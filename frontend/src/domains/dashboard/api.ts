import { isMockMode } from '@/shared/api/client';
import { mockEvaluations as evals, mockGroups } from '@/shared/api/mockData';
import type { Group } from '@/domains/groups/types';
import type { Evaluation, EvaluationReferral } from '@/types';

export interface DashboardDistributionItem {
  label: string;
  value: number;
}

export interface SpiMockSusTriage {
  idPaciente: string;
  nomeCrianca: string;
  idadeAnos: number | null;
  sexo: string;
  dataTriagem: string | null;
  scoreTriagem: number | null;
  nivelRisco: string;
  encaminhado: boolean;
  statusConsulta: string;
  diagnosticoConfirmado: string;
}

export interface SpiMockSusDashboard {
  fonte: string;
  aba: string;
  atualizadoEm: string;
  totalPacientes: number;
  totalTriagens: number;
  triagensMesAtual: number;
  scoreMedio: number;
  menorScore: number;
  maiorScore: number;
  encaminhados: number;
  consultasAgendadas: number;
  consultasRealizadas: number;
  consultasCanceladas: number;
  diagnosticosConfirmados: number;
  tratamentosIniciados: number;
  casosSeveros: number;
  tempoMedioEsperaDias: number;
  tempoMedioIntervencaoDias: number;
  consultasEvitadas: number;
  economiaFinanceiraEstimada: number;
  custoMedioConsultaEspecializada: number;
  taxaEncaminhamento: number;
  taxaComparecimento: number;
  taxaDiagnosticoConfirmado: number;
  taxaEncaminhamentoAssertivo: number;
  taxaTratamentoAposDiagnostico: number;
  periodoTriagens: {
    inicio: string | null;
    fim: string | null;
  };
  distribuicaoTriagensMensais: DashboardDistributionItem[];
  distribuicaoRisco: DashboardDistributionItem[];
  distribuicaoStatusConsulta: DashboardDistributionItem[];
  distribuicaoEspecialista: DashboardDistributionItem[];
  distribuicaoDiagnostico: DashboardDistributionItem[];
  distribuicaoTratamento: DashboardDistributionItem[];
  ultimasTriagens: SpiMockSusTriage[];
}

interface SystemDashboardSummary {
  triagens?: {
    totalPacientes: number;
    totalTriagens: number;
    scoreMedio: number;
    menorScore: number;
    maiorScore: number;
    encaminhados: number;
    consultasEvitadas: number;
    economiaFinanceiraEstimada: number;
    casosSeveros: number;
    taxaEncaminhamento: number;
    distribuicaoTriagensMensais: DashboardDistributionItem[];
    distribuicaoRisco: DashboardDistributionItem[];
    distribuicaoEspecialista: DashboardDistributionItem[];
  };
}

export type DashboardFilter = {
  risco?: string;
  especialista?: string;
  dataInicio?: string;
  dataFim?: string;
  grupoId?: number;
};

