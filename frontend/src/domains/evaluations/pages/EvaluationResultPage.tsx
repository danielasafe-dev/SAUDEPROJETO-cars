import { useLocation, useNavigate, Link } from 'react-router-dom';
import ScoreChart from '../components/ScoreChart';
import { CARS_QUESTIONS } from '../utils/questions';

interface ResultState {
  score: number;
  classification: string;
  color: string;
  cls: string;
  patientId: number;
  answers: Record<number, number>;
}

export default function EvaluationResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state || !state.score) {
    navigate('/');
    return null;
  }

  const { score, classification, color, cls, answers }: ResultState = state;

  const labels = ['Normal', 'Leve', 'Moderado', 'Grave'];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-xl font-bold">Resultado</h2>

      {/* Score Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-sm text-gray-500 mb-2">Pontuação Total (máx. 60)</p>
        <p className="text-5xl font-extrabold" style={{ color }}>
          {score}
        </p>
        <p className={`inline-block px-4 py-2 rounded-full font-bold text-sm mt-3 ${
          cls === 'not-tea' ? 'bg-green-100 text-green-700' :
          cls === 'tea-leve' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
        }`}>
          {score}/60 — {classification}
        </p>
      </div>

      {/* Radar */}
      <ScoreChart respostas={answers} />

      {/* Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Detalhamento por Dimensão</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {CARS_QUESTIONS.map((q) => {
            const v = answers[q.id] || 0;
            return (
              <div key={q.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <span className="text-xs font-bold text-gray-500 w-5">#{q.id}</span>
                <span className={`text-xs font-bold text-white w-8 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  v === 1 ? 'bg-green-500' : v === 2 ? 'bg-green-500' : v === 3 ? 'bg-amber-500' : 'bg-red-500'
                }`}>{v}</span>
                <span className="text-xs truncate" title={q.name}>{q.name}</span>
                <span className="text-xs text-gray-400 ml-auto">{labels[v - 1]}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <Link
          to="/"
          className="px-5 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
        >
          Voltar ao Início
        </Link>
        <Link
          to="/nova-avaliacao"
          className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Nova Avaliação
        </Link>
      </div>
    </div>
  );
}
