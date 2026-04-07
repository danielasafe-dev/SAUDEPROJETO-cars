import { ClipboardList, TrendingUp, Calendar } from 'lucide-react';

export default function StatsCards({ total, avgScore, lastMonth }: { total: number; avgScore: number; lastMonth: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <CardValue icon={ClipboardList} label="Total de Avaliações" value={total} colorClass="bg-blue-50 text-blue-700" />
      <CardValue icon={TrendingUp} label="Média de Pontuação" value={avgScore} colorClass="bg-amber-50 text-amber-700" />
      <CardValue icon={Calendar} label="Último Mês" value={lastMonth} colorClass="bg-green-50 text-green-700" />
    </div>
  );
}

function CardValue({ icon: Icon, label, value, colorClass }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; colorClass: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-bold">{String(value)}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}
