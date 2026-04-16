import Dialog from '@/shared/components/dialog/Dialog';
import EvaluationFormPage from '../pages/EvaluationFormPage';

interface EvaluationCreateDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function EvaluationCreateDialog({
  open,
  onClose,
}: EvaluationCreateDialogProps) {
  return (
    <Dialog
      isOpen={open}
      onClose={onClose}
      title="Nova avaliacao"
      description="Selecione ou cadastre o paciente e responda as questoes da avaliacao."
      size="lg"
    >
      <div className="max-h-[70vh] overflow-y-auto pr-1">
        <EvaluationFormPage embedded onCancel={onClose} />
      </div>
    </Dialog>
  );
}
