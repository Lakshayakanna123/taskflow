import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input, Textarea, Select } from '../ui/FormControls';
import { Button } from '../ui/Button';
import type { Task, TaskFormData, Priority, Category } from '../../types/task';
import { validateTaskTitle, validateTaskDescription } from '../../utils/validation';
import { toDateInputValue } from '../../utils/date';
import { createTask, updateTask } from '../../services/tasks.service';
import { useAppContext } from '../../context/AppContext';

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  editTask?: Task | null;
}

const defaultForm: TaskFormData = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
  category: '',
  labels: [],
};

function taskToForm(task: Task): TaskFormData {
  return {
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: toDateInputValue(task.dueDate),
    category: task.category ?? '',
    labels: task.labels,
  };
}

export function TaskFormModal({ open, onClose, editTask }: TaskFormModalProps) {
  const { user } = useAppContext();
  const [form, setForm] = useState<TaskFormData>(() =>
    editTask ? taskToForm(editTask) : defaultForm
  );
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Reset form when modal opens/closes or edit task changes
  function handleOpen() {
    setForm(editTask ? taskToForm(editTask) : defaultForm);
    setErrors({});
    setGlobalError(null);
  }

  function validate(): boolean {
    const titleError = validateTaskTitle(form.title);
    const descError = validateTaskDescription(form.description);
    const newErrors: typeof errors = {};
    if (titleError) newErrors.title = titleError;
    if (descError) newErrors.description = descError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!validate()) return;
    setSubmitting(true);
    setGlobalError(null);
    try {
      if (editTask) {
        await updateTask(user.uid, editTask.id, form);
      } else {
        await createTask(user.uid, form);
      }
      onClose();
      setForm(defaultForm);
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : 'Failed to save task. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editTask ? 'Edit Task' : 'New Task'}
    >
      {/* Run handleOpen when modal becomes open */}
      {open && <span className="hidden" ref={() => handleOpen()} />}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Title"
          id="task-title"
          required
          placeholder="What needs to be done?"
          value={form.title}
          onChange={(e) => {
            setForm((f) => ({ ...f, title: e.target.value }));
            if (errors.title) setErrors((er) => ({ ...er, title: undefined }));
          }}
          error={errors.title}
          maxLength={200}
          autoFocus
        />
        <Textarea
          label="Description"
          id="task-description"
          placeholder="Add more details… (optional)"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          error={errors.description}
          maxLength={2000}
        />
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Priority"
            id="task-priority"
            value={form.priority}
            onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as Priority }))}
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </Select>
          <Select
            label="Category"
            id="task-category"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Category | '' }))}
          >
            <option value="">No Category</option>
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="study">Study</option>
            <option value="health">Health</option>
            <option value="other">Other</option>
          </Select>
        </div>
        <Input
          label="Due Date"
          id="task-due-date"
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
          min={new Date().toISOString().split('T')[0]}
        />
        {globalError && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-700 dark:text-red-400" role="alert">{globalError}</p>
          </div>
        )}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            {editTask ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
