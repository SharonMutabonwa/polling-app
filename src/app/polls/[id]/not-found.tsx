import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileQuestion } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileQuestion className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Poll Not Found</CardTitle>
          </div>
          <CardDescription>
            The poll you're looking for doesn't exist or may have been deleted.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This could happen if:
          </p>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>The poll ID is incorrect</li>
            <li>The poll has been deleted by its creator</li>
            <li>You don't have permission to view this poll</li>
          </ul>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/polls">Browse Polls</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/polls/create">Create New Poll</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}