"use client"

import { ClaimDetailView } from "@/components/claim-detail-view"
import { useSearchParams } from "next/navigation"

export default function ClaimPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const from = searchParams.get("from") as "agent" | "adjuster" | null

  return <ClaimDetailView claimId={params.id} returnTo={from} />
}
