import { Eye, Pencil, Trash2 } from 'lucide-react';
import type { Patient } from '@/types';
import { formatCpf, formatDate, formatPatientSex, formatPhone, getPatientAgeLabel } from '../utils/patientUtils';

interface PatientsTableProps {
  patients: Patient[];
  onView: (patient: Patient) => void;
  onEdit: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

export default function PatientsTable({
  patients,
  onView,
  onEdit,
  onDelete,
}: PatientsTableProps) {
  if (!patients.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center text-sm text-gray-500">
        Nenhum paciente encontrado com os filtros atuais.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-sm">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Paciente</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">CPF</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Nascimento</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Sexo</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Contato</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Cadastro</th>
            <th className="px-4 py-3 text-left font-medium text-gray-600">Acoes</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id} className="border-b border-gray-100 align-top hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="font-medium text-gray-900">{patient.nome}</div>
                <div className="text-xs text-gray-500">{getPatientAgeLabel(patient)}</div>
              </td>
              <td className="px-4 py-3 text-gray-600">{formatCpf(patient.cpf)}</td>
              <td className="px-4 py-3 text-gray-600">{formatDate(patient.data_nascimento)}</td>
              <td className="px-4 py-3 text-gray-600">{formatPatientSex(patient.sexo)}</td>
              <td className="px-4 py-3 text-gray-600">
                <div>{formatPhone(patient.telefone)}</div>
                <div className="text-xs text-gray-500">{patient.email || 'Sem e-mail'}</div>
              </td>
              <td className="px-4 py-3 text-gray-500">{formatDate(patient.criado_em)}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onView(patient)}
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Visualizar
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit(patient)}
                    className="inline-flex items-center gap-1 rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-50"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(patient)}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
