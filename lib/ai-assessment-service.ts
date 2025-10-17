import type { Claim } from "./mock-claims-data"

interface AssessmentInput {
  policyId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  vinNumber: string
  incidentLocation: string
  vehicle: string
  incidentDate: string
  incidentDescription: string
  photos: Array<{ id: string; name: string; url: string; preview: string }>
}

export function generateAIAssessment(input: AssessmentInput): Claim {
  // Base confidence: 70% + 7% per photo, capped at 95%
  const baseConfidence = Math.min(70 + input.photos.length * 7, 95)

  // Description quality bonus: +5% for detailed descriptions with damage keywords
  let descriptionBonus = 0
  const description = input.incidentDescription.toLowerCase()
  const damageKeywords = [
    "damage",
    "collision",
    "accident",
    "bumper",
    "hood",
    "door",
    "dent",
    "scratch",
    "broken",
    "cracked",
  ]
  const hasKeywords = damageKeywords.some((keyword) => description.includes(keyword))

  if (input.incidentDescription.length >= 50 && hasKeywords) {
    descriptionBonus = 5
  }

  // Reduced random variation from ±10 to ±5 for more predictable demo results
  const randomVariation = Math.floor(Math.random() * 10) - 5
  const confidenceScore = Math.max(32, Math.min(95, baseConfidence + descriptionBonus + randomVariation))

  // Generate claim ID
  const claimId = `CLM-2025-${Math.floor(Math.random() * 900) + 100}`

  // Generate estimated cost based on description keywords
  let baseCost = 1500
  if (description.includes("bumper")) baseCost += 800
  if (description.includes("hood")) baseCost += 1200
  if (description.includes("door")) baseCost += 1000
  if (description.includes("windshield")) baseCost += 500
  if (description.includes("airbag")) baseCost += 5000
  if (description.includes("total")) baseCost += 8000

  const costVariation = Math.floor(Math.random() * 1000) - 500
  const estimatedCost = Math.max(300, baseCost + costVariation)

  // Generate risk factors based on confidence score
  const riskFactors: string[] = []
  const lowConfidenceReasons: string[] = []

  if (confidenceScore < 90) {
    if (confidenceScore < 50) {
      riskFactors.push("Insufficient photo documentation")
      riskFactors.push("Incident description lacks detail")
      riskFactors.push("Estimated cost requires verification")
      lowConfidenceReasons.push("Limited visual evidence provided")
      lowConfidenceReasons.push("Incident details need clarification")
      lowConfidenceReasons.push("Cost estimate requires professional assessment")
    } else if (confidenceScore < 70) {
      riskFactors.push("Additional documentation recommended")
      riskFactors.push("Photo angles could be improved")
      lowConfidenceReasons.push("Some damage areas not clearly visible")
      lowConfidenceReasons.push("Additional verification recommended")
    } else {
      riskFactors.push("Minor documentation gaps")
      lowConfidenceReasons.push("Additional angle photos would improve assessment")
    }
  }

  // Generate damage assessment
  const damageAssessment =
    confidenceScore >= 90
      ? `Clear damage visible in provided photos. Damage pattern consistent with reported incident. Assessment appears straightforward.`
      : confidenceScore >= 70
        ? `Damage visible in photos but some areas require additional documentation. Pattern generally consistent with reported incident.`
        : `Limited visibility of full damage extent. Photos provided show some damage but additional documentation needed for complete assessment.`

  // Generate recommendation
  let recommendation = ""
  if (confidenceScore >= 90) {
    recommendation =
      "High confidence assessment. Damage clearly documented and consistent with incident description. Ready for adjuster approval."
  } else if (confidenceScore >= 70) {
    recommendation =
      "Moderate confidence assessment. Agent review recommended to verify damage extent and cost estimate."
  } else {
    recommendation =
      "Low confidence assessment. Manual review required. Request additional documentation and professional inspection before proceeding."
  }

  // Process photos with AI analysis
  const processedPhotos = input.photos.map((photo, index) => ({
    url: photo.preview,
    caption: photo.name.replace(/\.[^/.]+$/, "").replace(/-/g, " "),
    analysis:
      confidenceScore >= 80
        ? `Damage clearly visible. Photo quality good. ${index === 0 ? "Primary damage area documented." : "Additional angle provides context."}`
        : confidenceScore >= 60
          ? `Some damage visible. ${index === 0 ? "Primary area shown but additional angles recommended." : "Supplementary documentation."}`
          : `Limited visibility. ${index === 0 ? "Additional photos needed for complete assessment." : "Insufficient detail for full analysis."}`,
  }))

  const currentDate = new Date()
  const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`
  const formattedTime = currentDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })

  const claim: Claim = {
    id: claimId,
    policyholder: `${input.firstName} ${input.lastName}`,
    policyNumber: input.policyId,
    email: input.email,
    phone: input.phone,
    vehicle: input.vehicle,
    vin: input.vinNumber,
    incidentDate: new Date(input.incidentDate).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    }),
    dateSubmitted: formattedDate,
    lastUpdated: formattedDate,
    incidentLocation: input.incidentLocation,
    incidentDescription: input.incidentDescription,
    estimatedCost: estimatedCost,
    status: "Needs Review",
    confidenceScore: confidenceScore,
    source: "ai-assessed",
    aiAnalysis: {
      damageAssessment: damageAssessment,
      estimatedRepairCost: `$${Math.floor(estimatedCost * 0.9).toLocaleString()} - $${Math.floor(estimatedCost * 1.1).toLocaleString()}`,
      riskFactors: riskFactors,
      recommendation: recommendation,
      lowConfidenceReasons: lowConfidenceReasons.length > 0 ? lowConfidenceReasons : undefined,
    },
    photos: processedPhotos,
    timeline: [
      {
        date: `${formattedDate} ${formattedTime}`,
        event: "Claim submitted",
        actor: input.firstName + " " + input.lastName,
      },
      {
        date: `${formattedDate} ${formattedTime}`,
        event: `AI analysis completed - Confidence: ${confidenceScore}%`,
        actor: "System",
      },
      {
        date: `${formattedDate} ${formattedTime}`,
        event:
          confidenceScore >= 90
            ? "Routed to adjuster for approval (high confidence)"
            : "Routed to agent for review (confidence below 90%)",
        actor: "System",
      },
    ],
  }

  return claim
}

export function saveClaim(claim: Claim): void {
  const storedClaims = localStorage.getItem("mockClaims")
  const claims = storedClaims ? JSON.parse(storedClaims) : []

  claims.unshift(claim)

  const recentClaims = claims.slice(0, 5)

  try {
    localStorage.setItem("mockClaims", JSON.stringify(recentClaims))
    console.log("[v0] Claim saved successfully to localStorage")
  } catch (error) {
    console.error("[v0] Failed to save claim to localStorage:", error)
    const minimalClaims = claims.slice(0, 3)
    try {
      localStorage.setItem("mockClaims", JSON.stringify(minimalClaims))
      console.log("[v0] Saved claim after reducing to 3 most recent")
    } catch (retryError) {
      console.error("[v0] Still failed after cleanup:", retryError)
      localStorage.setItem("mockClaims", JSON.stringify([claim]))
      console.log("[v0] Cleared all old claims and saved new one")
    }
  }
}

export function clearOldClaims(): void {
  localStorage.removeItem("mockClaims")
}
