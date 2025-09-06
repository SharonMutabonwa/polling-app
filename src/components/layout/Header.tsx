"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between">
        <Link href="/" className="text-xl font-bold">
          Polling App
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/polls" className="hover:underline">
            Polls
          </Link>
          {user ? (
            <>
              <span>{user.email}</span>
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="hover:underline">
                Login
              </Link>
              <Link href="/auth/register" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
