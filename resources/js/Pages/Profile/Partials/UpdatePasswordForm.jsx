import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';

export default function UpdatePasswordForm({ className = '' }) {
    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: () => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                }

                if (errors.current_password) {
                    reset('current_password');
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-2xl font-semibold text-gray-900">
                    Alterar Senha
                </h2>

                <p className="mt-2 text-sm text-gray-600">
                    Atualize sua senha para manter a conta segura.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                    <div>
                        <InputLabel htmlFor="current_password" value="Senha atual" />
                        <TextInput
                            id="current_password"
                            type="password"
                            className="mt-2 block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 focus:border-blue-300 focus:bg-white focus:ring-blue-100"
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            autoComplete="current-password"
                        />
                        <InputError message={errors.current_password} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="Nova senha" />
                        <TextInput
                            id="password"
                            type="password"
                            className="mt-2 block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 focus:border-blue-300 focus:bg-white focus:ring-blue-100"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            autoComplete="new-password"
                        />
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password_confirmation" value="Confirmar senha" />
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            className="mt-2 block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 focus:border-blue-300 focus:bg-white focus:ring-blue-100"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            autoComplete="new-password"
                        />
                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-xl bg-[#05081f] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-50"
                    >
                        Salvar senha
                    </button>

                    {recentlySuccessful && (
                        <p className="text-sm font-medium text-green-600">Senha alterada.</p>
                    )}
                </div>
            </form>
        </section>
    );
}