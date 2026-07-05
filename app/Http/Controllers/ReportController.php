<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        $period = $request->string('period')->toString() ?: '7';

        $reportData = $this->buildReportData($period);

        return Inertia::render('Reports/Index', [
            'filters' => [
                'period' => $period,
            ],
            'summary' => $reportData['summary'],
            'salesEvolution' => $reportData['salesEvolution'],
            'salesByCategory' => $reportData['salesByCategory'],
            'topProducts' => $reportData['topProducts'],
            'lowStockProducts' => $reportData['lowStockProducts'],
            'recentOrders' => $reportData['recentOrders'],
        ]);
    }

    public function exportPdf(Request $request)
    {
        $period = $request->string('period')->toString() ?: '7';

        $reportData = $this->buildReportData($period);

        $pdf = Pdf::loadView('reports.pdf', [
            'filters' => [
                'period' => $period,
                'period_label' => $this->getPeriodLabel($period),
            ],
            'summary' => $reportData['summary'],
            'salesByCategory' => $reportData['salesByCategory'],
            'topProducts' => $reportData['topProducts'],
            'lowStockProducts' => $reportData['lowStockProducts'],
            'recentOrders' => $reportData['recentOrders'],
            'generatedAt' => now(),
        ])->setPaper('a4', 'portrait');

        return $pdf->download('relatorio-stockdrink-' . now()->format('Y-m-d_H-i') . '.pdf');
    }

    public function exportDetailedOrdersPdf(Request $request)
    {
        $period = $request->string('period')->toString() ?: '7';

        $orders = $this->buildDetailedOrdersData($period);

        $pdf = Pdf::loadView('reports.orders-detailed-pdf', [
            'filters' => [
                'period' => $period,
                'period_label' => $this->getPeriodLabel($period),
            ],
            'orders' => $orders,
            'generatedAt' => now(),
        ])->setPaper('a4', 'portrait');

        return $pdf->download('pedidos-detalhados-stockdrink-' . now()->format('Y-m-d_H-i') . '.pdf');
    }

    private function buildReportData(string $period): array
    {
        [$startDate, $endDate] = $this->resolvePeriodDates($period);

        $validRevenueStatuses = ['confirmed', 'delivered'];

        $ordersQuery = Order::query();

        if ($period !== 'all') {
            $ordersQuery->whereBetween('created_at', [$startDate, $endDate]);
        }

        $revenueTotal = (clone $ordersQuery)
            ->whereIn('status', $validRevenueStatuses)
            ->sum('total');

        $completedOrdersCount = (clone $ordersQuery)
            ->whereIn('status', $validRevenueStatuses)
            ->count();

        $ticketAverage = $completedOrdersCount > 0
            ? $revenueTotal / $completedOrdersCount
            : 0;

        $itemsSold = OrderItem::query()
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->where('orders.status', '!=', 'cancelled')
            ->when($period !== 'all', function ($query) use ($startDate, $endDate) {
                $query->whereBetween('orders.created_at', [$startDate, $endDate]);
            })
            ->selectRaw("
                SUM(
                    CASE
                        WHEN order_items.sale_type = 'bundle'
                            THEN order_items.quantity * products.units_per_bundle
                        ELSE order_items.quantity
                    END
                ) as total_units
            ")
            ->value('total_units') ?? 0;

        $itemsSoldBundlesRaw = OrderItem::query()
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->where('orders.status', '!=', 'cancelled')
            ->when($period !== 'all', function ($query) use ($startDate, $endDate) {
                $query->whereBetween('orders.created_at', [$startDate, $endDate]);
            })
            ->groupBy('order_items.product_id', 'products.units_per_bundle')
            ->selectRaw("
                products.units_per_bundle,
                SUM(
                    CASE
                        WHEN order_items.sale_type = 'bundle'
                            THEN order_items.quantity * products.units_per_bundle
                        ELSE order_items.quantity
                    END
                ) as total_units_sold
            ")
            ->get();

        $itemsSoldBundles = $itemsSoldBundlesRaw->sum(function ($item) {
            if (! $item->units_per_bundle || $item->units_per_bundle <= 0) {
                return 0;
            }

            return intdiv((int) $item->total_units_sold, (int) $item->units_per_bundle);
        });

        $lowStockCount = Product::whereRaw('stock_quantity <= (minimum_stock * units_per_bundle)')
            ->count();

        $salesEvolutionRaw = Order::query()
            ->whereIn('status', $validRevenueStatuses)
            ->when($period !== 'all', function ($query) use ($startDate, $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            })
            ->selectRaw('DATE(created_at) as sale_date, SUM(total) as total_sales')
            ->groupBy('sale_date')
            ->orderBy('sale_date')
            ->pluck('total_sales', 'sale_date');

        $salesEvolution = [];

        if ($period === 'all') {
            foreach ($salesEvolutionRaw as $date => $total) {
                $salesEvolution[] = [
                    'label' => Carbon::parse($date)->format('d/m'),
                    'total' => (float) $total,
                ];
            }
        } else {
            $currentDate = $startDate->copy();

            while ($currentDate->lte($endDate)) {
                $key = $currentDate->toDateString();

                $salesEvolution[] = [
                    'label' => $currentDate->format('d/m'),
                    'total' => (float) ($salesEvolutionRaw[$key] ?? 0),
                ];

                $currentDate->addDay();
            }
        }

        $salesByCategory = OrderItem::query()
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->join('products', 'order_items.product_id', '=', 'products.id')
                ->leftJoin('categories', 'products.category_id', '=', 'categories.id')
                ->whereIn('orders.status', $validRevenueStatuses)
                ->when($period !== 'all', function ($query) use ($startDate, $endDate) {
                    $query->whereBetween('orders.created_at', [$startDate, $endDate]);
                })
                ->selectRaw("COALESCE(categories.name, 'Sem categoria') as category_name")
                ->selectRaw('SUM(order_items.subtotal) as total_sales')
                ->groupBy('categories.id', 'categories.name')
                ->orderByDesc('total_sales')
                ->get();

        $topProducts = Product::with('category')
            ->get()
            ->map(function ($product) {
                $stockValue = $product->stock_quantity * $product->unit_price;

                return (object) [
                    'id' => $product->id,
                    'name' => $product->name,
                    'category_name' => $product->category?->name ?? 'Sem categoria',
                    'stock_quantity' => $product->stock_quantity,
                    'units_per_bundle' => $product->units_per_bundle,
                    'unit_price' => (float) $product->unit_price,
                    'stock_value' => (float) $stockValue,
                ];
            })
            ->sortByDesc('stock_value')
            ->take(5)
            ->values();

        $lowStockProducts = Product::query()
            ->whereRaw('stock_quantity <= (minimum_stock * units_per_bundle)')
            ->orderBy('stock_quantity')
            ->take(5)
            ->get([
                'id',
                'name',
                'stock_quantity',
                'minimum_stock',
                'units_per_bundle',
            ]);

        $recentOrders = Order::query()
            ->when($period !== 'all', function ($query) use ($startDate, $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            })
            ->latest()
            ->take(5)
            ->get([
                'id',
                'order_number',
                'customer_name',
                'status',
                'total',
                'created_at',
            ]);

        return [
            'summary' => [
                'revenue_total' => (float) $revenueTotal,
                'ticket_average' => (float) $ticketAverage,
                'items_sold' => (int) $itemsSold,
                'items_sold_bundles' => (int) $itemsSoldBundles,
                'low_stock_count' => (int) $lowStockCount,
            ],
            'salesEvolution' => $salesEvolution,
            'salesByCategory' => $salesByCategory,
            'topProducts' => $topProducts,
            'lowStockProducts' => $lowStockProducts,
            'recentOrders' => $recentOrders,
        ];
    }

    private function buildDetailedOrdersData(string $period)
    {
        [$startDate, $endDate] = $this->resolvePeriodDates($period);

        return Order::with(['items.product'])
            ->when($period !== 'all', function ($query) use ($startDate, $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            })
            ->latest()
            ->get([
                'id',
                'order_number',
                'customer_name',
                'status',
                'payment_method',
                'total',
                'created_at',
            ]);
    }

    private function resolvePeriodDates(string $period): array
    {
        if ($period === 'all') {
            return [null, null];
        }

        $days = (int) $period;
        $startDate = Carbon::now()->subDays($days - 1)->startOfDay();
        $endDate = Carbon::now()->endOfDay();

        return [$startDate, $endDate];
    }

    private function getPeriodLabel(string $period): string
    {
        if ($period === '7') {
            return 'Últimos 7 dias';
        }

        if ($period === '30') {
            return 'Últimos 30 dias';
        }

        return 'Todo o período';
    }
}