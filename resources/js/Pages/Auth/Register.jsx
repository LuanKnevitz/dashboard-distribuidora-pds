import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Cadastre-se" />

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
                                Sistema de Gestão
                            </h1>
                            <p className="mt-3 text-xl text-gray-500">
                                Distribuidora de Bebidas
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <InputLabel
                                    htmlFor="name"
                                    value="Nome"
                                    className="mb-2 block text-base font-semibold text-gray-900"
                                />

                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="block w-full rounded-xl border-gray-200 bg-gray-100 px-4 py-3 text-base"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Seu nome"
                                />

                                <InputError message={errors.name} className="mt-2" />
                            </div>

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
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="seu@email.com"
                                />

                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="password"
                                    value="Senha"
                                    className="mb-2 block text-base font-semibold text-gray-900"
                                />

                                <div className="relative">
                                    <TextInput
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        className="block w-full rounded-xl border-gray-200 bg-gray-100 px-4 py-3 pr-12 text-base"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.8}
                                            stroke="currentColor"
                                            className="h-5 w-5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .644C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                    </button>
                                </div>

                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Confirmar senha"
                                    className="mb-2 block text-base font-semibold text-gray-900"
                                />

                                <div className="relative">
                                    <TextInput
                                        id="password_confirmation"
                                        type={showPasswordConfirmation ? 'text' : 'password'}
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="block w-full rounded-xl border-gray-200 bg-gray-100 px-4 py-3 pr-12 text-base"
                                        autoComplete="new-password"
                                        onChange={(e) =>
                                            setData('password_confirmation', e.target.value)
                                        }
                                        placeholder="••••••••"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPasswordConfirmation((prev) => !prev)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.8}
                                            stroke="currentColor"
                                            className="h-5 w-5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M2.036 12.322a1.012 1.012 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .644C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                    </button>
                                </div>

                                <InputError
                                    message={errors.password_confirmation}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <Link
                                    href={route('login')}
                                    className="font-medium text-gray-800 hover:text-blue-600"
                                >
                                    Já tem conta? Entrar
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-xl bg-black px-4 py-3 text-base font-semibold text-white transition hover:bg-gray-900 disabled:opacity-50"
                            >
                                Cadastrar
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}