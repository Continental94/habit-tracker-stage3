# Habit Tracker PWA — Stage 3

A mobile-first Progressive Web App for tracking daily habits built with Next.js, TypeScript, and Tailwind CSS.

## 🔗 Live Demo
[View Live App](YOUR_VERCEL_URL_HERE)

## 🛠️ Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- localStorage (persistence)
- Vitest + React Testing Library (unit & integration tests)
- Playwright (E2E tests)

## 🚀 Setup Instructions
```bash
git clone https://github.com/Continental94/habit-tracker-stage3.git
cd habit-tracker-stage3
npm install
npm run dev
```
Open http://localhost:3000

## 🧪 Running Tests
```bash
# Unit tests + coverage
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests (requires dev server)
npm run test:e2e

# All tests
npm run test
```

## 💾 Local Persistence Structure
All data is stored in localStorage using these keys:
- `habit-tracker-users` — array of registered users
- `habit-tracker-session` — current logged-in session
- `habit-tracker-habits` — array of all habits

## 📱 PWA Support
- `public/manifest.json` — app manifest with icons
- `public/sw.js` — service worker for offline caching
- Service worker registered in layout.tsx on client load
- App shell cached after first load for offline use

## 🗂️ Test Files
| File | What it verifies |
|---|---|
| `tests/unit/slug.test.ts` | getHabitSlug utility function |
| `tests/unit/validators.test.ts` | validateHabitName utility function |
| `tests/unit/streaks.test.ts` | calculateCurrentStreak utility function |
| `tests/unit/habits.test.ts` | toggleHabitCompletion utility function |
| `tests/integration/auth-flow.test.tsx` | Signup, login, error handling |
| `tests/integration/habit-form.test.tsx` | Habit CRUD, toggle, delete confirmation |
| `tests/e2e/app.spec.ts` | Full user flows end-to-end |

## ⚖️ Trade-offs
- localStorage used instead of a database for simplicity and determinism
- No password hashing (out of scope for this stage)
- Single daily frequency supported as per spec
- PWA offline support limited to app shell caching