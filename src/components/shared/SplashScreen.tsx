export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="fixed inset-0 flex flex-col items-center justify-center bg-indigo-600 text-white"
    >
      <div className="text-center">
        <div className="text-6xl mb-4">✓</div>
        <h1 className="text-4xl font-bold tracking-tight">Habit Tracker</h1>
        <p className="mt-2 text-indigo-200 text-lg">Build better habits, every day</p>
      </div>
    </div>
  );
}