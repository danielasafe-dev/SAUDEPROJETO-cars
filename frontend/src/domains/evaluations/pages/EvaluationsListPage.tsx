import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getEvals } from '@/domains/dashboard/api';
import type { Evaluation } from '@/types';
import { Eye, Plus } from 'lucide-react';
import EvaluationCreateDialog from '../components/EvaluationCreateDialog';

export default function EvaluationsListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [evals, setEvals] = useState<Evaluation[]>([]);
  const [filter, setFilter] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    getEvals().then((data: Evaluation[]) => setEvals(data));
  }, []);

  useEffect(() => {
    const state = location.state as { openNewEvaluation?: boolean } | null;
    if (state?.openNewEvaluation) {
      setCreateOpen(true);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Avaliacoes</h2>
          <p className="text-sm text-gray-500">Historico completo</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Nova Avaliacao
        </button>
      </div>

      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Buscar por paciente..."
        className="w-full max-w-sm rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Paciente</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Avaliador</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Data</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Score</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{e.patientNome}</td>
                <td className="px-4 py-2 text-gray-500">{e.avaliadorNome}</td>
                <td className="px-4 py-2 text-gray-500">{new Date(e.dataAvaliacao).toLocaleDateString('pt-BR')}</td>
                <td className="px-4 py-2">
                  <span className={`rounded-full px-2 py-1 text-xs font-bold ${badgeCls(e.scoreTotal)}`}>
                    {e.scoreTotal}/60
                  </span>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => navigate(`/avaliacoes/${e.id}`)}
                    className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="h-3 w-3" />
                    Visualizar
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  Nenhuma avaliacao encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <EvaluationCreateDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
