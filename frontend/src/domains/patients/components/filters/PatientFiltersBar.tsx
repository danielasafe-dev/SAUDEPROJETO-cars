import { Search } from 'lucide-react';
import type { PatientSearchField } from '../../types';
import { patientSearchFieldOptions } from '../utils/patientUtils';

interface PatientFiltersBarProps {
  search: string;
  searchField: PatientSearchField;
  onSearchChange: (value: string) => void;
  onSearchFieldChange: (value: PatientSearchField) => void;
}

export default function PatientFiltersBar({
  search,
  searchField,
  onSearchChange,
  onSearchFieldChange,
}: PatientFiltersBarProps) {
  const selectedFieldLabel =
    patientSearchFieldOptions.find((option) => option.value === searchField)?.label ??
    'Todas as colunas';

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-end">
      <div className="sm:min-w-52">
        <label className="mb-1 block text-sm font-medium text-gray-700">Filtrar por</label>
        <select
          value={searchField}
          onChange={(event) => onSearchFieldChange(event.target.value as PatientSearchField)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          {patientSearchFieldOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <label className="relative block flex-1">
        <span className="mb-1 block text-sm font-medium text-gray-700">Busca</span>
        <Search className="pointer-events-none absolute left-3 top-[38px] h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={`Buscar em ${selectedFieldLabel.toLowerCase()}`}
          className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>
    </div>
  );
}
