import { CreatePollForm } from '@/components/polls/create-poll-form';

export default function CreatePollPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-3xl font-bold">Create a New Poll</h1>
        <p className="text-muted-foreground">Create a poll and share it with others</p>
      </div>
      <CreatePollForm />
    </div>
  );
}