import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEvals } from '@/domains/dashboard/api';
import type { Evaluation } from '@/types';
import { Eye } from 'lucide-react';

export default function EvaluationsListPage() {
  const navigate = useNavigate();
  const [evals, setEvals] = useState<Evaluation[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    getEvals().then((data: Evaluation[]) => setEvals(data));
  }, []);

  const filtered = evals.filter((e) =>
    e.patientNome.toLowerCase().includes(filter.toLowerCase())
  );

  const badgeCls = (score: number) => {
    if (score <= 29.5) return 'bg-green-100 text-green-700';
    if (score < 37) return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Avaliações</h2>
        <p className="text-sm text-gray-500">Histórico completo</p>
      </div>

      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Buscar por paciente..."
        className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Paciente</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Avaliador</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Data</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Score</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{e.patientNome}</td>
                <td className="px-4 py-2 text-gray-500">{e.avaliadorNome}</td>
                <td className="px-4 py-2 text-gray-500">{new Date(e.dataAvaliacao).toLocaleDateString('pt-BR')}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${badgeCls(e.scoreTotal)}`}>
                    {e.scoreTotal}/60
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => navigate(`/avaliacoes/${e.id}`)}
                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <Eye className="w-3 h-3" />
                    Visualizar
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  Nenhuma avaliação encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
