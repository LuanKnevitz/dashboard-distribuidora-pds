import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function Create({ products }) {
    const { data, setData, post, processing, errors } = useForm({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        payment_method: '',
        items: [
            {
                product_id: '',
                sale_type: 'unit',
                quantity: 1,
            },
        ],
    });

    const addItem = () => {
        setData('items', [
            ...data.items,
            {
                product_id: '',
                sale_type: 'unit',
                quantity: 1,
            },
        ]);
    };

    const removeItem = (index) => {
        if (data.items.length === 1) return;

        const updatedItems = [...data.items];
        updatedItems.splice(index, 1);
        setData('items', updatedItems);
    };

    const updateItem = (index, field, value) => {
        const updatedItems = [...data.items];
        updatedItems[index][field] = value;
        setData('items', updatedItems);
    };

    const getProductById = (productId) => {
        return products.find((product) => product.id === Number(productId));
    };

    const getItemPrice = (item) => {
        const product = getProductById(item.product_id);
        if (!product) return 0;

        return item.sale_type === 'bundle'
            ? Number(product.bundle_price)
            : Number(product.unit_price);
    };

    const getItemSubtotal = (item) => {
        return getItemPrice(item) * Number(item.quantity || 0);
    };

    const getOrderTotal = () => {
        return data.items.reduce((total, item) => {
            return total + getItemSubtotal(item);
        }, 0);
    };

    const formatCurrency = (value) => {
        return Number(value || 0).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('orders.store'));
    };

    return (
        <AppLayout title={null}>
            <Head title="Novo Pedido" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Novo Pedido</h1>
                    <p className="mt-2 text-base text-gray-600">
                        Cadastre um novo pedido da distribuidora
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {(errors.items || Object.keys(errors).length > 0) && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            Verifique os campos do pedido antes de salvar.
                        </div>
                    )}

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-800">
                                    Cliente
                                </label>
                                <input
                                    type="text"
                                    value={data.customer_name}
                                    onChange={(e) => setData('customer_name', e.target.value)}
                                    placeholder="Nome do cliente"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                />
                                {errors.customer_name && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.customer_name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-800">
                                    Forma de pagamento
                                </label>
                                <select
                                    value={data.payment_method}
                                    onChange={(e) => setData('payment_method', e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="">Selecione</option>
                                    <option value="pix">Pix</option>
                                    <option value="dinheiro">Dinheiro</option>
                                    <option value="credito">Cartão de crédito</option>
                                    <option value="debito">Cartão de débito</option>
                                    <option value="boleto">Boleto</option>
                                </select>
                                {errors.payment_method && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.payment_method}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-800">
                                    E-mail
                                </label>
                                <input
                                    type="email"
                                    value={data.customer_email}
                                    onChange={(e) => setData('customer_email', e.target.value)}
                                    placeholder="cliente@email.com"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                />
                                {errors.customer_email && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.customer_email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-800">
                                    Telefone
                                </label>
                                <input
                                    type="text"
                                    value={data.customer_phone}
                                    onChange={(e) => setData('customer_phone', e.target.value)}
                                    placeholder="(00) 00000-0000"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                />
                                {errors.customer_phone && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.customer_phone}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Itens do pedido
                            </h2>

                            <button
                                type="button"
                                onClick={addItem}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                <PlusIcon className="h-5 w-5" />
                                Adicionar item
                            </button>
                        </div>

                        <div className="space-y-4">
                            {data.items.map((item, index) => {
                                const product = getProductById(item.product_id);
                                const itemPrice = getItemPrice(item);
                                const subtotal = getItemSubtotal(item);

                                return (
                                    <div
                                        key={index}
                                        className="rounded-2xl border border-gray-200 bg-gray-50 p-4"
                                    >
                                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                                            <div>
                                                <label className="mb-2 block text-sm font-semibold text-gray-800">
                                                    Produto
                                                </label>
                                                <select
                                                    value={item.product_id}
                                                    onChange={(e) =>
                                                        updateItem(index, 'product_id', e.target.value)
                                                    }
                                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                                                >
                                                    <option value="">Selecione</option>
                                                    {products.map((product) => (
                                                        <option key={product.id} value={product.id}>
                                                            {product.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors[`items.${index}.product_id`] && (
                                                    <p className="mt-2 text-sm text-red-600">
                                                        {errors[`items.${index}.product_id`]}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-semibold text-gray-800">
                                                    Venda em
                                                </label>
                                                <select
                                                    value={item.sale_type}
                                                    onChange={(e) =>
                                                        updateItem(index, 'sale_type', e.target.value)
                                                    }
                                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                                                >
                                                    <option value="unit">Unidade</option>
                                                    <option value="bundle">Fardo</option>
                                                </select>
                                                {errors[`items.${index}.sale_type`] && (
                                                    <p className="mt-2 text-sm text-red-600">
                                                        {errors[`items.${index}.sale_type`]}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-semibold text-gray-800">
                                                    Quantidade
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        updateItem(index, 'quantity', e.target.value)
                                                    }
                                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                                                />
                                                {errors[`items.${index}.quantity`] && (
                                                    <p className="mt-2 text-sm text-red-600">
                                                        {errors[`items.${index}.quantity`]}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-semibold text-gray-800">
                                                    Preço
                                                </label>
                                                <div className="rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-700">
                                                    {formatCurrency(itemPrice)}
                                                    {product && item.sale_type === 'bundle' && (
                                                        <span className="mt-1 block text-xs text-gray-500">
                                                            {product.units_per_bundle} un. por fardo
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-sm font-semibold text-gray-800">
                                                    Subtotal
                                                </label>
                                                <div className="rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-900">
                                                    {formatCurrency(subtotal)}
                                                </div>

                                                {data.items.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(index)}
                                                        className="mt-3 inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                        Remover
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {errors.items && (
                            <p className="mt-4 text-sm text-red-600">{errors.items}</p>
                        )}
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total do pedido</p>
                                <h3 className="mt-2 text-4xl font-bold text-green-600">
                                    {formatCurrency(getOrderTotal())}
                                </h3>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                            >
                                Salvar pedido
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}