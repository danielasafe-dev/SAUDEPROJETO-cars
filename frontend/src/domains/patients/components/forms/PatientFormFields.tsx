import type { Group } from '@/domains/groups/types';
import type { PatientFormValues } from '../../types';
import { patientSexOptions } from '../utils/patientUtils';

interface PatientFormFieldsProps {
  values: PatientFormValues;
  onChange: (field: keyof PatientFormValues, value: string) => void;
  groups?: Group[];
  showGroupField?: boolean;
  disabled?: boolean;
}

export default function PatientFormFields({
  values,
  onChange,
  groups = [],
  showGroupField = false,
  disabled = false,
}: PatientFormFieldsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-medium">Nome completo</label>
        <input
          value={values.nome}
          onChange={(event) => onChange('nome', event.target.value)}
          required
          disabled={disabled}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
          placeholder="Nome completo do paciente"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">CPF</label>
        <input
          value={values.cpf}
          onChange={(event) => onChange('cpf', event.target.value)}
          required
          disabled={disabled}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
          placeholder="000.000.000-00"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Data de nascimento</label>
        <input
          type="date"
          value={values.dataNascimento}
          onChange={(event) => onChange('dataNascimento', event.target.value)}
          required
          disabled={disabled}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Sexo</label>
        <select
          value={values.sexo}
          onChange={(event) => onChange('sexo', event.target.value)}
          required
          disabled={disabled}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
        >
          <option value="">Selecione o sexo</option>
          {patientSexOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Telefone</label>
        <input
          value={values.telefone}
          onChange={(event) => onChange('telefone', event.target.value)}
          disabled={disabled}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
          placeholder="(00) 00000-0000"
        />
      </div>

      {showGroupField && (
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium">Grupo</label>
          <select
            value={values.groupId}
            onChange={(event) => onChange('groupId', event.target.value)}
            required
            disabled={disabled}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
          >
            <option value="">Selecione o grupo</option>
            {groups.map((group) => (
              <option key={group.id} value={String(group.id)}>
                {group.nome}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-medium">E-mail</label>
        <input
          type="email"
          value={values.email}
          onChange={(event) => onChange('email', event.target.value)}
          disabled={disabled}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
          placeholder="paciente@exemplo.com"
        />
      </div>

      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-medium">Endereco</label>
        <input
          value={values.endereco}
          onChange={(event) => onChange('endereco', event.target.value)}
          disabled={disabled}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
          placeholder="Rua, numero, bairro, cidade"
        />
      </div>

      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-medium">Observacoes</label>
        <textarea
          value={values.observacoes}
          onChange={(event) => onChange('observacoes', event.target.value)}
          disabled={disabled}
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
          placeholder="Informacoes complementares relevantes"
        />
      </div>

      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-medium">Documentos</label>
        <textarea
          value={values.documentos}
          onChange={(event) => onChange('documentos', event.target.value)}
          disabled={disabled}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
          placeholder="Documentos do paciente, anexos entregues ou referencias externas"
        />
      </div>

      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-medium">Historico</label>
        <textarea
          value={values.historico}
          onChange={(event) => onChange('historico', event.target.value)}
          disabled={disabled}
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100"
          placeholder="Historico clinico, social ou observacoes de acompanhamento"
        />
      </div>
    </div>
  );
}
