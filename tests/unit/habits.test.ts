import { describe, it, expect } from 'vitest';
import { toggleHabitCompletion } from '@/src/lib/habits';
import { Habit } from '@/src/types/habit';

const baseHabit: Habit = {
  id: 'test-id',
  userId: 'user-1',
  name: 'Drink Water',
  description: 'Stay hydrated',
  frequency: 'daily',
  createdAt: '2024-01-01T00:00:00.000Z',
  completions: [],
};

describe('toggleHabitCompletion', () => {
  it('adds a completion date when the date is not present', () => {
    const result = toggleHabitCompletion(baseHabit, '2024-01-01');
    expect(result.completions).toContain('2024-01-01');
  });

  it('removes a completion date when the date already exists', () => {
    const habit = { ...baseHabit, completions: ['2024-01-01'] };
    const result = toggleHabitCompletion(habit, '2024-01-01');
    expect(result.completions).not.toContain('2024-01-01');
  });

  it('does not mutate the original habit object', () => {
    const habit = { ...baseHabit, completions: ['2024-01-01'] };
    toggleHabitCompletion(habit, '2024-01-02');
    expect(habit.completions).toEqual(['2024-01-01']);
  });

  it('does not return duplicate completion dates', () => {
    const habit = { ...baseHabit, completions: ['2024-01-01'] };
    const result = toggleHabitCompletion(
      { ...habit, completions: ['2024-01-01', '2024-01-01'] },
      '2024-01-02'
    );
    const count = result.completions.filter((d) => d === '2024-01-01').length;
    expect(count).toBe(1);
  });
});