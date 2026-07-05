<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();
        $categoryId = $request->string('category')->toString();
        $status = $request->string('status')->toString();

        $query = Product::with('category')
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->when($categoryId, function ($query) use ($categoryId) {
                $query->where('category_id', $categoryId);
            })
            ->when($status, function ($query) use ($status) {
                if ($status === 'low') {
                    $query->whereRaw('stock_quantity <= (minimum_stock * units_per_bundle)')
                        ->where('status', true);
                }

                if ($status === 'ok') {
                    $query->whereRaw('stock_quantity > (minimum_stock * units_per_bundle)')
                        ->where('status', true);
                }

                if ($status === 'inactive') {
                    $query->where('status', false);
                }
            })
            ->orderBy('name');

        $products = $query->get();

        $categories = Category::orderBy('name')->get(['id', 'name']);

        $summary = [
            'total_products' => $products->count(),
            'total_categories' => $products->pluck('category_id')->filter()->unique()->count(),
            'low_stock_count' => $products->filter(function ($product) {
                $minimumInUnits = (int) $product->minimum_stock * (int) $product->units_per_bundle;

                return (int) $product->stock_quantity <= $minimumInUnits
                    && (bool) $product->status === true;
            })->count(),
        ];

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'category' => $categoryId,
                'status' => $status,
            ],
            'summary' => $summary,
        ]);
    }

    public function create(): Response
    {
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Products/Create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'unit_price' => ['required', 'numeric', 'min:0'],
            'bundle_price' => ['required', 'numeric', 'min:0'],
            'units_per_bundle' => ['required', 'integer', 'min:1'],
            'minimum_stock' => ['required', 'integer', 'min:0'],
        ]);

        Product::create([
            'category_id' => $validated['category_id'],
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'unit_price' => $validated['unit_price'],
            'bundle_price' => $validated['bundle_price'],
            'units_per_bundle' => $validated['units_per_bundle'],
            'stock_quantity' => 0,
            'minimum_stock' => $validated['minimum_stock'],
            'status' => true,
        ]);

        return redirect()->route('products.index');
    }

    public function edit(Product $product): Response
    {
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Products/Edit', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'unit_price' => ['required', 'numeric', 'min:0'],
            'bundle_price' => ['required', 'numeric', 'min:0'],
            'units_per_bundle' => ['required', 'integer', 'min:1'],
            'minimum_stock' => ['required', 'integer', 'min:0'],
            'status' => ['required', 'boolean'],
        ]);

        $product->update($validated);

        return redirect()->route('products.index');
    }

    public function toggleStatus(Product $product): RedirectResponse
    {
        $product->update([
            'status' => ! $product->status,
        ]);

        return redirect()->route('products.index');
    }
}