import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ products }) {
    const toggleStatus = (productId) => {
        router.patch(route('products.toggle-status', productId));
    };

    return (
        <AppLayout title="Produtos">
            <Head title="Produtos" />

            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-xl font-semibold">Lista de produtos</h1>

                <Link
                    href={route('products.create')}
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Novo produto
                </Link>
            </div>

            {products.length === 0 ? (
                <div className="rounded border border-dashed border-gray-300 p-6 text-center text-gray-500">
                    Nenhum produto cadastrado.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 bg-white">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="border p-3">Nome</th>
                                <th className="border p-3">Categoria</th>
                                <th className="border p-3">Preço</th>
                                <th className="border p-3">Estoque</th>
                                <th className="border p-3">Estoque mínimo</th>
                                <th className="border p-3">Status</th>
                                <th className="border p-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="border p-3">{product.name}</td>
                                    <td className="border p-3">{product.category?.name ?? '-'}</td>
                                    <td className="border p-3">R$ {product.price}</td>
                                    <td className="border p-3">{product.stock_quantity}</td>
                                    <td className="border p-3">{product.minimum_stock}</td>
                                    <td className="border p-3">
                                        <span
                                            className={`rounded px-2 py-1 text-sm font-medium ${
                                                product.status
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {product.status ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </td>
                                    <td className="border p-3">
                                        <div className="flex items-center gap-3">
                                            <Link
                                                href={route('products.edit', product.id)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Editar
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() => toggleStatus(product.id)}
                                                className={`rounded px-3 py-1 text-sm text-white ${
                                                    product.status
                                                        ? 'bg-red-600 hover:bg-red-700'
                                                        : 'bg-green-600 hover:bg-green-700'
                                                }`}
                                            >
                                                {product.status ? 'Inativar' : 'Ativar'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AppLayout>
    );
}