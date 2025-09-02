'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock authentication state - would come from auth context in real app
const isAuthenticated = false;

export function Navbar() {
  const pathname = usePathname();
  
  return (
    <header className="border-b bg-background sticky top-0 z-10">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">PollApp</Link>
          <nav className="hidden md:flex gap-6">
            <Link 
              href="/polls" 
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/polls' ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              Explore Polls
            </Link>
            {isAuthenticated && (
              <Link 
                href="/polls/create" 
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/polls/create' ? 'text-foreground' : 'text-muted-foreground'}`}
              >
                Create Poll
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <div className="flex h-full w-full items-center justify-center bg-muted rounded-full">
                      <span className="text-xs">JD</span>
                    </div>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/auth/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/polls/my-polls">My Polls</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/auth/login">Logout</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}