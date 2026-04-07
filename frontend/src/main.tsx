import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './shared/store/authStore';
import './index.css';
import App from './App';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

// Load persisted auth
const storedUser = localStorage.getItem('user');
const storedToken = localStorage.getItem('token');
if (storedUser && storedToken) {
  useAuthStore.getState().setAuth(JSON.parse(storedUser), storedToken);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
