export type Priority = 'low' | 'medium' | 'high';
export type Category = 'personal' | 'work' | 'study' | 'health' | 'other';

export interface Task {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  dueDate: Date | null;
  category: Category | null;
  labels: string[];
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
}

export type TaskFormData = {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string; // ISO date string from form input
  category: Category | '';
  labels: string[];
};

export type TaskFilter =
  | 'all'
  | 'pending'
  | 'completed'
  | 'today'
  | 'upcoming'
  | 'overdue';

export type TaskSort =
  | 'newest'
  | 'oldest'
  | 'dueDate'
  | 'priority'
  | 'alphabetical';

export const PRIORITY_ORDER: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export const CATEGORY_LABELS: Record<Category, string> = {
  personal: 'Personal',
  work: 'Work',
  study: 'Study',
  health: 'Health',
  other: 'Other',
};
