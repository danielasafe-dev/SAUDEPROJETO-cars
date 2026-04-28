import { useEffect, useState } from 'react';
import {
  Activity,
  Banknote,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  HeartPulse,
  Route,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Timer,
  TrendingUp,
} from 'lucide-react';
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getDashboardStats, type DashboardDistributionItem, type SpiMockSusDashboard } from '../api';
import StatsCards from '../components/StatsCards';

const riskColors = ['#ef4444', '#f59e0b', '#5ba4e6', '#22c55e'];
const statusColors = ['#22c55e', '#2272c3', '#94a3b8', '#ef4444'];
const palette = ['#2272c3', '#5ba4e6', '#7c3aed', '#f59e0b', '#22c55e', '#ef4444', '#94a3b8'];

function formatDate(date: string | null) {
  return date ? new Date(date).toLocaleDateString('pt-BR') : '-';
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value);
}

export default function DashboardPage() {
  const [stats, setStats] = useState<SpiMockSusDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((err) => {
        console.error('Erro ao carregar dashboard:', err);
        setError('Erro ao carregar indicadores do CSV');
      });
  }, []);

  if (error && !stats) return <div className="text-center py-8 text-red-400">{error}</div>;
  if (!stats) return <div className="text-center py-8 text-gray-400">Carregando...</div>;

  const lastMonthly = stats.distribuicaoTriagensMensais.slice(-16);

  return (
    <div className="space-y-7">
      <header className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-cyan-50 p-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-blue-700">
              <Sparkles className="h-4 w-4" />
              NEXOS · Dashboard Triagem
            </div>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-900">Indicadores gerenciais SPI</h2>
            <p className="mt-1 text-sm text-gray-500">
              Base mockada via API a partir de {stats.fonte}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <Metric label="Período" value={`${formatDate(stats.periodoTriagens.inicio)} - ${formatDate(stats.periodoTriagens.fim)}`} />
            <Metric label="Base" value={`${stats.totalTriagens.toLocaleString('pt-BR')} registros`} />
            <Metric label="Score" value={`${stats.menorScore}-${stats.maiorScore}`} />
            <Metric label="Atualização" value={formatDate(stats.atualizadoEm)} />
          </div>
        </div>
      </header>

      <SectionTitle title="Visão Geral" />
      <StatsCards
        items={[
          { icon: ClipboardList, label: 'Crianças triadas', value: stats.totalTriagens.toLocaleString('pt-BR'), tone: 'blue', tag: 'KPI 01', foot: 'base completa do CSV' },
          { icon: TrendingUp, label: 'Score médio', value: stats.scoreMedio.toFixed(1), tone: 'amber', tag: 'KPI 02', foot: 'CARS-2 / M-CHAT-R/F' },
          { icon: Activity, label: 'Casos severos', value: stats.casosSeveros, tone: 'red', tag: 'KPI 03', foot: `${formatPercent((stats.casosSeveros * 100) / stats.totalTriagens)} das triagens` },
          { icon: CalendarDays, label: 'Triagens no mês', value: stats.triagensMesAtual, tone: 'green', tag: 'KPI 04', foot: 'último mês da base' },
        ]}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1.45fr_1fr] gap-5">
        <ChartCard title="Crianças triadas por mês" subtitle="Volume mensal de triagens realizadas">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={lastMonthly}>
              <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={54} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[7, 7, 0, 0]} fill="#2272c3" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Distribuição por nível de risco" subtitle="Classificação clínica da triagem">
          <DistributionDonut data={stats.distribuicaoRisco} colors={riskColors} />
        </ChartCard>
      </div>

      <SectionTitle title="Encaminhamentos" tone="purple" />
      <StatsCards
        columnsClassName="grid-cols-1 md:grid-cols-3"
        items={[
          { icon: Route, label: 'Total encaminhadas', value: stats.encaminhados, tone: 'blue', tag: 'KPI 07', foot: `${formatPercent(stats.taxaEncaminhamento)} das triadas` },
          { icon: ShieldCheck, label: 'Encaminhamento assertivo', value: formatPercent(stats.taxaEncaminhamentoAssertivo), tone: 'green', tag: 'KPI 08', foot: 'diagnóstico confirmado após consulta' },
          { icon: Timer, label: 'Tempo triagem → consulta', value: `${stats.tempoMedioEsperaDias.toFixed(0)} dias`, tone: 'red', tag: 'KPI 09', foot: 'meta de referência: < 30 dias' },
        ]}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-5">
        <ChartCard title="Status das consultas especializadas" subtitle={`Situação atual das ${stats.encaminhados} crianças encaminhadas`}>
          <DistributionDonut data={stats.distribuicaoStatusConsulta} colors={statusColors} />
        </ChartCard>

        <ChartCard title="Destino do encaminhamento" subtitle="Especialidades demandadas pela triagem">
          <HorizontalBars data={stats.distribuicaoEspecialista} />
        </ChartCard>
      </div>

      <SectionTitle title="Impacto Econômico" tone="amber" />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <ImpactCard
          icon={CheckCircle2}
          title="KPI 10 — Consultas especializadas evitadas"
          value={`${stats.consultasEvitadas.toLocaleString('pt-BR')} consultas evitadas`}
          subtitle="Sem triagem, toda criança iria direto ao especialista."
          detail={`${stats.totalTriagens.toLocaleString('pt-BR')} triadas - ${stats.encaminhados.toLocaleString('pt-BR')} encaminhadas = ${stats.consultasEvitadas.toLocaleString('pt-BR')} evitadas`}
        />
        <ImpactCard
          icon={Banknote}
          title="KPI 11 — Economia financeira estimada"
          value={formatCurrency(stats.economiaFinanceiraEstimada)}
          subtitle={`Custo médio considerado: ${formatCurrency(stats.custoMedioConsultaEspecializada)} por consulta.`}
          detail="Estimativa conservadora para demonstrar o efeito da triagem como filtro."
          tone="green"
        />
      </div>

      <SectionTitle title="Resultado Assistencial" tone="purple" />
      <StatsCards
        columnsClassName="grid-cols-1 md:grid-cols-3"
        items={[
          { icon: Stethoscope, label: 'Diagnósticos confirmados', value: stats.diagnosticosConfirmados, tone: 'blue', tag: 'KPI 12', foot: `${formatPercent(stats.taxaDiagnosticoConfirmado)} das consultas realizadas` },
          { icon: Timer, label: 'Tempo até intervenção', value: `${stats.tempoMedioIntervencaoDias.toFixed(0)} dias`, tone: 'red', tag: 'KPI 13', foot: 'triagem até início de tratamento' },
          { icon: HeartPulse, label: 'Acompanhamento ativo', value: stats.tratamentosIniciados, tone: 'green', tag: 'KPI 14', foot: `${formatPercent(stats.taxaTratamentoAposDiagnostico)} após diagnóstico` },
        ]}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <ChartCard title="Tipos de diagnóstico confirmado" subtitle="Distribuição dos diagnósticos informados na base">
          <DistributionList data={stats.distribuicaoDiagnostico} colors={palette} />
        </ChartCard>

        <ChartCard title="Tipos de tratamento iniciado" subtitle="Tratamentos associados aos acompanhamentos ativos">
          <DistributionList data={stats.distribuicaoTratamento} colors={palette} />
        </ChartCard>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Triagens recentes</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {stats.ultimasTriagens.map((triagem) => (
            <div key={triagem.idPaciente} className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{triagem.nomeCrianca}</p>
                <p className="text-xs text-gray-500">
                  {formatDate(triagem.dataTriagem)} · {triagem.nivelRisco || 'Sem classificação'}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold">{triagem.scoreTriagem ?? '-'}/60</p>
                <p className="text-xs text-gray-500">{triagem.encaminhado ? 'Encaminhada' : 'Sem encaminhamento'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-blue-100 bg-white/80 px-3 py-2">
      <p className="text-xs font-semibold text-gray-500">{label}</p>
      <p className="text-sm font-extrabold text-gray-900 whitespace-nowrap">{value}</p>
    </div>
  );
}

function SectionTitle({ title, tone = 'blue' }: { title: string; tone?: 'blue' | 'purple' | 'amber' }) {
  const tones = {
    blue: 'bg-blue-100 text-blue-800',
    purple: 'bg-violet-100 text-violet-800',
    amber: 'bg-amber-100 text-amber-800',
  };

  return (
    <div className="flex items-center gap-3">
      <span className={`rounded-full px-4 py-1.5 text-xs font-extrabold uppercase tracking-wide ${tones[tone]}`}>{title}</span>
      <div className="h-px flex-1 bg-gray-200" />
    </div>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-extrabold text-gray-900">{title}</h3>
      <p className="mb-4 text-xs font-medium text-gray-500">{subtitle}</p>
      {children}
    </div>
  );
}

function DistributionDonut({ data, colors }: { data: DashboardDistributionItem[]; colors: string[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="h-56 w-full md:w-60 shrink-0 overflow-visible">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={54}
              outerRadius={76}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell key={entry.label} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <DistributionList data={data.map((item) => ({ ...item, label: `${item.label} · ${formatPercent((item.value * 100) / Math.max(total, 1))}` }))} colors={colors} />
    </div>
  );
}

function HorizontalBars({ data }: { data: DashboardDistributionItem[] }) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="w-40 truncate text-xs font-semibold text-gray-600">{item.label}</span>
          <div className="h-2.5 flex-1 rounded-full bg-gray-100">
            <div className="h-full rounded-full" style={{ width: `${(item.value * 100) / max}%`, backgroundColor: palette[index % palette.length] }} />
          </div>
          <span className="w-10 text-right text-xs font-extrabold text-gray-800">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function DistributionList({ data, colors }: { data: DashboardDistributionItem[]; colors: string[] }) {
  return (
    <div className="w-full space-y-2">
      {data.map((item, index) => (
        <div key={item.label} className="flex items-center justify-between gap-3 border-b border-gray-100 py-2 last:border-b-0">
          <div className="flex min-w-0 items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: colors[index % colors.length] }} />
            <span className="truncate text-sm font-semibold text-gray-700">{item.label}</span>
          </div>
          <span className="text-sm font-extrabold text-gray-900">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function ImpactCard({
  icon: Icon,
  title,
  value,
  subtitle,
  detail,
  tone = 'blue',
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  subtitle: string;
  detail: string;
  tone?: 'blue' | 'green';
}) {
  const style = tone === 'green' ? 'from-emerald-50 to-green-100 border-emerald-100 text-emerald-800' : 'from-blue-50 to-cyan-100 border-blue-100 text-blue-800';

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-extrabold text-gray-900">{title}</h3>
      <p className="mb-4 text-xs font-medium text-gray-500">{subtitle}</p>
      <div className={`flex items-center gap-4 rounded-xl border bg-gradient-to-br p-4 ${style}`}>
        <Icon className="h-9 w-9 shrink-0" />
        <div>
          <p className="text-2xl font-extrabold tracking-tight">{value}</p>
          <p className="text-xs font-semibold opacity-80">{detail}</p>
        </div>
      </div>
    </div>
  );
}