export async function getDashboardStats(filter?: DashboardFilter): Promise<SpiMockSusDashboard> {
  if (!isMockMode()) {
    const { api } = await import('@/shared/api/client');
    const [mockResponse, systemResponse] = await Promise.all([
      api.get('/api/dashboard/spi-mock', { params: filter }),
      api.get('/api/dashboard', { params: filter }),
    ]);

    const base = filter?.grupoId ? emptyDashboardForSystemFilter(mockResponse.data) : mockResponse.data;
    return mergeSystemSummaryIntoDashboard(base, systemResponse.data);
  }

  const filteredEvals = evals.filter((e) => {
    if (filter?.risco) {
      const risco = filter.risco?.toLocaleLowerCase('pt-BR') ?? '';
      if (risco.includes('severo') && e.scoreTotal < 37) return false;
      if ((risco.includes('leve') || risco.includes('moderado')) && (e.scoreTotal <= 29.5 || e.scoreTotal >= 37)) return false;
      if (risco.includes('sem') && e.scoreTotal > 29.5) return false;
    }

    const evaluationDate = new Date(e.dataAvaliacao);
    if (filter?.dataInicio && evaluationDate < new Date(`${filter.dataInicio}T00:00:00`)) {
      return false;
    }

    if (filter?.dataFim && evaluationDate > new Date(`${filter.dataFim}T23:59:59`)) {
      return false;
    }

    return true;
  });
  const avg = filteredEvals.reduce((s, e) => s + e.scoreTotal, 0) / (filteredEvals.length || 1);
  const severe = filteredEvals.filter((e) => e.scoreTotal >= 37).length;
  const encaminhados = filteredEvals.filter((e) => e.scoreTotal > 29.5).length;
  const scores = filteredEvals.map((e) => e.scoreTotal);

  return {
    fonte: 'mockData.ts',
    aba: 'avaliacoes',
    atualizadoEm: new Date().toISOString(),
    totalPacientes: new Set(filteredEvals.map((e) => e.patientId)).size,
    totalTriagens: filteredEvals.length,
    triagensMesAtual: 2,
    scoreMedio: Math.round(avg * 10) / 10,
    menorScore: scores.length ? Math.min(...scores) : 0,
    maiorScore: scores.length ? Math.max(...scores) : 0,
    encaminhados,
    consultasAgendadas: 0,
    consultasRealizadas: 0,
    consultasCanceladas: 0,
    diagnosticosConfirmados: severe,
    tratamentosIniciados: 0,
    casosSeveros: severe,
    tempoMedioEsperaDias: 0,
    tempoMedioIntervencaoDias: 0,
    consultasEvitadas: filteredEvals.length - encaminhados,
    economiaFinanceiraEstimada: (filteredEvals.length - encaminhados) * 1000,
    custoMedioConsultaEspecializada: 1000,
    taxaEncaminhamento: filteredEvals.length ? Math.round((encaminhados * 1000) / filteredEvals.length) / 10 : 0,
    taxaComparecimento: 0,
    taxaDiagnosticoConfirmado: 0,
    taxaEncaminhamentoAssertivo: 0,
    taxaTratamentoAposDiagnostico: 0,
    periodoTriagens: { inicio: null, fim: null },
    distribuicaoTriagensMensais: [],
    distribuicaoRisco: [
      { label: 'Sem sinais', value: filteredEvals.filter((e) => e.scoreTotal <= 29.5).length },
      { label: 'Leve/Moderado', value: filteredEvals.filter((e) => e.scoreTotal > 29.5 && e.scoreTotal < 37).length },
      { label: 'Severo', value: severe },
    ],
    distribuicaoStatusConsulta: [],
    distribuicaoEspecialista: [],
    distribuicaoDiagnostico: [],
    distribuicaoTratamento: [],
    ultimasTriagens: filteredEvals.slice(-6).reverse().map((e) => ({
      idPaciente: String(e.patientId),
      nomeCrianca: e.patientNome,
      idadeAnos: null,
      sexo: '',
      dataTriagem: e.dataAvaliacao,
      scoreTriagem: e.scoreTotal,
      nivelRisco: e.classificacao,
      encaminhado: e.scoreTotal > 29.5,
      statusConsulta: 'Sem consulta',
      diagnosticoConfirmado: 'Pendente',
    })),
  };
}

export async function getDashboardGroups(): Promise<Group[]> {
  if (isMockMode()) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockGroups.map(normalizeDashboardGroup);
  }

  const { api } = await import('@/shared/api/client');
  const { data } = await api.get('/api/dashboard/groups');
  return Array.isArray(data) ? data.map(normalizeDashboardGroup) : [];
}

export async function saveEvaluationReferral(
  evaluationId: number,
  data: { encaminhado: boolean; especialidade?: string | null; custoEstimado?: number }
): Promise<EvaluationReferral> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 350));
    return {
      id: Date.now(),
      evaluationId,
      patientId: 0,
      encaminhado: data.encaminhado,
      especialidade: data.encaminhado ? data.especialidade ?? null : null,
      custoEstimado: data.encaminhado ? data.custoEstimado ?? 1000 : 0,
      criadoEm: new Date().toISOString(),
    };
  }

  return (await import('@/shared/api/client')).api.put(`/api/evaluations/${evaluationId}/referral`, data).then((r) => r.data);
}

export async function getEvaluationDashboardStats() {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 300));
    const avg = evals.reduce((s, e) => s + e.scoreTotal, 0) / (evals.length || 1);
    return {
      total: evals.length,
      averageScore: Math.round(avg * 10) / 10,
      lastMonth: 2,
      classificationDistribution: {
        semIndicativo: evals.filter((e) => e.scoreTotal <= 29.5).length,
        teaLeveModerado: evals.filter((e) => e.scoreTotal > 29.5 && e.scoreTotal < 37).length,
        teaGrave: evals.filter((e) => e.scoreTotal >= 37).length,
      },
      recentEvaluations: evals.slice(-4).reverse(),
    };
  }
  return (await import('@/shared/api/client')).api.get('/api/evaluations/stats').then((r) => r.data);
}

