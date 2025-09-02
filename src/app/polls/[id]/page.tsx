import { PollDetail } from '@/components/polls/poll-detail';

type PollPageProps = {
  params: {
    id: string;
  };
};

// Mock poll data - would come from API in real app
const mockPoll = {
  id: '1',
  title: 'What is your favorite programming language?',
  description: 'Vote for your preferred programming language',
  options: [
    { id: '1-1', text: 'JavaScript', votes: 25 },
    { id: '1-2', text: 'Python', votes: 18 },
    { id: '1-3', text: 'Java', votes: 12 },
    { id: '1-4', text: 'C#', votes: 8 },
  ],
  createdBy: 'John Doe',
  createdAt: '2023-05-15',
  totalVotes: 63,
  hasVoted: false,
};

export default function PollPage({ params }: PollPageProps) {
  // In a real app, we would fetch the poll data based on the ID
  const pollId = params.id;
  
  return (
    <div className="container py-8">
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-3xl font-bold">Poll Details</h1>
      </div>
      <PollDetail {...mockPoll} />
    </div>
  );
}