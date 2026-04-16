import { useEffect, useState } from 'react';
import Dialog from '@/shared/components/dialog/Dialog';
import type { User } from '@/types';
import UserFormFields, { type UserFormValues } from '../forms/UserFormFields';
import type { CreateUserInput } from '../../api';
import { isLinkedLeadershipRequired, shouldShowLinkedLeadershipField } from '../utils/userUtils';

interface UserCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserInput) => Promise<void>;
  chefiaUsers: User[];
}

const initialValues: UserFormValues = {
  nome: '',
  email: '',
  confirmEmail: '',
  role: 'agente_saude',
  chefiaId: '',
};

export default function UserCreateDialog({
  open,
  onClose,
  onSubmit,
  chefiaUsers,
}: UserCreateDialogProps) {
  const [values, setValues] = useState<UserFormValues>(initialValues);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setValues(initialValues);
      setLoading(false);
      setError('');
    }
  }, [open]);

  const handleChange = (field: keyof UserFormValues, value: string) => {
    setValues((current) => {
      if (field === 'role') {
        return {
          ...current,
          role: value as UserFormValues['role'],
          chefiaId: value === 'admin' ? '' : current.chefiaId,
        };
      }

      return { ...current, [field]: value };
    });
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const email = values.email.trim();
      const confirmEmail = values.confirmEmail.trim();
      const showLinkedLeadershipField = shouldShowLinkedLeadershipField(values.role);
      const linkedLeadershipRequired = isLinkedLeadershipRequired(values.role);
      const selectedLinkedLeadershipId = values.chefiaId ? Number(values.chefiaId) : null;

      if (email !== confirmEmail) {
        throw new Error('Os e-mails informados precisam ser iguais.');
      }

      if (linkedLeadershipRequired && chefiaUsers.length === 0) {
        throw new Error('Cadastre pelo menos uma chefia ativa antes de criar este perfil.');
      }

      if (showLinkedLeadershipField && linkedLeadershipRequired && !selectedLinkedLeadershipId) {
        throw new Error('Selecione uma chefia vinculada valida para esse perfil.');
      }

      if (selectedLinkedLeadershipId && !chefiaUsers.some((user) => user.id === selectedLinkedLeadershipId)) {
        throw new Error('A chefia vinculada precisa ser um usuario com perfil Chefia.');
      }

      await onSubmit({
        nome: values.nome.trim(),
        email,
        role: values.role,
        chefiaId: selectedLinkedLeadershipId,
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao criar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={open}
      onClose={onClose}
      title="Criar usuario"
      description="Preencha os dados para cadastrar um novo acesso."
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
            form="create-user-form"
            disabled={loading}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Criar'}
          </button>
        </>
      }
    >
      <form id="create-user-form" onSubmit={handleSubmit} className="space-y-4">
        <UserFormFields
          values={values}
          onChange={handleChange}
          disabled={loading}
          chefiaOptions={chefiaUsers}
          enableLinkedLeadershipField
          emailHint="Os dois campos de e-mail precisam ser iguais. A definicao da senha ficara para o fluxo de convite por e-mail."
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
