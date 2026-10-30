export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Email is required.';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address.';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required.';
  if (password.length < 6) return 'Password must be at least 6 characters.';
  return null;
}

export function validateDisplayName(name: string): string | null {
  if (!name.trim()) return 'Full name is required.';
  if (name.trim().length < 2) return 'Name must be at least 2 characters.';
  if (name.trim().length > 60) return 'Name must be 60 characters or fewer.';
  return null;
}

export function validateTaskTitle(title: string): string | null {
  if (!title.trim()) return 'Task title is required.';
  if (title.trim().length > 200) return 'Title must be 200 characters or fewer.';
  return null;
}

export function validateTaskDescription(description: string): string | null {
  if (description.trim().length > 2000)
    return 'Description must be 2000 characters or fewer.';
  return null;
}
