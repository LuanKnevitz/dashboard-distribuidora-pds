<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $startOfDay = Carbon::now()->startOfDay();
        $endOfDay = Carbon::now()->endOfDay();

        $startOfWeek = Carbon::now()->startOfWeek(Carbon::MONDAY)->startOfDay();
        $endOfWeek = Carbon::now()->endOfWeek(Carbon::SUNDAY)->endOfDay();

        $validRevenueStatuses = ['confirmed', 'delivered'];

        $totalProducts = Product::count();

        $ordersToday = Order::whereBetween('created_at', [$startOfDay, $endOfDay])->count();

        $pendingToday = Order::whereBetween('created_at', [$startOfDay, $endOfDay])
            ->where('status', 'pending')
            ->count();

        $lowStockCount = Product::whereRaw('stock_quantity <= (minimum_stock * units_per_bundle)')
            ->count();

        $totalSales = Order::whereIn('status', $validRevenueStatuses)->sum('total');

        $weeklySalesRaw = Order::query()
            ->whereIn('status', $validRevenueStatuses)
            ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
            ->selectRaw('DATE(created_at) as sale_date, SUM(total) as total_sales')
            ->groupBy('sale_date')
            ->orderBy('sale_date')
            ->pluck('total_sales', 'sale_date');

        $weekdayMap = [
            1 => 'Seg',
            2 => 'Ter',
            3 => 'Qua',
            4 => 'Qui',
            5 => 'Sex',
            6 => 'Sáb',
            7 => 'Dom',
        ];

        $weeklySales = [];
        $currentDate = $startOfWeek->copy();

        while ($currentDate->lte($endOfWeek)) {
            $key = $currentDate->toDateString();

            $weeklySales[] = [
                'label' => $weekdayMap[$currentDate->dayOfWeekIso],
                'total' => (float) ($weeklySalesRaw[$key] ?? 0),
            ];

            $currentDate->addDay();
        }

        $statusCountsRaw = Order::query()
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        $statusCounts = [
            'pending' => (int) ($statusCountsRaw['pending'] ?? 0),
            'confirmed' => (int) ($statusCountsRaw['confirmed'] ?? 0),
            'separated' => (int) ($statusCountsRaw['separated'] ?? 0),
            'delivered' => (int) ($statusCountsRaw['delivered'] ?? 0),
        ];

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
            ->latest()
            ->take(5)
            ->get([
                'id',
                'order_number',
                'customer_name',
                'status',
                'total',
            ]);

        return Inertia::render('Dashboard', [
            'summary' => [
                'total_products' => $totalProducts,
                'orders_today' => $ordersToday,
                'pending_today' => $pendingToday,
                'low_stock_count' => $lowStockCount,
                'total_sales' => (float) $totalSales,
            ],
            'weeklySales' => $weeklySales,
            'statusCounts' => $statusCounts,
            'lowStockProducts' => $lowStockProducts,
            'recentOrders' => $recentOrders,
        ]);
    }
}