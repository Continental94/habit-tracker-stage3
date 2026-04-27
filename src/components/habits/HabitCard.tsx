'use client';
import { useState } from 'react';
import { Habit } from '@/src/types/habit';
import { getHabitSlug } from '@/src/lib/slug';
import { calculateCurrentStreak } from '@/src/lib/streaks';

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  today: string;
}

export default function HabitCard({ habit, onEdit, onDelete, onToggle, today }: HabitCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const slug = getHabitSlug(habit.name);
  const streak = calculateCurrentStreak(habit.completions, today);
  const isCompleted = habit.completions.includes(today);

  if (showConfirm) {
    return (
      <div
        data-testid={`habit-card-${slug}`}
        className="bg-white rounded-xl shadow-sm border border-red-200 p-6"
      >
        <p className="text-gray-800 font-medium mb-1">Delete "{habit.name}"?</p>
        <p className="text-sm text-gray-500 mb-4">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button
            data-testid="confirm-delete-button"
            onClick={() => onDelete(habit.id)}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
          >
            Delete
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 focus:outline-none font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className={`bg-white rounded-xl shadow-sm border p-6 transition-all ${isCompleted ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{habit.name}</h3>
          {habit.description && (
            <p className="text-sm text-gray-500 mt-1 truncate">{habit.description}</p>
          )}
          <div
            data-testid={`habit-streak-${slug}`}
            className="mt-2 flex items-center gap-1 text-sm"
          >
            <span className="text-orange-500">🔥</span>
            <span className="font-medium text-gray-700">{streak}</span>
            <span className="text-gray-500">day{streak !== 1 ? 's' : ''} streak</span>
          </div>
        </div>

        <button
          data-testid={`habit-complete-${slug}`}
          onClick={() => onToggle(habit.id)}
          aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
          className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            isCompleted
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-indigo-400'
          }`}
        >
          {isCompleted ? '✓' : ''}
        </button>
      </div>

      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
        <button
          data-testid={`habit-edit-${slug}`}
          onClick={() => onEdit(habit)}
          className="flex-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
        >
          Edit
        </button>
        <button
          data-testid={`habit-delete-${slug}`}
          onClick={() => setShowConfirm(true)}
          className="flex-1 text-sm text-red-500 hover:text-red-700 font-medium py-1 focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}