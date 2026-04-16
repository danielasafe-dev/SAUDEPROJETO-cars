import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import {
  createUser,
  deactivateUser,
  getUsers,
  sendUserPasswordInvite,
  updateUser,
  type CreateUserInput,
  type UpdateUserInput,
} from '../api';
import UsersTable from '../components/table/UsersTable';
import UserCreateDialog from '../components/dialogs/UserCreateDialog';
import UserDetailsDialog from '../components/dialogs/UserDetailsDialog';
import UserEditDialog from '../components/dialogs/UserEditDialog';
import UserDeactivateDialog from '../components/dialogs/UserDeactivateDialog';
import UserPasswordInviteDialog from '../components/dialogs/UserPasswordInviteDialog';
import type { User } from '@/types';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [detailsUser, setDetailsUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [passwordInviteTarget, setPasswordInviteTarget] = useState<User | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<User | null>(null);

  const refreshUsers = async () => {
    const data = await getUsers();
    setUsers(data);
    setError('');
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
        setError('');
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar usuarios');
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const handleCreate = async (data: CreateUserInput) => {
    await createUser(data);
    await refreshUsers();
  };

  const handleEdit = async (userId: number, data: UpdateUserInput) => {
    await updateUser(userId, data);
    await refreshUsers();
  };

  const handleDeactivate = async (userId: number) => {
    await deactivateUser(userId);
    await refreshUsers();
  };

  const handlePasswordInvite = async (userId: number) => {
    await sendUserPasswordInvite(userId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Usuarios</h2>
          <p className="text-sm text-gray-500">Gerenciar avaliadores e administradores</p>
        </div>

        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Novo usuario
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-10 text-center text-sm text-gray-500">
          Carregando usuarios...
        </div>
      ) : (
        <UsersTable
          users={users}
          onView={setDetailsUser}
          onEdit={setEditUser}
          onSendInvite={setPasswordInviteTarget}
          onDeactivate={setDeactivateTarget}
        />
      )}

      <UserCreateDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />
      <UserDetailsDialog user={detailsUser} open={detailsUser !== null} onClose={() => setDetailsUser(null)} />
      <UserEditDialog user={editUser} open={editUser !== null} onClose={() => setEditUser(null)} onSubmit={handleEdit} />
      <UserPasswordInviteDialog
        user={passwordInviteTarget}
        open={passwordInviteTarget !== null}
        onClose={() => setPasswordInviteTarget(null)}
        onConfirm={handlePasswordInvite}
      />
      <UserDeactivateDialog
        user={deactivateTarget}
        open={deactivateTarget !== null}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={handleDeactivate}
      />
    </div>
  );
}
