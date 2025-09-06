import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
      <h1 className="text-5xl font-bold mb-4">Welcome to PollApp</h1>
      <p className="text-xl text-gray-600 mb-8">
        Create, share, and vote on polls instantly.
      </p>
      <div className="space-x-4">
        <Link href="/polls" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Explore Polls
        </Link>
        <Link href="/auth/login" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
          Login
        </Link>
      </div>
    </div>
  );
}