export async function getEvals(): Promise<Evaluation[]> {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 300));
    return evals;
  }
  return (await import('@/shared/api/client')).api.get('/api/evaluations').then((r) => r.data);
}

export async function createEvaluation(data: { patientId: number; respostas: Record<number, number>; formId?: number; groupId?: number; observacoes?: string }) {
  if (isMockMode()) {
    await new Promise((r) => setTimeout(r, 600));
    const total = Object.values(data.respostas).reduce((s, v) => s + v, 0);
    const cls = total <= 29.5 ? 'Sem indicativo de TEA' : total < 37 ? 'TEA Leve a Moderado' : 'TEA Grave';
    return {
      id: Date.now(),
      patientId: data.patientId,
      patientNome: 'Novo Paciente',
      avaliadorId: 2,
      avaliadorNome: 'Avaliador',
      respostas: data.respostas,
      scoreTotal: total,
      classificacao: cls,
      observacoes: data.observacoes?.trim() || null,
      dataAvaliacao: new Date().toISOString(),
    } satisfies Evaluation;
  }
  return (await import('@/shared/api/client')).api.post('/api/evaluations', data).then((r) => r.data);
}

function mergeSystemEvaluationsIntoDashboard(base: SpiMockSusDashboard, evaluations: Evaluation[], filter?: DashboardFilter): SpiMockSusDashboard {
  const filteredEvaluations = evaluations.filter((evaluation) => matchesDashboardFilter(evaluation, filter));
  const totalTriagens = base.totalTriagens + filteredEvaluations.length;
  const scores = filteredEvaluations.map((evaluation) => Number(evaluation.scoreTotal)).filter((value) => Number.isFinite(value));
  const encaminhadas = filteredEvaluations.filter((evaluation) => evaluation.referral?.encaminhado).length;
  const semEncaminhamento = filteredEvaluations.filter((evaluation) => evaluation.referral && !evaluation.referral.encaminhado).length;

  const scoreSum = base.scoreMedio * base.totalTriagens + scores.reduce((sum, score) => sum + score, 0);
  const scoreMedio = totalTriagens ? Math.round((scoreSum / totalTriagens) * 10) / 10 : 0;
  const allScoreValues = [base.menorScore, base.maiorScore, ...scores].filter((value) => value > 0);

  return {
    ...base,
    fonte: `${base.fonte} + sistema`,
    aba: 'CSV + Avaliacoes',
    totalTriagens,
    totalPacientes: base.totalPacientes + new Set(filteredEvaluations.map((evaluation) => evaluation.patientId)).size,
    scoreMedio,
    menorScore: allScoreValues.length ? Math.min(...allScoreValues) : 0,
    maiorScore: allScoreValues.length ? Math.max(...allScoreValues) : 0,
    encaminhados: base.encaminhados + encaminhadas,
    consultasEvitadas: base.consultasEvitadas + semEncaminhamento,
    economiaFinanceiraEstimada: base.economiaFinanceiraEstimada + semEncaminhamento * base.custoMedioConsultaEspecializada,
    casosSeveros: base.casosSeveros + filteredEvaluations.filter((evaluation) => classifyRiskLabel(evaluation) === 'Severo').length,
    taxaEncaminhamento: totalTriagens ? Math.round(((base.encaminhados + encaminhadas) * 1000) / totalTriagens) / 10 : 0,
    distribuicaoTriagensMensais: mergeDistribution(base.distribuicaoTriagensMensais, monthlyDistributionFromEvaluations(filteredEvaluations)),
    distribuicaoRisco: mergeDistribution(base.distribuicaoRisco, riskDistributionFromEvaluations(filteredEvaluations), ['Severo', 'Moderado', 'Leve', 'Sem Sinais']),
    distribuicaoEspecialista: mergeDistribution(base.distribuicaoEspecialista, specialtyDistributionFromEvaluations(filteredEvaluations)).slice(0, 6),
    ultimasTriagens: [
      ...filteredEvaluations
        .slice()
        .sort((left, right) => new Date(right.dataAvaliacao).getTime() - new Date(left.dataAvaliacao).getTime())
        .slice(0, 6)
        .map((evaluation) => ({
          idPaciente: String(evaluation.patientId),
          nomeCrianca: evaluation.patientNome,
          idadeAnos: null,
          sexo: '',
          dataTriagem: evaluation.dataAvaliacao,
          scoreTriagem: Number(evaluation.scoreTotal),
          nivelRisco: classifyRiskLabel(evaluation),
          encaminhado: Boolean(evaluation.referral?.encaminhado),
          statusConsulta: evaluation.referral?.encaminhado ? 'Encaminhada' : evaluation.referral ? 'Sem encaminhamento' : 'Sem decisao',
          diagnosticoConfirmado: 'Pendente',
        })),
      ...base.ultimasTriagens,
    ]
      .sort((left, right) => new Date(right.dataTriagem ?? '').getTime() - new Date(left.dataTriagem ?? '').getTime())
      .slice(0, 6),
  };
}

