import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardChartProps {
  semIndicativo: number;
  teaLeveModerado: number;
  teaGrave: number;
}

export default function DashboardChart({ semIndicativo, teaLeveModerado, teaGrave }: DashboardChartProps) {
  const data = [
    { name: 'Sem Indicativo', value: semIndicativo, fill: '#16a34a' },
    { name: 'TEA Leve/Moderado', value: teaLeveModerado, fill: '#ca8a04' },
    { name: 'TEA Grave', value: teaGrave, fill: '#dc2626' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Distribuição por Classificação</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
