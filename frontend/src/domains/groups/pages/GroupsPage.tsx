import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import SearchFiltersPanel from '@/shared/components/filters/SearchFiltersPanel';
import { useAuthStore } from '@/shared/store/authStore';
import type { User } from '@/types';
import { getUsers } from '@/domains/users/api';
import {
  createGroup,
  deleteGroup,
  getGroups,
  updateGroup,
  type CreateGroupInput,
  type UpdateGroupInput,
} from '../api';
import type { Group } from '../types';
import GroupsTable from '../components/table/GroupsTable';
import GroupCreateDialog from '../components/dialogs/GroupCreateDialog';
import GroupEditDialog from '../components/dialogs/GroupEditDialog';
import GroupDetailsDialog from '../components/dialogs/GroupDetailsDialog';
import GroupDeleteDialog from '../components/dialogs/GroupDeleteDialog';
import { getGroupSearchText } from '../components/utils/groupUtils';

export default function GroupsPage() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'admin';

  const [groups, setGroups] = useState<Group[]>([]);
  const [managers, setManagers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [detailsGroup, setDetailsGroup] = useState<Group | null>(null);
  const [editGroup, setEditGroup] = useState<Group | null>(null);
  const [deleteGroupTarget, setDeleteGroupTarget] = useState<Group | null>(null);

  const loadData = async () => {
    const [groupsData, usersData] = await Promise.all([getGroups(), getUsers()]);
    setGroups(groupsData);
    setManagers(usersData.filter((item: User) => item.role === 'gestor'));
    setError('');
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        await loadData();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar grupos');
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const managersById = useMemo(
    () => new Map(managers.map((manager) => [manager.id, manager])),
    [managers],
  );

  const handleCreate = async (data: CreateGroupInput) => {
    const selectedManager = data.gestorId ? managersById.get(data.gestorId) ?? null : user ?? null;
    await createGroup(data, selectedManager);
    await loadData();
  };

  const handleEdit = async (groupId: number, data: UpdateGroupInput) => {
    const selectedManager = data.gestorId ? managersById.get(data.gestorId) ?? null : user ?? null;
    await updateGroup(groupId, data, selectedManager);
    await loadData();
  };

  const handleDelete = async (groupId: number) => {
    await deleteGroup(groupId);
    await loadData();
  };

  const normalizedSearch = search.trim().toLowerCase();
  const filteredGroups = groups.filter((group) => {
    if (!normalizedSearch) {
      return true;
    }

    return getGroupSearchText(group).includes(normalizedSearch);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-bold">Grupos</h2>
          <p className="text-sm text-gray-500">
            {filteredGroups.length} grupo(s) exibido(s) de {groups.length} cadastrado(s)
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Novo grupo
        </button>
      </div>

      <SearchFiltersPanel
        title="Encontre grupos e gestores com mais rapidez"
        description="Busque por nome do grupo ou pelo gestor responsavel para localizar o que precisa."
        searchLabel="Buscar grupo"
        searchValue={search}
        searchPlaceholder="Buscar por nome do grupo ou gestor"
        onSearchChange={setSearch}
        hasActiveFilters={search.trim().length > 0}
        onClear={() => setSearch('')}
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-10 text-center text-sm text-gray-500">
          Carregando grupos...
        </div>
      ) : (
        <GroupsTable
          groups={filteredGroups}
          onView={setDetailsGroup}
          onEdit={setEditGroup}
          onDelete={setDeleteGroupTarget}
        />
      )}

      <GroupCreateDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        managers={managers}
        requireManager={Boolean(isAdmin)}
      />
      <GroupEditDialog
        group={editGroup}
        open={editGroup !== null}
        onClose={() => setEditGroup(null)}
        onSubmit={handleEdit}
        managers={managers}
        requireManager={Boolean(isAdmin)}
      />
      <GroupDetailsDialog
        group={detailsGroup}
        open={detailsGroup !== null}
        onClose={() => setDetailsGroup(null)}
      />
      <GroupDeleteDialog
        group={deleteGroupTarget}
        open={deleteGroupTarget !== null}
        onClose={() => setDeleteGroupTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