function mergeSystemSummaryIntoDashboard(base: SpiMockSusDashboard, system: SystemDashboardSummary): SpiMockSusDashboard {
  const summary = system.triagens;
  if (!summary || summary.totalTriagens <= 0) {
    return base;
  }

  const totalTriagens = base.totalTriagens + summary.totalTriagens;
  const scoreMedio = totalTriagens
    ? Math.round(((base.scoreMedio * base.totalTriagens + Number(summary.scoreMedio) * summary.totalTriagens) / totalTriagens) * 10) / 10
    : 0;
  const scoreValues = [base.menorScore, base.maiorScore, Number(summary.menorScore), Number(summary.maiorScore)].filter((value) => value > 0);

  return {
    ...base,
    fonte: `${base.fonte} + sistema`,
    aba: 'CSV + Resumo gerencial',
    totalPacientes: base.totalPacientes + summary.totalPacientes,
    totalTriagens,
    scoreMedio,
    menorScore: scoreValues.length ? Math.min(...scoreValues) : 0,
    maiorScore: scoreValues.length ? Math.max(...scoreValues) : 0,
    encaminhados: base.encaminhados + summary.encaminhados,
    consultasEvitadas: base.consultasEvitadas + summary.consultasEvitadas,
    economiaFinanceiraEstimada: base.economiaFinanceiraEstimada + Number(summary.economiaFinanceiraEstimada),
    casosSeveros: base.casosSeveros + summary.casosSeveros,
    taxaEncaminhamento: totalTriagens ? Math.round(((base.encaminhados + summary.encaminhados) * 1000) / totalTriagens) / 10 : 0,
    distribuicaoTriagensMensais: mergeDistribution(base.distribuicaoTriagensMensais, summary.distribuicaoTriagensMensais),
    distribuicaoRisco: mergeDistribution(base.distribuicaoRisco, summary.distribuicaoRisco, ['Severo', 'Moderado', 'Leve', 'Sem Sinais']),
    distribuicaoEspecialista: mergeDistribution(base.distribuicaoEspecialista, summary.distribuicaoEspecialista).slice(0, 6),
  };
}

function emptyDashboardForSystemFilter(base: SpiMockSusDashboard): SpiMockSusDashboard {
  return {
    ...base,
    fonte: 'sistema',
    aba: 'Resumo por grupo',
    totalPacientes: 0,
    totalTriagens: 0,
    triagensMesAtual: 0,
    scoreMedio: 0,
    menorScore: 0,
    maiorScore: 0,
    encaminhados: 0,
    consultasAgendadas: 0,
    consultasRealizadas: 0,
    consultasCanceladas: 0,
    diagnosticosConfirmados: 0,
    tratamentosIniciados: 0,
    casosSeveros: 0,
    tempoMedioEsperaDias: 0,
    tempoMedioIntervencaoDias: 0,
    consultasEvitadas: 0,
    economiaFinanceiraEstimada: 0,
    taxaEncaminhamento: 0,
    taxaComparecimento: 0,
    taxaDiagnosticoConfirmado: 0,
    taxaEncaminhamentoAssertivo: 0,
    taxaTratamentoAposDiagnostico: 0,
    periodoTriagens: { inicio: null, fim: null },
    distribuicaoTriagensMensais: [],
    distribuicaoRisco: [],
    distribuicaoStatusConsulta: [],
    distribuicaoEspecialista: [],
    distribuicaoDiagnostico: [],
    distribuicaoTratamento: [],
    ultimasTriagens: [],
  };
}

