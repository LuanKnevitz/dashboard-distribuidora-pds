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
    public function index(Request $request): Response
{
    $startOfDay = Carbon::now()->startOfDay();
    $endOfDay = Carbon::now()->endOfDay();

    $search = $request->string('search')->toString();
    $type = $request->string('type')->toString();

    $products = Product::with('category')->get();

    $totalClosedBundles = $products->sum(function ($product) {
        if (! $product->units_per_bundle || $product->units_per_bundle <= 0) {
            return 0;
        }

        return intdiv((int) $product->stock_quantity, (int) $product->units_per_bundle);
    });

    $entriesTodayMovements = StockMovement::with('product')
        ->where('type', 'entry')
        ->whereBetween('created_at', [$startOfDay, $endOfDay])
        ->get();

    $exitsTodayMovements = StockMovement::with('product')
        ->where('type', 'exit')
        ->whereBetween('created_at', [$startOfDay, $endOfDay])
        ->get();

    $entriesTodayBundles = $entriesTodayMovements
        ->where('movement_unit', 'bundle')
        ->sum('input_quantity');

    $exitsTodayBundles = $exitsTodayMovements
        ->where('movement_unit', 'bundle')
        ->sum('input_quantity');

    $entriesTodayUnits = $entriesTodayMovements
        ->where('movement_unit', 'unit')
        ->sum('input_quantity');

    $exitsTodayUnits = $exitsTodayMovements
        ->where('movement_unit', 'unit')
        ->sum('input_quantity');

    $lowStockProducts = Product::with('category')
        ->whereRaw('stock_quantity <= (minimum_stock * units_per_bundle)')
        ->orderBy('stock_quantity')
        ->get();

    $recentMovementsQuery = StockMovement::with(['product', 'user'])->latest();

    if ($search) {
        $recentMovementsQuery->whereHas('product', function ($query) use ($search) {
            $query->where('name', 'like', "%{$search}%");
        });
    }

    if ($type) {
        $recentMovementsQuery->where('type', $type);
    }

    $recentMovements = $recentMovementsQuery
        ->take(20)
        ->get();

    return Inertia::render('Stock/Index', [
        'summary' => [
            'total_stock' => $totalClosedBundles,
            'entries_today_bundles' => $entriesTodayBundles,
            'exits_today_bundles' => $exitsTodayBundles,
            'entries_today_units' => $entriesTodayUnits,
            'exits_today_units' => $exitsTodayUnits,
        ],
        'lowStockProducts' => $lowStockProducts,
        'recentMovements' => $recentMovements,
        'filters' => [
            'search' => $search,
            'type' => $type,
        ],
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
        'movement_unit' => ['required', 'in:unit,bundle'],
        'input_quantity' => ['required', 'integer', 'min:1'],
        'reason' => ['nullable', 'string'],
    ]);

    $product = Product::findOrFail($validated['product_id']);

    $previousStock = $product->stock_quantity;
    $inputQuantity = (int) $validated['input_quantity'];
    $type = $validated['type'];
    $movementUnit = $validated['movement_unit'];

    $quantityInUnits = $movementUnit === 'bundle'
        ? $inputQuantity * $product->units_per_bundle
        : $inputQuantity;

    if ($type === 'entry') {
        $newStock = $previousStock + $quantityInUnits;
    } elseif ($type === 'exit') {
        if ($quantityInUnits > $previousStock) {
            return back()->withErrors([
                'input_quantity' => 'A quantidade de saída não pode ser maior que o estoque atual.',
            ]);
        }

        $newStock = $previousStock - $quantityInUnits;
    } else {
        if ($movementUnit === 'bundle') {
            $newStock = $inputQuantity * $product->units_per_bundle;
        } else {
            $newStock = $inputQuantity;
        }
    }

    $product->update([
        'stock_quantity' => $newStock,
    ]);

    StockMovement::create([
        'product_id' => $product->id,
        'user_id' => auth()->id(),
        'type' => $type,
        'movement_unit' => $movementUnit,
        'input_quantity' => $inputQuantity,
        'quantity' => $quantityInUnits,
        'previous_stock' => $previousStock,
        'new_stock' => $newStock,
        'reason' => $validated['reason'] ?? null,
    ]);

    return redirect()->route('stock.index');
}
}