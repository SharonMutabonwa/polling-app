'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';

type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  pollsCreated: number;
  pollsVoted: number;
};

// Mock user data - would come from API in real app
const mockUser: UserProfile = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  pollsCreated: 5,
  pollsVoted: 12,
};

export function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile>(mockUser);
  
  const handleLogout = () => {
    // TODO: Implement actual logout logic
    router.push('/auth/login');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-col items-center">
        <Avatar className="h-24 w-24 mb-4">
          <div className="flex h-full w-full items-center justify-center bg-muted rounded-full">
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatarUrl} alt={user.name} className="h-full w-full rounded-full" />
            ) : (
              <span className="text-2xl">{user.name.charAt(0)}</span>
            )}
          </div>
        </Avatar>
        <CardTitle>{user.name}</CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 border rounded-lg">
            <p className="text-2xl font-bold">{user.pollsCreated}</p>
            <p className="text-sm text-muted-foreground">Polls Created</p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="text-2xl font-bold">{user.pollsVoted}</p>
            <p className="text-sm text-muted-foreground">Polls Voted</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push('/polls/my-polls')}>My Polls</Button>
        <Button variant="destructive" onClick={handleLogout}>Logout</Button>
      </CardFooter>
    </Card>
  );
}