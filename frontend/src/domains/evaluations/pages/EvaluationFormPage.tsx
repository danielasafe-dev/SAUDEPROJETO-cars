import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CARS_QUESTIONS } from '../utils/questions';
import { calcScore, getClassification } from '../utils/scoring';
import type { EvaluationAnswers } from '../types';
import QuestionCard from '../components/QuestionCard';
import { createEvaluation, getEvals } from '@/domains/dashboard/api';

export default function EvaluationFormPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'existing' | 'new'>('existing');
  const [existingPatientId, setExistingPatientId] = useState<number | null>(null);
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');
  const [answers, setAnswers] = useState<EvaluationAnswers>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const total = CARS_QUESTIONS.length;
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
      setError(`Faltam ${total - answered} questão(ões) para responder.`);
      return;
    }
    setError('');
    setLoading(true);
    try {
      const pid = mode === 'existing' ? existingPatientId! : Date.now();
      const result = await createEvaluation({ patientId: pid, respostas: answers });
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
      setError('Erro ao salvar avaliação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Nova Avaliação</h2>
          <p className="text-sm text-gray-500">Selecione ou cadastre o paciente e responda as 14 questões</p>
        </div>
        <div className="text-sm text-gray-500 font-medium">
          {answered}/{total}
        </div>
      </div>

      {/* Progress */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Patient selection */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">Paciente</h3>

        <div className="flex gap-2">
          <button
            onClick={() => setMode('existing')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              mode === 'existing' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Paciente Existente
          </button>
          <button
            onClick={() => setMode('new')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
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
              <label className="block text-xs font-medium text-gray-500 mb-1">Nome *</label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome completo do paciente"
              />
            </div>
            <div className="w-28">
              <label className="block text-xs font-medium text-gray-500 mb-1">Idade</label>
              <input
                type="number"
                value={newAge}
                onChange={(e) => setNewAge(e.target.value)}
                min={0}
                max={99}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* All questions at once */}
      <div className="space-y-3">
        {CARS_QUESTIONS.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            value={answers[q.id] as number | undefined}
            onChange={(score) => handleAnswer(q.id, score)}
          />
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-center pb-8">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-green-700 disabled:opacity-50 transition shadow-lg shadow-green-600/20"
        >
          {loading ? 'Salvando...' : 'Salvar Avaliação'}
        </button>
      </div>
    </div>
  );
}

function ExistingPatientSelector({ value, onChange }: { value: number | null; onChange: (id: number) => void }) {
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
        onChange={(e) => { setSearch(e.target.value); setShow(true); }}
        onFocus={() => setShow(true)}
        onBlur={() => setTimeout(() => setShow(false), 200)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Buscar paciente..."
      />
      {show && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-44 overflow-auto">
          {filtered.length === 0 && (
            <div className="p-3 text-sm text-gray-400 text-center">Nenhum paciente encontrado</div>
          )}
          {filtered.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 ${
                p.id === value ? 'bg-blue-50 text-blue-700 font-medium' : ''
              }`}
              onMouseDown={() => { onChange(p.id); setShow(false); setSearch(''); }}
            >
              {p.nome} — {p.idade || '?'} anos
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
