import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Task, TaskFormData, Priority, Category } from '../types/task';

const VALID_PRIORITIES = ['low', 'medium', 'high'] as const;
const VALID_CATEGORIES = ['personal', 'work', 'study', 'health', 'other'] as const;
const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 2000;

function validateTaskData(data: TaskFormData): void {
  const title = data.title.trim();
  if (!title) throw new Error('Task title is required.');
  if (title.length > MAX_TITLE_LENGTH)
    throw new Error(`Title must be ${MAX_TITLE_LENGTH} characters or fewer.`);
  if (data.description.trim().length > MAX_DESCRIPTION_LENGTH)
    throw new Error(`Description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer.`);
  if (!VALID_PRIORITIES.includes(data.priority as Priority))
    throw new Error('Invalid priority value.');
  if (data.category && !VALID_CATEGORIES.includes(data.category as Category))
    throw new Error('Invalid category value.');
}

function tasksCollection(uid: string) {
  return collection(db, 'users', uid, 'tasks');
}

function taskDoc(uid: string, taskId: string) {
  return doc(db, 'users', uid, 'tasks', taskId);
}

function firestoreDocToTask(id: string, data: Record<string, unknown>): Task {
  return {
    id,
    ownerId: data.ownerId as string,
    title: data.title as string,
    description: (data.description as string) ?? '',
    completed: (data.completed as boolean) ?? false,
    priority: (data.priority as Priority) ?? 'medium',
    dueDate:
      data.dueDate instanceof Timestamp ? data.dueDate.toDate() : null,
    category: (data.category as Category) ?? null,
    labels: (data.labels as string[]) ?? [],
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate()
        : new Date(),
    updatedAt:
      data.updatedAt instanceof Timestamp
        ? data.updatedAt.toDate()
        : new Date(),
    completedAt:
      data.completedAt instanceof Timestamp ? data.completedAt.toDate() : null,
  };
}

export function subscribeToTasks(
  uid: string,
  onData: (tasks: Task[]) => void,
  onError: (error: Error) => void
): Unsubscribe {
  const q = query(tasksCollection(uid), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const tasks: Task[] = snapshot.docs.map((d) =>
        firestoreDocToTask(d.id, d.data() as Record<string, unknown>)
      );
      onData(tasks);
    },
    (err) => onError(err as Error)
  );
}

export async function createTask(
  uid: string,
  formData: TaskFormData
): Promise<void> {
  validateTaskData(formData);
  const title = formData.title.trim();
  const description = formData.description.trim();
  const dueDate = formData.dueDate ? Timestamp.fromDate(new Date(formData.dueDate)) : null;

  await addDoc(tasksCollection(uid), {
    ownerId: uid,
    title,
    description,
    completed: false,
    priority: formData.priority,
    dueDate,
    category: formData.category || null,
    labels: formData.labels,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    completedAt: null,
  });
}

export async function updateTask(
  uid: string,
  taskId: string,
  formData: Partial<TaskFormData>
): Promise<void> {
  if (formData.title !== undefined) {
    const title = formData.title.trim();
    if (!title) throw new Error('Task title is required.');
    if (title.length > MAX_TITLE_LENGTH)
      throw new Error(`Title must be ${MAX_TITLE_LENGTH} characters or fewer.`);
  }
  if (
    formData.priority !== undefined &&
    !VALID_PRIORITIES.includes(formData.priority as Priority)
  ) {
    throw new Error('Invalid priority value.');
  }

  const updates: Record<string, unknown> = { updatedAt: serverTimestamp() };
  if (formData.title !== undefined) updates.title = formData.title.trim();
  if (formData.description !== undefined)
    updates.description = formData.description.trim();
  if (formData.priority !== undefined) updates.priority = formData.priority;
  if (formData.dueDate !== undefined)
    updates.dueDate = formData.dueDate
      ? Timestamp.fromDate(new Date(formData.dueDate))
      : null;
  if (formData.category !== undefined)
    updates.category = formData.category || null;
  if (formData.labels !== undefined) updates.labels = formData.labels;

  await updateDoc(taskDoc(uid, taskId), updates);
}

export async function toggleTaskComplete(
  uid: string,
  taskId: string,
  completed: boolean
): Promise<void> {
  await updateDoc(taskDoc(uid, taskId), {
    completed,
    completedAt: completed ? serverTimestamp() : null,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTask(uid: string, taskId: string): Promise<void> {
  await deleteDoc(taskDoc(uid, taskId));
}
