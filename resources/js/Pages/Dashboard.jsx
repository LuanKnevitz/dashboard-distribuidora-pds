import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import {
    CubeIcon,
    ShoppingCartIcon,
    ExclamationTriangleIcon,
    CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { useMemo } from 'react';

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

export default function Dashboard({
    summary,
    weeklySales,
    statusCounts,
    lowStockProducts,
    recentOrders,
}) {
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
        const remainingUnits = stockQuantity % unitsPerBundle;

        if (remainingUnits === 0) {
            return `${bundles} fardo(s)`;
        }

        return `${bundles} fardo(s) e ${remainingUnits} un.`;
    };

    const lineData = useMemo(
        () => ({
            labels: weeklySales.map((item) => item.label),
            datasets: [
                {
                    data: weeklySales.map((item) => item.total),
                    borderColor: '#3b82f6',
                    backgroundColor: '#3b82f6',
                    tension: 0.35,
                    pointRadius: 4,
                    pointHoverRadius: 5,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#3b82f6',
                    pointBorderWidth: 2,
                },
            ],
        }),
        [weeklySales]
    );

    const pieData = useMemo(
        () => ({
            labels: ['Pendente', 'Confirmado', 'Separado', 'Entregue'],
            datasets: [
                {
                    data: [
                        statusCounts.pending,
                        statusCounts.confirmed,
                        statusCounts.separated,
                        statusCounts.delivered,
                    ],
                    backgroundColor: ['#6366f1', '#f59e0b', '#10b981', '#3b82f6'],
                    borderColor: '#ffffff',
                    borderWidth: 1,
                },
            ],
        }),
        [statusCounts]
    );

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            x: {
                ticks: {
                    color: '#6b7280',
                    font: {
                        size: 12,
                    },
                },
                grid: {
                    color: '#e5e7eb',
                    borderDash: [4, 4],
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#6b7280',
                    font: {
                        size: 12,
                    },
                },
                grid: {
                    color: '#e5e7eb',
                    borderDash: [4, 4],
                },
            },
        },
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: 10,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    color: '#374151',
                    font: {
                        size: 12,
                    },
                    padding: 18,
                },
            },
        },
    };

    const statCards = [
        {
            title: 'Total de Produtos',
            value: summary.total_products,
            subtitle: 'produtos cadastrados',
            icon: CubeIcon,
            iconColor: 'text-blue-500',
        },
        {
            title: 'Pedidos Hoje',
            value: summary.orders_today,
            subtitle: `${summary.pending_today} pendentes`,
            icon: ShoppingCartIcon,
            iconColor: 'text-green-500',
            subtitleColor: 'text-orange-500',
        },
        {
            title: 'Estoque Baixo',
            value: summary.low_stock_count,
            subtitle: 'produtos abaixo do mínimo',
            icon: ExclamationTriangleIcon,
            iconColor: 'text-orange-500',
        },
        {
            title: 'Vendas Totais',
            value: formatCurrency(summary.total_sales),
            subtitle: 'pedidos confirmados e entregues',
            icon: CurrencyDollarIcon,
            iconColor: 'text-violet-500',
        },
    ];

    return (
        <AppLayout title={null}>
            <Head title="Dashboard" />

            <div>
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-600 sm:text-base">
                    Bem-vindo, Admin Sistema! Aqui está uma visão geral do sistema.
                </p>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {statCards.map((card, index) => {
                    const Icon = card.icon;

                    return (
                        <div
                            key={index}
                            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <p className="text-sm font-medium text-gray-600 sm:text-base">
                                    {card.title}
                                </p>

                                <div className="shrink-0 rounded-full bg-gray-50 p-2">
                                    <Icon className={`h-5 w-5 ${card.iconColor}`} />
                                </div>
                            </div>

                            <div className="mt-6 sm:mt-8">
                                <h3 className="break-words text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                    {card.value}
                                </h3>
                                <p
                                    className={`mt-2 text-xs sm:text-sm ${
                                        card.subtitleColor ?? 'text-gray-500'
                                    }`}
                                >
                                    {card.subtitle}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                    <h2 className="mb-6 text-xl font-semibold text-gray-900 sm:text-2xl">
                        Vendas da Semana
                    </h2>

                    <div className="h-72 sm:h-80">
                        <Line data={lineData} options={lineOptions} />
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                    <h2 className="mb-6 text-xl font-semibold text-gray-900 sm:text-2xl">
                        Pedidos por Status
                    </h2>

                    <div className="h-72 sm:h-80">
                        <Pie data={pieData} options={pieOptions} />
                    </div>
                </div>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                    <h2 className="mb-6 text-xl font-semibold text-gray-900 sm:text-2xl">
                        Produtos com Estoque Baixo
                    </h2>

                    {lowStockProducts.length === 0 ? (
                        <p className="text-sm text-gray-500">
                            Nenhum produto com estoque baixo.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {lowStockProducts.map((product) => {
                                const minimumInUnits =
                                    product.minimum_stock * product.units_per_bundle;

                                const isCritical =
                                    product.stock_quantity <= minimumInUnits / 2;

                                return (
                                    <div
                                        key={product.id}
                                        className="flex flex-col gap-3 rounded-xl bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-base font-semibold text-gray-900 sm:text-lg">
                                                {product.name}
                                            </p>
                                            <p className="mt-1 text-sm text-gray-600">
                                                Estoque:{' '}
                                                {formatBundles(
                                                    product.stock_quantity,
                                                    product.units_per_bundle
                                                )}{' '}
                                                / Mínimo: {product.minimum_stock} fardo(s)
                                            </p>
                                        </div>

                                        <span
                                            className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                                                isCritical
                                                    ? 'bg-red-600 text-white'
                                                    : 'bg-orange-100 text-orange-700'
                                            }`}
                                        >
                                            {isCritical ? 'Crítico' : 'Baixo'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                    <h2 className="mb-6 text-xl font-semibold text-gray-900 sm:text-2xl">
                        Pedidos Recentes
                    </h2>

                    {recentOrders.length === 0 ? (
                        <p className="text-sm text-gray-500">Nenhum pedido encontrado.</p>
                    ) : (
                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex flex-col gap-3 rounded-xl bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
                                >
                                    <div className="min-w-0">
                                        <p className="text-base font-semibold text-gray-900 sm:text-lg">
                                            {order.order_number ?? `#${order.id}`}
                                        </p>
                                        <p className="mt-1 truncate text-sm text-gray-600">
                                            {order.customer_name}
                                        </p>
                                    </div>

                                    <div className="text-left sm:text-right">
                                        <p className="text-base font-semibold text-gray-900 sm:text-lg">
                                            {formatCurrency(order.total)}
                                        </p>
                                        <span
                                            className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                                                order.status === 'delivered'
                                                    ? 'bg-green-100 text-green-700'
                                                    : order.status === 'pending'
                                                      ? 'bg-orange-100 text-orange-700'
                                                      : order.status === 'confirmed'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : order.status === 'separated'
                                                          ? 'bg-violet-100 text-violet-700'
                                                          : 'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {formatStatus(order.status)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}