'use client';
import { useState, useEffect } from 'react';
import { Habit } from '@/src/types/habit';
import { validateHabitName } from '@/src/lib/validators';

interface HabitFormProps {
  onSave: (name: string, description: string) => void;
  onCancel: () => void;
  editingHabit?: Habit | null;
}

export default function HabitForm({ onSave, onCancel, editingHabit }: HabitFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    if (editingHabit) {
      setName(editingHabit.name);
      setDescription(editingHabit.description);
    } else {
      setName('');
      setDescription('');
    }
    setNameError('');
  }, [editingHabit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateHabitName(name);
    if (!validation.valid) {
      setNameError(validation.error || 'Invalid name');
      return;
    }
    onSave(validation.value, description.trim());
  };

  return (
    <form
      data-testid="habit-form"
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4"
    >
      <h3 className="text-lg font-semibold text-gray-800">
        {editingHabit ? 'Edit Habit' : 'New Habit'}
      </h3>

      <div>
        <label htmlFor="habit-name" className="block text-sm font-medium text-gray-700 mb-1">
          Habit Name <span className="text-red-500">*</span>
        </label>
        <input
          id="habit-name"
          type="text"
          data-testid="habit-name-input"
          value={name}
          onChange={(e) => { setName(e.target.value); setNameError(''); }}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${nameError ? 'border-red-400' : 'border-gray-300'}`}
          placeholder="e.g. Drink Water"
        />
        {nameError && (
          <p className="mt-1 text-sm text-red-600">{nameError}</p>
        )}
      </div>

      <div>
        <label htmlFor="habit-description" className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <input
          id="habit-description"
          type="text"
          data-testid="habit-description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="e.g. Drink 8 glasses a day"
        />
      </div>

      <div>
        <label htmlFor="habit-frequency" className="block text-sm font-medium text-gray-700 mb-1">
          Frequency
        </label>
        <select
          id="habit-frequency"
          data-testid="habit-frequency-select"
          defaultValue="daily"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="daily">Daily</option>
        </select>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          data-testid="habit-save-button"
          className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
        >
          {editingHabit ? 'Save Changes' : 'Create Habit'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}