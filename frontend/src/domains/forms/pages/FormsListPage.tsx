import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getForms } from '../api';
import type { Formulario } from '../types';
import { Plus, Pencil, Trash2, FileText } from 'lucide-react';

export default function FormsListPage() {
  const navigate = useNavigate();
  const [forms, setForms] = useState<Formulario[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadForms();
  }, []);

  async function loadForms() {
    setLoading(true);
    try {
      const data = await getForms();
      setForms(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  const filtered = forms.filter((f) =>
    f.nome.toLowerCase().includes(filter.toLowerCase())
  );

  const handleEdit = (id: number) => navigate(`/formularios/${id}`);
  const handleNew = () => navigate('/formularios/novo');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Formulários</h2>
          <p className="text-sm text-gray-500">{forms.length} formulário(s) cadastrado(s)</p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Novo Formulário
        </button>
      </div>

      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Buscar por nome..."
        className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Nome</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Descrição</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Grupo</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Perguntas</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Peso Total</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Criado por</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f) => (
              <tr key={f.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-2 font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                  {f.nome}
                </td>
                <td className="px-4 py-2 text-gray-500 max-w-48 truncate">{f.descricao || '—'}</td>
                <td className="px-4 py-2 text-gray-500">{f.groupNome || '—'}</td>
                <td className="px-4 py-2 text-center">{f.perguntas.length}</td>
                <td className="px-4 py-2 text-center font-medium">{f.pesoTotal}</td>
                <td className="px-4 py-2 text-gray-500">{f.criadoPorNome}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEdit(f.id)}
                    className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  Carregando...
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  {filter ? 'Nenhum formulário encontrado' : 'Nenhum formulário cadastrado'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
