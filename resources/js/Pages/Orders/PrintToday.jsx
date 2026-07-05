import { Head } from '@inertiajs/react';

export default function PrintToday({ groupedItems, printDate }) {
    return (
        <div className="min-h-screen bg-white p-8">
            <Head title={`Lista de separação - ${printDate}`} />

            <div className="mb-6 flex items-center justify-between print:hidden">
                <div>
                    <h1 className="text-2xl font-bold">Lista de separação do dia</h1>
                    <p className="text-gray-600">{printDate}</p>
                </div>

                <button
                    type="button"
                    onClick={() => window.print()}
                    className="rounded bg-blue-600 px-4 py-2 text-white"
                >
                    Imprimir
                </button>
            </div>

            {groupedItems.length === 0 ? (
                <p>Nenhum pedido encontrado para hoje.</p>
            ) : (
                <table className="w-full border-collapse border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2 text-left">Produto</th>
                            <th className="border p-2 text-left">Venda em</th>
                            <th className="border p-2 text-left">Quantidade total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groupedItems.map((item, index) => (
                            <tr key={`${item.product_name}-${item.sale_type}-${index}`}>
                                <td className="border p-2">{item.product_name}</td>
                                <td className="border p-2">
                                    {item.sale_type === 'bundle' ? 'Fardo' : 'Unidade'}
                                </td>
                                <td className="border p-2">{item.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}