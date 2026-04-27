import LoginForm from '@/src/components/auth/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">Habit Tracker</h1>
          <p className="text-gray-500 mt-2">Welcome back! Sign in to continue.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Sign In</h2>
          <LoginForm />
          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link href="/signup" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}