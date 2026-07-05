<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\StockMovement;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();
        $status = $request->string('status')->toString();

        $ordersQuery = Order::with(['user', 'items'])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where('order_number', 'like', "%{$search}%")
                        ->orWhere('customer_name', 'like', "%{$search}%")
                        ->orWhere('customer_phone', 'like', "%{$search}%");
                });
            })
            ->when($status, function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->latest();

        $orders = $ordersQuery
            ->paginate(10)
            ->through(function ($order) {
                $order->formatted_created_at = Carbon::parse($order->created_at)
                    ->timezone(config('app.timezone'))
                    ->format('d/m/Y, H:i');

                return $order;
            })
            ->withQueryString();

        $today = now()->timezone(config('app.timezone'));

        $summary = [
            'total_orders' => Order::count(),
            'orders_today' => Order::whereDate('created_at', $today->toDateString())
                ->where('status', '!=', 'cancelled')
                ->count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'total_value' => Order::whereIn('status', ['confirmed', 'delivered'])->sum('total'),
        ];

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'summary' => $summary,
        ]);
    }

    public function create(): Response
    {
        $products = Product::where('status', true)
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'unit_price',
                'bundle_price',
                'units_per_bundle',
                'stock_quantity',
            ]);

        return Inertia::render('Orders/Create', [
            'products' => $products,
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load(['items.product', 'user']);

        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }

    public function print(Order $order)
    {
        $order->load(['items.product', 'user']);

        $pdf = Pdf::loadView('orders.print-pdf', [
            'order' => $order,
            'generatedAt' => now()->timezone(config('app.timezone')),
        ])->setPaper('a4', 'portrait');

        $fileName = 'pedido-' . ($order->order_number ?? $order->id) . '.pdf';

        return $pdf->download($fileName);
    }

    public function printToday()
    {
        $startOfDay = now()->timezone(config('app.timezone'))->startOfDay();
        $endOfDay = now()->timezone(config('app.timezone'))->endOfDay();

        $orders = Order::with(['items.product'])
            ->whereBetween('created_at', [$startOfDay, $endOfDay])
            ->where('status', '!=', 'cancelled')
            ->get();

        $groupedItems = $orders
            ->flatMap(function ($order) {
                return $order->items;
            })
            ->groupBy(function ($item) {
                return $item->product_id . '-' . $item->sale_type;
            })
            ->map(function ($items) {
                $first = $items->first();

                return (object) [
                    'product_name' => $first->product?->name ?? '-',
                    'sale_type' => $first->sale_type,
                    'total_quantity' => $items->sum('quantity'),
                ];
            })
            ->sortBy('product_name')
            ->values();

        $pdf = Pdf::loadView('orders.print-today-pdf', [
            'items' => $groupedItems,
            'ordersCount' => $orders->count(),
            'generatedAt' => now()->timezone(config('app.timezone')),
        ])->setPaper('a4', 'portrait');

        return $pdf->download('lista-separacao-dia-' . now()->format('Y-m-d_H-i') . '.pdf');
    }

    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:pending,confirmed,separated,delivered'],
        ]);

        if ($order->status === 'cancelled') {
            return back()->withErrors([
                'status' => 'Pedido cancelado não pode ter o status alterado.',
            ]);
        }

        $order->update([
            'status' => $validated['status'],
        ]);

        return redirect()->route('orders.show', $order->id);
    }

    public function cancel(Order $order): RedirectResponse
    {
        if ($order->status === 'cancelled') {
            return back()->withErrors([
                'status' => 'Este pedido já foi cancelado.',
            ]);
        }

        DB::transaction(function () use ($order) {
            $order->load('items.product');

            foreach ($order->items as $item) {
                $product = $item->product;

                if (! $product) {
                    continue;
                }

                $stockToReturn = $item->sale_type === 'bundle'
                    ? $item->quantity * $product->units_per_bundle
                    : $item->quantity;

                $previousStock = $product->stock_quantity;
                $newStock = $previousStock + $stockToReturn;

                $product->update([
                    'stock_quantity' => $newStock,
                ]);

                StockMovement::create([
                    'product_id' => $product->id,
                    'user_id' => auth()->id(),
                    'type' => 'entry',
                    'movement_unit' => $item->sale_type,
                    'input_quantity' => $item->quantity,
                    'quantity' => $stockToReturn,
                    'previous_stock' => $previousStock,
                    'new_stock' => $newStock,
                    'reason' => 'Devolução referente ao cancelamento do pedido ' . ($order->order_number ?? $order->id),
                ]);
            }

            $order->update([
                'status' => 'cancelled',
            ]);
        });

        return redirect()->route('orders.show', $order->id);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['nullable', 'email', 'max:255'],
            'customer_phone' => ['nullable', 'string', 'max:30'],
            'payment_method' => ['required', 'in:pix,dinheiro,credito,debito,boleto'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.sale_type' => ['required', 'in:unit,bundle'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ], [
            'customer_name.required' => 'O nome do cliente é obrigatório.',
            'customer_email.email' => 'O e-mail informado é inválido.',
            'payment_method.required' => 'Selecione a forma de pagamento.',
            'payment_method.in' => 'A forma de pagamento selecionada é inválida.',
            'items.required' => 'Adicione pelo menos um item ao pedido.',
            'items.*.product_id.required' => 'Selecione um produto.',
            'items.*.product_id.exists' => 'O produto selecionado é inválido.',
            'items.*.sale_type.required' => 'Selecione o tipo de venda.',
            'items.*.sale_type.in' => 'O tipo de venda selecionado é inválido.',
            'items.*.quantity.required' => 'Informe a quantidade.',
            'items.*.quantity.integer' => 'A quantidade deve ser um número inteiro.',
            'items.*.quantity.min' => 'A quantidade deve ser no mínimo 1.',
        ]);

        DB::transaction(function () use ($validated) {
            $order = Order::create([
                'order_number' => null,
                'user_id' => auth()->id(),
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'] ?? null,
                'customer_phone' => $validated['customer_phone'] ?? null,
                'payment_method' => $validated['payment_method'],
                'status' => 'pending',
                'total' => 0,
            ]);

            $order->update([
                'order_number' => 'PED-' . str_pad((string) $order->id, 6, '0', STR_PAD_LEFT),
            ]);

            $total = 0;

            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                $saleType = $item['sale_type'];
                $quantity = (int) $item['quantity'];

                $itemPrice = $saleType === 'bundle'
                    ? $product->bundle_price
                    : $product->unit_price;

                $stockToDecrease = $saleType === 'bundle'
                    ? $quantity * $product->units_per_bundle
                    : $quantity;

                if ($stockToDecrease > $product->stock_quantity) {
                    throw \Illuminate\Validation\ValidationException::withMessages([
                        'items' => ["Estoque insuficiente para o produto {$product->name}."],
                    ]);
                }

                $subtotal = $itemPrice * $quantity;
                $previousStock = $product->stock_quantity;
                $newStock = $previousStock - $stockToDecrease;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'sale_type' => $saleType,
                    'quantity' => $quantity,
                    'item_price' => $itemPrice,
                    'subtotal' => $subtotal,
                ]);

                $product->update([
                    'stock_quantity' => $newStock,
                ]);

                StockMovement::create([
                    'product_id' => $product->id,
                    'user_id' => auth()->id(),
                    'type' => 'exit',
                    'movement_unit' => $saleType,
                    'input_quantity' => $quantity,
                    'quantity' => $stockToDecrease,
                    'previous_stock' => $previousStock,
                    'new_stock' => $newStock,
                    'reason' => 'Saída referente ao pedido ' . $order->order_number,
                ]);

                $total += $subtotal;
            }

            $order->update([
                'total' => $total,
            ]);
        });

        return redirect()->route('orders.index');
    }
}