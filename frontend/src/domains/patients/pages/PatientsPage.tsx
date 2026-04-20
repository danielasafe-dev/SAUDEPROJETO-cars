import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import type { Patient } from '@/types';
import type { Group } from '@/domains/groups/types';
import { getGroups } from '@/domains/groups/api';
import { useAuthStore } from '@/shared/store/authStore';
import {
  createPatient,
  deletePatient,
  getPatients,
  updatePatient,
  type CreatePatientInput,
  type UpdatePatientInput,
} from '../api';
import PatientsTable from '../components/table/PatientsTable';
import PatientFiltersBar from '../components/filters/PatientFiltersBar';
import PatientCreateDialog from '../components/dialogs/PatientCreateDialog';
import PatientEditDialog from '../components/dialogs/PatientEditDialog';
import PatientDetailsDialog from '../components/dialogs/PatientDetailsDialog';
import PatientDeleteDialog from '../components/dialogs/PatientDeleteDialog';
import type { PatientSearchField } from '../types';
import { matchesPatientSearch } from '../components/utils/patientUtils';

export default function PatientsPage() {
  const isAdmin = useAuthStore((state) => state.user?.role === 'admin');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [searchField, setSearchField] = useState<PatientSearchField>('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [detailsPatient, setDetailsPatient] = useState<Patient | null>(null);
  const [editPatient, setEditPatient] = useState<Patient | null>(null);
  const [deletePatientTarget, setDeletePatientTarget] = useState<Patient | null>(null);

  const refreshPatients = async () => {
    const data = await getPatients();
    setPatients(data);
    setError('');
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const [patientsData, groupsData] = await Promise.all([
          getPatients(),
          isAdmin ? getGroups() : Promise.resolve([] as Group[]),
        ]);
        setPatients(patientsData);
        setGroups(groupsData);
        setError('');
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar pacientes');
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [isAdmin]);

  const handleCreate = async (data: CreatePatientInput) => {
    await createPatient(data);
    await refreshPatients();
  };

  const handleEdit = async (patientId: number, data: UpdatePatientInput) => {
    await updatePatient(patientId, data);
    await refreshPatients();
  };

  const handleDelete = async (patientId: number) => {
    await deletePatient(patientId);
    await refreshPatients();
  };

  const normalizedSearch = search.trim().toLowerCase();
  const filteredPatients = patients.filter((patient) => {
    if (!normalizedSearch) {
      return true;
    }

    return matchesPatientSearch(patient, normalizedSearch, searchField);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-bold">Pacientes</h2>
          <p className="text-sm text-gray-500">
            {filteredPatients.length} paciente(s) exibido(s) de {patients.length} cadastrado(s)
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Novo paciente
          </button>
        </div>
      </div>

      <PatientFiltersBar
        search={search}
        searchField={searchField}
        onSearchChange={setSearch}
        onSearchFieldChange={setSearchField}
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white px-6 py-10 text-center text-sm text-gray-500">
          Carregando pacientes...
        </div>
      ) : (
        <PatientsTable
          patients={filteredPatients}
          onView={setDetailsPatient}
          onEdit={setEditPatient}
          onDelete={setDeletePatientTarget}
        />
      )}

      <PatientCreateDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        groups={groups}
        requireGroupSelection={isAdmin}
        onSubmit={handleCreate}
      />
      <PatientEditDialog
        patient={editPatient}
        open={editPatient !== null}
        onClose={() => setEditPatient(null)}
        groups={groups}
        requireGroupSelection={isAdmin}
        onSubmit={handleEdit}
      />
      <PatientDetailsDialog
        patient={detailsPatient}
        open={detailsPatient !== null}
        onClose={() => setDetailsPatient(null)}
      />
      <PatientDeleteDialog
        patient={deletePatientTarget}
        open={deletePatientTarget !== null}
        onClose={() => setDeletePatientTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
