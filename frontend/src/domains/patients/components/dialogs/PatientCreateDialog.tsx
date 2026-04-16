import { useEffect, useState } from 'react';
import Dialog from '@/shared/components/dialog/Dialog';
import type { PatientFormValues } from '../../types';
import type { CreatePatientInput } from '../../api';
import PatientFormFields from '../forms/PatientFormFields';
import {
  buildPatientFormValues,
  mapPatientFormToInput,
  maskCpfInput,
  maskPhoneInput,
  validatePatientForm,
} from '../utils/patientUtils';

interface PatientCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePatientInput) => Promise<void>;
}

export default function PatientCreateDialog({
  open,
  onClose,
  onSubmit,
}: PatientCreateDialogProps) {
  const [values, setValues] = useState<PatientFormValues>(buildPatientFormValues());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setValues(buildPatientFormValues());
      setLoading(false);
      setError('');
    }
  }, [open]);

  const handleChange = (field: keyof PatientFormValues, value: string) => {
    if (field === 'cpf') {
      setValues((current) => ({ ...current, cpf: maskCpfInput(value) }));
      return;
    }

    if (field === 'telefone') {
      setValues((current) => ({ ...current, telefone: maskPhoneInput(value) }));
      return;
    }

    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const validationError = validatePatientForm(values);
      if (validationError) {
        throw new Error(validationError);
      }

      await onSubmit(mapPatientFormToInput(values));
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao criar paciente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={open}
      onClose={onClose}
      title="Novo paciente"
      description="Preencha os dados principais para cadastrar um novo paciente."
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
            form="create-patient-form"
            disabled={loading}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar paciente'}
          </button>
        </>
      }
    >
      <form id="create-patient-form" onSubmit={handleSubmit} className="space-y-4">
        <PatientFormFields values={values} onChange={handleChange} disabled={loading} />

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}
      </form>
    </Dialog>
  );
}
