import { PollList } from '@/components/polls/poll-list';

export default function PollsPage() {
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