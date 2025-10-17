export interface Claim {
  id: string
  policyholder: string
  policyNumber: string
  email: string
  phone: string
  vehicle: string
  vin: string
  incidentDate: string
  dateSubmitted: string
  lastUpdated: string
  incidentLocation: string
  incidentDescription: string
  estimatedCost: number
  status: "Needs Review" | "Approved" | "Pending Additional Info"
  confidenceScore: number
  source: "ai-assessed" | "agent-assessed"
  aiAnalysis: {
    damageAssessment: string
    estimatedRepairCost: string
    riskFactors: string[]
    recommendation: string
    lowConfidenceReasons?: string[]
  }
  photos: Array<{
    url: string
    caption: string
    analysis: string
  }>
  timeline: Array<{
    date: string
    event: string
    actor: string
  }>
}

export const mockClaims: Claim[] = [
  // Agent Dashboard Claims (confidence < 90%, needs agent review) - Status: Needs Review
  {
    id: "CLM-2025-001",
    policyholder: "Sarah Johnson",
    policyNumber: "POL-2024-8765",
    email: "sarah.johnson@email.com",
    phone: "(555) 234-5678",
    vehicle: "2022 Toyota Camry",
    vin: "4T1B11HK5NU123456",
    incidentDate: "10/11/2025",
    dateSubmitted: "10/14/2025",
    lastUpdated: "10/15/2025",
    incidentLocation: "Interstate 95, Exit 42, Baltimore, MD",
    incidentDescription:
      "I was driving southbound on I-95 during heavy rain when the vehicle in front of me suddenly braked. I applied my brakes but was unable to stop in time due to wet road conditions, resulting in a low-speed collision. The impact damaged my front bumper and hood. No injuries occurred. Police report filed at the scene (Report #MD-2025-10-12-4567).",
    estimatedCost: 3200,
    status: "Needs Review",
    confidenceScore: 62,
    source: "ai-assessed",
    aiAnalysis: {
      damageAssessment:
        "Front bumper shows impact damage with paint transfer. Hood has minor denting. Damage pattern consistent with low-speed rear-end collision.",
      estimatedRepairCost: "$2,800 - $3,500",
      riskFactors: [
        "Weather conditions (heavy rain) may affect liability determination",
        "Following distance unclear from description",
        "No dashcam footage provided",
      ],
      recommendation:
        "Manual review recommended. Request police report and witness statements to verify incident details.",
      lowConfidenceReasons: [
        "Image quality concerns - some angles lack sufficient lighting",
        "Potential hidden damage not visible in photos",
        "Weather conditions complicate liability assessment",
      ],
    },
    photos: [
      {
        url: "/damaged-car-front-bumper.jpg",
        caption: "Front bumper damage",
        analysis:
          "Impact damage visible on front bumper with paint transfer from other vehicle. Consistent with low-speed collision.",
      },
      {
        url: "/car-hood-damage-close-up.jpg",
        caption: "Hood denting close-up",
        analysis: "Minor denting on hood near front edge. Damage pattern suggests forward impact force.",
      },
      {
        url: "/car-damage-side-angle.jpg",
        caption: "Side angle view",
        analysis: "Overall vehicle condition good. Damage isolated to front end only.",
      },
    ],
    timeline: [
      { date: "10/14/2025 09:23 AM", event: "Claim submitted", actor: "Sarah Johnson" },
      { date: "10/14/2025 09:24 AM", event: "AI analysis completed - Confidence: 62%", actor: "System" },
      { date: "10/14/2025 09:25 AM", event: "Routed to agent for review (confidence below 90%)", actor: "System" },
    ],
  },
  {
    id: "CLM-2025-006",
    policyholder: "Robert Taylor",
    policyNumber: "POL-2024-3456",
    email: "robert.taylor@email.com",
    phone: "(555) 789-0123",
    vehicle: "2021 BMW X5",
    vin: "5UXCR6C09M9123456",
    incidentDate: "10/12/2025",
    dateSubmitted: "10/14/2025",
    lastUpdated: "10/15/2025",
    incidentLocation: "Shopping center parking lot, Miami, FL",
    incidentDescription:
      "Shopping cart rolled into vehicle causing door dent. Witness saw cart rolling downhill in windy conditions. Minor cosmetic damage only.",
    estimatedCost: 800,
    status: "Needs Review",
    confidenceScore: 58,
    source: "ai-assessed",
    aiAnalysis: {
      damageAssessment:
        "Small dent on rear passenger door. Damage appears minor but claim amount seems high for cosmetic repair.",
      estimatedRepairCost: "$500 - $700",
      riskFactors: [
        "Estimated cost higher than typical for this type of damage",
        "No security footage provided",
        "Witness statement not verified",
      ],
      recommendation: "Manual review recommended. Verify repair estimate and consider requesting additional quotes.",
      lowConfidenceReasons: [
        "Estimated cost higher than typical for this type of damage",
        "No security footage provided",
        "Witness statement not verified",
      ],
    },
    photos: [
      {
        url: "/car-damage-side-angle.jpg",
        caption: "Door dent",
        analysis: "Small dent visible on rear door. Damage appears consistent with shopping cart impact.",
      },
    ],
    timeline: [
      { date: "10/14/2025 01:30 PM", event: "Claim submitted", actor: "Robert Taylor" },
      { date: "10/14/2025 01:31 PM", event: "AI analysis completed - Confidence: 58%", actor: "System" },
      { date: "10/14/2025 01:32 PM", event: "Routed to agent for review (confidence below 90%)", actor: "System" },
      { date: "10/15/2025 10:45 AM", event: "Flagged for cost review by agent", actor: "Agent" },
    ],
  },
  {
    id: "CLM-2025-010",
    policyholder: "Christopher Lee",
    policyNumber: "POL-2024-7890",
    email: "christopher.lee@email.com",
    phone: "(555) 123-4567",
    vehicle: "2021 Jeep Wrangler",
    vin: "1C4HJXDG5MW123456",
    incidentDate: "10/10/2025",
    dateSubmitted: "10/12/2025",
    lastUpdated: "10/14/2025",
    incidentLocation: "Off-road trail, Moab, UT",
    incidentDescription:
      "Undercarriage damage from rock while off-roading. Oil pan dented, no leaks detected. Vehicle driven to repair shop without issues.",
    estimatedCost: 2800,
    status: "Needs Review",
    confidenceScore: 48,
    source: "ai-assessed",
    aiAnalysis: {
      damageAssessment:
        "Undercarriage damage reported. Unable to verify extent of damage from provided photos. Off-road activity may not be covered under standard policy.",
      estimatedRepairCost: "Unable to assess without inspection",
      riskFactors: [
        "Off-road activity may violate policy terms",
        "Insufficient photo documentation of damage",
        "Need to verify policy coverage for recreational off-roading",
        "Repair estimate high without clear damage assessment",
      ],
      recommendation:
        "Manual review required. Verify policy coverage for off-road use. Request professional inspection report and additional documentation.",
      lowConfidenceReasons: [
        "Off-road activity may violate policy terms",
        "Insufficient photo documentation of damage",
        "Need to verify policy coverage for recreational off-roading",
        "Repair estimate high without clear damage assessment",
      ],
    },
    photos: [
      {
        url: "/car-damage-side-angle.jpg",
        caption: "Vehicle exterior",
        analysis: "Exterior photos provided but undercarriage damage not visible. Additional documentation needed.",
      },
    ],
    timeline: [
      { date: "10/12/2025 02:30 PM", event: "Claim submitted", actor: "Christopher Lee" },
      { date: "10/12/2025 02:31 PM", event: "AI analysis completed - Confidence: 48%", actor: "System" },
      { date: "10/13/2025 11:00 AM", event: "Additional documentation requested", actor: "Mike Chen" },
      { date: "10/14/2025 03:15 PM", event: "Policy coverage review initiated", actor: "Lisa Park" },
    ],
  },
  {
    id: "CLM-2025-013",
    policyholder: "Michelle Davis",
    policyNumber: "POL-2024-3456",
    email: "michelle.davis@email.com",
    phone: "(555) 456-7890",
    vehicle: "2023 Kia Sportage",
    vin: "5XYP5DHC5PG123456",
    incidentDate: "10/12/2025",
    dateSubmitted: "10/14/2025",
    lastUpdated: "10/15/2025",
    incidentLocation: "City street, Philadelphia, PA",
    incidentDescription:
      "Hit pothole causing tire and wheel damage. Tire blew out, wheel bent. City has record of pothole complaints for this location.",
    estimatedCost: 950,
    status: "Needs Review",
    confidenceScore: 65,
    source: "ai-assessed",
    aiAnalysis: {
      damageAssessment:
        "Tire damage and bent wheel rim reported. Photos show damaged tire but wheel damage not clearly visible.",
      estimatedRepairCost: "$800 - $1,000",
      riskFactors: [
        "Road hazard claims require verification of unavoidable conditions",
        "City liability may apply - could affect claim",
        "Need to verify if pothole was marked or reported prior to incident",
      ],
      recommendation:
        "Manual review recommended. Verify pothole documentation and determine if city liability applies before processing claim.",
      lowConfidenceReasons: [
        "Road hazard claims require verification of unavoidable conditions",
        "City liability may apply - could affect claim",
        "Need to verify if pothole was marked or reported prior to incident",
      ],
    },
    photos: [
      {
        url: "/damaged-car-front-bumper.jpg",
        caption: "Damaged tire",
        analysis:
          "Tire shows sidewall damage consistent with pothole impact. Wheel rim damage not clearly visible in photo.",
      },
    ],
    timeline: [
      { date: "10/14/2025 11:30 AM", event: "Claim submitted", actor: "Michelle Davis" },
      { date: "10/14/2025 11:31 AM", event: "AI analysis completed - Confidence: 65%", actor: "System" },
      { date: "10/15/2025 09:15 AM", event: "City records requested", actor: "Lisa Park" },
    ],
  },
  {
    id: "CLM-2025-018",
    policyholder: "Brian Moore",
    policyNumber: "POL-2024-7890",
    email: "brian.moore@email.com",
    phone: "(555) 901-2345",
    vehicle: "2021 Ram 1500",
    vin: "1C6SRFFT5MN123456",
    incidentDate: "10/09/2025",
    dateSubmitted: "10/11/2025",
    lastUpdated: "10/13/2025",
    incidentLocation: "Construction zone, Highway 75, Detroit, MI",
    incidentDescription:
      "Paint damage from construction debris spray. Multiple paint chips and scratches on front end and hood. Other vehicles also affected. Construction company identified.",
    estimatedCost: 2200,
    status: "Needs Review",
    confidenceScore: 54,
    source: "ai-assessed",
    aiAnalysis: {
      damageAssessment:
        "Multiple small paint chips and scratches reported on front surfaces. Photos show some damage but extent unclear.",
      estimatedRepairCost: "$1,800 - $2,400",
      riskFactors: [
        "Construction zone damage may involve third-party liability",
        "Multiple vehicles affected suggests systemic issue",
        "Need to determine if construction company is liable",
        "Repair estimate should be verified with professional assessment",
      ],
      recommendation:
        "Manual review required. Investigate construction company liability before processing. May require subrogation. Verify extent of damage with in-person inspection.",
      lowConfidenceReasons: [
        "Construction zone damage may involve third-party liability",
        "Multiple vehicles affected suggests systemic issue",
        "Need to determine if construction company is liable",
        "Repair estimate should be verified with professional assessment",
      ],
    },
    photos: [
      {
        url: "/car-hood-damage-close-up.jpg",
        caption: "Hood paint damage",
        analysis: "Multiple small chips visible. Pattern suggests debris spray rather than single impact.",
      },
      {
        url: "/damaged-car-front-bumper.jpg",
        caption: "Front bumper chips",
        analysis: "Paint chips on bumper surface. Damage extent requires closer inspection.",
      },
    ],
    timeline: [
      { date: "10/11/2025 04:00 PM", event: "Claim submitted", actor: "Brian Moore" },
      { date: "10/11/2025 04:01 PM", event: "AI analysis completed - Confidence: 54%", actor: "System" },
      { date: "10/12/2025 10:00 AM", event: "Construction company contacted", actor: "Lisa Park" },
      { date: "10/13/2025 02:00 PM", event: "Inspection scheduled", actor: "Lisa Park" },
    ],
  },
  {
    id: "CLM-2025-019",
    policyholder: "Angela Harris",
    policyNumber: "POL-2024-2345",
    email: "angela.harris@email.com",
    phone: "(555) 012-3456",
    vehicle: "2022 Acura MDX",
    vin: "5J8YD4H86NL123456",
    incidentDate: "10/12/2025",
    dateSubmitted: "10/14/2025",
    lastUpdated: "10/14/2025",
    incidentLocation: "School parking lot, Houston, TX",
    incidentDescription:
      "Rear-ended while waiting in school pickup line. Other driver admitted fault. Minor bumper damage. Police report not filed due to minor nature. Contact information exchanged.",
    estimatedCost: 1100,
    status: "Needs Review",
    confidenceScore: 68,
    source: "ai-assessed",
    aiAnalysis: {
      damageAssessment:
        "Rear bumper shows impact damage. Damage appears minor and localized. Consistent with low-speed rear-end collision.",
      estimatedRepairCost: "$1,000 - $1,200",
      riskFactors: [
        "No police report filed",
        "Other party information needs verification",
        "Need to confirm other party's insurance details",
      ],
      recommendation:
        "Manual review recommended. Verify other party's insurance information before processing. Consider requesting photos from other vehicle.",
      lowConfidenceReasons: [
        "No police report filed",
        "Other party information needs verification",
        "Need to confirm other party's insurance details",
      ],
    },
    photos: [
      {
        url: "/damaged-car-front-bumper.jpg",
        caption: "Rear bumper impact",
        analysis: "Minor impact damage to rear bumper. Paint scratched, slight denting visible.",
      },
    ],
    timeline: [
      { date: "10/14/2025 03:30 PM", event: "Claim submitted", actor: "Angela Harris" },
      { date: "10/14/2025 03:31 PM", event: "AI analysis completed - Confidence: 68%", actor: "System" },
      { date: "10/14/2025 05:00 PM", event: "Flagged for verification by agent", actor: "Agent" },
    ],
  },
  {
    id: "CLM-2025-020",
    policyholder: "Thomas Jackson",
    policyNumber: "POL-2024-5678",
    email: "thomas.jackson@email.com",
    phone: "(555) 123-4567",
    vehicle: "2020 Porsche Cayenne",
    vin: "WP1AB2A59LLA123456",
    incidentDate: "10/15/2025",
    dateSubmitted: "10/15/2025",
    lastUpdated: "10/15/2025",
    incidentLocation: "Private driveway, Beverly Hills, CA",
    incidentDescription:
      "Paint damage and scratches on multiple panels. Claim states damage occurred overnight but no clear cause identified. No police report filed.",
    estimatedCost: 8500,
    status: "Needs Review",
    confidenceScore: 32,
    source: "ai-assessed",
    aiAnalysis: {
      damageAssessment:
        "Photos show scratches on multiple panels. Damage pattern unclear and inconsistent. No clear single cause of damage evident.",
      estimatedRepairCost: "Unable to accurately assess - requires inspection",
      riskFactors: [
        "Very high repair estimate for unclear damage",
        "No clear incident description or cause",
        "Damage to multiple panels suggests multiple incidents or pre-existing damage",
        "No police report despite significant claimed damage",
        "Photos do not clearly show extent of damage claimed",
        "Timeline suspicious - damage discovered and claimed same day",
      ],
      recommendation:
        "Require additional information and in-person professional inspection. Damage pattern and claim details raise concerns. Need clear explanation of incident and verification that damage is new.",
      lowConfidenceReasons: [
        "Very high repair estimate for unclear damage",
        "No clear incident description or cause",
        "Damage to multiple panels suggests multiple incidents or pre-existing damage",
        "No police report despite significant claimed damage",
        "Photos do not clearly show extent of damage claimed",
        "Timeline suspicious - damage discovered and claimed same day",
      ],
    },
    photos: [
      {
        url: "/car-damage-side-angle.jpg",
        caption: "Side panel scratches",
        analysis: "Some scratching visible but extent and cause unclear from photos. Requires closer inspection.",
      },
    ],
    timeline: [
      { date: "10/15/2025 04:00 PM", event: "Claim submitted", actor: "Thomas Jackson" },
      { date: "10/15/2025 04:01 PM", event: "AI analysis completed - Confidence: 32%", actor: "System" },
      { date: "10/15/2025 04:05 PM", event: "Flagged for additional review by agent", actor: "Agent" },
    ],
  },

  // Adjuster Dashboard - AI-Assessed Claims (confidence >= 90%) - Status: Needs Review
  {
    id: "CLM-2025-003",
    policyholder: "Emily Rodriguez",
    policyNumber: "POL-2024-7654",
    email: "emily.rodriguez@email.com",
    phone: "(555) 345-6789",
    vehicle: "2023 Ford Explorer",
    vin: "1FM5K8D84PGA12345",
    incidentDate: "10/08/2025",
    dateSubmitted: "10/13/2025",
    lastUpdated: "10/14/2025",
    incidentLocation: "Home driveway, 456 Oak Avenue, Austin, TX",
    incidentDescription:
      "Hailstorm caused damage to vehicle roof and hood. Multiple dents visible across top surfaces. Weather service confirms severe hail event in area on incident date. Vehicle was parked in driveway during storm.",
    estimatedCost: 2100,
    status: "Needs Review",
    confidenceScore: 94,
    source: "ai-assessed",
    aiAnalysis: {
      damageAssessment:
        "Multiple impact dents consistent with hail damage pattern. Damage distribution across horizontal surfaces matches typical hail storm damage. No signs of pre-existing damage.",
      estimatedRepairCost: "$2,000 - $2,200",
      riskFactors: [],
      recommendation:
        "High confidence assessment. Damage clearly consistent with reported hail event. Weather data confirms severe hail in area on incident date. Ready for adjuster approval.",
    },
    photos: [
      {
        url: "/car-hood-damage-close-up.jpg",
        caption: "Hood hail damage",
        analysis:
          "Multiple circular impact dents consistent with hail damage. Pattern and size uniform across surface.",
      },
      {
        url: "/car-damage-side-angle.jpg",
        caption: "Roof damage overview",
        analysis:
          "Extensive hail damage visible on roof surface. Damage pattern consistent with natural weather event.",
      },
    ],
    timeline: [
      { date: "10/13/2025 11:15 AM", event: "Claim submitted", actor: "Emily Rodriguez" },
      { date: "10/13/2025 11:16 AM", event: "AI analysis completed - Confidence: 94%", actor: "System" },
      { date: "10/13/2025 11:20 AM", event: "Routed to adjuster for approval (high confidence)", actor: "System" },
    ],
  },
  {
    id: "CLM-2025-007",
    policyholder: "Amanda White",
    policyNumber: "POL-2024-6789",
    email: "amanda.white@email.com",
    phone: "(555) 890-1234",
    vehicle: "2022 Subaru Outback",
    vin: "4S4BTAFC5N3123456",
    incidentDate: "10/13/2025",
    dateSubmitted: "10/15/2025",
    lastUpdated: "10/15/2025",
    incidentLocation: "Residential street, Portland, OR",
    incidentDescription:
      "Backed into mailbox while reversing out of driveway. Rear bumper damage. My fault, no other parties involved.",
    estimatedCost: 1200,
    status: "Needs Review",
    confidenceScore: 92,
    source: "ai-assessed",
    aiAnalysis: {
      damageAssessment:
        "Rear bumper shows impact damage consistent with backing into stationary object. Damage localized to bumper area only.",
      estimatedRepairCost: "$1,100 - $1,300",
      riskFactors: [],
      recommendation:
        "High confidence assessment. Straightforward single-vehicle incident. Policyholder admits fault. Damage assessment accurate. Ready for adjuster approval.",
    },
    photos: [
      {
        url: "/damaged-car-front-bumper.jpg",
        caption: "Rear bumper damage",
        analysis: "Impact damage on rear bumper. Consistent with backing into fixed object.",
      },
    ],
    timeline: [
      { date: "10/15/2025 08:45 AM", event: "Claim submitted", actor: "Amanda White" },
      { date: "10/15/2025 08:46 AM", event: "AI analysis completed - Confidence: 92%", actor: "System" },
      { date: "10/15/2025 08:47 AM", event: "Routed to adjuster for approval (high confidence)", actor: "System" },
    ],
  },

  // Adjuster Dashboard - Approved Claims
  {
    id: "CLM-2025-004",
    policyholder: "David Kim",
    policyNumber: "POL-2024-5432",
    email: "david.kim@email.com",
    phone: "(555) 567-8901",
    vehicle: "2020 Tesla Model 3",
    vin: "5YJ3E1EA8LF123456",
    incidentDate: "10/09/2025",
    dateSubmitted: "10/11/2025",
    lastUpdated: "10/12/2025",
    incidentLocation: "Highway 101, San Jose, CA",
    incidentDescription:
      "Vehicle struck by debris that fell from truck ahead. Windshield cracked and front bumper scratched. Dashcam footage available showing incident.",
    estimatedCost: 1500,
    status: "Approved",
    confidenceScore: 91,
    source: "ai-assessed",
    aiAnalysis: {
      damageAssessment:
        "Windshield shows star crack pattern from impact. Front bumper has minor scratching. Dashcam footage confirms debris strike from vehicle ahead.",
      estimatedRepairCost: "$1,400 - $1,600",
      riskFactors: [],
      recommendation:
        "High confidence assessment. Dashcam footage clearly shows debris falling from truck. Not-at-fault incident with strong evidence. Approved.",
    },
    photos: [
      {
        url: "/damaged-car-front-bumper.jpg",
        caption: "Windshield crack",
        analysis: "Star pattern crack on windshield consistent with impact from flying debris.",
      },
    ],
    timeline: [
      { date: "10/11/2025 08:30 AM", event: "Claim submitted", actor: "David Kim" },
      { date: "10/11/2025 08:31 AM", event: "AI analysis completed - Confidence: 91%", actor: "System" },
      { date: "10/11/2025 02:45 PM", event: "Dashcam footage reviewed", actor: "Lisa Park" },
      { date: "10/12/2025 10:15 AM", event: "Claim approved by adjuster", actor: "Lisa Park" },
    ],
  },
  {
    id: "CLM-2025-005",
    policyholder: "Jennifer Martinez",
    policyNumber: "POL-2024-8901",
    email: "jennifer.martinez@email.com",
    phone: "(555) 678-9012",
    vehicle: "2019 Chevrolet Silverado",
    vin: "1GCVKREC5KZ123456",
    incidentDate: "10/07/2025",
    dateSubmitted: "10/10/2025",
    lastUpdated: "10/11/2025",
    incidentLocation: "Rural Route 45, Denver, CO",
    incidentDescription:
      "Deer ran into road, unavoidable collision. Front end damage to vehicle. Police report filed. Deer carcass removed by animal control.",
    estimatedCost: 4200,
    status: "Approved",
    confidenceScore: 88,
    source: "agent-assessed",
    aiAnalysis: {
      damageAssessment:
        "Significant front end damage consistent with animal collision. Grille, headlight, and bumper damage. Hood has impact denting.",
      estimatedRepairCost: "$4,000 - $4,500",
      riskFactors: [],
      recommendation:
        "Agent reviewed. Damage pattern consistent with deer strike. Police report confirms incident. Common occurrence in reported area. Approved.",
      lowConfidenceReasons: ["Initial AI confidence below threshold", "Required agent verification of police report"],
    },
    photos: [
      {
        url: "/damaged-car-front-bumper.jpg",
        caption: "Front end damage",
        analysis: "Extensive damage to front grille and bumper. Pattern consistent with animal collision.",
      },
      {
        url: "/car-hood-damage-close-up.jpg",
        caption: "Hood impact damage",
        analysis: "Hood shows significant impact denting from animal strike.",
      },
    ],
    timeline: [
      { date: "10/10/2025 07:20 PM", event: "Claim submitted", actor: "Jennifer Martinez" },
      { date: "10/10/2025 07:21 PM", event: "AI analysis completed - Confidence: 88%", actor: "System" },
      { date: "10/10/2025 07:22 PM", event: "Routed to agent for review (confidence below 90%)", actor: "System" },
      { date: "10/11/2025 09:00 AM", event: "Police report verified", actor: "Mike Chen" },
      { date: "10/11/2025 09:15 AM", event: "Claim approved by adjuster", actor: "Mike Chen" },
    ],
  },
  {
    id: "CLM-2025-009",
    policyholder: "Lisa Thompson",
    policyNumber: "POL-2024-2345",
    email: "lisa.thompson@email.com",
    phone: "(555) 012-3456",
    vehicle: "2023 Hyundai Tucson",
    vin: "5NMJC3DH5PH123456",
    incidentDate: "10/14/2025",
    dateSubmitted: "10/15/2025",
    lastUpdated: "10/15/2025",
    incidentLocation: "Highway 280, San Francisco, CA",
    incidentDescription:
      "Rock kicked up by vehicle ahead struck windshield causing chip. Chip is spreading into crack. Need immediate repair to prevent further damage.",
    estimatedCost: 350,
    status: "Approved",
    confidenceScore: 95,
    source: "ai-assessed",
    aiAnalysis: {
      damageAssessment:
        "Small chip in windshield with beginning crack propagation. Typical road debris damage. Immediate repair recommended to prevent full windshield replacement.",
      estimatedRepairCost: "$300 - $400",
      riskFactors: [],
      recommendation:
        "High confidence assessment. Approved immediately. Quick repair will prevent more expensive full replacement. Standard road hazard incident.",
    },
    photos: [
      {
        url: "/damaged-car-front-bumper.jpg",
        caption: "Windshield chip",
        analysis: "Small chip with crack beginning to spread. Typical impact damage from road debris.",
      },
    ],
    timeline: [
      { date: "10/15/2025 07:15 AM", event: "Claim submitted", actor: "Lisa Thompson" },
      { date: "10/15/2025 07:16 AM", event: "AI analysis completed - Confidence: 95%", actor: "System" },
      { date: "10/15/2025 07:17 AM", event: "Routed to adjuster for approval (high confidence)", actor: "System" },
      { date: "10/15/2025 08:00 AM", event: "Fast-track approved by adjuster", actor: "System" },
    ],
  },
  {
    id: "CLM-2025-011",
    policyholder: "Patricia Garcia",
    policyNumber: "POL-2024-5678",
    email: "patricia.garcia@email.com",
    phone: "(555) 234-5678",
    vehicle: "2022 Nissan Rogue",
    vin: "5N1AT3CA5NC123456",
    incidentDate: "10/09/2025",
    dateSubmitted: "10/11/2025",
    lastUpdated: "10/12/2025",
    incidentLocation: "Grocery store parking lot, Phoenix, AZ",
    incidentDescription:
      "Door ding from adjacent vehicle. Small dent and paint chip on driver door. Other vehicle left before I returned.",
    estimatedCost: 650,
    status: "Approved",
    confidenceScore: 90,
    source: "ai-assessed",
    aiAnalysis: {
      damageAssessment:
        "Small dent with paint chip on driver door edge. Damage consistent with door-to-door contact in parking lot.",
      estimatedRepairCost: "$600 - $700",
      riskFactors: [],
      recommendation:
        "High confidence assessment. Common parking lot incident. Damage and cost assessment reasonable. Approved.",
    },
    photos: [
      {
        url: "/car-damage-side-angle.jpg",
        caption: "Door ding damage",
        analysis: "Small dent with paint transfer on door edge. Typical parking lot door ding.",
      },
    ],
    timeline: [
      { date: "10/11/2025 05:45 PM", event: "Claim submitted", actor: "Patricia Garcia" },
      { date: "10/11/2025 05:46 PM", event: "AI analysis completed - Confidence: 90%", actor: "System" },
      { date: "10/11/2025 05:47 PM", event: "Routed to adjuster for approval (high confidence)", actor: "System" },
      { date: "10/12/2025 10:30 AM", event: "Claim approved by adjuster", actor: "Lisa Park" },
    ],
  },
  {
    id: "CLM-2025-012",
    policyholder: "Daniel Brown",
    policyNumber: "POL-2024-8912",
    email: "daniel.brown@email.com",
    phone: "(555) 345-6789",
    vehicle: "2020 Volkswagen Jetta",
    vin: "3VWC57BU8LM123456",
    incidentDate: "10/13/2025",
    dateSubmitted: "10/14/2025",
    lastUpdated: "10/15/2025",
    incidentLocation: "Residential driveway, Boston, MA",
    incidentDescription:
      "Tree branch fell on vehicle during windstorm. Roof and rear windshield damaged. Branch removed by tree service. Weather service confirms high winds in area.",
    estimatedCost: 5200,
    status: "Approved",
    confidenceScore: 93,
    source: "ai-assessed",
    aiAnalysis: {
      damageAssessment:
        "Roof shows impact damage and denting. Rear windshield cracked. Damage pattern consistent with falling tree branch. Weather data confirms severe winds on incident date.",
      estimatedRepairCost: "$5,000 - $5,500",
      riskFactors: [],
      recommendation:
        "High confidence assessment. Clear weather-related incident with supporting documentation. Damage assessment accurate. Approved.",
    },
    photos: [
      {
        url: "/car-hood-damage-close-up.jpg",
        caption: "Roof damage",
        analysis: "Significant roof denting from tree branch impact. Damage pattern consistent with falling debris.",
      },
      {
        url: "/damaged-car-front-bumper.jpg",
        caption: "Rear windshield",
        analysis: "Rear windshield cracked from branch impact. Requires full replacement.",
      },
    ],
    timeline: [
      { date: "10/14/2025 09:00 AM", event: "Claim submitted", actor: "Daniel Brown" },
      { date: "10/14/2025 09:01 AM", event: "AI analysis completed - Confidence: 93%", actor: "System" },
      { date: "10/14/2025 09:02 AM", event: "Routed to adjuster for approval (high confidence)", actor: "System" },
      { date: "10/14/2025 02:30 PM", event: "Weather data verified", actor: "Mike Chen" },
      { date: "10/15/2025 10:00 AM", event: "Claim approved by adjuster", actor: "Mike Chen" },
    ],
  },
  {
    id: "CLM-2025-016",
    policyholder: "Steven Clark",
    policyNumber: "POL-2024-1234",
    email: "steven.clark@email.com",
    phone: "(555) 789-0123",
    vehicle: "2020 Mercedes-Benz C-Class",
    vin: "55SWF8DB5LU123456",
    incidentDate: "10/08/2025",
    dateSubmitted: "10/10/2025",
    lastUpdated: "10/12/2025",
    incidentLocation: "Home garage, Atlanta, GA",
    incidentDescription:
      "Garage door malfunctioned and closed on vehicle while exiting. Roof and rear hatch damaged. Garage door company confirms mechanical failure. Repair records available.",
    estimatedCost: 3800,
    status: "Approved",
    confidenceScore: 90,
    source: "ai-assessed",
    aiAnalysis: {
      damageAssessment:
        "Roof and rear hatch show impact damage from above. Damage pattern consistent with garage door closure. Garage door company report confirms mechanical failure.",
      estimatedRepairCost: "$3,600 - $4,000",
      riskFactors: [],
      recommendation:
        "High confidence assessment. Clear mechanical failure with third-party documentation. Damage assessment accurate. Policyholder may have subrogation claim against garage door company. Approved.",
    },
    photos: [
      {
        url: "/car-hood-damage-close-up.jpg",
        caption: "Roof damage",
        analysis: "Roof denting from garage door impact. Damage pattern consistent with downward force.",
      },
      {
        url: "/damaged-car-front-bumper.jpg",
        caption: "Rear hatch damage",
        analysis: "Rear hatch shows impact damage and paint scratching from garage door.",
      },
    ],
    timeline: [
      { date: "10/10/2025 09:15 AM", event: "Claim submitted", actor: "Steven Clark" },
      { date: "10/10/2025 09:16 AM", event: "AI analysis completed - Confidence: 90%", actor: "System" },
      { date: "10/10/2025 09:17 AM", event: "Routed to adjuster for approval (high confidence)", actor: "System" },
      { date: "10/11/2025 02:30 PM", event: "Garage door report reviewed", actor: "Lisa Park" },
      { date: "10/12/2025 10:45 AM", event: "Claim approved by adjuster", actor: "Lisa Park" },
      { date: "10/12/2025 10:50 AM", event: "Subrogation case opened", actor: "System" },
    ],
  },
  {
    id: "CLM-2025-017",
    policyholder: "Karen Thomas",
    policyNumber: "POL-2024-4567",
    email: "karen.thomas@email.com",
    phone: "(555) 890-1234",
    vehicle: "2023 Lexus RX",
    vin: "2T2HZMDA5PC123456",
    incidentDate: "10/13/2025",
    dateSubmitted: "10/15/2025",
    lastUpdated: "10/16/2025",
    incidentLocation: "Highway rest stop, Las Vegas, NV",
    incidentDescription:
      "Vehicle broken into while parked at rest stop. Window smashed, items stolen from interior. No damage to vehicle other than window. Police report filed.",
    estimatedCost: 450,
    status: "Approved",
    confidenceScore: 79,
    source: "agent-assessed",
    aiAnalysis: {
      damageAssessment:
        "Passenger window smashed. Glass fragments visible. No other vehicle damage reported. Theft claim separate from auto damage.",
      estimatedRepairCost: "$400 - $500",
      riskFactors: ["Break-in claim requires police report verification", "Stolen items claim filed separately"],
      recommendation:
        "Agent reviewed and verified police report. Auto damage claim for window replacement approved. Stolen items claim filed separately under comprehensive coverage.",
      lowConfidenceReasons: [
        "Break-in claim required police report verification",
        "Needed to confirm no other vehicle damage",
      ],
    },
    photos: [
      {
        url: "/car-damage-side-angle.jpg",
        caption: "Smashed window",
        analysis: "Passenger window completely shattered. Consistent with break-in. No other visible damage.",
      },
    ],
    timeline: [
      { date: "10/15/2025 12:00 PM", event: "Claim submitted", actor: "Karen Thomas" },
      { date: "10/15/2025 12:01 PM", event: "AI analysis completed - Confidence: 79%", actor: "System" },
      { date: "10/15/2025 12:02 PM", event: "Routed to agent for review (confidence below 90%)", actor: "System" },
      { date: "10/15/2025 03:30 PM", event: "Agent reviewed and requested police report", actor: "Agent" },
      { date: "10/16/2025 10:00 AM", event: "Police report verified and claim approved", actor: "Adjuster" },
    ],
  },

  // Adjuster Dashboard - Pending Additional Info Claims
  {
    id: "CLM-2025-002",
    policyholder: "Michael Chen",
    policyNumber: "POL-2024-9123",
    email: "michael.chen@email.com",
    phone: "(555) 876-5432",
    vehicle: "2021 Honda Accord",
    vin: "1HGCV1F36LA123789",
    incidentDate: "10/10/2025",
    dateSubmitted: "10/12/2025",
    lastUpdated: "10/13/2025",
    incidentLocation: "Parking lot, 123 Main St, Seattle, WA",
    incidentDescription:
      "Returned to my parked vehicle to find damage to the driver side door. Another vehicle appears to have struck my car while parking. No note was left. Security camera footage requested from property management.",
    estimatedCost: 1800,
    status: "Pending Additional Info",
    confidenceScore: 78,
    source: "agent-assessed",
    aiAnalysis: {
      damageAssessment:
        "Driver side door shows scraping and denting consistent with side-swipe impact. Paint transfer visible.",
      estimatedRepairCost: "$1,600 - $2,000",
      riskFactors: [
        "No witness information available",
        "Awaiting security footage",
        "Hit-and-run scenario requires police report",
      ],
      recommendation:
        "Agent reviewed. Pending receipt of security footage and police report. Damage assessment appears accurate.",
      lowConfidenceReasons: [
        "No witness information to corroborate incident",
        "Security footage not yet provided",
        "Hit-and-run claims require additional verification",
      ],
    },
    photos: [
      {
        url: "/damaged-car-front-bumper.jpg",
        caption: "Driver side door damage",
        analysis: "Scraping and denting on driver side door. Paint transfer suggests contact with another vehicle.",
      },
    ],
    timeline: [
      { date: "10/12/2025 03:45 PM", event: "Claim submitted", actor: "Michael Chen" },
      { date: "10/12/2025 03:46 PM", event: "AI analysis completed - Confidence: 78%", actor: "System" },
      { date: "10/12/2025 03:47 PM", event: "Routed to agent for review (confidence below 90%)", actor: "System" },
      { date: "10/13/2025 10:20 AM", event: "Agent reviewed and forwarded to adjuster", actor: "Agent" },
      { date: "10/13/2025 02:30 PM", event: "Additional documentation requested by adjuster", actor: "Adjuster" },
    ],
  },
  {
    id: "CLM-2025-008",
    policyholder: "James Anderson",
    policyNumber: "POL-2024-4567",
    email: "james.anderson@email.com",
    phone: "(555) 901-2345",
    vehicle: "2020 Mazda CX-5",
    vin: "JM3KFBDM5L0123456",
    incidentDate: "10/11/2025",
    dateSubmitted: "10/13/2025",
    lastUpdated: "10/14/2025",
    incidentLocation: "Downtown parking garage, Chicago, IL",
    incidentDescription:
      "Side mirror clipped by passing vehicle in narrow parking garage. Mirror housing cracked, glass intact. Other vehicle did not stop.",
    estimatedCost: 450,
    status: "Pending Additional Info",
    confidenceScore: 82,
    source: "agent-assessed",
    aiAnalysis: {
      damageAssessment:
        "Side mirror housing shows impact damage. Glass mirror intact. Damage consistent with side-swipe in confined space.",
      estimatedRepairCost: "$400 - $500",
      riskFactors: ["No witness information", "Other vehicle not identified", "Parking garage footage requested"],
      recommendation:
        "Agent reviewed. Pending security footage review. Damage assessment reasonable for mirror replacement.",
      lowConfidenceReasons: [
        "No witness information available",
        "Other vehicle not identified",
        "Awaiting parking garage security footage",
      ],
    },
    photos: [
      {
        url: "/car-damage-side-angle.jpg",
        caption: "Side mirror damage",
        analysis: "Mirror housing cracked from impact. Glass remains intact and functional.",
      },
    ],
    timeline: [
      { date: "10/13/2025 04:20 PM", event: "Claim submitted", actor: "James Anderson" },
      { date: "10/13/2025 04:21 PM", event: "AI analysis completed - Confidence: 82%", actor: "System" },
      { date: "10/13/2025 04:22 PM", event: "Routed to agent for review (confidence below 90%)", actor: "System" },
      { date: "10/14/2025 09:45 AM", event: "Agent reviewed and requested additional info", actor: "Agent" },
      { date: "10/14/2025 02:00 PM", event: "Security footage requested", actor: "Adjuster" },
    ],
  },
  {
    id: "CLM-2025-014",
    policyholder: "Kevin Wilson",
    policyNumber: "POL-2024-6789",
    email: "kevin.wilson@email.com",
    phone: "(555) 567-8901",
    vehicle: "2021 Audi A4",
    vin: "WAUFFAFL5MN123456",
    incidentDate: "10/11/2025",
    dateSubmitted: "10/13/2025",
    lastUpdated: "10/14/2025",
    incidentLocation: "Office parking lot, Dallas, TX",
    incidentDescription:
      "Keyed along passenger side. Long scratch from front to rear door. Security footage shows vandalism occurred overnight. Police report filed.",
    estimatedCost: 1800,
    status: "Pending Additional Info",
    confidenceScore: 75,
    source: "agent-assessed",
    aiAnalysis: {
      damageAssessment:
        "Long continuous scratch along passenger side panels. Damage consistent with intentional keying. No impact damage present.",
      estimatedRepairCost: "$1,700 - $1,900",
      riskFactors: ["Vandalism claim requires police report verification", "Security footage review pending"],
      recommendation:
        "Agent reviewed. Pending police report and security footage verification. Damage assessment accurate for paint repair.",
      lowConfidenceReasons: [
        "Vandalism claim requires police report verification",
        "Security footage review pending",
        "Need to confirm no pre-existing damage",
      ],
    },
    photos: [
      {
        url: "/car-damage-side-angle.jpg",
        caption: "Keyed passenger side",
        analysis: "Long continuous scratch visible along passenger side. Consistent with intentional vandalism.",
      },
    ],
    timeline: [
      { date: "10/13/2025 08:30 AM", event: "Claim submitted", actor: "Kevin Wilson" },
      { date: "10/13/2025 08:31 AM", event: "AI analysis completed - Confidence: 75%", actor: "System" },
      { date: "10/13/2025 08:32 AM", event: "Routed to agent for review (confidence below 90%)", actor: "System" },
      { date: "10/13/2025 03:00 PM", event: "Agent reviewed and requested verification", actor: "Agent" },
      { date: "10/14/2025 11:00 AM", event: "Police report and footage requested", actor: "Adjuster" },
    ],
  },
  {
    id: "CLM-2025-015",
    policyholder: "Nancy Martinez",
    policyNumber: "POL-2024-9012",
    email: "nancy.martinez@email.com",
    phone: "(555) 678-9012",
    vehicle: "2022 Volvo XC90",
    vin: "YV4A22PK5N1123456",
    incidentDate: "10/14/2025",
    dateSubmitted: "10/15/2025",
    lastUpdated: "10/15/2025",
    incidentLocation: "Intersection of 5th and Main, Minneapolis, MN",
    incidentDescription:
      "T-bone collision at intersection. Other driver ran red light. Multiple witnesses. Significant damage to driver side. Airbags deployed. Police report filed.",
    estimatedCost: 12500,
    status: "Pending Additional Info",
    confidenceScore: 76,
    source: "agent-assessed",
    aiAnalysis: {
      damageAssessment:
        "Significant side impact damage. Driver door, B-pillar, and rear door damaged. Airbag deployment confirmed. Damage consistent with T-bone collision.",
      estimatedRepairCost: "$12,000 - $15,000",
      riskFactors: [
        "High-value claim requires thorough investigation",
        "Liability determination pending police report review",
        "Structural damage may require additional inspection",
        "Potential total loss - need professional appraisal",
      ],
      recommendation:
        "Agent reviewed. Full investigation required. Verify police report and witness statements. Arrange professional damage assessment to determine if vehicle is repairable or total loss.",
      lowConfidenceReasons: [
        "High-value claim with potential for significant damage",
        "Liability determination pending further review",
        "Need for professional damage assessment",
      ],
    },
    photos: [
      {
        url: "/car-damage-side-angle.jpg",
        caption: "Driver side impact",
        analysis: "Severe side impact damage. Structural integrity compromised. Professional assessment required.",
      },
      {
        url: "/damaged-car-front-bumper.jpg",
        caption: "Deployed airbags",
        analysis: "Side airbags deployed. Confirms significant impact force.",
      },
    ],
    timeline: [
      { date: "10/15/2025 10:30 AM", event: "Claim submitted", actor: "Nancy Martinez" },
      { date: "10/15/2025 10:31 AM", event: "AI analysis completed - Confidence: 76%", actor: "System" },
      { date: "10/15/2025 10:32 AM", event: "Routed to agent for review (confidence below 90%)", actor: "System" },
      { date: "10/15/2025 11:00 AM", event: "High-value claim flagged", actor: "System" },
      { date: "10/15/2025 02:00 PM", event: "Senior adjuster assigned", actor: "Mike Chen" },
    ],
  },
]

export function getClaimById(claimId: string): Claim | undefined {
  const storedClaims = localStorage.getItem("mockClaims")
  const claims = storedClaims ? JSON.parse(storedClaims) : mockClaims
  return claims.find((claim: Claim) => claim.id === claimId)
}

export function getClaimsByStatus(status: Claim["status"]): Claim[] {
  const storedClaims = localStorage.getItem("mockClaims")
  const claims = storedClaims ? JSON.parse(storedClaims) : mockClaims
  return claims.filter((claim: Claim) => claim.status === status)
}

export function getAllClaims(): Claim[] {
  const storedClaims = localStorage.getItem("mockClaims")
  return storedClaims ? JSON.parse(storedClaims) : mockClaims
}

export function updateClaim(updatedClaim: Claim): void {
  const storedClaims = localStorage.getItem("mockClaims")
  const claims = storedClaims ? JSON.parse(storedClaims) : mockClaims
  const index = claims.findIndex((claim: Claim) => claim.id === updatedClaim.id)
  if (index !== -1) {
    claims[index] = updatedClaim
    localStorage.setItem("mockClaims", JSON.stringify(claims))
  }
}
