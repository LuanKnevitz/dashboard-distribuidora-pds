import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ products }) {
    const { data, setData, post, processing, errors } = useForm({
        product_id: '',
        type: 'entry',
        quantity: '',
        reason: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('stock.store'));
    };

    return (
        <AppLayout title="Nova Movimentação">
            <Head title="Nova Movimentação" />

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="mb-1 block">Produto</label>
                    <select
                        className="w-full rounded border p-2"
                        value={data.product_id}
                        onChange={(e) => setData('product_id', e.target.value)}
                    >
                        <option value="">Selecione um produto</option>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </select>
                    {errors.product_id && (
                        <p className="mt-1 text-sm text-red-600">{errors.product_id}</p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block">Tipo de movimentação</label>
                    <select
                        className="w-full rounded border p-2"
                        value={data.type}
                        onChange={(e) => setData('type', e.target.value)}
                    >
                        <option value="entry">Entrada</option>
                        <option value="exit">Saída</option>
                        <option value="adjustment">Ajuste manual</option>
                    </select>
                    {errors.type && (
                        <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block">
                        {data.type === 'adjustment' ? 'Novo estoque' : 'Quantidade'}
                    </label>
                    <input
                        type="number"
                        min="1"
                        className="w-full rounded border p-2"
                        value={data.quantity}
                        onChange={(e) => setData('quantity', e.target.value)}
                    />
                    {errors.quantity && (
                        <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
                    )}
                </div>

                <div>
                    <label className="mb-1 block">Motivo / Observação</label>
                    <textarea
                        className="w-full rounded border p-2"
                        rows="4"
                        value={data.reason}
                        onChange={(e) => setData('reason', e.target.value)}
                    />
                    {errors.reason && (
                        <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
                >
                    Salvar movimentação
                </button>
            </form>
        </AppLayout>
    );
}