"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Filter, X, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { ClaimsAILogo } from "./claims-ai-logo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { mockClaims, type Claim } from "@/lib/mock-claims-data"

function mapClaimToDashboard(claim: Claim) {
  // Use the source directly from the claim
  const source = claim.source

  let dashboardStatus: string
  if (claim.status === "Approved") dashboardStatus = "approved"
  else if (claim.status === "Pending Additional Info") dashboardStatus = "pending-info"
  // Check if claim has been reviewed by agent (agent-assessed source)
  else if (source === "agent-assessed") dashboardStatus = "ai-reviewed"
  else dashboardStatus = "needs-review"

  return {
    id: claim.id,
    policyId: claim.policyNumber,
    policyHolder: claim.policyholder,
    vehicle: claim.vehicle,
    dateSubmitted: claim.dateSubmitted.split("T")[0] || claim.dateSubmitted,
    lastUpdated: claim.lastUpdated.split("T")[0] || claim.lastUpdated,
    status: dashboardStatus,
    confidence: claim.confidenceScore / 100,
    estimatedCost: claim.estimatedCost,
    damageType: claim.aiAnalysis.damageAssessment.substring(0, 50) + "...",
    priority: claim.confidenceScore < 50 ? "high" : claim.confidenceScore < 70 ? "medium" : "low",
    assignedTo: claim.confidenceScore < 90 ? "agent" : "adjuster",
    source,
  }
}

