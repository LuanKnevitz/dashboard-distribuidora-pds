import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ products = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        product_id: '',
        type: 'entry',
        movement_unit: 'unit',
        input_quantity: '',
        reason: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('stock.store'));
    };

    const quantityLabel =
        data.type === 'adjustment'
            ? data.movement_unit === 'bundle'
                ? 'Novo estoque (em fardos)'
                : 'Novo estoque (em unidades)'
            : data.movement_unit === 'bundle'
              ? 'Quantidade de fardos'
              : 'Quantidade de unidades';

    return (
        <AppLayout title={null}>
            <Head title="Nova Movimentação" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Nova Movimentação
                    </h1>
                    <p className="mt-2 text-base text-gray-600">
                        Registre entradas, saídas ou ajustes no estoque
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-800">
                                    Produto
                                </label>
                                <select
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
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
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.product_id}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-800">
                                    Tipo de movimentação
                                </label>
                                <select
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                >
                                    <option value="entry">Entrada</option>
                                    <option value="exit">Saída</option>
                                    <option value="adjustment">Ajuste manual</option>
                                </select>
                                {errors.type && (
                                    <p className="mt-2 text-sm text-red-600">{errors.type}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-800">
                                    Movimentar em
                                </label>
                                <select
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                    value={data.movement_unit}
                                    onChange={(e) =>
                                        setData('movement_unit', e.target.value)
                                    }
                                >
                                    <option value="unit">Unidade</option>
                                    <option value="bundle">Fardo</option>
                                </select>
                                {errors.movement_unit && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.movement_unit}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-800">
                                    {quantityLabel}
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                    value={data.input_quantity}
                                    onChange={(e) =>
                                        setData('input_quantity', e.target.value)
                                    }
                                />
                                {errors.input_quantity && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.input_quantity}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-800">
                                Motivo / Observação
                            </label>
                            <textarea
                                rows="4"
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                value={data.reason}
                                onChange={(e) => setData('reason', e.target.value)}
                                placeholder="Descreva o motivo da movimentação"
                            />
                            {errors.reason && (
                                <p className="mt-2 text-sm text-red-600">{errors.reason}</p>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-xl bg-[#05081f] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-50"
                            >
                                Salvar movimentação
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}