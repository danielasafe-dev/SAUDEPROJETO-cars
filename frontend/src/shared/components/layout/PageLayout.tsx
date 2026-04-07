import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/shared/store/authStore';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  UserCog,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/avaliacoes', icon: ClipboardList, label: 'Avaliações' },
  { to: '/pacientes', icon: Users, label: 'Pacientes' },
  { to: '/usuarios', icon: UserCog, label: 'Usuários', adminOnly: true },
];

export default function PageLayout() {
  const { user, logout, isAdmin } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredNav = navItems.filter(
    (item) => !item.adminOnly || isAdmin()
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h1 className="text-lg font-bold text-blue-700">CARS</h1>
          <button
            className="lg:hidden p-1"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {filteredNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.to
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}

          <Link
            to="/nova-avaliacao"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors mt-4"
            onClick={() => setSidebarOpen(false)}
          >
            <ClipboardList className="w-5 h-5" />
            Nova Avaliação
          </Link>
        </nav>

        <div className="p-3 border-t border-gray-200">
          <div className="px-3 py-2">
            <p className="text-sm font-medium text-gray-800">{user?.nome}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 lg:hidden">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-semibold">CARS</span>
        </header>
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
