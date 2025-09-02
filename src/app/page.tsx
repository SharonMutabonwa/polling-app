import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-12 text-center">
      <main className="flex flex-col items-center gap-8 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Welcome to PollApp</h1>
        <p className="text-xl text-muted-foreground">
          Create, share, and vote on polls with a modern, easy-to-use interface
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-md">
          <Button asChild size="lg" className="h-12">
            <Link href="/polls">Explore Polls</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12">
            <Link href="/auth/login">Get Started</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
          <div className="flex flex-col items-center gap-2">
            <div className="p-4 rounded-full bg-primary/10">
              <Image
                src="/file.svg"
                alt="Create icon"
                width={24}
                height={24}
                className="h-8 w-8"
              />
            </div>
            <h2 className="text-xl font-semibold">Create Polls</h2>
            <p className="text-muted-foreground text-center">Easily create custom polls with multiple options</p>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="p-4 rounded-full bg-primary/10">
              <Image
                src="/globe.svg"
                alt="Share icon"
                width={24}
                height={24}
                className="h-8 w-8"
              />
            </div>
            <h2 className="text-xl font-semibold">Share Polls</h2>
            <p className="text-muted-foreground text-center">Share your polls with friends and the community</p>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="p-4 rounded-full bg-primary/10">
              <Image
                src="/window.svg"
                alt="Results icon"
                width={24}
                height={24}
                className="h-8 w-8"
              />
            </div>
            <h2 className="text-xl font-semibold">View Results</h2>
            <p className="text-muted-foreground text-center">See real-time results with beautiful visualizations</p>
         </div>
         </div>
       </main>
     </div>
  );
}
