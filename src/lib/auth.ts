import { User, Session } from '@/src/types/auth';
import { getUsers, saveUsers, saveSession, clearSession } from './storage';

function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// ── SIGNUP ─────────────────────────────────────
export function signupUser(
  email: string,
  password: string
): { success: boolean; error?: string; session?: Session } {
  const users = getUsers();
  const exists = users.find((u) => u.email === email);

  if (exists) {
    return { success: false, error: 'User already exists' };
  }

  const newUser: User = {
    id: generateId(),
    email,
    password,
    createdAt: new Date().toISOString(),
  };

  saveUsers([...users, newUser]);

  const session: Session = { userId: newUser.id, email: newUser.email };
  saveSession(session);

  return { success: true, session };
}

// ── LOGIN ──────────────────────────────────────
export function loginUser(
  email: string,
  password: string
): { success: boolean; error?: string; session?: Session } {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }

  const session: Session = { userId: user.id, email: user.email };
  saveSession(session);

  return { success: true, session };
}

// ── LOGOUT ─────────────────────────────────────
export function logoutUser(): void {
  clearSession();
}