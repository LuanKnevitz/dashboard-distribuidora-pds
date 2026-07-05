import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Show({ order }) {
    const statusForm = useForm({
        status: order.status ?? 'pending',
    });

    const cancelForm = useForm({});

    const submitStatus = (e) => {
        e.preventDefault();
        statusForm.patch(route('orders.update-status', order.id));
    };

    const handleCancel = () => {
        const confirmed = window.confirm(
            'Tem certeza que deseja cancelar este pedido? O estoque será devolvido.'
        );

        if (!confirmed) return;

        cancelForm.patch(route('orders.cancel', order.id));
    };

    const formatCurrency = (value) => {
        return Number(value || 0).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    };

    const formatDate = (value) => {
        if (!value) return '-';

        return new Date(value).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
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

    const getStatusClass = (status) => {
        if (status === 'pending') {
            return 'bg-orange-100 text-orange-700';
        }

        if (status === 'confirmed') {
            return 'bg-blue-100 text-blue-700';
        }

        if (status === 'separated') {
            return 'bg-purple-100 text-purple-700';
        }

        if (status === 'delivered') {
            return 'bg-green-100 text-green-700';
        }

        return 'bg-red-100 text-red-700';
    };

    const formatPaymentMethod = (method) => {
        if (method === 'pix') return 'Pix';
        if (method === 'dinheiro') return 'Dinheiro';
        if (method === 'credito') return 'Cartão de crédito';
        if (method === 'debito') return 'Cartão de débito';
        if (method === 'boleto') return 'Boleto';
        return method || '-';
    };

    const formatSaleType = (saleType) => {
        if (saleType === 'bundle') return 'Fardo';
        if (saleType === 'unit') return 'Unidade';
        return saleType;
    };

    const isCancelled = order.status === 'cancelled';

    return (
        <AppLayout title={null}>
            <Head title={`Pedido ${order.order_number ?? `#${order.id}`}`} />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Detalhes do Pedido
                        </h1>
                        <p className="mt-2 text-base text-gray-600">
                            Acompanhe as informações completas deste pedido
                        </p>
                    </div>

                    <a
                        href={route('orders.print', order.id)}
                        className="inline-flex items-center justify-center rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                    >
                        Baixar PDF do pedido
                    </a>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                {order.order_number ?? `#${order.id}`}
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Criado em {formatDate(order.created_at)}
                            </p>
                        </div>

                        <span
                            className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusClass(
                                order.status
                            )}`}
                        >
                            {formatStatus(order.status)}
                        </span>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">Cliente</p>
                        <p className="mt-2 text-xl font-semibold text-gray-900">
                            {order.customer_name || '-'}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">Forma de pagamento</p>
                        <p className="mt-2 text-xl font-semibold text-gray-900">
                            {formatPaymentMethod(order.payment_method)}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">E-mail</p>
                        <p className="mt-2 text-xl font-semibold text-gray-900">
                            {order.customer_email || '-'}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">Telefone</p>
                        <p className="mt-2 text-xl font-semibold text-gray-900">
                            {order.customer_phone || '-'}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">Quantidade de itens</p>
                        <p className="mt-2 text-xl font-semibold text-gray-900">
                            {order.items?.length ?? 0} item(s)
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">Total do pedido</p>
                        <p className="mt-2 text-3xl font-bold text-green-600">
                            {formatCurrency(order.total)}
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-5 text-2xl font-semibold text-gray-900">
                        Ações do pedido
                    </h2>

                    <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                        <form onSubmit={submitStatus} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-800">
                                    Alterar status
                                </label>
                                <select
                                    value={statusForm.data.status}
                                    onChange={(e) =>
                                        statusForm.setData('status', e.target.value)
                                    }
                                    disabled={isCancelled || statusForm.processing}
                                    className="w-full min-w-[220px] rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
                                >
                                    <option value="pending">Pendente</option>
                                    <option value="confirmed">Confirmado</option>
                                    <option value="separated">Separado</option>
                                    <option value="delivered">Entregue</option>
                                </select>
                                {statusForm.errors.status && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {statusForm.errors.status}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isCancelled || statusForm.processing}
                                className="rounded-xl bg-[#2563eb] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                            >
                                Salvar status
                            </button>
                        </form>

                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isCancelled || cancelForm.processing}
                            className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                        >
                            Cancelar pedido
                        </button>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="mb-6 text-2xl font-semibold text-gray-900">
                        Itens do pedido
                    </h2>

                    <div className="overflow-x-auto rounded-2xl border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200 bg-white">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                                        Produto
                                    </th>
                                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                                        Venda em
                                    </th>
                                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                                        Quantidade
                                    </th>
                                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                                        Preço
                                    </th>
                                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                                        Subtotal
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                                {order.items?.length > 0 ? (
                                    order.items.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4 text-sm font-medium text-gray-900">
                                                {item.product?.name ?? '-'}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-700">
                                                {formatSaleType(item.sale_type)}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-700">
                                                {item.quantity}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-700">
                                                {formatCurrency(item.item_price)}
                                            </td>
                                            <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                                                {formatCurrency(item.subtotal)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-4 py-8 text-center text-sm text-gray-500"
                                        >
                                            Nenhum item encontrado neste pedido.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-4 text-right shadow-sm">
                            <p className="text-sm text-gray-500">Total do pedido</p>
                            <p className="mt-1 text-3xl font-bold text-green-600">
                                {formatCurrency(order.total)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}