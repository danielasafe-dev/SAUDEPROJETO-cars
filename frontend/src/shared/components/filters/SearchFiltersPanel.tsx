import { Search, SlidersHorizontal, X } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface SearchFiltersPanelProps {
  badgeLabel?: string;
  title: string;
  description: string;
  searchLabel: string;
  searchValue: string;
  searchPlaceholder: string;
  onSearchChange: (value: string) => void;
  filterLabel?: string;
  filterValue?: string;
  filterOptions?: FilterOption[];
  onFilterChange?: (value: string) => void;
  onClear?: () => void;
  hasActiveFilters?: boolean;
  clearLabel?: string;
}

export default function SearchFiltersPanel({
  badgeLabel = 'Busca e filtros',
  title,
  description,
  searchLabel,
  searchValue,
  searchPlaceholder,
  onSearchChange,
  filterLabel,
  filterValue,
  filterOptions,
  onFilterChange,
  onClear,
  hasActiveFilters = false,
  clearLabel = 'Limpar filtros',
}: SearchFiltersPanelProps) {
  const showFilter =
    Boolean(filterLabel) &&
    filterValue !== undefined &&
    Boolean(filterOptions?.length) &&
    Boolean(onFilterChange);

  const handleFilterChange = (value: string) => {
    if (onFilterChange) {
      onFilterChange(value);
    }
  };

  const layoutClass = showFilter
    ? 'lg:grid-cols-[minmax(0,2.2fr)_minmax(220px,0.9fr)]'
    : 'lg:grid-cols-1';

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {badgeLabel}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>

        {hasActiveFilters && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-2 self-start rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 lg:self-auto"
          >
            <X className="h-4 w-4" />
            {clearLabel}
          </button>
        )}
      </div>

      <div className={`mt-4 grid gap-3 ${layoutClass}`}>
        <label className="relative block">
          <span className="mb-1.5 block text-sm font-medium text-gray-700">{searchLabel}</span>
          <Search className="pointer-events-none absolute left-3 top-[42px] h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>

        {showFilter && (
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-gray-700">{filterLabel}</span>
            <select
              value={filterValue}
              onChange={(event) => handleFilterChange(event.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {filterOptions!.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
    </section>
  );
}
