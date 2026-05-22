import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AppLayout title="Dashboard">
            <Head title="Dashboard" />

            <p className="text-gray-600">
                Bem-vindo ao sistema StockDrink. Aqui ficará a visão geral do sistema.
            </p>
        </AppLayout>
    );
}