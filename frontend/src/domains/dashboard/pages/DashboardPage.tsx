import { useEffect, useState } from 'react';
import { getDashboardStats } from '../api';
import StatsCards from '../components/StatsCards';
import DashboardChart from '../components/DashboardChart';
import type { Evaluation } from '@/types';

interface DashboardData {
  total: number;
  averageScore: number;
  lastMonth: number;
  classificationDistribution: { semIndicativo: number; teaLeveModerado: number; teaGrave: number };
  recentEvaluations: Evaluation[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardData | null>(null);

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  if (!stats) return <div className="text-center py-8 text-gray-400">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Dashboard</h2>
        <p className="text-sm text-gray-500">Resumo das avaliações CARS</p>
      </div>

      <StatsCards total={stats.total} avgScore={stats.averageScore} lastMonth={stats.lastMonth} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardChart {...stats.classificationDistribution} />

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Últimas Avaliações</h3>
          <div className="space-y-2">
            {stats.recentEvaluations.map((ev) => (
              <div key={ev.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{ev.patientNome}</p>
                  <p className="text-xs text-gray-500">{new Date(ev.dataAvaliacao).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{ev.scoreTotal}/60</p>
                  <p className="text-xs text-gray-500">{ev.classificacao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
