import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import type { Patient } from '@/types';
import {
  createPatient,
  deletePatient,
  getPatients,
  updatePatient,
  type CreatePatientInput,
  type UpdatePatientInput,
} from '../api';
import PatientsTable from '../components/table/PatientsTable';
import PatientCreateDialog from '../components/dialogs/PatientCreateDialog';
import PatientEditDialog from '../components/dialogs/PatientEditDialog';
import PatientDetailsDialog from '../components/dialogs/PatientDetailsDialog';
import PatientDeleteDialog from '../components/dialogs/PatientDeleteDialog';
import { getPatientSearchText } from '../components/utils/patientUtils';

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
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
        const data = await getPatients();
        setPatients(data);
        setError('');
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar pacientes');
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

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

    return getPatientSearchText(patient).includes(normalizedSearch);
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
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nome, CPF, telefone ou e-mail"
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 sm:w-80"
            />
          </label>

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
        onSubmit={handleCreate}
      />
      <PatientEditDialog
        patient={editPatient}
        open={editPatient !== null}
        onClose={() => setEditPatient(null)}
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
