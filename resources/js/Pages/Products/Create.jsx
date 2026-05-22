import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ categories }) {
    const { data, setData, post, processing, errors } = useForm({
        category_id: '',
        name: '',
        description: '',
        price: '',
        stock_quantity: '',
        minimum_stock: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('products.store'));
    };

    return (
        <AppLayout title="Cadastrar Produto">
            <Head title="Cadastrar Produto" />

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="mb-1 block">Nome</label>
                    <input
                        type="text"
                        className="w-full rounded border p-2"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                    <label className="mb-1 block">Categoria</label>
                    <select
                        className="w-full rounded border p-2"
                        value={data.category_id}
                        onChange={(e) => setData('category_id', e.target.value)}
                    >
                        <option value="">Selecione uma categoria</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {errors.category_id && <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>}
                </div>

                <div>
                    <label className="mb-1 block">Preço</label>
                    <input
                        type="number"
                        step="0.01"
                        className="w-full rounded border p-2"
                        value={data.price}
                        onChange={(e) => setData('price', e.target.value)}
                    />
                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                </div>

                <div>
                    <label className="mb-1 block">Quantidade em estoque</label>
                    <input
                        type="number"
                        className="w-full rounded border p-2"
                        value={data.stock_quantity}
                        onChange={(e) => setData('stock_quantity', e.target.value)}
                    />
                    {errors.stock_quantity && <p className="mt-1 text-sm text-red-600">{errors.stock_quantity}</p>}
                </div>

                <div>
                    <label className="mb-1 block">Estoque mínimo</label>
                    <input
                        type="number"
                        className="w-full rounded border p-2"
                        value={data.minimum_stock}
                        onChange={(e) => setData('minimum_stock', e.target.value)}
                    />
                    {errors.minimum_stock && <p className="mt-1 text-sm text-red-600">{errors.minimum_stock}</p>}
                </div>

                <div>
                    <label className="mb-1 block">Descrição</label>
                    <textarea
                        className="w-full rounded border p-2"
                        rows="4"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                    />
                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
                >
                    Salvar
                </button>
            </form>
        </AppLayout>
    );
}