"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Edit3,
  MessageSquare,
  Clock,
  DollarSign,
  ImageIcon,
  Sparkles,
  FileText,
  History,
  Send,
  User,
  AlertTriangle,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { getClaimById, type Claim as SharedClaim } from "@/lib/mock-claims-data"
import { AIFeedbackDialog } from "@/components/ai-feedback-dialog"

// Mock claims data - this should be imported from a shared location or fetched
// For this example, we'll assume it's available globally or imported.
// Replace with actual import if 'mockClaims' is defined elsewhere.
const mockClaims: SharedClaim[] = [
  // Sample mock claims - replace with your actual mock data if available
  {
    id: "CLM-2025-001",
    policyholder: "Sarah Johnson",
    policyNumber: "POL-2024-8765",
    vehicle: "2022 Toyota Camry",
    vin: "4T1B11HK5NU123456",
    dateSubmitted: "2025-10-14T09:30:00",
    lastUpdated: "2025-10-15T10:00:00",
    status: "Needs Review",
    confidenceScore: 65,
    estimatedCost: 3450,
    damageType: "Front bumper, hood",
    assignedTo: "agent",
    source: "ai-assessed",
    photos: [
      { url: "/damaged-car-front-bumper.jpg" },
      { url: "/car-hood-damage-close-up.jpg" },
      { url: "/car-damage-side-angle.jpg" },
    ],
    email: "sarah.johnson@email.com",
    phone: "(555) 234-5678",
    incidentDate: "2025-10-12",
    incidentLocation: "Interstate 95, Exit 42, Baltimore, MD",
    incidentDescription:
      "I was driving southbound on I-95 during heavy rain when the vehicle in front of me suddenly braked. I applied my brakes but was unable to stop in time due to wet road conditions, resulting in a low-speed collision. The impact damaged my front bumper and hood. No injuries occurred. Police report filed at the scene (Report #MD-2025-10-12-4567).",
    aiAnalysis: {
      damageAssessment: "Front bumper, hood, headlight (right)",
      riskFactors: ["Image quality issues", "Potential hidden damage"],
      lowConfidenceReasons: ["Ambiguous damage patterns", "Image quality concerns"],
      recommendation:
        "Agent should carefully review all images for hidden damage. Consider requesting additional photos of undercarriage and internal components. Verify bumper replacement vs repair feasibility.",
    },
    timeline: [
      { timestamp: "2025-10-14T09:30:00", event: "Claim submitted", actor: "Sarah Johnson", type: "submission" },
      {
        timestamp: "2025-10-14T09:31:00",
        event: "Photos validated - Quality check passed",
        actor: "System",
        type: "validation",
      },
      {
        timestamp: "2025-10-14T09:32:00",
        event: "AI analysis completed - Confidence score 65% (below 90% threshold)",
        actor: "AI System",
        type: "analysis",
      },
      {
        timestamp: "2025-10-14T09:32:00",
        event: "Routed to agent for manual review (Low confidence: 65%)",
        actor: "System",
        type: "routing",
      },
    ],
  },
  // Add more mock claims as needed
]

interface ClaimDetailViewProps {
  claimId: string
  returnTo?: "agent" | "adjuster" | null
}

interface Note {
  id: string
  text: string
  author: string
  timestamp: string
}

interface TimelineEvent {
  timestamp: string
  event: string
  user: string
  type: string
}

interface ClaimData {
  id: string
  policyHolder: string
  policyNumber: string
  vehicle: string
  vin: string
  dateSubmitted: string
  lastUpdated: string
  status: string
  confidence: number
  estimatedCost: number
  damageType: string
  assignedTo: string
  source: string
  photos: string[]
  contactEmail: string
  contactPhone: string
  incidentDate: string
  incidentLocation: string
  incidentDescription: string
  aiAnalysis: {
    detectedDamage: Array<{ part: string; severity: string; confidence: number; cost: number }>
    totalEstimate: number
    reasoning: string
    dataQuality: string
    recommendations: string
  }
  timeline: TimelineEvent[]
  notes: Note[]
}

// Mock claim data - Fallback if shared data is not found
const initialClaimData: ClaimData = {
  id: "CLM-2025-001",
  policyHolder: "Sarah Johnson",
  policyNumber: "POL-2024-8765",
  vehicle: "2022 Toyota Camry",
  vin: "4T1B11HK5NU123456",
  dateSubmitted: "2025-10-14T09:30:00",
  lastUpdated: "2025-10-15T10:00:00",
  status: "needs-review",
  confidence: 0.65,
  estimatedCost: 3450,
  damageType: "Front bumper, hood",
  assignedTo: "agent",
  source: "ai-assessed",
  photos: ["/damaged-car-front-bumper.jpg", "/car-hood-damage-close-up.jpg", "/car-damage-side-angle.jpg"],
  contactEmail: "sarah.johnson@email.com",
  contactPhone: "(555) 234-5678",
  incidentDate: "2025-10-12",
  incidentLocation: "Interstate 95, Exit 42, Baltimore, MD",
  incidentDescription:
    "I was driving southbound on I-95 during heavy rain when the vehicle in front of me suddenly braked. I applied my brakes but was unable to stop in time due to wet road conditions, resulting in a low-speed collision. The impact damaged my front bumper and hood. No injuries occurred. Police report filed at the scene (Report #MD-2025-10-12-4567).",
  aiAnalysis: {
    detectedDamage: [
      { part: "Front Bumper", severity: "Moderate", confidence: 0.68, cost: 1200 },
      { part: "Hood", severity: "Minor", confidence: 0.62, cost: 1800 },
      { part: "Headlight (Right)", severity: "Minor", confidence: 0.65, cost: 450 },
    ],
    totalEstimate: 3450,
    reasoning:
      "AI analysis detected front-end damage but confidence is below threshold due to image quality concerns and ambiguous damage patterns. Manual agent review required to verify damage extent and cost accuracy.",
    dataQuality: "Moderate - Some angles lack sufficient lighting, potential hidden damage not visible",
    recommendations:
      "Agent should carefully review all images for hidden damage. Consider requesting additional photos of undercarriage and internal components. Verify bumper replacement vs repair feasibility.",
  },
  timeline: [
    { timestamp: "2025-10-14T09:30:00", event: "Claim submitted", user: "Sarah Johnson", type: "submission" },
    {
      timestamp: "2025-10-14T09:31:00",
      event: "Photos validated - Quality check passed",
      user: "System",
      type: "validation",
    },
    {
      timestamp: "2025-10-14T09:32:00",
      event: "AI analysis completed - Confidence score 65% (below 90% threshold)",
      user: "AI System",
      type: "analysis",
    },
    {
      timestamp: "2025-10-14T09:32:00",
      event: "Routed to agent for manual review (Low confidence: 65%)",
      user: "System",
      type: "routing",
    },
  ],
  notes: [],
}

