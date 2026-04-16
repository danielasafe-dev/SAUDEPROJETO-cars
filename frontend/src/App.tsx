import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/store/authStore';
import ProtectedRoute from '@/shared/components/ProtectedRoute';
import PageLayout from '@/shared/components/layout/PageLayout';
import LoginPage from '@/domains/auth/pages/LoginPage';
import DashboardPage from '@/domains/dashboard/pages/DashboardPage';
import PatientsPage from '@/domains/patients/pages/PatientsPage';
import UsersPage from '@/domains/users/pages/UsersPage';
import EvaluationFormPage from '@/domains/evaluations/pages/EvaluationFormPage';
import EvaluationsListPage from '@/domains/evaluations/pages/EvaluationsListPage';
import EvaluationResultPage from '@/domains/evaluations/pages/EvaluationResultPage';
import EvaluationDetailPage from '@/domains/evaluations/pages/EvaluationDetailPage';

function Private() {
  const user = useAuthStore((s) => s.user);
  const canManageUsers = useAuthStore((s) => s.canManageUsers);
  return (
    <Routes>
      <Route path="/" element={<PageLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="avaliacoes" element={<EvaluationsListPage />} />
        <Route path="pacientes" element={<PatientsPage />} />
        <Route path="nova-avaliacao" element={<EvaluationFormPage />} />
        <Route path="resultado" element={<EvaluationResultPage />} />
        <Route path="avaliacoes/:id" element={<EvaluationDetailPage />} />
        {user && canManageUsers() && (
          <Route path="usuarios" element={<UsersPage />} />
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<ProtectedRoute><Private /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
