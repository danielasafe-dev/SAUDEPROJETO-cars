import { useEffect, useState } from 'react';
import Dialog from '@/shared/components/dialog/Dialog';
import type { User } from '@/types';
import type { UpdateUserInput } from '../../api';
import UserFormFields, { type UserFormValues } from '../forms/UserFormFields';

interface UserEditDialogProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (userId: number, data: UpdateUserInput) => Promise<void>;
}

function buildInitialValues(user: User | null): UserFormValues {
  return {
    nome: user?.nome ?? '',
    email: user?.email ?? '',
    confirmEmail: user?.email ?? '',
    role: user?.role ?? 'agente_saude',
  };
}

export default function UserEditDialog({ user, open, onClose, onSubmit }: UserEditDialogProps) {
  const [values, setValues] = useState<UserFormValues>(buildInitialValues(user));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setValues(buildInitialValues(user));
      setLoading(false);
      setError('');
    }
  }, [open, user]);

  const handleChange = (field: keyof UserFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (!user) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const email = values.email.trim();
      const confirmEmail = values.confirmEmail.trim();

      if (email !== confirmEmail) {
        throw new Error('Os e-mails informados precisam ser iguais.');
      }

      await onSubmit(user.id, {
        nome: values.nome.trim(),
        email,
        role: values.role,
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao editar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={open}
      onClose={onClose}
      title="Editar usuario"
      description="Atualize os dados do usuario selecionado."
      size="lg"
      closeDisabled={loading}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="edit-user-form"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </>
      }
    >
      <form id="edit-user-form" onSubmit={handleSubmit} className="space-y-4">
        <UserFormFields
          values={values}
          onChange={handleChange}
          disabled={loading}
          emailHint="Confirme o e-mail para salvar a alteracao."
        />

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}
      </form>
    </Dialog>
  );
}
