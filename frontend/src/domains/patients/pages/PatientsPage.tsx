import { useEffect, useState } from 'react';
import { getPatients, createPatient } from '../api';
import type { Patient } from '@/types';
import { Plus } from 'lucide-react';

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPatients().then(setPatients);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createPatient({ nome, idade: idade ? Number(idade) : undefined });
      const updated = await getPatients();
      setPatients(updated);
      setShowForm(false);
      setNome('');
      setIdade('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Pacientes</h2>
          <p className="text-sm text-gray-500">{patients.length} paciente(s) cadastrado(s)</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Novo Paciente
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <form onSubmit={handleSubmit} className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Nome</label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Nome do paciente"
              />
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium mb-1">Idade</label>
              <input
                type="number"
                value={idade}
                onChange={(e) => setIdade(e.target.value)}
                min={0}
                max={99}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
            >
              {loading ? '...' : 'Salvar'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Nome</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Idade</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Data Cadastro</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{p.nome}</td>
                <td className="px-4 py-2">{p.idade || '—'}</td>
                <td className="px-4 py-2 text-gray-500">{new Date(p.criado_em).toLocaleDateString('pt-BR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
