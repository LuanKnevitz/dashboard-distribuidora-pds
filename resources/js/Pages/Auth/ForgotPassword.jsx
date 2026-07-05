import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <>
            <Head title="Esqueceu a senha" />

            <div className="flex min-h-screen items-center justify-center bg-[#142c79] px-4 py-10">
                <div className="w-full max-w-md">
                    <div className="mb-8 flex justify-center">
                        <img
                            src="/images/stockdrink-logo.png"
                            alt="Logo StockDrink"
                            className="h-24 w-24 rounded-3xl object-cover shadow-lg"
                        />
                    </div>

                    <div className="rounded-[22px] bg-white px-6 py-8 shadow-xl sm:px-8">
                        <div className="mb-8 text-center">
                            <h1 className="text-4xl font-bold text-gray-900">
                                Recuperar Senha
                            </h1>
                            <p className="mt-3 text-base text-gray-500">
                                Informe seu e-mail para receber o link de redefinição.
                            </p>
                        </div>

                        {status && (
                            <div className="mb-4 rounded-lg bg-green-100 px-4 py-3 text-sm text-green-700">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <InputLabel
                                    htmlFor="email"
                                    value="E-mail"
                                    className="mb-2 block text-base font-semibold text-gray-900"
                                />

                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="block w-full rounded-xl border-gray-200 bg-gray-100 px-4 py-3 text-base"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="seu@email.com"
                                />

                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <Link
                                    href={route('login')}
                                    className="font-medium text-gray-800 hover:text-blue-600"
                                >
                                    Voltar para entrar
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-xl bg-black px-4 py-3 text-base font-semibold text-white transition hover:bg-gray-900 disabled:opacity-50"
                            >
                                Enviar link de redefinição
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}