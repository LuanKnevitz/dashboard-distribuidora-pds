import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AppLayout title={null}>
            <Head title="Meu Perfil" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
                    <p className="mt-2 text-base text-gray-600">
                        Gerencie seus dados de acesso e configurações da conta
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <UpdatePasswordForm />
                </div>

                <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
                    <DeleteUserForm />
                </div>
            </div>
        </AppLayout>
    );
}