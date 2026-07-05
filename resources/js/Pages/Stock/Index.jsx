import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function Index({
    summary,
    lowStockProducts = [],
    recentMovements = [],
    filters = {},
}) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [type, setType] = useState(filters.type ?? '');

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                route('stock.index'),
                {
                    search,
                    type,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                }
            );
        }, 400);

        return () => clearTimeout(timeout);
    }, [search, type]);

    const formatBundles = (stockQuantity, unitsPerBundle) => {
        if (!unitsPerBundle || unitsPerBundle <= 0) {
            return '-';
        }

        const bundles = Math.floor(stockQuantity / unitsPerBundle);
        const remainingUnits = stockQuantity % unitsPerBundle;

        if (remainingUnits === 0) {
            return `${bundles} fardo(s)`;
        }

        return `${bundles} fardo(s) e ${remainingUnits} un.`;
    };

    const getMovementLabel = (movementType) => {
        if (movementType === 'entry') return 'Entrada';
        if (movementType === 'exit') return 'Saída';
        return 'Ajuste';
    };

    const getMovementBadgeClass = (movementType) => {
        if (movementType === 'entry') {
            return 'bg-green-100 text-green-700';
        }

        if (movementType === 'exit') {
            return 'bg-red-100 text-red-700';
        }

        return 'bg-yellow-100 text-yellow-700';
    };

    const getMovementTextClass = (movementType) => {
        if (movementType === 'entry') {
            return 'text-green-600';
        }

        if (movementType === 'exit') {
            return 'text-red-600';
        }

        return 'text-yellow-600';
    };

    const getMissingBundles = (product) => {
        if (!product.units_per_bundle || product.units_per_bundle <= 0) {
            return 0;
        }

        const currentBundles = Math.floor(product.stock_quantity / product.units_per_bundle);
        const missing = product.minimum_stock - currentBundles;

        return missing > 0 ? missing : 0;
    };

    return (
        <AppLayout title={null}>
            <Head title="Estoque" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                            Controle de Estoque
                        </h1>
                        <p className="mt-2 text-sm text-gray-600 sm:text-base">
                            Gerencie entradas, saídas e movimentações de estoque
                        </p>
                    </div>

                    <Link
                        href={route('stock.create')}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#05081f] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
                    >
                        <span className="text-lg leading-none">+</span>
                        Nova Movimentação
                    </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                        <p className="text-sm font-medium text-gray-600 sm:text-base">
                            Total em Estoque
                        </p>
                        <h3 className="mt-6 break-words text-3xl font-bold text-gray-900 sm:mt-10 sm:text-4xl">
                            {summary.total_stock}
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">fardos</p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                        <p className="text-sm font-medium text-gray-600 sm:text-base">
                            Entradas (Hoje)
                        </p>
                        <h3 className="mt-6 break-words text-3xl font-bold text-green-600 sm:mt-10 sm:text-4xl">
                            {summary.entries_today_bundles}
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">fardos</p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                        <p className="text-sm font-medium text-gray-600 sm:text-base">
                            Saídas (Hoje)
                        </p>
                        <h3 className="mt-6 break-words text-3xl font-bold text-red-600 sm:mt-10 sm:text-4xl">
                            {summary.exits_today_bundles}
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">fardos</p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                        <p className="text-sm font-medium text-gray-600 sm:text-base">
                            Entradas (Hoje)
                        </p>
                        <h3 className="mt-6 break-words text-3xl font-bold text-green-600 sm:mt-10 sm:text-4xl">
                            {summary.entries_today_units}
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">unidades</p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                        <p className="text-sm font-medium text-gray-600 sm:text-base">
                            Saídas (Hoje)
                        </p>
                        <h3 className="mt-6 break-words text-3xl font-bold text-red-600 sm:mt-10 sm:text-4xl">
                            {summary.exits_today_units}
                        </h3>
                        <p className="mt-2 text-sm text-gray-500">unidades</p>
                    </div>
                </div>

                <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 shadow-sm sm:p-6">
                    <div className="mb-5 flex items-center gap-2">
                        <span className="text-orange-500">⚠</span>
                        <h2 className="text-lg font-semibold text-orange-900 sm:text-xl">
                            Produtos com Estoque Baixo
                        </h2>
                    </div>

                    {lowStockProducts.length === 0 ? (
                        <div className="rounded-2xl bg-white p-4 text-sm text-gray-500">
                            Nenhum produto com estoque baixo.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {lowStockProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="flex flex-col gap-3 rounded-2xl bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                                >
                                    <div className="min-w-0">
                                        <p className="text-base font-semibold text-gray-900 sm:text-lg">
                                            {product.name}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Estoque: {product.stock_quantity} / Mínimo:{' '}
                                            {product.minimum_stock * product.units_per_bundle}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500">
                                            {formatBundles(
                                                product.stock_quantity,
                                                product.units_per_bundle
                                            )}{' '}
                                            / mínimo de {product.minimum_stock} fardo(s)
                                        </p>
                                    </div>

                                    <span className="inline-flex w-fit rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white">
                                        Faltam {getMissingBundles(product)} fardo(s)
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
                        <div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar por produto..."
                                className="w-full rounded-xl border border-transparent bg-gray-100 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full rounded-xl border border-transparent bg-gray-100 px-4 py-3 text-sm font-medium text-gray-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="">Todas Movimentações</option>
                                <option value="entry">Entrada</option>
                                <option value="exit">Saída</option>
                                <option value="adjustment">Ajuste</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                    <h2 className="mb-6 text-xl font-semibold text-gray-900 sm:text-2xl">
                        Histórico de Movimentações
                    </h2>

                    {recentMovements.length === 0 ? (
                        <div className="rounded-2xl border border-dashed p-6 text-sm text-gray-500">
                            Nenhuma movimentação registrada.
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-2xl border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200 bg-white">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                                            Data/Hora
                                        </th>
                                        <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                                            Produto
                                        </th>
                                        <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                                            Tipo
                                        </th>
                                        <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                                            Quantidade
                                        </th>
                                        <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                                            Estoque
                                        </th>
                                        <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                                            Motivo
                                        </th>
                                        <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                                            Usuário
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                    {recentMovements.map((movement) => (
                                        <tr key={movement.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4 text-sm text-gray-700">
                                                {new Date(
                                                    movement.created_at
                                                ).toLocaleString('pt-BR')}
                                            </td>

                                            <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                                {movement.product?.name ?? '-'}
                                            </td>

                                            <td className="px-4 py-4 text-sm">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getMovementBadgeClass(
                                                        movement.type
                                                    )}`}
                                                >
                                                    {getMovementLabel(movement.type)}
                                                </span>
                                            </td>

                                            <td
                                                className={`px-4 py-4 text-sm font-semibold ${getMovementTextClass(
                                                    movement.type
                                                )}`}
                                            >
                                                {movement.type === 'entry' && '+'}
                                                {movement.type === 'exit' && '-'}
                                                {movement.input_quantity}{' '}
                                                {movement.movement_unit === 'bundle'
                                                    ? 'fardo(s)'
                                                    : 'unidade(s)'}
                                                <span className="block text-xs font-normal text-gray-500">
                                                    ({movement.quantity} un.)
                                                </span>
                                            </td>

                                            <td className="px-4 py-4 text-sm text-gray-700">
                                                {movement.previous_stock} → {movement.new_stock}
                                            </td>

                                            <td className="px-4 py-4 text-sm text-gray-700">
                                                {movement.reason || '-'}
                                            </td>

                                            <td className="px-4 py-4 text-sm text-gray-700">
                                                {movement.user?.name ?? '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}