function normalizeDashboardGroup(payload: unknown): Group {
  const raw = payload as Record<string, unknown>;

  return {
    id: Number(raw.id ?? raw.Id ?? 0),
    nome: String(raw.nome ?? raw.Nome ?? ''),
    gestor_id: nullableNumber(raw.gestor_id ?? raw.gestorId ?? raw.GestorId),
    gestor_nome: nullableString(raw.gestor_nome ?? raw.gestorNome ?? raw.GestorNome),
    ativo: Boolean(raw.ativo ?? raw.Ativo ?? false),
    quantidade_membros: Number(raw.quantidade_membros ?? raw.quantidadeMembros ?? raw.QuantidadeMembros ?? 0),
    criado_em: String(raw.criado_em ?? raw.criadoEm ?? raw.CriadoEm ?? new Date().toISOString()),
  };
}

function nullableString(value: unknown): string | null {
  if (value == null) return null;
  const normalized = String(value).trim();
  return normalized ? normalized : null;
}

function nullableNumber(value: unknown): number | null {
  if (value == null || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function matchesDashboardFilter(evaluation: Evaluation, filter?: DashboardFilter) {
  if (filter?.risco && classifyRiskLabel(evaluation).toLocaleLowerCase('pt-BR') !== filter.risco.toLocaleLowerCase('pt-BR')) {
    return false;
  }

  if (filter?.especialista && evaluation.referral?.especialidade?.toLocaleLowerCase('pt-BR') !== filter.especialista.toLocaleLowerCase('pt-BR')) {
    return false;
  }

  const evaluationDate = new Date(evaluation.dataAvaliacao);
  if (filter?.dataInicio && evaluationDate < new Date(`${filter.dataInicio}T00:00:00`)) {
    return false;
  }

  if (filter?.dataFim && evaluationDate > new Date(`${filter.dataFim}T23:59:59`)) {
    return false;
  }

  return true;
}

function classifyRiskLabel(evaluation: Evaluation) {
  const classification = evaluation.classificacao.toLocaleLowerCase('pt-BR');
  if (classification.includes('grave')) return 'Severo';
  if (classification.includes('moderado')) return 'Moderado';
  if (classification.includes('leve')) return 'Leve';
  if (classification.includes('sem')) return 'Sem Sinais';
  const score = Number(evaluation.scoreTotal);
  if (score >= 37) return 'Severo';
  if (score > 29.5) return 'Moderado';
  return 'Sem Sinais';
}

function monthlyDistributionFromEvaluations(evaluations: Evaluation[]) {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return Object.values(
    evaluations.reduce<Record<string, DashboardDistributionItem>>((acc, evaluation) => {
      const date = new Date(evaluation.dataAvaliacao);
      const label = `${months[date.getMonth()]}/${String(date.getFullYear()).slice(-2)}`;
      acc[label] = acc[label] ?? { label, value: 0 };
      acc[label].value += 1;
      return acc;
    }, {})
  );
}

function riskDistributionFromEvaluations(evaluations: Evaluation[]) {
  return Object.values(
    evaluations.reduce<Record<string, DashboardDistributionItem>>((acc, evaluation) => {
      const label = classifyRiskLabel(evaluation);
      acc[label] = acc[label] ?? { label, value: 0 };
      acc[label].value += 1;
      return acc;
    }, {})
  );
}

function specialtyDistributionFromEvaluations(evaluations: Evaluation[]) {
  return Object.values(
    evaluations.reduce<Record<string, DashboardDistributionItem>>((acc, evaluation) => {
      const label = evaluation.referral?.encaminhado ? evaluation.referral.especialidade : null;
      if (!label) return acc;
      acc[label] = acc[label] ?? { label, value: 0 };
      acc[label].value += 1;
      return acc;
    }, {})
  );
}

function mergeDistribution(base: DashboardDistributionItem[], extra: DashboardDistributionItem[], preferredOrder?: string[]) {
  const map = new Map<string, DashboardDistributionItem>();
  [...base, ...extra].forEach((item) => {
    const key = item.label.toLocaleLowerCase('pt-BR');
    const current = map.get(key);
    map.set(key, { label: current?.label ?? item.label, value: (current?.value ?? 0) + item.value });
  });

  const merged = Array.from(map.values());
  if (!preferredOrder) {
    return merged.sort((left, right) => right.value - left.value || left.label.localeCompare(right.label));
  }

  return merged.sort((left, right) => {
    const leftIndex = preferredOrder.findIndex((label) => label.toLocaleLowerCase('pt-BR') === left.label.toLocaleLowerCase('pt-BR'));
    const rightIndex = preferredOrder.findIndex((label) => label.toLocaleLowerCase('pt-BR') === right.label.toLocaleLowerCase('pt-BR'));
    return (leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex) - (rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex);
  });
}
