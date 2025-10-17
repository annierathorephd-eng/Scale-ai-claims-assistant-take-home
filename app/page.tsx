"use client"

import { Suspense } from "react"
import { ClaimsDashboard } from "@/components/claims-dashboard"

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      }
    >
      <ClaimsDashboard />
    </Suspense>
  )
}
