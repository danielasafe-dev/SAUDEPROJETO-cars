import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SPI_QUESTIONS } from '../utils/questions';
import { calcScore, getClassification } from '../utils/scoring';
import type { EvaluationAnswers } from '../types';
import QuestionCard from '../components/QuestionCard';
import { createEvaluation } from '@/domains/dashboard/api';

interface EvaluationFormPageProps {
  embedded?: boolean;
  onCancel?: () => void;
}

export default function EvaluationFormPage({
  embedded = false,
  onCancel,
}: EvaluationFormPageProps) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'existing' | 'new'>('existing');
  const [existingPatientId, setExistingPatientId] = useState<number | null>(null);
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');
  const [answers, setAnswers] = useState<EvaluationAnswers>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const total = SPI_QUESTIONS.length;
  const answered = Object.keys(answers).length;
  const progress = total > 0 ? (answered / total) * 100 : 0;

  const handleAnswer = (qId: number, score: number) => {
    setAnswers({ ...answers, [qId]: score });
  };

  const handleSubmit = async () => {
    if (mode === 'existing' && !existingPatientId) {
      setError('Selecione um paciente existente.');
      return;
    }

    if (mode === 'new' && !newName.trim()) {
      setError('Informe o nome do paciente.');
      return;
    }

    if (answered < total) {
      setError(`Faltam ${total - answered} questao(oes) para responder.`);
      return;
    }

    setError('');
    setLoading(true);

    try {
      const pid = mode === 'existing' ? existingPatientId! : Date.now();
      await createEvaluation({ patientId: pid, respostas: answers });
      const score = calcScore(answers);
      const classification = getClassification(score);

      navigate('/resultado', {
        state: {
          ...classification,
          patientId: pid,
          patientNome: mode === 'new' ? newName : undefined,
          answers,
        },
      });
    } catch {
      setError('Erro ao salvar avaliacao');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={embedded ? 'space-y-5' : 'mx-auto max-w-3xl space-y-5'}>
      {embedded ? (
        <div className="flex items-center justify-end text-sm font-medium text-gray-500">
          {answered}/{total}
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Nova Avaliacao</h2>
            <p className="text-sm text-gray-500">Selecione ou cadastre o paciente e responda as 14 questoes</p>
          </div>
          <div className="text-sm font-medium text-gray-500">
            {answered}/{total}
          </div>
        </div>
      )}

      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-sm font-semibold text-gray-700">Paciente</h3>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode('existing')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              mode === 'existing' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Paciente Existente
          </button>
          <button
            type="button"
            onClick={() => setMode('new')}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              mode === 'new' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Novo Paciente
          </button>
        </div>

        {mode === 'existing' ? (
          <ExistingPatientSelector value={existingPatientId} onChange={setExistingPatientId} />
        ) : (
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-gray-500">Nome *</label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome completo do paciente"
              />
            </div>
            <div className="w-28">
              <label className="mb-1 block text-xs font-medium text-gray-500">Idade</label>
              <input
                type="number"
                value={newAge}
                onChange={(e) => setNewAge(e.target.value)}
                min={0}
                max={99}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {SPI_QUESTIONS.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            value={answers[q.id] as number | undefined}
            onChange={(score) => handleAnswer(q.id, score)}
          />
        ))}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className={`flex ${embedded ? 'justify-end gap-3 pb-2' : 'justify-center pb-8'}`}>
        {embedded && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-xl bg-green-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar Avaliacao'}
        </button>
      </div>
    </div>
  );
}

function ExistingPatientSelector({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (id: number) => void;
}) {
  const [patients, setPatients] = useState<{ id: number; nome: string; idade: number | null }[]>([]);
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    import('@/domains/patients/api').then(({ getPatients }) => getPatients().then(setPatients));
  }, []);

  const filtered = patients.filter((p) =>
    p.nome.toLowerCase().includes(search.toLowerCase())
  );
  const selected = patients.find((p) => p.id === value);

  return (
    <div className="relative">
      <input
        value={selected?.nome || search}
        onChange={(e) => {
          setSearch(e.target.value);
          setShow(true);
        }}
        onFocus={() => setShow(true)}
        onBlur={() => setTimeout(() => setShow(false), 200)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Buscar paciente..."
      />
      {show && (
        <div className="absolute z-10 mt-1 max-h-44 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {filtered.length === 0 && (
            <div className="p-3 text-center text-sm text-gray-400">Nenhum paciente encontrado</div>
          )}
          {filtered.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`w-full px-3 py-2 text-left text-sm hover:bg-blue-50 ${
                p.id === value ? 'bg-blue-50 font-medium text-blue-700' : ''
              }`}
              onMouseDown={() => {
                onChange(p.id);
                setShow(false);
                setSearch('');
              }}
            >
              {p.nome} - {p.idade || '?'} anos
            </button>
          ))}
        </div>
      )}
    </div>
  );
}



