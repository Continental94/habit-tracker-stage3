import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

import LoginForm from '@/src/components/auth/LoginForm';
import SignupForm from '@/src/components/auth/SignupForm';

describe('auth flow', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('submits the signup form and creates a session', async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByTestId('auth-signup-email'), 'test@example.com');
    await user.type(screen.getByTestId('auth-signup-password'), 'password123');
    await user.click(screen.getByTestId('auth-signup-submit'));

    await waitFor(() => {
      const session = JSON.parse(localStorageMock.getItem('habit-tracker-session') || 'null');
      expect(session).not.toBeNull();
      expect(session.email).toBe('test@example.com');
    });
  });

  it('shows an error for duplicate signup email', async () => {
    const user = userEvent.setup();

    // First signup
    render(<SignupForm />);
    await user.type(screen.getByTestId('auth-signup-email'), 'test@example.com');
    await user.type(screen.getByTestId('auth-signup-password'), 'password123');
    await user.click(screen.getByTestId('auth-signup-submit'));

    // Second signup with same email
    render(<SignupForm />);
    await user.type(screen.getAllByTestId('auth-signup-email')[1], 'test@example.com');
    await user.type(screen.getAllByTestId('auth-signup-password')[1], 'password456');
    await user.click(screen.getAllByTestId('auth-signup-submit')[1]);

    await waitFor(() => {
      expect(screen.getByText('User already exists')).toBeTruthy();
    });
  });

  it('submits the login form and stores the active session', async () => {
    const user = userEvent.setup();

    // Create user first
    const users = [{ id: '1', email: 'test@example.com', password: 'password123', createdAt: new Date().toISOString() }];
    localStorageMock.setItem('habit-tracker-users', JSON.stringify(users));

    render(<LoginForm />);
    await user.type(screen.getByTestId('auth-login-email'), 'test@example.com');
    await user.type(screen.getByTestId('auth-login-password'), 'password123');
    await user.click(screen.getByTestId('auth-login-submit'));

    await waitFor(() => {
      const session = JSON.parse(localStorageMock.getItem('habit-tracker-session') || 'null');
      expect(session).not.toBeNull();
      expect(session.email).toBe('test@example.com');
    });
  });

  it('shows an error for invalid login credentials', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByTestId('auth-login-email'), 'wrong@example.com');
    await user.type(screen.getByTestId('auth-login-password'), 'wrongpassword');
    await user.click(screen.getByTestId('auth-login-submit'));

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeTruthy();
    });
  });
});