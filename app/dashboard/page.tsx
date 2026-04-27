'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, getHabits, saveHabits } from '@/src/lib/storage';
import { logoutUser } from '@/src/lib/auth';
import { toggleHabitCompletion } from '@/src/lib/habits';
import { Habit } from '@/src/types/habit';
import HabitCard from '@/src/components/habits/HabitCard';
import HabitForm from '@/src/components/habits/HabitForm';
import { Session } from '@/src/types/auth';

function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [mounted, setMounted] = useState(false);
  const today = getToday();

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.push('/login');
      return;
    }
    setSession(s);
    const allHabits = getHabits();
    const userHabits = allHabits.filter((h) => h.userId === s.userId);
    setHabits(userHabits);
    setMounted(true);
  }, [router]);

  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };

  const handleSaveHabit = (name: string, description: string) => {
    const allHabits = getHabits();
    if (editingHabit) {
      const updated = allHabits.map((h) =>
        h.id === editingHabit.id
          ? { ...h, name, description }
          : h
      );
      saveHabits(updated);
      setHabits(updated.filter((h) => h.userId === session!.userId));
    } else {
      const newHabit: Habit = {
        id: generateId(),
        userId: session!.userId,
        name,
        description,
        frequency: 'daily',
        createdAt: new Date().toISOString(),
        completions: [],
      };
      const updated = [...allHabits, newHabit];
      saveHabits(updated);
      setHabits(updated.filter((h) => h.userId === session!.userId));
    }
    setShowForm(false);
    setEditingHabit(null);
  };

  const handleDelete = (id: string) => {
    const allHabits = getHabits();
    const updated = allHabits.filter((h) => h.id !== id);
    saveHabits(updated);
    setHabits(updated.filter((h) => h.userId === session!.userId));
  };

  const handleToggle = (id: string) => {
    const allHabits = getHabits();
    const updated = allHabits.map((h) =>
      h.id === id ? toggleHabitCompletion(h, today) : h
    );
    saveHabits(updated);
    setHabits(updated.filter((h) => h.userId === session!.userId));
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingHabit(null);
  };

  if (!mounted) return null;

  return (
    <div data-testid="dashboard-page" className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-indigo-600">Habit Tracker</h1>
            <p className="text-xs text-gray-500">{session?.email}</p>
          </div>
          <button
            data-testid="auth-logout-button"
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-red-600 font-medium focus:outline-none focus:ring-2 focus:ring-red-400 rounded px-3 py-1"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Create button */}
        {!showForm && (
          <button
            data-testid="create-habit-button"
            onClick={() => { setEditingHabit(null); setShowForm(true); }}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm"
          >
            + Create New Habit
          </button>
        )}

        {/* Form */}
        {showForm && (
          <HabitForm
            onSave={handleSaveHabit}
            onCancel={handleCancel}
            editingHabit={editingHabit}
          />
        )}

        {/* Habit List */}
        {habits.length === 0 && !showForm ? (
          <div
            data-testid="empty-state"
            className="text-center py-16"
          >
            <div className="text-5xl mb-4">🌱</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No habits yet</h2>
            <p className="text-gray-500 text-sm">
              Click "Create New Habit" to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggle={handleToggle}
                today={today}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}