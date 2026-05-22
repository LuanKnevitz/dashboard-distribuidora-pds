import { Link, usePage } from '@inertiajs/react';

export default function AppLayout({ children, title = 'Sistema' }) {
    const { auth, url } = usePage().props;
    const user = auth?.user;

    const currentUrl = usePage().url;

    const menuItems = [
        {
            label: 'Dashboard',
            href: route('dashboard'),
            active: currentUrl === '/dashboard',
        },
        {
            label: 'Produtos',
            href: route('products.index'),
            active:
                currentUrl === '/products' ||
                currentUrl === '/products/create' ||
                currentUrl.startsWith('/products/'),
        },
        {
            label: 'Estoque',
            href: route('stock.index'),
            active: currentUrl === '/stock' || currentUrl === '/stock/create',
        },
        {
            label: 'Pedidos',
            href: '#',
            active: false,
            disabled: true,
        },
        {
            label: 'Relatórios',
            href: '#',
            active: false,
            disabled: true,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="border-b bg-white">
                <div className="flex items-center justify-between px-6 py-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            Sistema de Gestão
                        </h1>
                        <p className="text-sm text-gray-500">
                            Distribuidora de Bebidas
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="font-semibold text-gray-900">{user?.name}</p>
                        <p className="text-sm text-gray-500">Administrador</p>
                    </div>
                </div>
            </header>

            <div className="flex">
                <aside className="min-h-[calc(100vh-81px)] w-64 border-r bg-white p-4">
                    <nav className="space-y-2">
                        {menuItems.map((item) =>
                            item.disabled ? (
                                <div
                                    key={item.label}
                                    className="rounded px-4 py-3 text-gray-400"
                                >
                                    {item.label}
                                </div>
                            ) : (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`block rounded px-4 py-3 transition ${
                                        item.active
                                            ? 'bg-blue-100 font-semibold text-blue-700'
                                            : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            )
                        )}
                    </nav>
                </aside>

                <main className="flex-1 p-6">
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        {title && (
                            <h2 className="mb-6 text-2xl font-bold text-gray-900">
                                {title}
                            </h2>
                        )}

                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}