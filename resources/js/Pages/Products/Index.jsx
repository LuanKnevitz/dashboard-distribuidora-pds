import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    PlusIcon,
    MagnifyingGlassIcon,
    ChevronDownIcon,
    PencilSquareIcon,
    PowerIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';

export default function Index({
    products = [],
    categories = [],
    filters = {},
    summary = {},
}) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [category, setCategory] = useState(filters.category ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                route('products.index'),
                {
                    search,
                    category,
                    status,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                }
            );
        }, 400);

        return () => clearTimeout(timeout);
    }, [search, category, status]);

    const formatCurrency = (value) => {
        return Number(value || 0).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    };

    const formatBundles = (stockQuantity, unitsPerBundle) => {
        if (!unitsPerBundle || Number(unitsPerBundle) <= 0) {
            return '-';
        }

        const bundles = Math.floor(Number(stockQuantity) / Number(unitsPerBundle));
        const remainingUnits = Number(stockQuantity) % Number(unitsPerBundle);

        if (remainingUnits === 0) {
            return `${bundles} fardo(s)`;
        }

        return `${bundles} fardo(s) e ${remainingUnits} un.`;
    };

    const isLowStock = (product) => {
        const minimumInUnits =
            (Number(product.minimum_stock) || 0) *
            (Number(product.units_per_bundle) || 0);

        return Number(product.stock_quantity) <= minimumInUnits;
    };

    const handleToggleStatus = (productId) => {
        router.patch(route('products.toggle-status', productId));
    };

    return (
        <AppLayout title={null}>
            <Head title="Produtos" />

            <div>
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Gestão de Produtos
                        </h1>
                        <p className="mt-2 text-base text-gray-600">
                            Gerencie o catálogo de produtos da distribuidora
                        </p>
                    </div>

                    <Link
                        href={route('products.create')}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#05081f] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Novo Produto
                    </Link>
                </div>

                <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr]">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar por nome..."
                                className="w-full rounded-xl border border-transparent bg-gray-100 py-3 pl-12 pr-4 text-sm text-gray-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div className="relative">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full appearance-none rounded-xl border border-transparent bg-gray-100 px-4 py-3 text-sm font-medium text-gray-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="">Todas Categorias</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        </div>

                        <div className="relative">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full appearance-none rounded-xl border border-transparent bg-gray-100 px-4 py-3 text-sm font-medium text-gray-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="">Todos Status</option>
                                <option value="ok">Estoque OK</option>
                                <option value="low">Estoque baixo</option>
                                <option value="inactive">Inativo</option>
                            </select>
                            <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <p className="text-base font-medium text-gray-600">
                            Total de Produtos
                        </p>
                        <h3 className="mt-12 text-4xl font-bold text-gray-900">
                            {summary.total_products ?? 0}
                        </h3>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <p className="text-base font-medium text-gray-600">
                            Categorias
                        </p>
                        <h3 className="mt-12 text-4xl font-bold text-gray-900">
                            {summary.total_categories ?? 0}
                        </h3>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <p className="text-base font-medium text-gray-600">
                            Estoque Baixo
                        </p>
                        <h3 className="mt-12 text-4xl font-bold text-orange-600">
                            {summary.low_stock_count ?? 0}
                        </h3>
                    </div>
                </div>

                <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-6 text-2xl font-semibold text-gray-900">
                        Lista de Produtos
                    </h2>

                    <div className="overflow-x-auto rounded-2xl border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        SKU
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Produto
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Categoria
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Preço Unit.
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Preço Fardo
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Estoque Atual
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                                        Ações
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 bg-white">
                                {products.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-6 py-10 text-center text-sm text-gray-500"
                                        >
                                            Nenhum produto encontrado.
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {product.sku ?? `REF-${String(product.id).padStart(3, '0')}`}
                                            </td>

                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                <div className="flex items-center gap-2">
                                                    {product.status && isLowStock(product) && (
                                                        <ExclamationTriangleIcon className="h-4 w-4 text-orange-500" />
                                                    )}
                                                    <span>{product.name}</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-800">
                                                    {product.category?.name ?? '-'}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {formatCurrency(product.unit_price)}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {formatCurrency(product.bundle_price)}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                <span
                                                    className={
                                                        product.status && isLowStock(product)
                                                            ? 'font-semibold text-orange-600'
                                                            : 'text-gray-900'
                                                    }
                                                >
                                                    {formatBundles(
                                                        product.stock_quantity,
                                                        product.units_per_bundle
                                                    )}
                                                </span>
                                                <span className="text-gray-400">
                                                    {' '}
                                                    / mín. {product.minimum_stock} fardo(s)
                                                </span>
                                            </td>

                                            <td className="px-6 py-4 text-sm">
                                                {!product.status ? (
                                                    <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                                        Inativo
                                                    </span>
                                                ) : isLowStock(product) ? (
                                                    <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                                                        Estoque baixo
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                                        Estoque OK
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-3">
                                                    <Link
                                                        href={route('products.edit', product.id)}
                                                        className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-blue-600"
                                                        title="Editar"
                                                    >
                                                        <PencilSquareIcon className="h-5 w-5" />
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleStatus(product.id)}
                                                        className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-red-600"
                                                        title={product.status ? 'Inativar' : 'Ativar'}
                                                    >
                                                        <PowerIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}