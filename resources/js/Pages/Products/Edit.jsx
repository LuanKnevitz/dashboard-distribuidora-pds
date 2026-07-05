import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ product, categories = [] }) {
    const { data, setData, patch, processing, errors } = useForm({
        category_id: product.category_id ?? '',
        name: product.name ?? '',
        description: product.description ?? '',
        unit_price: product.unit_price ?? '',
        bundle_price: product.bundle_price ?? '',
        units_per_bundle: product.units_per_bundle ?? '',
        minimum_stock: product.minimum_stock ?? '',
        status: product.status ? 1 : 0,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('products.update', product.id));
    };

    return (
        <AppLayout title={null}>
            <Head title="Editar Produto" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Editar Produto
                    </h1>
                    <p className="mt-2 text-base text-gray-600">
                        Atualize as informações do produto
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-800">
                                    Categoria
                                </label>
                                <select
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="">Selecione uma categoria</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.category_id}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-800">
                                    Nome do produto
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Digite o nome do produto"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                />
                                {errors.name && (
                                    <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-800">
                                    Preço por unidade
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.unit_price}
                                    onChange={(e) => setData('unit_price', e.target.value)}
                                    placeholder="0,00"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                />
                                {errors.unit_price && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.unit_price}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-800">
                                    Preço por fardo
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.bundle_price}
                                    onChange={(e) => setData('bundle_price', e.target.value)}
                                    placeholder="0,00"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                />
                                {errors.bundle_price && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.bundle_price}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-800">
                                    Unidades por fardo
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={data.units_per_bundle}
                                    onChange={(e) =>
                                        setData('units_per_bundle', e.target.value)
                                    }
                                    placeholder="Ex.: 6, 12, 24"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                />
                                {errors.units_per_bundle && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.units_per_bundle}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-800">
                                    Estoque mínimo (em fardos)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.minimum_stock}
                                    onChange={(e) => setData('minimum_stock', e.target.value)}
                                    placeholder="Digite o estoque mínimo"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                />
                                {errors.minimum_stock && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.minimum_stock}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-800">
                                    Status
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', Number(e.target.value))}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value={1}>Ativo</option>
                                    <option value={0}>Inativo</option>
                                </select>
                                {errors.status && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.status}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-800">
                                Descrição
                            </label>
                            <textarea
                                rows="4"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Descreva o produto"
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            />
                            {errors.description && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-xl bg-[#05081f] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-50"
                            >
                                Salvar alterações
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}