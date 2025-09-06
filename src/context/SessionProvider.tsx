"use client"

import { SessionProvider } from "next-auth/react"
import { AuthProvider } from "./AuthContext"

export default function Provider({
  children,
  session,
}: {
  children: React.ReactNode
  session?: any
}) {
  return (
    <SessionProvider session={session}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </SessionProvider>
  )
}