export function ClaimsDashboard() {
  const searchParams = useSearchParams()
  const viewParam = searchParams.get("view")

  const [roleView, setRoleView] = useState<"agent" | "adjuster" | "policyholder">(() => {
    if (viewParam === "policyholder" || viewParam === "agent" || viewParam === "adjuster") {
      return viewParam
    }
    return "adjuster"
  })
  const [expandedClaims, setExpandedClaims] = useState<Set<string>>(new Set())
  const [claims, setClaims] = useState<ReturnType<typeof mapClaimToDashboard>[]>([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const [statusFilters, setStatusFilters] = useState<string[]>([])
  const [sourceFilters, setSourceFilters] = useState<string[]>([])
  const [claimIdSearch, setClaimIdSearch] = useState("")
  const [policyholderSearch, setPolicyholderSearch] = useState("")
  const [policyIdFilter, setPolicyIdFilter] = useState("")
  const [createdFromDate, setCreatedFromDate] = useState("")
  const [createdToDate, setCreatedToDate] = useState("")
  const [updatedFromDate, setUpdatedFromDate] = useState("")
  const [updatedToDate, setUpdatedToDate] = useState("")
  const [minCost, setMinCost] = useState("")
  const [maxCost, setMaxCost] = useState("")

  useEffect(() => {
    const loadClaims = () => {
      const storedClaims = localStorage.getItem("mockClaims")
      let allClaims = [...mockClaims]

      if (storedClaims) {
        try {
          const parsedClaims = JSON.parse(storedClaims)
          const claimIds = new Set(parsedClaims.map((c: Claim) => c.id))
          const uniqueMockClaims = allClaims.filter((c) => !claimIds.has(c.id))
          allClaims = [...parsedClaims, ...uniqueMockClaims]
        } catch (e) {
          console.error("Error parsing stored claims:", e)
        }
      }

      const mappedClaims = allClaims.map(mapClaimToDashboard)
      setClaims(mappedClaims)
    }

    loadClaims()

    // Listen for custom refresh event
    const handleRefresh = () => {
      loadClaims()
    }

    window.addEventListener("refreshDashboard", handleRefresh)

    return () => {
      window.removeEventListener("refreshDashboard", handleRefresh)
    }
  }, [viewParam, refreshTrigger])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setRefreshTrigger((prev) => prev + 1)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  useEffect(() => {
    if (viewParam === "policyholder" || viewParam === "agent" || viewParam === "adjuster") {
      setRoleView(viewParam)
    }
  }, [viewParam])

  useEffect(() => {
    const savedView = localStorage.getItem("dashboardView")
    if (savedView === "agent" || savedView === "adjuster") {
      setRoleView(savedView)
      localStorage.removeItem("dashboardView")
      setRefreshTrigger((prev) => prev + 1)
    }
  }, [])

  const toggleFilter = (filterArray: string[], setFilter: (val: string[]) => void, value: string) => {
    if (filterArray.includes(value)) {
      setFilter(filterArray.filter((f) => f !== value))
    } else {
      setFilter([...filterArray, value])
    }
  }

  const clearAllFilters = () => {
    setStatusFilters([])
    setSourceFilters([])
    setClaimIdSearch("")
    setPolicyholderSearch("")
    setPolicyIdFilter("")
    setCreatedFromDate("")
    setCreatedToDate("")
    setUpdatedFromDate("")
    setUpdatedToDate("")
    setMinCost("")
    setMaxCost("")
  }

  const hasActiveFilters =
    statusFilters.length > 0 ||
    (roleView !== "agent" && sourceFilters.length > 0) ||
    claimIdSearch !== "" ||
    policyholderSearch !== "" ||
    policyIdFilter !== "" ||
    createdFromDate !== "" ||
    createdToDate !== "" ||
    updatedFromDate !== "" ||
    updatedToDate !== "" ||
    minCost !== "" ||
    maxCost !== ""

  const activeAdvancedFiltersCount =
    (claimIdSearch ? 1 : 0) +
    (policyholderSearch ? 1 : 0) +
    (policyIdFilter ? 1 : 0) +
    (createdFromDate || createdToDate ? 1 : 0) +
    (updatedFromDate || updatedToDate ? 1 : 0) +
    (minCost || maxCost ? 1 : 0)

  const toggleClaimExpansion = (claimId: string) => {
    const newExpanded = new Set(expandedClaims)
    if (newExpanded.has(claimId)) {
      newExpanded.delete(claimId)
    } else {
      newExpanded.add(claimId)
    }
    setExpandedClaims(newExpanded)
  }

  const getStatusBadge = (status: string, confidence: number) => {
    if (status === "approved") {
      return <Badge className="bg-success/20 text-success border-success/30">Approved</Badge>
    }
    if (status === "needs-review") {
      return <Badge className="bg-warning/20 text-warning border-warning/30">Needs Review</Badge>
    }
    if (status === "pending-info") {
      return <Badge className="bg-info/20 text-info border-info/30">Pending Additional Info</Badge>
    }
    if (status === "ai-reviewed") {
      if (roleView === "agent") {
        return <Badge className="bg-info/20 text-info border-info/30">Sent for Approval</Badge>
      }
      return <Badge className="bg-warning/20 text-warning border-warning/30">Needs Review</Badge>
    }
    return <Badge variant="secondary">{status}</Badge>
  }

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.85) {
      return (
        <Badge variant="outline" className="text-success border-success/50">
          High: {(confidence * 100).toFixed(0)}%
        </Badge>
      )
    }
    if (confidence >= 0.7) {
      return (
        <Badge variant="outline" className="text-warning border-warning/50">
          Medium: {(confidence * 100).toFixed(0)}%
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="text-destructive border-destructive/50">
        Low: {(confidence * 100).toFixed(0)}%
      </Badge>
    )
  }

  if (roleView === "policyholder") {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <ClaimsAILogo />
              <Tabs value={roleView} onValueChange={(v) => setRoleView(v as "agent" | "adjuster" | "policyholder")}>
                <TabsList className="bg-secondary">
                  <TabsTrigger value="policyholder">Policyholder View</TabsTrigger>
                  <TabsTrigger value="agent">Agent View</TabsTrigger>
                  <TabsTrigger value="adjuster">Adjuster View</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-12 max-w-2xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-semibold mb-4 text-balance">Manage Your Claims</h1>
            <p className="text-muted-foreground text-lg">Submit a new claim and track its progress</p>
          </div>

          <div className="flex justify-center">
            <Card className="p-8 bg-card border-border hover:border-accent/50 transition-colors w-full max-w-md">
              <div className="mb-6 text-center">
                <div className="w-12 h-12 bg-gradient-blob rounded-lg mb-4 mx-auto" />
                <h2 className="text-2xl font-semibold mb-2">Submit New Claim</h2>
                <p className="text-muted-foreground">
                  Upload photos and details of your vehicle damage. Our AI will analyze and provide an initial
                  assessment.
                </p>
              </div>
              <Link href="/submit-claim">
                <Button className="w-full bg-gradient-blob text-white border-2 border-white/40 ring-2 ring-accent/30 hover:ring-accent/50 transition-all">
                  Start New Claim →
                </Button>
              </Link>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  const filteredClaims = claims.filter((claim) => {
    const matchesClaimId = claimIdSearch === "" || claim.id.toLowerCase().includes(claimIdSearch.toLowerCase())
    const matchesPolicyholder =
      policyholderSearch === "" || claim.policyHolder.toLowerCase().includes(policyholderSearch.toLowerCase())

    const matchesRole =
      roleView === "agent"
        ? claim.confidence < 0.9 && (claim.source === "ai-assessed" || claim.source === "agent-assessed")
        : claim.confidence >= 0.9 || claim.source === "agent-assessed"

    let matchesStatus = true
    if (statusFilters.length > 0) {
      matchesStatus = statusFilters.includes(claim.status)
    }

    let matchesSource = true
    if (sourceFilters.length > 0) {
      matchesSource = sourceFilters.includes(claim.source)
    }

    const matchesPolicyId = policyIdFilter === "" || claim.policyId.toLowerCase().includes(policyIdFilter.toLowerCase())

    let matchesCreatedDate = true
    if (createdFromDate && claim.dateSubmitted < createdFromDate) matchesCreatedDate = false
    if (createdToDate && claim.dateSubmitted > createdToDate) matchesCreatedDate = false

    let matchesUpdatedDate = true
    if (updatedFromDate && claim.lastUpdated < updatedFromDate) matchesUpdatedDate = false
    if (updatedToDate && claim.lastUpdated > updatedToDate) matchesUpdatedDate = false

    let matchesCost = true
    if (minCost && claim.estimatedCost < Number.parseFloat(minCost)) matchesCost = false
    if (maxCost && claim.estimatedCost > Number.parseFloat(maxCost)) matchesCost = false

    return (
      matchesClaimId &&
      matchesPolicyholder &&
      matchesRole &&
      matchesStatus &&
      matchesSource &&
      matchesPolicyId &&
      matchesCreatedDate &&
      matchesUpdatedDate &&
      matchesCost
    )
  })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <ClaimsAILogo />
            <Tabs value={roleView} onValueChange={(v) => setRoleView(v as "agent" | "adjuster" | "policyholder")}>
              <TabsList className="bg-secondary">
                <TabsTrigger value="policyholder">Policyholder View</TabsTrigger>
                <TabsTrigger value="agent">Agent View</TabsTrigger>
                <TabsTrigger value="adjuster">Adjuster View</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Card className="bg-card border-border">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold mb-1">
                  {roleView === "adjuster" ? "Adjuster Dashboard" : "Agent Dashboard"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {roleView === "adjuster"
                    ? "Review AI or agent-analyzed claims and approve estimates"
                    : "Review low-confidence claims and provide manual assessment"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Status
                    {statusFilters.length > 0 && (
                      <Badge variant="secondary" className="ml-2 px-1.5 py-0 text-xs">
                        {statusFilters.length}
                      </Badge>
                    )}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={statusFilters.includes("needs-review")}
                    onCheckedChange={() => toggleFilter(statusFilters, setStatusFilters, "needs-review")}
                  >
                    Needs Review
                  </DropdownMenuCheckboxItem>
                  {roleView === "agent" ? (
                    <DropdownMenuCheckboxItem
                      checked={statusFilters.includes("ai-reviewed")}
                      onCheckedChange={() => toggleFilter(statusFilters, setStatusFilters, "ai-reviewed")}
                    >
                      Sent for Approval
                    </DropdownMenuCheckboxItem>
                  ) : (
                    <DropdownMenuCheckboxItem
                      checked={statusFilters.includes("approved")}
                      onCheckedChange={() => toggleFilter(statusFilters, setStatusFilters, "approved")}
                    >
                      Approved
                    </DropdownMenuCheckboxItem>
                  )}
                  <DropdownMenuCheckboxItem
                    checked={statusFilters.includes("pending-info")}
                    onCheckedChange={() => toggleFilter(statusFilters, setStatusFilters, "pending-info")}
                  >
                    Pending Additional Info
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {roleView !== "agent" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Source
                      {sourceFilters.length > 0 && (
                        <Badge variant="secondary" className="ml-2 px-1.5 py-0 text-xs">
                          {sourceFilters.length}
                        </Badge>
                      )}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuLabel>Filter by Source</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={sourceFilters.includes("ai-assessed")}
                      onCheckedChange={() => toggleFilter(sourceFilters, setSourceFilters, "ai-assessed")}
                    >
                      AI-Assessed
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={sourceFilters.includes("agent-assessed")}
                      onCheckedChange={() => toggleFilter(sourceFilters, setSourceFilters, "agent-assessed")}
                    >
                      Agent-Assessed
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Advanced Filters
                    {activeAdvancedFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-2 px-1.5 py-0 text-xs">
                        {activeAdvancedFiltersCount}
                      </Badge>
                    )}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Advanced Filters</DropdownMenuLabel>
                  <div className="px-2 py-2 space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Claim ID</label>
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <Input
                          placeholder="CLM-2025-XXX"
                          value={claimIdSearch}
                          onChange={(e) => setClaimIdSearch(e.target.value)}
                          className="h-8 text-sm pl-8"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Policyholder Name</label>
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <Input
                          placeholder="Search by name..."
                          value={policyholderSearch}
                          onChange={(e) => setPolicyholderSearch(e.target.value)}
                          className="h-8 text-sm pl-8"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Policy ID</label>
                      <Input
                        placeholder="POL-2024-XXXX"
                        value={policyIdFilter}
                        onChange={(e) => setPolicyIdFilter(e.target.value)}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Estimate Cost Range ($)</label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={minCost}
                          onChange={(e) => setMinCost(e.target.value)}
                          className="h-8 text-sm"
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          value={maxCost}
                          onChange={(e) => setMaxCost(e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Created Date Range</label>
                      <div className="flex gap-2">
                        <Input
                          type="date"
                          value={createdFromDate}
                          onChange={(e) => setCreatedFromDate(e.target.value)}
                          className="h-8 text-sm"
                          placeholder="From"
                        />
                        <Input
                          type="date"
                          value={createdToDate}
                          onChange={(e) => setCreatedToDate(e.target.value)}
                          className="h-8 text-sm"
                          placeholder="To"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Last Updated Range</label>
                      <div className="flex gap-2">
                        <Input
                          type="date"
                          value={updatedFromDate}
                          onChange={(e) => setUpdatedFromDate(e.target.value)}
                          className="h-8 text-sm"
                          placeholder="From"
                        />
                        <Input
                          type="date"
                          value={updatedToDate}
                          onChange={(e) => setUpdatedToDate(e.target.value)}
                          className="h-8 text-sm"
                          placeholder="To"
                        />
                      </div>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              )}
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2">
                {claimIdSearch && (
                  <Badge variant="secondary" className="gap-1">
                    Claim ID: {claimIdSearch}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setClaimIdSearch("")} />
                  </Badge>
                )}
                {policyholderSearch && (
                  <Badge variant="secondary" className="gap-1">
                    Policyholder: {policyholderSearch}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setPolicyholderSearch("")} />
                  </Badge>
                )}
                {policyIdFilter && (
                  <Badge variant="secondary" className="gap-1">
                    Policy: {policyIdFilter}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => {
                        setPolicyIdFilter("")
                      }}
                    />
                  </Badge>
                )}
                {(minCost || maxCost) && (
                  <Badge variant="secondary" className="gap-1">
                    Cost: ${minCost || "0"} - ${maxCost || "∞"}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => {
                        setMinCost("")
                        setMaxCost("")
                      }}
                    />
                  </Badge>
                )}
                {(createdFromDate || createdToDate) && (
                  <Badge variant="secondary" className="gap-1">
                    Created: {createdFromDate || "..."} to {createdToDate || "..."}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => {
                        setCreatedFromDate("")
                        setCreatedToDate("")
                      }}
                    />
                  </Badge>
                )}
                {(updatedFromDate || updatedToDate) && (
                  <Badge variant="secondary" className="gap-1">
                    Updated: {updatedFromDate || "..."} to {updatedToDate || "..."}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => {
                        setUpdatedFromDate("")
                        setUpdatedToDate("")
                      }}
                    />
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="divide-y divide-border">
            {filteredClaims.map((claim) => {
              const isExpanded = expandedClaims.has(claim.id)
              return (
                <div key={claim.id} className="p-6 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold">{claim.id}</h3>
                        {getStatusBadge(claim.status, claim.confidence)}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <p className="text-muted-foreground mb-1">Policyholder</p>
                          <p className="font-medium">{claim.policyHolder}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Estimated Cost</p>
                          <p className="font-semibold text-lg">${claim.estimatedCost.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Date Submitted</p>
                          <p className="font-medium">{claim.dateSubmitted}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">Last Updated</p>
                          <p className="font-medium">{claim.lastUpdated}</p>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground mb-1">Policy ID</p>
                              <p className="font-medium">{claim.policyId}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground mb-1">Vehicle</p>
                              <p className="font-medium">{claim.vehicle}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground mb-1">Damage Type</p>
                              <p className="font-medium">{claim.damageType}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground mb-1">Confidence Score</p>
                              {getConfidenceBadge(claim.confidence)}
                            </div>
                            {roleView !== "agent" && (
                              <div>
                                <p className="text-muted-foreground mb-1">Source</p>
                                <p className="font-medium">
                                  {claim.source === "ai-assessed"
                                    ? "AI-Assessed"
                                    : claim.source === "agent-assessed"
                                      ? "Agent-Assessed"
                                      : claim.source}
                                </p>
                              </div>
                            )}
                            <div>
                              <p className="text-muted-foreground mb-1">Assigned To</p>
                              <p className="font-medium capitalize">{claim.assignedTo}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Link href={`/claim/${claim.id}?from=${roleView}`}>
                        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                          View →
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleClaimExpansion(claim.id)}
                        className="text-muted-foreground"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-1" />
                            Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 mr-1" />
                            More
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </main>
    </div>
  )
}
