import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    Squares2X2Icon,
    CubeIcon,
    ArchiveBoxIcon,
    ShoppingCartIcon,
    DocumentChartBarIcon,
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

export default function AppLayout({ children, title = 'Sistema' }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const currentUrl = usePage().url;

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const menuItems = [
        {
            label: 'Dashboard',
            href: route('dashboard'),
            active: currentUrl === '/dashboard',
            icon: Squares2X2Icon,
        },
        {
            label: 'Produtos',
            href: route('products.index'),
            active:
                currentUrl === '/products' ||
                currentUrl === '/products/create' ||
                currentUrl.startsWith('/products/'),
            icon: CubeIcon,
        },
        {
            label: 'Estoque',
            href: route('stock.index'),
            active: currentUrl === '/stock' || currentUrl === '/stock/create',
            icon: ArchiveBoxIcon,
        },
        {
            label: 'Pedidos',
            href: route('orders.index'),
            active:
                currentUrl === '/orders' ||
                currentUrl === '/orders/create' ||
                currentUrl.startsWith('/orders/'),
            icon: ShoppingCartIcon,
        },
        {
            label: 'Relatórios',
            href: route('reports.index'),
            active: currentUrl === '/reports',
            icon: DocumentChartBarIcon,
        },
    ];

    const userInitials = user?.name
        ? user.name
              .split(' ')
              .map((name) => name[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()
        : 'US';

    const SidebarContent = () => (
        <nav className="space-y-2">
            {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium transition ${
                            item.active
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-slate-700 hover:bg-gray-50 hover:text-blue-600'
                        }`}
                    >
                        <Icon
                            className={`h-6 w-6 ${
                                item.active ? 'text-blue-700' : 'text-slate-600'
                            }`}
                        />
                        <span>{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="border-b bg-white">
                <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white p-2 text-gray-700 transition hover:bg-gray-50 md:hidden"
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </button>

                        <Link
                            href={route('dashboard')}
                            className="flex items-center gap-3 transition hover:opacity-90"
                        >
                            <img
                                src="/images/stockdrink-logo.png"
                                alt="Logo StockDrink"
                                className="h-11 w-11 rounded-2xl object-cover sm:h-12 sm:w-12"
                            />

                            <div className="min-w-0">
                                <h1 className="truncate text-base font-bold text-gray-900 sm:text-xl">
                                    Sistema de Gestão
                                </h1>
                                <p className="truncate text-xs text-gray-500 sm:text-sm">
                                    Distribuidora de Bebidas
                                </p>
                            </div>
                        </Link>
                    </div>

                    <details className="relative shrink-0">
                        <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-2 py-2 transition hover:bg-gray-100 [&::-webkit-details-marker]:hidden sm:gap-3 sm:px-3">
                            <div className="hidden text-right sm:block">
                                <p className="max-w-[140px] truncate font-semibold text-gray-900">
                                    {user?.name}
                                </p>
                                <p className="text-sm text-gray-500">Administrador</p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                                {userInitials}
                            </div>
                        </summary>

                        <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border bg-white py-2 shadow-lg">
                            <Link
                                href={route('profile.edit')}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Meu perfil
                            </Link>

                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                            >
                                Sair
                            </Link>
                        </div>
                    </details>
                </div>
            </header>

            <div className="flex">
                <aside className="hidden min-h-[calc(100vh-81px)] w-64 border-r bg-white px-4 py-5 md:block">
                    <SidebarContent />
                </aside>

                {sidebarOpen && (
                    <div className="fixed inset-0 z-50 md:hidden">
                        <div
                            className="absolute inset-0 bg-black/40"
                            onClick={() => setSidebarOpen(false)}
                        />

                        <div className="absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-white p-5 shadow-xl">
                            <div className="mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img
                                        src="/images/stockdrink-logo.png"
                                        alt="Logo StockDrink"
                                        className="h-10 w-10 rounded-2xl object-cover"
                                    />
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">
                                            StockDrink
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Sistema de Gestão
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setSidebarOpen(false)}
                                    className="rounded-xl border border-gray-200 p-2 text-gray-700"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>

                            <SidebarContent />
                        </div>
                    </div>
                )}

                <main className="min-w-0 flex-1 p-4 sm:p-6">
                    <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
                        {title && (
                            <h2 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">
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