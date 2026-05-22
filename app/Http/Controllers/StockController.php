<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockMovement;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StockController extends Controller
{
    public function index(): Response
    {
        $today = Carbon::today();

        $totalStock = Product::sum('stock_quantity');

        $entriesToday = StockMovement::where('type', 'entry')
            ->whereDate('created_at', $today)
            ->sum('quantity');

        $exitsToday = StockMovement::where('type', 'exit')
            ->whereDate('created_at', $today)
            ->sum('quantity');

        $lowStockProducts = Product::with('category')
            ->whereColumn('stock_quantity', '<=', 'minimum_stock')
            ->orderBy('stock_quantity')
            ->get();

        $recentMovements = StockMovement::with(['product', 'user'])
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('Stock/Index', [
            'summary' => [
                'total_stock' => $totalStock,
                'entries_today' => $entriesToday,
                'exits_today' => $exitsToday,
                'low_stock_count' => $lowStockProducts->count(),
            ],
            'lowStockProducts' => $lowStockProducts,
            'recentMovements' => $recentMovements,
        ]);
    }

    public function create(): Response
    {
        $products = Product::where('status', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Stock/Create', [
            'products' => $products,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'type' => ['required', 'in:entry,exit,adjustment'],
            'quantity' => ['required', 'integer', 'min:1'],
            'reason' => ['nullable', 'string'],
        ]);

        $product = Product::findOrFail($validated['product_id']);

        $previousStock = $product->stock_quantity;
        $quantity = (int) $validated['quantity'];
        $type = $validated['type'];

        if ($type === 'entry') {
            $newStock = $previousStock + $quantity;
        } elseif ($type === 'exit') {
            if ($quantity > $previousStock) {
                return back()->withErrors([
                    'quantity' => 'A quantidade de saída não pode ser maior que o estoque atual.',
                ]);
            }

            $newStock = $previousStock - $quantity;
        } else {
            $newStock = $quantity;
        }

        $product->update([
            'stock_quantity' => $newStock,
        ]);

        StockMovement::create([
            'product_id' => $product->id,
            'user_id' => auth()->id(),
            'type' => $type,
            'quantity' => $quantity,
            'previous_stock' => $previousStock,
            'new_stock' => $newStock,
            'reason' => $validated['reason'] ?? null,
        ]);

        return redirect()->route('stock.index');
    }
}