import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ summary, lowStockProducts, recentMovements }) {
    return (
        <AppLayout title="Estoque">
            <Head title="Estoque" />

            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-xl font-semibold">Controle de estoque</h1>

                <Link
                    href={route('stock.create')}
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Nova Movimentação
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded border bg-white p-4">
                    <p className="text-sm text-gray-500">Total em estoque</p>
                    <h3 className="text-2xl font-bold">{summary.total_stock}</h3>
                </div>

                <div className="rounded border bg-white p-4">
                    <p className="text-sm text-gray-500">Entradas do dia</p>
                    <h3 className="text-2xl font-bold text-green-600">
                        {summary.entries_today}
                    </h3>
                </div>

                <div className="rounded border bg-white p-4">
                    <p className="text-sm text-gray-500">Saídas do dia</p>
                    <h3 className="text-2xl font-bold text-red-600">
                        {summary.exits_today}
                    </h3>
                </div>

                <div className="rounded border bg-white p-4">
                    <p className="text-sm text-gray-500">Produtos com estoque baixo</p>
                    <h3 className="text-2xl font-bold text-yellow-600">
                        {summary.low_stock_count}
                    </h3>
                </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div>
                    <h3 className="mb-4 text-lg font-semibold">Produtos com estoque baixo</h3>

                    {lowStockProducts.length === 0 ? (
                        <div className="rounded border border-dashed p-4 text-gray-500">
                            Nenhum produto com estoque baixo.
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded border bg-white">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-100 text-left">
                                        <th className="border p-3">Produto</th>
                                        <th className="border p-3">Estoque atual</th>
                                        <th className="border p-3">Estoque mínimo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lowStockProducts.map((product) => (
                                        <tr key={product.id}>
                                            <td className="border p-3">{product.name}</td>
                                            <td className="border p-3">{product.stock_quantity}</td>
                                            <td className="border p-3">{product.minimum_stock}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div>
                    <h3 className="mb-4 text-lg font-semibold">Histórico recente</h3>

                    {recentMovements.length === 0 ? (
                        <div className="rounded border border-dashed p-4 text-gray-500">
                            Nenhuma movimentação registrada.
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded border bg-white">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-100 text-left">
                                        <th className="border p-3">Produto</th>
                                        <th className="border p-3">Tipo</th>
                                        <th className="border p-3">Quantidade</th>
                                        <th className="border p-3">Usuário</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentMovements.map((movement) => (
                                        <tr key={movement.id}>
                                            <td className="border p-3">
                                                {movement.product?.name ?? '-'}
                                            </td>
                                            <td className="border p-3">
                                                {movement.type === 'entry' && 'Entrada'}
                                                {movement.type === 'exit' && 'Saída'}
                                                {movement.type === 'adjustment' && 'Ajuste'}
                                            </td>
                                            <td className="border p-3">{movement.quantity}</td>
                                            <td className="border p-3">
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