import { useEffect, useState } from 'react';
import Dialog from '@/shared/components/dialog/Dialog';
import type { Group } from '@/domains/groups/types';
import type { PatientFormValues } from '../../types';
import { lookupAddressByCep, type CreatePatientInput } from '../../api';
import PatientFormFields from '../forms/PatientFormFields';
import {
  buildPatientFormValues,
  maskCepInput,
  mapPatientFormToInput,
  maskCpfInput,
  maskPhoneInput,
  validatePatientForm,
} from '../utils/patientUtils';

interface PatientCreateDialogProps {
  open: boolean;
  onClose: () => void;
  groups?: Group[];
  defaultGroupId?: string;
  requireGroupSelection?: boolean;
  onSubmit: (data: CreatePatientInput) => Promise<void>;
}

export default function PatientCreateDialog({
  open,
  onClose,
  groups = [],
  defaultGroupId = '',
  requireGroupSelection = false,
  onSubmit,
}: PatientCreateDialogProps) {
  const [values, setValues] = useState<PatientFormValues>(buildPatientFormValues());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cepLookupLoading, setCepLookupLoading] = useState(false);
  const [cepLookupMessage, setCepLookupMessage] = useState('');
  const [cepLookupTone, setCepLookupTone] = useState<'neutral' | 'success' | 'error'>('neutral');

  useEffect(() => {
    if (open) {
      setValues({
        ...buildPatientFormValues(),
        groupId: defaultGroupId,
      });
      setLoading(false);
      setError('');
      setCepLookupLoading(false);
      setCepLookupMessage('');
      setCepLookupTone('neutral');
    }
  }, [defaultGroupId, open]);

  const handleChange = (field: keyof PatientFormValues, value: string) => {
    if (field === 'cpf') {
      setValues((current) => ({ ...current, cpf: maskCpfInput(value) }));
      return;
    }

    if (field === 'telefone') {
      setValues((current) => ({ ...current, telefone: maskPhoneInput(value) }));
      return;
    }

    if (field === 'cep') {
      setCepLookupMessage('');
      setCepLookupTone('neutral');
      setValues((current) => ({ ...current, cep: maskCepInput(value) }));
      return;
    }

    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleCepBlur = async () => {
    const cep = values.cep.replace(/\D/g, '');
    if (cep.length !== 8) {
      return;
    }

    setCepLookupLoading(true);
    setCepLookupMessage('');
    setCepLookupTone('neutral');

    try {
      const address = await lookupAddressByCep(cep);
      setValues((current) => ({
        ...current,
        cep: maskCepInput(address.cep || current.cep),
        estado: address.estado || current.estado,
        cidade: address.cidade || current.cidade,
        bairro: address.bairro || current.bairro,
        rua: address.rua || current.rua,
        complemento: current.complemento || address.complemento || '',
      }));
      setCepLookupMessage('Endereco preenchido automaticamente pelo CEP.');
      setCepLookupTone('success');
    } catch (err: unknown) {
      setCepLookupMessage(err instanceof Error ? err.message : 'Nao foi possivel consultar o CEP.');
      setCepLookupTone('error');
    } finally {
      setCepLookupLoading(false);
    }
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const validationError = validatePatientForm(values, { requireGroup: requireGroupSelection });
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
      size="xl"
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
        <PatientFormFields
          values={values}
          onChange={handleChange}
          onCepBlur={handleCepBlur}
          groups={groups}
          showGroupField={requireGroupSelection}
          disabled={loading}
          cepLookupLoading={cepLookupLoading}
          cepLookupMessage={cepLookupMessage}
          cepLookupTone={cepLookupTone}
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
