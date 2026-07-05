import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Index({
    filters,
    summary,
    salesEvolution,
    salesByCategory,
    topProducts,
    lowStockProducts,
    recentOrders,
}) {
    const [activeTab, setActiveTab] = useState('sales');

    const handlePeriodChange = (e) => {
        router.get(
            route('reports.index'),
            { period: e.target.value },
            { preserveState: true, replace: true }
        );
    };

    const formatCurrency = (value) => {
        return Number(value).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    };

    const formatStatus = (status) => {
        if (status === 'pending') return 'Pendente';
        if (status === 'confirmed') return 'Confirmado';
        if (status === 'separated') return 'Separado';
        if (status === 'delivered') return 'Entregue';
        if (status === 'cancelled') return 'Cancelado';
        return status;
    };

    const formatBundles = (stockQuantity, unitsPerBundle) => {
        if (!unitsPerBundle || unitsPerBundle <= 0) {
            return '-';
        }

        const bundles = Math.floor(stockQuantity / unitsPerBundle);
        return `${bundles} fardo(s)`;
    };

    const salesEvolutionChartData = useMemo(() => {
        return {
            labels: salesEvolution.map((item) => item.label),
            datasets: [
                {
                    label: 'Vendas',
                    data: salesEvolution.map((item) => item.total),
                    borderColor: '#3b82f6',
                    backgroundColor: '#3b82f6',
                    tension: 0.3,
                },
            ],
        };
    }, [salesEvolution]);

    const salesByCategoryChartData = useMemo(() => {
        const hasSingleCategory = salesByCategory.length === 1;

        return {
            labels: salesByCategory.map((item) => item.category_name),
            datasets: [
                {
                    label: 'Vendas por categoria',
                    data: salesByCategory.map((item) => Number(item.total_sales)),
                    backgroundColor: '#3b82f6',
                    borderRadius: 8,
                    maxBarThickness: hasSingleCategory ? 100 : 140,
                    categoryPercentage: hasSingleCategory ? 0.45 : 0.7,
                    barPercentage: hasSingleCategory ? 0.55 : 0.8,
                },
            ],
        };
    }, [salesByCategory]);

    const commonChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
    };

    const salesByCategoryChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                offset: true,
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <AppLayout title="Relatórios">
            <Head title="Relatórios" />

            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Relatórios e Consultas</h1>
                    <p className="mt-1 text-gray-600">Análise de dados e relatórios gerenciais</p>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        className="rounded border bg-white px-4 py-2"
                        value={filters.period}
                        onChange={handlePeriodChange}
                    >
                        <option value="7">Últimos 7 dias</option>
                        <option value="30">Últimos 30 dias</option>
                        <option value="all">Todo período</option>
                    </select>

                    <a
                        href={route('reports.export.orders-detailed-pdf', { period: filters.period })}
                        className="rounded border bg-white px-4 py-2 text-gray-700 transition hover:bg-gray-50"
                    >
                        Pedidos detalhados
                    </a>

                    <a
                        href={route('reports.export.pdf', { period: filters.period })}
                        className="rounded border bg-white px-4 py-2 text-gray-700 transition hover:bg-gray-50"
                    >
                        Exportar PDF
                    </a>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border bg-white p-6">
                    <p className="text-sm text-gray-500">Receita Total</p>
                    <h3 className="mt-4 text-2xl font-bold">
                        {formatCurrency(summary.revenue_total)}
                    </h3>
                </div>

                <div className="rounded-2xl border bg-white p-6">
                    <p className="text-sm text-gray-500">Ticket Médio</p>
                    <h3 className="mt-4 text-2xl font-bold">
                        {formatCurrency(summary.ticket_average)}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">por pedido</p>
                </div>

                <div className="rounded-2xl border bg-white p-6">
                    <p className="text-sm text-gray-500">Itens Vendidos</p>

                    <div className="mt-4 flex items-end gap-14">
                        <div>
                            <h3 className="text-2xl font-bold">{summary.items_sold}</h3>
                            <p className="mt-1 text-sm text-gray-500">unidades</p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold">{summary.items_sold_bundles}</h3>
                            <p className="mt-1 text-sm text-gray-500">fardos</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border bg-white p-6">
                    <p className="text-sm text-gray-500">Produtos com Estoque Baixo</p>
                    <h3 className="mt-4 text-2xl font-bold text-orange-600">
                        {summary.low_stock_count}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">produtos</p>
                </div>
            </div>

            <div className="mt-8 rounded-full bg-gray-100 p-1">
                <div className="grid grid-cols-4">
                    <button
                        type="button"
                        onClick={() => setActiveTab('sales')}
                        className={`rounded-full px-4 py-2 text-sm font-medium ${
                            activeTab === 'sales' ? 'bg-white shadow' : ''
                        }`}
                    >
                        Vendas
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('stock')}
                        className={`rounded-full px-4 py-2 text-sm font-medium ${
                            activeTab === 'stock' ? 'bg-white shadow' : ''
                        }`}
                    >
                        Estoque
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('orders')}
                        className={`rounded-full px-4 py-2 text-sm font-medium ${
                            activeTab === 'orders' ? 'bg-white shadow' : ''
                        }`}
                    >
                        Pedidos
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('products')}
                        className={`rounded-full px-4 py-2 text-sm font-medium ${
                            activeTab === 'products' ? 'bg-white shadow' : ''
                        }`}
                    >
                        Produtos
                    </button>
                </div>
            </div>

            {activeTab === 'sales' && (
                <>
                    <div className="mt-6 grid gap-6 xl:grid-cols-2">
                        <div className="rounded-2xl border bg-white p-6">
                            <h2 className="mb-4 text-lg font-semibold">Evolução de Vendas</h2>
                            <div className="h-72">
                                <Line data={salesEvolutionChartData} options={commonChartOptions} />
                            </div>
                        </div>

                        <div className="rounded-2xl border bg-white p-6">
                            <h2 className="mb-4 text-lg font-semibold">Vendas por Categoria</h2>
                            <div className="h-72">
                                <Bar
                                    data={salesByCategoryChartData}
                                    options={salesByCategoryChartOptions}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 rounded-2xl border bg-white p-6">
                        <h2 className="mb-4 text-lg font-semibold">Top 5 Produtos</h2>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 text-left">
                                        <th className="border p-3">Produto</th>
                                        <th className="border p-3">Categoria</th>
                                        <th className="border p-3">Estoque</th>
                                        <th className="border p-3">Preço</th>
                                        <th className="border p-3">Valor em Estoque</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topProducts.map((product) => (
                                        <tr key={product.id}>
                                            <td className="border p-3 font-medium">{product.name}</td>
                                            <td className="border p-3">{product.category_name}</td>
                                            <td className="border p-3">
                                                {formatBundles(
                                                    product.stock_quantity,
                                                    product.units_per_bundle
                                                )}
                                            </td>
                                            <td className="border p-3">
                                                {formatCurrency(product.unit_price)}
                                            </td>
                                            <td className="border p-3 font-medium">
                                                {formatCurrency(product.stock_value)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'stock' && (
                <div className="mt-6 rounded-2xl border bg-white p-6">
                    <h2 className="mb-4 text-lg font-semibold">Produtos com Estoque Baixo</h2>

                    {lowStockProducts.length === 0 ? (
                        <p className="text-gray-500">Nenhum produto com estoque baixo.</p>
                    ) : (
                        <div className="space-y-3">
                            {lowStockProducts.map((product) => (
                                <div key={product.id} className="rounded border p-4">
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-sm text-gray-600">
                                        Estoque atual:{' '}
                                        {formatBundles(
                                            product.stock_quantity,
                                            product.units_per_bundle
                                        )}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Estoque mínimo: {product.minimum_stock} fardo(s)
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'orders' && (
                <div className="mt-6 rounded-2xl border bg-white p-6">
                    <h2 className="mb-4 text-lg font-semibold">Pedidos Recentes</h2>

                    {recentOrders.length === 0 ? (
                        <p className="text-gray-500">Nenhum pedido encontrado.</p>
                    ) : (
                        <div className="space-y-3">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="rounded border p-4">
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium">
                                            {order.order_number ?? `#${order.id}`}
                                        </p>
                                        <span className="text-sm text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-600">{order.customer_name}</p>

                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="text-sm">{formatStatus(order.status)}</span>
                                        <span className="text-sm font-medium">
                                            {formatCurrency(order.total)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'products' && (
                <div className="mt-6 rounded-2xl border bg-white p-6">
                    <h2 className="mb-4 text-lg font-semibold">Top 5 Produtos</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 text-left">
                                    <th className="border p-3">Produto</th>
                                    <th className="border p-3">Categoria</th>
                                    <th className="border p-3">Estoque</th>
                                    <th className="border p-3">Preço</th>
                                    <th className="border p-3">Valor em Estoque</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td className="border p-3 font-medium">{product.name}</td>
                                        <td className="border p-3">{product.category_name}</td>
                                        <td className="border p-3">
                                            {formatBundles(
                                                product.stock_quantity,
                                                product.units_per_bundle
                                            )}
                                        </td>
                                        <td className="border p-3">
                                            {formatCurrency(product.unit_price)}
                                        </td>
                                        <td className="border p-3 font-medium">
                                            {formatCurrency(product.stock_value)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}