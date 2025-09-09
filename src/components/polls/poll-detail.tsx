'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { submitVote } from '@/lib/actions/votes';

type PollOption = {
  id: string;
  text: string;
  votes: number;
};

type PollDetailProps = {
  id: string;
  title: string;
  description?: string;
  options: PollOption[];
  createdBy: string;
  createdAt: string;
  totalVotes: number;
  hasVoted?: boolean;
};

export function PollDetail({
  id,
  title,
  description,
  options,
  createdBy,
  createdAt,
  totalVotes,
  hasVoted = false,
}: PollDetailProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [userHasVoted, setUserHasVoted] = useState(hasVoted);
  const [pollOptions, setPollOptions] = useState<PollOption[]>(options);
  const [pollTotalVotes, setPollTotalVotes] = useState(totalVotes);

  const handleVote = async () => {
    if (!selectedOption) return;
    
    setIsVoting(true);
    
    try {
      const formData = new FormData();
      formData.append('pollId', id);
      formData.append('optionId', selectedOption);
      
      await submitVote(formData);
      
      // Update local state to reflect the vote
      const updatedOptions = pollOptions.map(option => {
        if (option.id === selectedOption) {
          return { ...option, votes: option.votes + 1 };
        }
        return option;
      });
      
      setPollOptions(updatedOptions);
      setPollTotalVotes(prev => prev + 1);
      setUserHasVoted(true);
    } catch (error) {
      console.error('Failed to submit vote:', error);
      // You could add error state here if needed
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        <div className="text-sm text-muted-foreground mt-2">
          <p>Created by {createdBy}</p>
          <p>Created on {new Date(createdAt).toLocaleDateString()}</p>
          <p>{pollTotalVotes} votes</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pollOptions.map((option) => {
            const percentage = pollTotalVotes > 0 ? Math.round((option.votes / pollTotalVotes) * 100) : 0;
            
            return (
              <div key={option.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {!userHasVoted && (
                      <input
                        type="radio"
                        id={option.id}
                        name="poll-option"
                        value={option.id}
                        checked={selectedOption === option.id}
                        onChange={() => setSelectedOption(option.id)}
                        className="h-4 w-4"
                      />
                    )}
                    <label 
                      htmlFor={option.id} 
                      className={`${!userHasVoted ? 'cursor-pointer' : ''} ${selectedOption === option.id ? 'font-medium' : ''}`}
                    >
                      {option.text}
                    </label>
                  </div>
                  {userHasVoted && <span className="font-medium">{percentage}%</span>}
                </div>
                
                {userHasVoted && (
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter>
        {!userHasVoted ? (
          <Button
            onClick={handleVote}
            className="w-full"
            disabled={!selectedOption || isVoting}
          >
            {isVoting ? 'Submitting Vote...' : 'Vote'}
          </Button>
        ) : (
          <p className="text-center w-full text-muted-foreground">
            You have already voted on this poll.
          </p>
        )}
      </CardFooter>
    </Card>
  );
}