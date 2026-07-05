import { Head } from '@inertiajs/react';

export default function Print({ order }) {
    const formatStatus = (status) => {
        if (status === 'pending') return 'Pendente';
        if (status === 'confirmed') return 'Confirmado';
        if (status === 'separated') return 'Separado';
        if (status === 'delivered') return 'Entregue';
        if (status === 'cancelled') return 'Cancelado';
        return status;
    };

    return (
        <div className="min-h-screen bg-white p-8">
            <Head title={`Imprimir ${order.order_number ?? order.id}`} />

            <div className="mb-6 flex items-center justify-between print:hidden">
                <h1 className="text-2xl font-bold">Impressão do pedido</h1>
                <button
                    type="button"
                    onClick={() => window.print()}
                    className="rounded bg-blue-600 px-4 py-2 text-white"
                >
                    Imprimir
                </button>
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-bold">{order.order_number ?? `Pedido #${order.id}`}</h2>
                <p>Status: {formatStatus(order.status)}</p>
                <p>Cliente: {order.customer_name}</p>
                <p>Forma de pagamento: {order.payment_method ?? '-'}</p>
                <p>E-mail: {order.customer_email ?? '-'}</p>
                <p>Telefone: {order.customer_phone ?? '-'}</p>
                <p>Data: {new Date(order.created_at).toLocaleString('pt-BR')}</p>
            </div>

            <table className="w-full border-collapse border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2 text-left">Produto</th>
                        <th className="border p-2 text-left">Venda em</th>
                        <th className="border p-2 text-left">Quantidade</th>
                        <th className="border p-2 text-left">Preço</th>
                        <th className="border p-2 text-left">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map((item) => (
                        <tr key={item.id}>
                            <td className="border p-2">{item.product?.name ?? '-'}</td>
                            <td className="border p-2">
                                {item.sale_type === 'bundle' ? 'Fardo' : 'Unidade'}
                            </td>
                            <td className="border p-2">{item.quantity}</td>
                            <td className="border p-2">R$ {item.item_price}</td>
                            <td className="border p-2">R$ {item.subtotal}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-6 text-right">
                <p className="text-sm text-gray-500">Total do pedido</p>
                <h3 className="text-2xl font-bold">R$ {order.total}</h3>
            </div>
        </div>
    );
}