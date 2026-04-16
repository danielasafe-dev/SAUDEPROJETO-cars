import { Eye, Pencil, UserX } from 'lucide-react';
import type { User } from '@/types';
import { formatCreatedAt, formatRole, roleBadgeCls, statusBadgeCls } from '../utils/userUtils';

interface UsersTableProps {
  users: User[];
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDeactivate: (user: User) => void;
}

export default function UsersTable({ users, onView, onEdit, onDeactivate }: UsersTableProps) {
  if (!users.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center text-sm text-gray-500">
        Nenhum usuario cadastrado ate o momento.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-sm">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Nome</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">E-mail</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Perfil</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Cadastro</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Acoes</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{user.nome}</td>
              <td className="px-4 py-3 text-gray-500">{user.email}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-1 text-xs font-bold ${roleBadgeCls(user.role)}`}>
                  {formatRole(user.role)}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-1 text-xs font-bold ${statusBadgeCls(user.ativo)}`}>
                  {user.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500">{formatCreatedAt(user.criado_em)}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onView(user)}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Visualizar
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(user)}
                    className="inline-flex items-center gap-1 rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-50"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </button>
                  {user.ativo && (
                    <button
                      type="button"
                      onClick={() => onDeactivate(user)}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50"
                    >
                      <UserX className="h-3.5 w-3.5" />
                      Desativar
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
