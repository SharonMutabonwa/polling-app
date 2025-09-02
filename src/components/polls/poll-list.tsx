'use client';

import { useState } from 'react';
import { PollCard } from './poll-card';

type PollOption = {
  id: string;
  text: string;
  votes: number;
};

type Poll = {
  id: string;
  title: string;
  description?: string;
  options: PollOption[];
  createdBy: string;
  createdAt: string;
  totalVotes: number;
  hasVoted?: boolean;
};

type PollListProps = {
  initialPolls: Poll[];
};

// Mock polls data - would come from API in real app
const mockPolls: Poll[] = [
  {
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
  },
  {
    id: '2',
    title: 'Which frontend framework do you prefer?',
    description: 'Vote for your favorite frontend framework',
    options: [
      { id: '2-1', text: 'React', votes: 32 },
      { id: '2-2', text: 'Vue', votes: 15 },
      { id: '2-3', text: 'Angular', votes: 10 },
      { id: '2-4', text: 'Svelte', votes: 8 },
    ],
    createdBy: 'Jane Smith',
    createdAt: '2023-05-20',
    totalVotes: 65,
    hasVoted: true,
  },
  {
    id: '3',
    title: 'What is your preferred database?',
    description: 'Vote for your favorite database technology',
    options: [
      { id: '3-1', text: 'PostgreSQL', votes: 22 },
      { id: '3-2', text: 'MongoDB', votes: 18 },
      { id: '3-3', text: 'MySQL', votes: 15 },
      { id: '3-4', text: 'SQLite', votes: 7 },
    ],
    createdBy: 'Alex Johnson',
    createdAt: '2023-06-01',
    totalVotes: 62,
    hasVoted: false,
  },
];

export function PollList({ initialPolls = mockPolls }: PollListProps) {
  const [polls, setPolls] = useState<Poll[]>(initialPolls);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-6">
      {polls.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No polls found</h3>
          <p className="text-muted-foreground">Create a new poll or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {polls.map((poll) => (
            <PollCard key={poll.id} {...poll} />
          ))}
        </div>
      )}
    </div>
  );
}