export function ClaimDetailView({ claimId, returnTo }: ClaimDetailViewProps) {
  const router = useRouter()
  const [claimData, setClaimData] = useState<ClaimData>(() => {
    const sharedClaim = getClaimById(claimId)
    if (sharedClaim) {
      return convertSharedClaimToClaimData(sharedClaim, returnTo)
    }
    return initialClaimData
  })

  const [activeTab, setActiveTab] = useState("analysis")
  const [isEditing, setIsEditing] = useState(false)
  const [editedCosts, setEditedCosts] = useState(claimData.aiAnalysis.detectedDamage)
  const [noteText, setNoteText] = useState("")
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
  const [isSubmissionDetailsOpen, setIsSubmissionDetailsOpen] = useState(true)

  const isAgentView = returnTo === "agent"
  const isLowConfidence = claimData.confidence < 0.9
  const isAgentAssessed = claimData.source === "agent-assessed" && !isAgentView

  useEffect(() => {
    const sharedClaim = getClaimById(claimId)
    if (sharedClaim) {
      const convertedClaim = convertSharedClaimToClaimData(sharedClaim, returnTo)

      const savedClaim = localStorage.getItem(`claim-${claimId}`)
      if (savedClaim) {
        const parsedClaim = JSON.parse(savedClaim)
        setClaimData({ ...convertedClaim, ...parsedClaim })
        setEditedCosts(parsedClaim.aiAnalysis?.detectedDamage || convertedClaim.aiAnalysis.detectedDamage)
      } else {
        setClaimData(convertedClaim)
        setEditedCosts(convertedClaim.aiAnalysis.detectedDamage)
      }
    }
  }, [claimId, returnTo])

  useEffect(() => {
    if (returnTo) {
      localStorage.setItem("dashboardView", returnTo)
    }
  }, [returnTo])

  const saveClaimData = (updatedClaim: ClaimData) => {
    localStorage.setItem(`claim-${claimId}`, JSON.stringify(updatedClaim))
    setClaimData(updatedClaim)
  }

  const addTimelineEvent = (event: string, type: string) => {
    const newEvent: TimelineEvent = {
      timestamp: new Date().toISOString(),
      event,
      user: isAgentView ? "Agent" : "Adjuster",
      type,
    }
    return [...claimData.timeline, newEvent]
  }

  const handleSaveNote = () => {
    if (!noteText.trim()) return

    const newNote: Note = {
      id: `note-${Date.now()}`,
      text: noteText,
      author: isAgentView ? "Agent" : "Adjuster",
      timestamp: new Date().toISOString(),
    }

    const updatedClaim = {
      ...claimData,
      notes: [...claimData.notes, newNote],
      lastUpdated: new Date().toISOString(),
      timeline: addTimelineEvent(
        `Note added: "${noteText.substring(0, 50)}${noteText.length > 50 ? "..." : ""}"`,
        "note",
      ),
    }

    saveClaimData(updatedClaim)
    setNoteText("")
  }

  const handleApprove = () => {
    console.log("[v0] handleApprove called, current status:", claimData.status)
    console.log("[v0] isAgentView:", isAgentView)

    const updatedClaim = {
      ...claimData,
      status: isAgentView ? "ai-reviewed" : "approved",
      source: isAgentView ? "agent-assessed" : claimData.source,
      assignedTo: isAgentView ? "adjuster" : claimData.assignedTo,
      lastUpdated: new Date().toISOString(),
      timeline: addTimelineEvent(
        isAgentView ? "Sent for approval - Routed to adjuster for final review" : "Claim approved",
        "approval",
      ),
    }
    saveClaimData(updatedClaim)

    console.log("[v0] Updating shared claim status to:", isAgentView ? "Needs Review" : "Approved")
    console.log("[v0] Setting source to:", isAgentView ? "agent-assessed" : undefined)

    updateSharedClaimStatus(
      claimData.id,
      isAgentView ? "Needs Review" : "Approved",
      isAgentView ? "agent-assessed" : undefined,
    )

    console.log("[v0] Dispatching refreshDashboard event")
    window.dispatchEvent(new Event("refreshDashboard"))

    setTimeout(() => {
      if (returnTo) {
        localStorage.setItem("dashboardView", returnTo)
      }
      console.log("[v0] Navigating back to dashboard")
      router.push("/")
    }, 500)
  }

  const handleRequestInfo = () => {
    setEmailSubject(`Additional Information Required - Claim ${claimId}`)
    setEmailBody(
      `Dear ${claimData.policyHolder},\n\nWe are reviewing your claim ${claimId} and require additional information to proceed with the assessment.\n\nPlease provide:\n\nThank you for your cooperation.\n\nBest regards,\nClaims AI Team`,
    )
    setShowEmailDialog(true)
  }

  const handleSendEmail = () => {
    console.log("[v0] handleSendEmail called")

    const emailDetails = `Subject: ${emailSubject}\n\nMessage:\n${emailBody}`

    const updatedClaim = {
      ...claimData,
      status: "pending-info",
      lastUpdated: new Date().toISOString(),
      timeline: addTimelineEvent(`Additional information requested via email\n\n${emailDetails}`, "email"),
    }
    saveClaimData(updatedClaim)

    console.log("[v0] Updating shared claim status to: Pending Additional Info")
    updateSharedClaimStatus(claimData.id, "Pending Additional Info")

    console.log("[v0] Dispatching refreshDashboard event")
    window.dispatchEvent(new Event("refreshDashboard"))

    setShowEmailDialog(false)
    setTimeout(() => {
      if (returnTo) {
        localStorage.setItem("dashboardView", returnTo)
      }
      console.log("[v0] Navigating back to dashboard")
      router.push("/")
    }, 500)
  }

  const handleSaveEdits = () => {
    setIsEditing(false)
    const oldCost = claimData.estimatedCost
    const updatedClaim = {
      ...claimData,
      aiAnalysis: {
        ...claimData.aiAnalysis,
        detectedDamage: editedCosts,
        totalEstimate: totalEditedCost,
      },
      estimatedCost: totalEditedCost,
      lastUpdated: new Date().toISOString(),
      timeline: addTimelineEvent(
        `Cost estimate updated from $${oldCost.toLocaleString()} to $${totalEditedCost.toLocaleString()}`,
        "edit",
      ),
    }
    saveClaimData(updatedClaim)
  }

  const totalEditedCost = editedCosts.reduce((sum, item) => sum + item.cost, 0)

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "needs-review":
        return { label: "Needs Review", className: "bg-warning/20 text-warning border-warning/30" }
      case "ai-reviewed":
        return {
          label: isAgentView ? "Sent for Approval" : "Needs Review",
          className: "bg-info/20 text-info border-info/30",
        }
      case "approved":
        return { label: "Approved", className: "bg-success/20 text-success border-success/30" }
      case "pending-info":
        return { label: "Pending Additional Info", className: "bg-info/20 text-info border-info/30" }
      case "rejected":
        return { label: "Rejected", className: "bg-destructive/20 text-destructive border-destructive/30" }
      default:
        return { label: "Needs Review", className: "bg-secondary text-secondary-foreground border-border" }
    }
  }

  const statusConfig = getStatusConfig(claimData.status)

  const getSubmissionQuality = () => {
    const confidence = claimData.confidence
    const photoCount = claimData.photos.length

    // Calculate quality score based on confidence and photo count
    let qualityScore = confidence * 100
    let qualityRating: "Excellent" | "Good" | "Fair" | "Poor"
    let qualityColor: string
    const issues: string[] = []

    // Adjust based on photo count
    if (photoCount < 3) {
      qualityScore -= 15
      issues.push("Insufficient photo coverage - minimum 3 photos recommended")
    }

    // Determine rating
    if (qualityScore >= 90) {
      qualityRating = "Excellent"
      qualityColor = "success"
    } else if (qualityScore >= 75) {
      qualityRating = "Good"
      qualityColor = "info"
      if (confidence < 0.85) issues.push("Some angles may lack optimal lighting or clarity")
    } else if (qualityScore >= 60) {
      qualityRating = "Fair"
      qualityColor = "warning"
      issues.push("Image quality concerns detected - some photos lack sufficient detail")
      if (confidence < 0.75) issues.push("Potential hidden damage not visible in current photos")
    } else {
      qualityRating = "Poor"
      qualityColor = "destructive"
      issues.push("Significant image quality issues affecting AI analysis")
      issues.push("Multiple angles missing or unclear")
      issues.push("Additional documentation required for accurate assessment")
    }

    return {
      rating: qualityRating,
      score: Math.round(qualityScore),
      color: qualityColor,
      issues,
      photoQuality: confidence >= 0.85 ? "Good" : confidence >= 0.7 ? "Fair" : "Poor",
      anglesCoverage: photoCount >= 4 ? "Complete" : photoCount >= 3 ? "Adequate" : "Incomplete",
      documentationComplete: photoCount >= 3 && confidence >= 0.7,
    }
  }

  const submissionQuality = getSubmissionQuality()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {returnTo === "agent" ? "Agent" : "Adjuster"} Dashboard
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">{claimData.id}</h1>
              <p className="text-base text-muted-foreground">{claimData.policyHolder}</p>
            </div>
            <Badge className={`${statusConfig.className} text-base px-4 py-2`}>{statusConfig.label}</Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-card border-border">
              <Collapsible open={isSubmissionDetailsOpen} onOpenChange={setIsSubmissionDetailsOpen}>
                <div className="p-6 border-b border-border">
                  <CollapsibleTrigger className="flex items-center justify-between w-full group">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-accent" />
                      <h2 className="text-lg font-semibold">Claim Submission Details</h2>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground transition-transform group-hover:text-foreground ${
                        isSubmissionDetailsOpen ? "rotate-180" : ""
                      }`}
                    />
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Policyholder</p>
                      <p className="font-medium">{claimData.policyHolder}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Policy Number</p>
                      <p className="font-medium">{claimData.policyNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Email</p>
                      <p className="font-medium">{claimData.contactEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Phone</p>
                      <p className="font-medium">{claimData.contactPhone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Vehicle</p>
                      <p className="font-medium">{claimData.vehicle}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">VIN</p>
                      <p className="font-mono text-sm">{claimData.vin}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Incident Date</p>
                      <p className="font-medium">{new Date(claimData.incidentDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Date Submitted</p>
                      <p className="font-medium">{new Date(claimData.dateSubmitted).toLocaleDateString()}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground mb-1">Incident Location</p>
                      <p className="font-medium text-foreground">{claimData.incidentLocation}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground mb-2">Incident Description</p>
                      <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                        <p className="text-sm leading-relaxed text-foreground">{claimData.incidentDescription}</p>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </Card>

            {/* Photos */}
            <Card className="bg-card border-border">
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-semibold">Damage Photos</h2>
                  <Badge variant="outline" className="ml-auto">
                    {claimData.photos.length} images
                  </Badge>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {claimData.photos.map((photo, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-video rounded-lg overflow-hidden border border-border group cursor-pointer"
                    >
                      <Image
                        src={photo || "/placeholder.svg"}
                        alt={`Damage photo ${idx + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-3 left-3 text-white text-sm font-medium">View Full Size</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* AI Analysis Tabs */}
            <Card className="bg-card border-border">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="p-6 border-b border-border">
                  <div className="flex items-center justify-between gap-4">
                    <TabsList className="bg-secondary">
                      <TabsTrigger value="analysis">
                        <Sparkles className="w-4 h-4 mr-2" />
                        AI Analysis
                      </TabsTrigger>
                      {isAgentAssessed && (
                        <TabsTrigger value="agent-review">
                          <User className="w-4 h-4 mr-2" />
                          Agent Review
                        </TabsTrigger>
                      )}
                      <TabsTrigger value="estimate">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Cost Estimate
                      </TabsTrigger>
                      <TabsTrigger value="timeline">
                        <History className="w-4 h-4 mr-2" />
                        Timeline
                      </TabsTrigger>
                    </TabsList>
                    <AIFeedbackDialog
                      claimId={claimData.id}
                      aiConfidence={claimData.confidence}
                      estimatedCost={claimData.estimatedCost}
                    />
                  </div>
                </div>

                <TabsContent value="analysis" className="p-6 space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-accent" />
                      Submission Quality & Validation
                    </h3>
                    <div
                      className={`bg-${submissionQuality.color}/10 rounded-lg p-6 border-2 border-${submissionQuality.color}/30`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge
                              variant="outline"
                              className={`bg-${submissionQuality.color}/20 text-${submissionQuality.color} border-${submissionQuality.color}/50 text-lg px-3 py-1`}
                            >
                              {submissionQuality.rating}
                            </Badge>
                            <span className="text-2xl font-bold text-${submissionQuality.color}">
                              {submissionQuality.score}%
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Overall submission quality score based on photo quality, coverage, and documentation
                            completeness
                          </p>
                        </div>
                      </div>

                      {/* Quality Metrics */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-background/50 rounded-lg p-3 border border-border">
                          <p className="text-xs text-muted-foreground mb-1">Photo Quality</p>
                          <p className="font-semibold">{submissionQuality.photoQuality}</p>
                        </div>
                        <div className="bg-background/50 rounded-lg p-3 border border-border">
                          <p className="text-xs text-muted-foreground mb-1">Angle Coverage</p>
                          <p className="font-semibold">{submissionQuality.anglesCoverage}</p>
                        </div>
                        <div className="bg-background/50 rounded-lg p-3 border border-border">
                          <p className="text-xs text-muted-foreground mb-1">Documentation</p>
                          <p className="font-semibold">
                            {submissionQuality.documentationComplete ? "Complete" : "Incomplete"}
                          </p>
                        </div>
                      </div>

                      {/* Flagged Issues */}
                      {submissionQuality.issues.length > 0 && (
                        <div className="space-y-2 mb-4">
                          <p className="text-sm font-medium text-muted-foreground">Flagged Issues:</p>
                          <ul className="space-y-2">
                            {submissionQuality.issues.map((issue, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <AlertCircle
                                  className={`w-4 h-4 text-${submissionQuality.color} flex-shrink-0 mt-0.5`}
                                />
                                <span>{issue}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Action Button */}
                      {submissionQuality.rating !== "Excellent" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRequestInfo}
                          className="w-full mt-2 bg-transparent"
                          disabled={claimData.status === "pending-info"}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-message-square w-4 h-4 mr-2"
                          >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                          </svg>
                          Request Additional Information
                        </Button>
                      )}
                    </div>
                  </div>

                  {isAgentView && isLowConfidence ? (
                    <>
                      {/* Alert Banner */}
                      <div className="bg-warning/10 border-2 border-warning/30 rounded-lg p-6">
                        <div className="flex items-start gap-4">
                          <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">Manual Review Required</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              This claim requires manual agent review due to AI confidence below the 90% threshold.
                              Please carefully assess all damage and verify the cost estimate before approving.
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-warning/20 text-warning border-warning/50">
                                AI Confidence: {(claimData.confidence * 100).toFixed(0)}%
                              </Badge>
                              <Badge variant="outline" className="bg-secondary">
                                Threshold: 90%
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* AI Assessment Overview */}
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-warning" />
                          AI Assessment Overview
                        </h3>
                        <div className="bg-gradient-to-br from-warning/10 to-destructive/10 rounded-lg p-6 border border-warning/20">
                          <div className="flex items-center justify-between mb-6">
                            <div>
                              <div className="text-4xl font-bold text-warning mb-2">
                                {(claimData.confidence * 100).toFixed(0)}%
                              </div>
                              <p className="text-sm text-muted-foreground">Overall Confidence Score</p>
                            </div>
                          </div>

                          <div className="space-y-3 text-sm">
                            <p className="text-muted-foreground mb-3">Confidence Breakdown:</p>
                            <div className="flex items-center gap-3">
                              <span className="text-muted-foreground w-36">Damage Detection</span>
                              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-warning"
                                  style={{ width: `${claimData.aiAnalysis.detectedDamage[0]?.confidence * 100}%` }}
                                />
                              </div>
                              <span className="font-medium w-12 text-right">
                                {(claimData.aiAnalysis.detectedDamage[0]?.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-muted-foreground w-36">Cost Estimation</span>
                              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-warning"
                                  style={{ width: `${claimData.aiAnalysis.detectedDamage[1]?.confidence * 100}%` }}
                                />
                              </div>
                              <span className="font-medium w-12 text-right">
                                {(claimData.aiAnalysis.detectedDamage[1]?.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-muted-foreground w-36">Image Analysis Quality</span>
                              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-warning"
                                  style={{ width: `${claimData.aiAnalysis.detectedDamage[2]?.confidence * 100}%` }}
                                />
                              </div>
                              <span className="font-medium w-12 text-right">
                                {(claimData.aiAnalysis.detectedDamage[2]?.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Assessment Limitations - Combined section */}
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-warning" />
                          Assessment Limitations
                        </h3>
                        <div className="space-y-3">
                          {/* Why confidence is low */}
                          <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                            <p className="text-sm font-medium text-muted-foreground mb-2">Why AI Confidence is Low:</p>
                            <p className="text-sm leading-relaxed">{claimData.aiAnalysis.reasoning}</p>
                          </div>

                          {/* Data quality issues */}
                          <div className="bg-warning/10 rounded-lg p-4 border border-warning/30">
                            <p className="text-sm font-medium text-muted-foreground mb-2">Submission Quality Issues:</p>
                            <p className="text-sm leading-relaxed">{claimData.aiAnalysis.dataQuality}</p>
                          </div>
                        </div>
                      </div>

                      {/* Detected Damage */}
                      <div>
                        <h3 className="font-semibold mb-3">AI-Detected Damage</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          The following damage was detected by AI but requires manual verification due to low confidence
                          scores.
                        </p>
                        <div className="space-y-3">
                          {claimData.aiAnalysis.detectedDamage.map((damage, idx) => (
                            <div key={idx} className="p-4 bg-secondary/50 rounded-lg border border-border">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-medium">{damage.part}</h4>
                                  <p className="text-sm text-muted-foreground">Severity: {damage.severity}</p>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={
                                    damage.confidence < 0.7
                                      ? "bg-warning/20 text-warning border-warning/50"
                                      : "bg-info/20 text-info border-info/50"
                                  }
                                >
                                  {(damage.confidence * 100).toFixed(0)}% confidence
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                                <span className="text-sm text-muted-foreground">AI Estimated Cost</span>
                                <span className="font-semibold text-lg">${damage.cost.toLocaleString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Review Recommendations */}
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-info" />
                          What You Should Review
                        </h3>
                        <div className="bg-info/10 rounded-lg p-4 border border-info/30">
                          <p className="text-sm leading-relaxed">{claimData.aiAnalysis.recommendations}</p>
                        </div>
                      </div>
                    </>
                  ) : isAgentAssessed ? (
                    <>
                      <div className="bg-info/10 border-2 border-info/30 rounded-lg p-6">
                        <div className="flex items-start gap-4">
                          <AlertCircle className="w-6 h-6 text-info flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">Original AI Assessment</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              This is the initial AI assessment that was flagged for manual review. The agent's review
                              and changes can be found in the "Agent Review" tab.
                            </p>
                            <Badge variant="outline" className="bg-info/20 text-info border-info/50">
                              AI Confidence: {(claimData.confidence * 100).toFixed(0)}%
                            </Badge>
                            <Badge variant="outline" className="bg-warning/20 text-warning border-warning/50">
                              Below 90% Threshold
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Original AI Assessment Overview */}
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-info" />
                          Initial AI Confidence Score
                        </h3>
                        <div className="bg-gradient-to-br from-info/10 to-warning/10 rounded-lg p-6 border border-info/20">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <div className="text-4xl font-bold text-warning mb-2">
                                {(claimData.confidence * 100).toFixed(0)}%
                              </div>
                              <p className="text-sm text-muted-foreground">Original AI Confidence</p>
                            </div>
                          </div>
                          <div className="space-y-3 text-sm">
                            <p className="text-muted-foreground mb-3">Confidence Breakdown:</p>
                            <div className="flex items-center gap-3">
                              <span className="text-muted-foreground w-36">Damage Detection</span>
                              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-warning"
                                  style={{ width: `${claimData.aiAnalysis.detectedDamage[0]?.confidence * 100}%` }}
                                />
                              </div>
                              <span className="font-medium w-12 text-right">
                                {(claimData.aiAnalysis.detectedDamage[0]?.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-muted-foreground w-36">Cost Estimation</span>
                              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-warning"
                                  style={{ width: `${claimData.aiAnalysis.detectedDamage[1]?.confidence * 100}%` }}
                                />
                              </div>
                              <span className="font-medium w-12 text-right">
                                {(claimData.aiAnalysis.detectedDamage[1]?.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-muted-foreground w-36">Image Analysis Quality</span>
                              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-warning"
                                  style={{ width: `${claimData.aiAnalysis.detectedDamage[2]?.confidence * 100}%` }}
                                />
                              </div>
                              <span className="font-medium w-12 text-right">
                                {(claimData.aiAnalysis.detectedDamage[2]?.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Why AI Flagged for Review */}
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-warning" />
                          Why This Was Flagged for Manual Review
                        </h3>
                        <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                          <p className="text-sm leading-relaxed">{claimData.aiAnalysis.reasoning}</p>
                        </div>
                      </div>

                      {/* Original AI Detected Damage */}
                      <div>
                        <h3 className="font-semibold mb-3">Original AI-Detected Damage</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          This is what the AI initially detected. See the Agent Review tab for verified damage and any
                          changes made.
                        </p>
                        <div className="space-y-3">
                          {claimData.aiAnalysis.detectedDamage.map((damage, idx) => (
                            <div key={idx} className="p-4 bg-secondary/50 rounded-lg border border-border">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-medium">{damage.part}</h4>
                                  <p className="text-sm text-muted-foreground">Severity: {damage.severity}</p>
                                </div>
                                <Badge variant="outline" className="bg-warning/20 text-warning border-warning/50">
                                  {(damage.confidence * 100).toFixed(0)}% confidence
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                                <span className="text-sm text-muted-foreground">AI Estimated Cost</span>
                                <span className="font-semibold text-lg">${damage.cost.toLocaleString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* AI Recommendations */}
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-info" />
                          AI Recommendations (for Agent)
                        </h3>
                        <div className="bg-info/10 rounded-lg p-4 border border-info/30">
                          <p className="text-sm leading-relaxed">{claimData.aiAnalysis.recommendations}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* AI Assessment Overview */}
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-accent" />
                          AI Assessment Overview
                        </h3>
                        <div className="bg-gradient-to-br from-accent/10 to-info/10 rounded-lg p-6 border border-accent/20">
                          <div className="flex items-center justify-between mb-6">
                            <div>
                              <div className="text-4xl font-bold gradient-text mb-2">
                                {(claimData.confidence * 100).toFixed(0)}%
                              </div>
                              <p className="text-sm text-muted-foreground">Overall Confidence Score</p>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-success/20 text-success border-success/50 text-base px-3 py-1"
                            >
                              High Confidence
                            </Badge>
                          </div>
                          <div className="space-y-3 text-sm">
                            <p className="text-muted-foreground mb-3">Confidence Breakdown:</p>
                            <div className="flex items-center gap-3">
                              <span className="text-muted-foreground w-36">Damage Detection</span>
                              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-accent" style={{ width: "94%" }} />
                              </div>
                              <span className="font-medium w-12 text-right">94%</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-muted-foreground w-36">Cost Estimation</span>
                              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-info" style={{ width: "91%" }} />
                              </div>
                              <span className="font-medium w-12 text-right">91%</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-muted-foreground w-36">Image Analysis Quality</span>
                              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-success" style={{ width: "95%" }} />
                              </div>
                              <span className="font-medium w-12 text-right">95%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Assessment Summary */}
                      <div>
                        <h3 className="font-semibold mb-3">Assessment Summary</h3>
                        <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                          <p className="text-sm leading-relaxed">{claimData.aiAnalysis.reasoning}</p>
                        </div>
                      </div>

                      {/* Detected Damage */}
                      <div>
                        <h3 className="font-semibold mb-3">Detected Damage Components</h3>
                        <div className="space-y-3">
                          {claimData.aiAnalysis.detectedDamage.map((damage, idx) => (
                            <div key={idx} className="p-4 bg-secondary/50 rounded-lg border border-border">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex-1">
                                  <h4 className="font-medium mb-1">{damage.part}</h4>
                                  <p className="text-sm text-muted-foreground">{damage.severity} damage</p>
                                </div>
                                <Badge variant="outline" className="bg-success/20 text-success border-success/50">
                                  {(damage.confidence * 100).toFixed(0)}% confidence
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                                <span className="text-sm text-muted-foreground">Estimated Cost</span>
                                <span className="font-semibold text-lg">${damage.cost.toLocaleString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-info" />
                          Recommendations
                        </h3>
                        <div className="bg-info/10 rounded-lg p-4 border border-info/30">
                          <p className="text-sm leading-relaxed">{claimData.aiAnalysis.recommendations}</p>
                        </div>
                      </div>
                    </>
                  )}
                </TabsContent>

                {isAgentAssessed && (
                  <TabsContent value="agent-review" className="p-6 space-y-6">
                    {/* Header */}
                    <div className="bg-success/10 border-2 border-success/30 rounded-lg p-6">
                      <div className="flex items-start gap-4">
                        <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">Agent Review Complete</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            This claim has been manually reviewed and verified by an agent. Below is a summary of their
                            assessment and any changes made.
                          </p>
                          <Badge variant="outline" className="bg-success/20 text-success border-success/50">
                            Ready for Adjuster Approval
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Agent Verification Summary */}
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        Agent Verification Summary
                      </h3>
                      <div className="bg-success/10 rounded-lg p-4 border border-success/30">
                        <p className="text-sm font-medium mb-3">Agent Actions:</p>
                        <ul className="text-sm space-y-2">
                          {/* Dynamically generate based on timeline events */}
                          {(() => {
                            const agentActions = claimData.timeline.filter(
                              (event) => event.user === "Agent" && event.type !== "routing",
                            )

                            if (agentActions.length === 0) {
                              return (
                                <li className="flex items-start gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                                  <span>Claim reviewed and verified by agent</span>
                                </li>
                              )
                            }

                            return agentActions.map((action, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <span>{action.event.split("\n")[0]}</span>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {new Date(action.timestamp).toLocaleString()}
                                  </p>
                                </div>
                              </li>
                            ))
                          })()}
                        </ul>
                      </div>
                    </div>

                    {/* Cost Changes by Agent */}
                    {(() => {
                      const costChanges = claimData.timeline.filter(
                        (event) =>
                          event.user === "Agent" && event.type === "edit" && event.event.includes("Cost estimate"),
                      )

                      if (costChanges.length > 0) {
                        return (
                          <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-accent" />
                              Cost Estimate Adjustments
                            </h3>
                            <div className="space-y-3">
                              {costChanges.map((change, idx) => (
                                <div key={idx} className="p-4 bg-accent/10 rounded-lg border border-accent/30">
                                  <p className="text-sm font-medium mb-1">{change.event}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(change.timestamp).toLocaleString()}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      }
                      return null
                    })()}

                    {/* Agent Notes */}
                    {claimData.notes.filter((note) => note.author === "Agent").length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-info" />
                          Agent Notes & Observations
                        </h3>
                        <div className="space-y-3">
                          {claimData.notes
                            .filter((note) => note.author === "Agent")
                            .map((note) => (
                              <div key={note.id} className="p-4 bg-info/10 rounded-lg border border-info/30">
                                <p className="text-sm leading-relaxed mb-2">{note.text}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(note.timestamp).toLocaleString()}
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Current Verified Damage */}
                    <div>
                      <h3 className="font-semibold mb-3">Agent-Verified Damage Components</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        These damage components have been verified by the agent and are ready for your final approval.
                      </p>
                      <div className="space-y-3">
                        {claimData.aiAnalysis.detectedDamage.map((damage, idx) => (
                          <div key={idx} className="p-4 bg-secondary/50 rounded-lg border border-border">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-medium">{damage.part}</h4>
                                <p className="text-sm text-muted-foreground">Severity: {damage.severity}</p>
                              </div>
                              <Badge variant="outline" className="bg-success/20 text-success border-success/50">
                                Agent Verified
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                              <span className="text-sm text-muted-foreground">Verified Cost</span>
                              <span className="font-semibold text-lg">${damage.cost.toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">Total Verified Estimate</span>
                          <span className="font-bold text-2xl gradient-text">
                            ${claimData.aiAnalysis.totalEstimate.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Additional Info Requests */}
                    {(() => {
                      const infoRequests = claimData.timeline.filter(
                        (event) => event.user === "Agent" && event.type === "email",
                      )

                      if (infoRequests.length > 0) {
                        return (
                          <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                              <Send className="w-4 h-4 text-info" />
                              Additional Information Requested
                            </h3>
                            <div className="space-y-3">
                              {infoRequests.map((request, idx) => (
                                <div key={idx} className="p-4 bg-info/10 rounded-lg border border-info/30">
                                  <p className="text-sm font-medium mb-2">{request.event.split("\n")[0]}</p>
                                  {request.event.includes("\n\n") && (
                                    <div className="mt-3 p-3 bg-secondary/50 rounded-lg border border-border">
                                      <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans">
                                        {request.event.split("\n\n").slice(1).join("\n\n")}
                                      </pre>
                                    </div>
                                  )}
                                  <p className="text-xs text-muted-foreground mt-2">
                                    {new Date(request.timestamp).toLocaleString()}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      }
                      return null
                    })()}
                  </TabsContent>
                )}

                <TabsContent value="estimate" className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Cost Breakdown</h3>
                    {!isEditing ? (
                      <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Estimate
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleSaveEdits}>
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {editedCosts.map((damage, idx) => (
                      <div key={idx} className="p-4 bg-secondary/50 rounded-lg border border-border">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">{damage.part}</h4>
                            <p className="text-sm text-muted-foreground">{damage.severity} damage</p>
                          </div>
                          {isEditing ? (
                            <Input
                              type="number"
                              value={damage.cost}
                              onChange={(e) => {
                                const newCosts = [...editedCosts]
                                newCosts[idx].cost = Number.parseInt(e.target.value) || 0
                                setEditedCosts(newCosts)
                              }}
                              className="w-32 text-right"
                              prefix="$"
                            />
                          ) : (
                            <span className="font-semibold text-lg">${damage.cost.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-lg">
                      <span className="font-semibold">Total Estimated Cost</span>
                      <span className="font-bold text-2xl gradient-text">${totalEditedCost.toLocaleString()}</span>
                    </div>
                    {isEditing && totalEditedCost !== claimData.estimatedCost && (
                      <p className="text-sm text-warning mt-2">
                        Original estimate: ${claimData.estimatedCost.toLocaleString()} (Difference: $
                        {Math.abs(totalEditedCost - claimData.estimatedCost).toLocaleString()})
                      </p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="timeline" className="p-6">
                  <div className="space-y-4">
                    {claimData.timeline.map((event, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              event.type === "submission"
                                ? "bg-info/20 text-info"
                                : event.type === "validation"
                                  ? "bg-success/20 text-success"
                                  : event.type === "analysis"
                                    ? "bg-accent/20 text-accent"
                                    : event.type === "routing"
                                      ? "bg-warning/20 text-warning"
                                      : event.type === "note"
                                        ? "bg-secondary text-muted-foreground"
                                        : event.type === "approval"
                                          ? "bg-success/20 text-success"
                                          : event.type === "rejection"
                                            ? "bg-destructive/20 text-destructive"
                                            : event.type === "email"
                                              ? "bg-info/20 text-info"
                                              : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            {event.type === "submission" && <FileText className="w-4 h-4" />}
                            {event.type === "validation" && <CheckCircle2 className="w-4 h-4" />}
                            {event.type === "analysis" && <Sparkles className="w-4 h-4" />}
                            {event.type === "routing" && <Clock className="w-4 h-4" />}
                            {event.type === "note" && <MessageSquare className="w-4 h-4" />}
                            {event.type === "approval" && <CheckCircle2 className="w-4 h-4" />}
                            {event.type === "rejection" && <XCircle className="w-4 h-4" />}
                            {event.type === "email" && <Send className="w-4 h-4" />}
                            {event.type === "edit" && <Edit3 className="w-4 h-4" />}
                          </div>
                          {idx < claimData.timeline.length - 1 && <div className="w-px h-12 bg-border" />}
                        </div>
                        <div className="flex-1 pb-8">
                          <p className="font-medium mb-1">{event.event.split("\n")[0]}</p>
                          {event.event.includes("\n\n") && (
                            <div className="mt-3 p-3 bg-secondary/50 rounded-lg border border-border">
                              <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans">
                                {event.event.split("\n\n").slice(1).join("\n\n")}
                              </pre>
                            </div>
                          )}
                          <p className="text-sm text-muted-foreground mt-2">
                            {event.user} • {new Date(event.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions - Prominent at top */}
            <Card className="bg-card border-border shadow-lg">
              <div className="p-6 border-b border-border bg-accent/5">
                <h3 className="font-semibold text-lg">Quick Actions</h3>
              </div>
              <div className="p-6 space-y-3">
                <Button
                  className="w-full justify-start bg-success text-white hover:bg-success/90 h-12 text-base"
                  onClick={handleApprove}
                  disabled={claimData.status === "approved" || (isAgentView && claimData.status === "ai-reviewed")}
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  {isAgentView ? "Send for Approval" : "Approve Claim"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start h-12 text-base bg-transparent"
                  onClick={handleRequestInfo}
                  disabled={claimData.status === "pending-info"}
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Request Additional Info
                </Button>
              </div>
            </Card>

            <Card className="bg-card border-border">
              <div className="p-6 border-b border-border">
                <h3 className="font-semibold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-accent" />
                  {isAgentView ? "Agent Notes" : "Adjuster Notes"}
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {/* Display existing notes */}
                {claimData.notes.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {claimData.notes.map((note) => (
                      <div key={note.id} className="p-3 bg-secondary/50 rounded-lg border border-border">
                        <div className="flex items-start gap-2 mb-2">
                          <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{note.author}</p>
                            <p className="text-xs text-muted-foreground">{new Date(note.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed">{note.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new note */}
                <Textarea
                  placeholder="Add notes about this claim assessment..."
                  value={noteText}
                  onChange={(e) => {
                    setNoteText(e.target.value)
                  }}
                  className="min-h-32 bg-secondary/50 border-border"
                />
                <Button className="w-full" size="sm" onClick={handleSaveNote} disabled={!noteText.trim()}>
                  Save Note
                </Button>
              </div>
            </Card>

            <Card className="bg-card border-border">
              <div className="p-6 border-b border-border">
                <h3 className="font-semibold">Additional Information</h3>
              </div>
              <div className="p-6 space-y-4 text-sm">
                {!isAgentView && (
                  <div>
                    <p className="text-muted-foreground mb-1">Source</p>
                    <p className="font-medium capitalize">
                      {claimData.source === "ai-assessed"
                        ? "AI-Assessed"
                        : claimData.source === "agent-assessed"
                          ? "Agent-Assessed"
                          : claimData.source.replace(/-/g, " ")}
                    </p>
                  </div>
                )}
                <div className="pt-2 border-t border-border">
                  <p className="text-muted-foreground mb-1">Assigned To</p>
                  <p className="font-medium capitalize">{claimData.assignedTo}</p>
                </div>
                <div className="pt-2 border-t border-border">
                  <p className="text-muted-foreground mb-1">Last Updated</p>
                  <p className="font-medium">{new Date(claimData.lastUpdated).toLocaleString()}</p>
                </div>
                <div className="pt-2 border-t border-border">
                  <p className="text-muted-foreground mb-1">AI Confidence</p>
                  <Badge
                    variant="outline"
                    className={
                      claimData.confidence >= 0.9
                        ? "text-success border-success/50"
                        : claimData.confidence >= 0.7
                          ? "text-info border-info/50"
                          : "text-warning border-warning/50"
                    }
                  >
                    {(claimData.confidence * 100).toFixed(0)}%
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Request Additional Information</DialogTitle>
            <DialogDescription>
              Draft an email to {claimData.policyHolder} requesting additional information for this claim.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">To</label>
              <Input value={`${claimData.policyHolder} <policyholder@example.com>`} disabled className="bg-secondary" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <Input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Message</label>
              <Textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="min-h-[200px]"
                placeholder="Enter your message..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendEmail} disabled={!emailSubject.trim() || !emailBody.trim()}>
              <Send className="w-4 h-4 mr-2" />
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Helper function to update shared claim status in localStorage
function updateSharedClaimStatus(
  claimId: string,
  newStatus: "Needs Review" | "Approved" | "Pending Additional Info" | "Sent for Approval",
  newSource?: string,
) {
  console.log("[v0] updateSharedClaimStatus called with:", { claimId, newStatus, newSource })

  // Get all claims from localStorage or use mock data
  const storedClaims = localStorage.getItem("mockClaims")
  const claims = storedClaims ? JSON.parse(storedClaims) : [...mockClaims]

  console.log("[v0] Current claims count:", claims.length)

  // Find and update the claim
  const claimIndex = claims.findIndex((c: SharedClaim) => c.id === claimId)
  console.log("[v0] Found claim at index:", claimIndex)

  if (claimIndex !== -1) {
    const oldStatus = claims[claimIndex].status
    const oldSource = claims[claimIndex].source // Corrected from 'index' to 'claimIndex'

    // Ensure the status is correctly mapped
    const storageStatus =
      newStatus === "Sent for Approval"
        ? "Needs Review"
        : newStatus === "Approved"
          ? "Approved"
          : newStatus === "Pending Additional Info"
            ? "Pending Additional Info"
            : "Needs Review"

    claims[claimIndex].status = storageStatus as "Needs Review" | "Approved" | "Pending Additional Info"
    claims[claimIndex].lastUpdated = new Date().toISOString()

    if (newSource) {
      claims[claimIndex].source = newSource
    }

    console.log("[v0] Updated claim:", {
      id: claimId,
      oldStatus,
      newStatus: claims[claimIndex].status,
      oldSource,
      newSource: claims[claimIndex].source,
    })

    localStorage.setItem("mockClaims", JSON.stringify(claims))
    console.log("[v0] Saved updated claims to localStorage")
  } else {
    console.log("[v0] WARNING: Claim not found in storage!")
  }
}

function convertSharedClaimToClaimData(sharedClaim: SharedClaim, returnTo?: "agent" | "adjuster" | null): ClaimData {
  // Use the source directly from shared claim
  const source = sharedClaim.source

  let status: string
  if (sharedClaim.status === "Approved") {
    status = "approved"
  } else if (sharedClaim.status === "Pending Additional Info") {
    status = "pending-info"
  } else if (sharedClaim.source === "agent-assessed" && returnTo === "adjuster") {
    // Agent has reviewed and sent for approval
    status = "ai-reviewed"
  } else {
    status = "needs-review"
  }

  return {
    id: sharedClaim.id,
    policyHolder: sharedClaim.policyholder,
    policyNumber: sharedClaim.policyNumber,
    vehicle: sharedClaim.vehicle,
    vin: sharedClaim.vin,
    dateSubmitted: sharedClaim.dateSubmitted,
    lastUpdated: sharedClaim.lastUpdated,
    status,
    confidence: sharedClaim.confidenceScore / 100,
    estimatedCost: sharedClaim.estimatedCost,
    damageType: sharedClaim.aiAnalysis.damageAssessment.substring(0, 50) + "...",
    assignedTo: sharedClaim.confidenceScore < 90 ? "agent" : "adjuster",
    source,
    photos: sharedClaim.photos.map((p) => p.url),
    contactEmail: sharedClaim.email,
    contactPhone: sharedClaim.phone,
    incidentDate: sharedClaim.incidentDate,
    incidentLocation: sharedClaim.incidentLocation,
    incidentDescription: sharedClaim.incidentDescription,
    aiAnalysis: {
      detectedDamage: [
        {
          part: "Front Bumper",
          severity: "Moderate",
          confidence: sharedClaim.confidenceScore / 100,
          cost: Math.round(sharedClaim.estimatedCost * 0.4),
        },
        {
          part: "Hood",
          severity: "Minor",
          confidence: sharedClaim.confidenceScore / 100,
          cost: Math.round(sharedClaim.estimatedCost * 0.35),
        },
        {
          part: "Additional Components",
          severity: "Minor",
          confidence: sharedClaim.confidenceScore / 100,
          cost: sharedClaim.estimatedCost - Math.round(sharedClaim.estimatedCost * 0.75),
        },
      ],
      totalEstimate: sharedClaim.estimatedCost,
      reasoning:
        source === "agent-assessed" && sharedClaim.aiAnalysis.lowConfidenceReasons
          ? `Initial AI confidence was below 90% threshold. Reasons: ${sharedClaim.aiAnalysis.lowConfidenceReasons.join("; ")}. Agent has reviewed and verified the claim.`
          : sharedClaim.aiAnalysis.recommendation,
      dataQuality:
        sharedClaim.aiAnalysis.riskFactors.length > 0
          ? `Concerns identified: ${sharedClaim.aiAnalysis.riskFactors.join(", ")}`
          : "Good - All required documentation provided",
      recommendations: sharedClaim.aiAnalysis.recommendation,
    },
    timeline: sharedClaim.timeline.map((t) => ({
      timestamp: t.date,
      event: t.event,
      user: t.actor,
      type: t.event.toLowerCase().includes("submit")
        ? "submission"
        : t.event.toLowerCase().includes("analys") || t.event.toLowerCase().includes("ai")
          ? "analysis"
          : t.event.toLowerCase().includes("approv")
            ? "approval"
            : t.event.toLowerCase().includes("request") || t.event.toLowerCase().includes("additional")
              ? "email"
              : "note",
    })),
    notes: [],
  }
}
