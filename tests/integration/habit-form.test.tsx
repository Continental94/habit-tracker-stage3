import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

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

import HabitForm from '@/src/components/habits/HabitForm';
import HabitCard from '@/src/components/habits/HabitCard';
import { Habit } from '@/src/types/habit';

const mockHabit: Habit = {
  id: 'habit-1',
  userId: 'user-1',
  name: 'Drink Water',
  description: 'Stay hydrated',
  frequency: 'daily',
  createdAt: '2024-01-01T00:00:00.000Z',
  completions: [],
};

describe('habit form', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('shows a validation error when habit name is empty', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<HabitForm onSave={onSave} onCancel={vi.fn()} />);

    await user.click(screen.getByTestId('habit-save-button'));

    await waitFor(() => {
      expect(screen.getByText('Habit name is required')).toBeTruthy();
    });
    expect(onSave).not.toHaveBeenCalled();
  });

  it('creates a new habit and renders it in the list', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<HabitForm onSave={onSave} onCancel={vi.fn()} />);

    await user.type(screen.getByTestId('habit-name-input'), 'Drink Water');
    await user.type(screen.getByTestId('habit-description-input'), 'Stay hydrated');
    await user.click(screen.getByTestId('habit-save-button'));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith('Drink Water', 'Stay hydrated');
    });
  });

  it('edits an existing habit and preserves immutable fields', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<HabitForm onSave={onSave} onCancel={vi.fn()} editingHabit={mockHabit} />);

    const nameInput = screen.getByTestId('habit-name-input');
    await user.clear(nameInput);
    await user.type(nameInput, 'Read Books');
    await user.click(screen.getByTestId('habit-save-button'));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith('Read Books', 'Stay hydrated');
    });
  });

  it('deletes a habit only after explicit confirmation', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    const today = new Date().toISOString().split('T')[0];

    render(
      <HabitCard
        habit={mockHabit}
        onEdit={vi.fn()}
        onDelete={onDelete}
        onToggle={vi.fn()}
        today={today}
      />
    );

    await user.click(screen.getByTestId('habit-delete-drink-water'));
    expect(onDelete).not.toHaveBeenCalled();

    await user.click(screen.getByTestId('confirm-delete-button'));
    expect(onDelete).toHaveBeenCalledWith('habit-1');
  });

  it('toggles completion and updates the streak display', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const today = new Date().toISOString().split('T')[0];

    render(
      <HabitCard
        habit={mockHabit}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggle={onToggle}
        today={today}
      />
    );

    expect(screen.getByTestId('habit-streak-drink-water')).toBeTruthy();
    await user.click(screen.getByTestId('habit-complete-drink-water'));
    expect(onToggle).toHaveBeenCalledWith('habit-1');
  });
});