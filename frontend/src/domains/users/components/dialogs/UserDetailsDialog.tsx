import Dialog from '@/shared/components/dialog/Dialog';
import type { User } from '@/types';
import { formatCreatedAt, formatRole, roleBadgeCls, statusBadgeCls } from '../utils/userUtils';

interface UserDetailsDialogProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
}

function InfoRow({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <div className="mt-1 text-sm text-gray-800">{value}</div>
    </div>
  );
}

export default function UserDetailsDialog({ user, open, onClose }: UserDetailsDialogProps) {
  return (
    <Dialog
      isOpen={open}
      onClose={onClose}
      title="Visualizar usuario"
      description="Confira os dados do usuario selecionado."
      footer={
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Fechar
        </button>
      }
    >
      {user && (
        <div className="grid gap-4 md:grid-cols-2">
          <InfoRow label="Nome" value={user.nome} />
          <InfoRow label="E-mail" value={user.email} />
          <InfoRow
            label="Perfil"
            value={
              <span className={`inline-flex rounded-full px-2 py-1 text-xs font-bold ${roleBadgeCls(user.role)}`}>
                {formatRole(user.role)}
              </span>
            }
          />
          <InfoRow
            label="Status"
            value={
              <span className={`inline-flex rounded-full px-2 py-1 text-xs font-bold ${statusBadgeCls(user.ativo)}`}>
                {user.ativo ? 'Ativo' : 'Inativo'}
              </span>
            }
          />
          <InfoRow label="Data de cadastro" value={formatCreatedAt(user.criado_em)} />
          <InfoRow label="Identificador" value={`#${user.id}`} />
        </div>
      )}
    </Dialog>
  );
}
