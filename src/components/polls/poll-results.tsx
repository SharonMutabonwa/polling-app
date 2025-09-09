'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, TrendingUp, Calendar } from 'lucide-react';

type PollOption = {
  id: string;
  text: string;
  votes: number;
};

type PollResultsProps = {
  options: PollOption[];
  totalVotes: number;
  createdAt: string;
  pollTitle: string;
};

export function PollResults({ options, totalVotes, createdAt, pollTitle }: PollResultsProps) {
  // Sort options by vote count (descending)
  const sortedOptions = [...options].sort((a, b) => b.votes - a.votes);
  const winningOption = sortedOptions[0];
  
  // Calculate percentages
  const optionsWithPercentages = sortedOptions.map(option => ({
    ...option,
    percentage: totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0
  }));

  // Calculate analytics
  const averageVotesPerOption = totalVotes > 0 ? (totalVotes / options.length).toFixed(1) : '0';
  const participationRate = totalVotes > 0 ? 'Active' : 'No votes yet';
  const daysSinceCreated = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Votes</p>
                <p className="text-2xl font-bold">{totalVotes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Options</p>
                <p className="text-2xl font-bold">{options.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg per Option</p>
                <p className="text-2xl font-bold">{averageVotesPerOption}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Days Active</p>
                <p className="text-2xl font-bold">{daysSinceCreated}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Poll Results
          </CardTitle>
          <CardDescription>
            Detailed breakdown of votes for "{pollTitle}"
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {optionsWithPercentages.map((option, index) => {
              const isWinner = option.id === winningOption?.id && totalVotes > 0;
              
              return (
                <div key={option.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium px-2 py-1 rounded ${
                        isWinner ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        #{index + 1}
                      </span>
                      <span className="font-medium">{option.text}</span>
                      {isWinner && (
                        <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                          Winner
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-lg">{option.percentage}%</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        ({option.votes} votes)
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        isWinner ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${option.percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {totalVotes === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No votes yet</p>
              <p className="text-sm">Share this poll to start collecting votes!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Winner Announcement */}
      {totalVotes > 0 && winningOption && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-500 text-white p-3 rounded-full">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-green-800 mb-2">
                🎉 Winner: {winningOption.text}
              </h3>
              <p className="text-green-700">
                Leading with {winningOption.votes} votes ({Math.round((winningOption.votes / totalVotes) * 100)}% of total)
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}