import { PollDetail } from '@/components/polls/poll-detail';
import { PollShare } from '@/components/polls/poll-share';
import { PollResults } from '@/components/polls/poll-results';
import { getPollWithVotes } from '@/lib/actions/votes';
import { notFound } from 'next/navigation';

type PollPageProps = {
  params: {
    id: string;
  };
};

export default async function PollPage({ params }: PollPageProps) {
  const { id: pollId } = await params;
  
  try {
    const pollData = await getPollWithVotes(pollId);
    
    // Calculate total votes for analytics
    const totalVotes = pollData.options.reduce((sum, option) => sum + option.votes, 0);
    
    return (
      <div className="container py-8">
        <div className="flex flex-col gap-4 mb-8">
          <h1 className="text-3xl font-bold">Poll Details</h1>
        </div>
        <div className="space-y-8">
          <PollDetail {...pollData} />
          <PollResults
            options={pollData.options}
            totalVotes={totalVotes}
            createdAt={pollData.created_at}
            pollTitle={pollData.title}
          />
          <PollShare
            pollId={pollData.id}
            pollTitle={pollData.title}
          />
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}