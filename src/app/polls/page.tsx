"use client";
import { PollList } from '@/components/polls/poll-list';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PollsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-3xl font-bold">Explore Polls</h1>
        <p className="text-muted-foreground">Browse and vote on polls created by the community</p>
      </div>
      <PollList initialPolls={[]} />
    </div>
  );
}
