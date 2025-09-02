import { PollList } from '@/components/polls/poll-list';

export default function MyPollsPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-3xl font-bold">My Polls</h1>
        <p className="text-muted-foreground">Manage polls you've created</p>
      </div>
      <PollList initialPolls={[]} />
    </div>
  );
}