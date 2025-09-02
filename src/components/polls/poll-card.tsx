'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type PollOption = {
  id: string;
  text: string;
  votes: number;
};

type PollCardProps = {
  id: string;
  title: string;
  description?: string;
  options: PollOption[];
  createdBy: string;
  createdAt: string;
  totalVotes: number;
  hasVoted?: boolean;
};

export function PollCard({
  id,
  title,
  description,
  options,
  createdBy,
  createdAt,
  totalVotes,
  hasVoted = false,
}: PollCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleViewPoll = () => {
    router.push(`/polls/${id}`);
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="line-clamp-1">{title}</CardTitle>
        {description && (
          <CardDescription className="line-clamp-2">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-4">
          <p>Created by {createdBy}</p>
          <p>Created on {new Date(createdAt).toLocaleDateString()}</p>
          <p>{totalVotes} votes</p>
        </div>
        <div className="space-y-2">
          {options.slice(0, 2).map((option) => (
            <div key={option.id} className="flex justify-between items-center">
              <span className="line-clamp-1">{option.text}</span>
              {hasVoted && (
                <span className="text-sm font-medium">
                  {totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0}%
                </span>
              )}
            </div>
          ))}
          {options.length > 2 && (
            <p className="text-sm text-muted-foreground">+{options.length - 2} more options</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleViewPoll} 
          className="w-full" 
          variant="outline"
          disabled={isLoading}
        >
          View Poll
        </Button>
      </CardFooter>
    </Card>
  );
}