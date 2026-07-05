import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformationForm({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-2xl font-semibold text-gray-900">
                    Informações do Perfil
                </h2>

                <p className="mt-2 text-sm text-gray-600">
                    Atualize seu nome e e-mail de acesso.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <InputLabel htmlFor="name" value="Nome" />
                        <TextInput
                            id="name"
                            className="mt-2 block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 focus:border-blue-300 focus:bg-white focus:ring-blue-100"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            isFocused
                            autoComplete="name"
                        />
                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="E-mail" />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-2 block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 focus:border-blue-300 focus:bg-white focus:ring-blue-100"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoComplete="username"
                        />
                        <InputError className="mt-2" message={errors.email} />
                    </div>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                        <p className="text-sm text-gray-800">
                            Seu e-mail ainda não foi verificado.
                            {' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="font-medium text-blue-600 underline hover:text-blue-700"
                            >
                                Clique aqui para reenviar o e-mail de verificação.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                Um novo link de verificação foi enviado.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-xl bg-[#05081f] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-50"
                    >
                        Salvar alterações
                    </button>

                    {recentlySuccessful && (
                        <p className="text-sm font-medium text-green-600">Salvo com sucesso.</p>
                    )}
                </div>
            </form>
        </section>
    );
}