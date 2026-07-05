import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import DangerButton from '@/Components/DangerButton';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const passwordInput = useRef();

    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-2xl font-semibold text-red-600">
                    Excluir Conta
                </h2>

                <p className="mt-2 text-sm text-gray-600">
                    Após excluir sua conta, todos os dados serão removidos permanentemente.
                </p>
            </header>

            <div className="mt-6">
                <button
                    type="button"
                    onClick={confirmUserDeletion}
                    className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                    Excluir conta
                </button>
            </div>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Tem certeza que deseja excluir sua conta?
                    </h2>

                    <p className="mt-2 text-sm text-gray-600">
                        Esta ação é permanente. Digite sua senha para confirmar.
                    </p>

                    <div className="mt-6">
                        <InputLabel htmlFor="password" value="Senha" className="sr-only" />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="block w-full rounded-xl border-gray-200 bg-gray-50 px-4 py-3 focus:border-red-300 focus:bg-white focus:ring-red-100"
                            isFocused
                            placeholder="Senha"
                        />

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                        >
                            Confirmar exclusão
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}