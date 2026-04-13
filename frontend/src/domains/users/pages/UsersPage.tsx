import { useEffect, useState } from 'react';
import { getUsers, createUser, deactivateUser } from '../api';
import type { User } from '@/types';
import { Plus } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'avaliador'>('avaliador');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await createUser({ nome: name, email, password, role });
      const updated = await getUsers();
      setUsers(updated);
      setShowForm(false);
      setName('');
      setEmail('');
      setPassword('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao criar usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id: number) => {
    await deactivateUser(id);
    const updated = await getUsers();
    setUsers(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Usuários</h2>
          <p className="text-sm text-gray-500">Gerenciar avaliadores e administradores</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Novo Usuário
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium mb-1">Nome</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-56">
              <label className="block text-sm font-medium mb-1">E-mail</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-56">
              <label className="block text-sm font-medium mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Senha de acesso"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Perfil</label>
              <select value={role} onChange={(e) => setRole(e.target.value as 'admin' | 'avaliador')}
                className="px-3 py-2 border border-gray-300 rounded-lg outline-none"
              >
                <option value="avaliador">Avaliador</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="w-full text-xs text-gray-500">
              Defina aqui a senha que o funcionario vai usar para fazer login.
            </div>
            {error && (
              <div className="w-full rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </div>
            )}
            <button type="submit" disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
            >
              {loading ? '...' : 'Criar'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Nome</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">E-mail</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Perfil</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{u.nome}</td>
                <td className="px-4 py-2 text-gray-500">{u.email}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>{u.role === 'admin' ? 'Administrador' : 'Avaliador'}</span>
                </td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    u.ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>{u.ativo ? 'Ativo' : 'Inativo'}</span>
                </td>
                <td className="px-4 py-2">
                  {u.ativo && (
                    <button onClick={() => handleDeactivate(u.id)}
                      className="text-red-600 hover:text-red-800 text-xs font-medium">
                      Desativar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
