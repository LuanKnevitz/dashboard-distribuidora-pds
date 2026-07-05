import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    PlusIcon,
    MagnifyingGlassIcon,
    ChevronDownIcon,
    EyeIcon,
    PrinterIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';

export default function Index({ orders, filters, summary }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            router.get(
                route('orders.index'),
                {
                    search,
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
    }, [search, status]);

    const formatStatus = (value) => {
        if (value === 'pending') return 'Pendente';
        if (value === 'confirmed') return 'Confirmado';
        if (value === 'separated') return 'Separado';
        if (value === 'delivered') return 'Entregue';
        if (value === 'cancelled') return 'Cancelado';
        return value;
    };

    const getStatusClass = (value) => {
        if (value === 'pending') return 'bg-orange-100 text-orange-700';
        if (value === 'confirmed') return 'bg-blue-100 text-blue-700';
        if (value === 'separated') return 'bg-purple-100 text-purple-700';
        if (value === 'delivered') return 'bg-green-100 text-green-700';
        return 'bg-red-100 text-red-700';
    };

    const formatCurrency = (value) => {
        return Number(value || 0).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    };

    return (
        <AppLayout title={null}>
            <Head title="Pedidos" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                            Gerenciamento de Pedidos
                        </h1>
                        <p className="mt-2 text-sm text-gray-600 sm:text-base">
                            Acompanhe e gerencie todos os pedidos da distribuidora
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <a
                            href={route('orders.print.today')}
                            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
                        >
                            Lista de separação do dia
                        </a>

                        <Link
                            href={route('orders.create')}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#05081f] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
                        >
                            <PlusIcon className="h-5 w-5" />
                            Novo Pedido
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                        <p className="text-sm font-medium text-gray-600 sm:text-base">
                            Total de Pedidos
                        </p>
                        <h3 className="mt-6 break-words text-3xl font-bold text-gray-900 sm:mt-12 sm:text-4xl">
                            {summary.total_orders}
                        </h3>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                        <p className="text-sm font-medium text-gray-600 sm:text-base">
                            Pedidos Hoje
                        </p>
                        <h3 className="mt-6 break-words text-3xl font-bold text-gray-900 sm:mt-12 sm:text-4xl">
                            {summary.orders_today}
                        </h3>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                        <p className="text-sm font-medium text-gray-600 sm:text-base">
                            Pendentes
                        </p>
                        <h3 className="mt-6 break-words text-3xl font-bold text-orange-600 sm:mt-12 sm:text-4xl">
                            {summary.pending_orders}
                        </h3>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                        <p className="text-sm font-medium text-gray-600 sm:text-base">
                            Valor Total
                        </p>
                        <h3 className="mt-6 break-words text-3xl font-bold text-gray-900 sm:mt-12 sm:text-4xl">
                            {formatCurrency(summary.total_value)}
                        </h3>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
                        <div className="relative">
                            <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar por número do pedido ou cliente..."
                                className="w-full rounded-xl border border-transparent bg-gray-100 py-3 pl-12 pr-4 text-sm text-gray-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div className="relative">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full appearance-none rounded-xl border border-transparent bg-gray-100 px-4 py-3 text-sm font-medium text-gray-800 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            >
                                <option value="">Todos os Status</option>
                                <option value="pending">Pendente</option>
                                <option value="confirmed">Confirmado</option>
                                <option value="separated">Separado</option>
                                <option value="delivered">Entregue</option>
                                <option value="cancelled">Cancelado</option>
                            </select>
                            <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                    <h2 className="mb-6 text-xl font-semibold text-gray-900 sm:text-2xl">
                        Lista de Pedidos
                    </h2>

                    <div className="overflow-x-auto rounded-2xl border border-gray-200">
                        {orders.data.length === 0 ? (
                            <div className="p-10 text-center text-sm text-gray-500">
                                Nenhum pedido encontrado.
                            </div>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200 bg-white">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                                            Nº Pedido
                                        </th>
                                        <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                                            Cliente
                                        </th>
                                        <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                                            Data
                                        </th>
                                        <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                                            Itens
                                        </th>
                                        <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                                            Valor Total
                                        </th>
                                        <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                                            Status
                                        </th>
                                        <th className="px-4 py-4 text-right text-sm font-semibold text-gray-700">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200">
                                    {orders.data.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                                {order.order_number ?? `#${order.id}`}
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {order.customer_name}
                                                </div>
                                                <div className="mt-1 text-sm text-gray-500">
                                                    {order.customer_email || order.customer_phone || '-'}
                                                </div>
                                            </td>

                                            <td className="px-4 py-4 text-sm text-gray-700">
                                                {order.formatted_created_at ?? '-'}
                                            </td>

                                            <td className="px-4 py-4 text-sm text-gray-700">
                                                {order.items?.length ?? 0} item(s)
                                            </td>

                                            <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                                                {formatCurrency(order.total)}
                                            </td>

                                            <td className="px-4 py-4 text-sm">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                                                        order.status
                                                    )}`}
                                                >
                                                    {formatStatus(order.status)}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={route('orders.show', order.id)}
                                                        className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-blue-600"
                                                        title="Ver pedido"
                                                    >
                                                        <EyeIcon className="h-5 w-5" />
                                                    </Link>

                                                    <a
                                                        href={route('orders.print', order.id)}
                                                        className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                                                        title="Baixar PDF do pedido"
                                                    >
                                                        <PrinterIcon className="h-5 w-5" />
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {orders.last_page > 1 && (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <button
                            type="button"
                            disabled={!orders.prev_page_url}
                            onClick={() =>
                                orders.prev_page_url && router.visit(orders.prev_page_url)
                            }
                            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                        >
                            Anterior
                        </button>

                        <span className="text-center text-sm text-gray-600">
                            Página {orders.current_page} de {orders.last_page}
                        </span>

                        <button
                            type="button"
                            disabled={!orders.next_page_url}
                            onClick={() =>
                                orders.next_page_url && router.visit(orders.next_page_url)
                            }
                            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                        >
                            Próxima
                        </button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}