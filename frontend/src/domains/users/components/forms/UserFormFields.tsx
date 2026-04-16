import type { User, UserRole } from '@/types';
import { isLinkedLeadershipRequired, roleOptions, shouldShowLinkedLeadershipField } from '../utils/userUtils';

export interface UserFormValues {
  nome: string;
  email: string;
  confirmEmail: string;
  role: UserRole;
  chefiaId: string;
}

interface UserFormFieldsProps {
  values: UserFormValues;
  onChange: (field: keyof UserFormValues, value: string) => void;
  disabled?: boolean;
  emailHint?: string;
  chefiaOptions?: User[];
  enableLinkedLeadershipField?: boolean;
}

export default function UserFormFields({
  values,
  onChange,
  disabled = false,
  emailHint,
  chefiaOptions = [],
  enableLinkedLeadershipField = false,
}: UserFormFieldsProps) {
  const showLinkedLeadershipField = enableLinkedLeadershipField && shouldShowLinkedLeadershipField(values.role);
  const linkedLeadershipRequired = isLinkedLeadershipRequired(values.role);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium">Nome</label>
          <input
            value={values.nome}
            onChange={(event) => onChange('nome', event.target.value)}
            required
            disabled={disabled}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">E-mail</label>
          <input
            type="email"
            value={values.email}
            onChange={(event) => onChange('email', event.target.value)}
            required
            disabled={disabled}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Confirmar e-mail</label>
          <input
            type="email"
            value={values.confirmEmail}
            onChange={(event) => onChange('confirmEmail', event.target.value)}
            required
            disabled={disabled}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium">Perfil</label>
          <select
            value={values.role}
            onChange={(event) => onChange('role', event.target.value)}
            disabled={disabled}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
          >
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {showLinkedLeadershipField && (
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">
              Chefia vinculada
              {linkedLeadershipRequired ? ' *' : ' (opcional)'}
            </label>
            <select
              value={values.chefiaId}
              onChange={(event) => onChange('chefiaId', event.target.value)}
              disabled={disabled}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              <option value="">
                {linkedLeadershipRequired ? 'Selecione uma chefia' : 'Sem chefia vinculada'}
              </option>
              {chefiaOptions.map((option) => (
                <option key={option.id} value={String(option.id)}>
                  {option.nome}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              {linkedLeadershipRequired
                ? 'Esse perfil so pode ser criado com uma chefia valida.'
                : 'Se desejar, voce pode vincular essa chefia a outra chefia ja cadastrada.'}
            </p>
          </div>
        )}
      </div>

      {emailHint && <div className="text-xs text-gray-500">{emailHint}</div>}
    </div>
  );
}
