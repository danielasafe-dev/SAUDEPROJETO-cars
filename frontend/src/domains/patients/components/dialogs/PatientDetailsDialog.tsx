import Dialog from '@/shared/components/dialog/Dialog';
import type { Patient } from '@/types';
import {
  formatCpf,
  formatDate,
  formatPatientSex,
  formatPhone,
  getPatientAgeLabel,
} from '../utils/patientUtils';

interface PatientDetailsDialogProps {
  patient: Patient | null;
  open: boolean;
  onClose: () => void;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <div className="mt-1 text-sm text-gray-800">{value}</div>
    </div>
  );
}

export default function PatientDetailsDialog({
  patient,
  open,
  onClose,
}: PatientDetailsDialogProps) {
  return (
    <Dialog
      isOpen={open}
      onClose={onClose}
      title="Detalhes do paciente"
      description="Confira os dados cadastrais sem editar as informacoes."
      size="lg"
      footer={
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Fechar
        </button>
      }
    >
      {patient && (
        <div className="grid gap-4 md:grid-cols-2">
          <InfoRow label="Nome completo" value={patient.nome} />
          <InfoRow label="CPF" value={formatCpf(patient.cpf)} />
          <InfoRow label="Data de nascimento" value={formatDate(patient.data_nascimento)} />
          <InfoRow label="Idade" value={getPatientAgeLabel(patient)} />
          <InfoRow label="Sexo" value={formatPatientSex(patient.sexo)} />
          <InfoRow label="Telefone" value={formatPhone(patient.telefone)} />
          <InfoRow label="E-mail" value={patient.email || 'Nao informado'} />
          <InfoRow label="Endereco" value={patient.endereco || 'Nao informado'} />
          <InfoRow label="Grupo" value={patient.group_nome || 'Nao informado'} />
          <InfoRow label="Observacoes" value={patient.observacoes || 'Nao informado'} />
          <InfoRow label="Cadastro" value={formatDate(patient.criado_em)} />
          <InfoRow label="Identificador" value={`#${patient.id}`} />
        </div>
      )}
    </Dialog>
  );
}
