import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/services/auth';

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  if (user?.role === 'admin') {
    redirect('/dashboard');
  } else if (user?.role === 'member') {
    redirect('/member');
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Redirecting...</p>
    </div>
  );
}
