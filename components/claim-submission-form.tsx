"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, X, CheckCircle2, ArrowLeft, ImageIcon } from "lucide-react"
import Link from "next/link"
import { generateAIAssessment, saveClaim } from "@/lib/ai-assessment-service"
import { useRouter } from "next/navigation"

interface UploadedFile {
  id: string
  name: string
  url: string
  preview: string
}

export function ClaimSubmissionForm() {
  const router = useRouter()
  const [step, setStep] = useState<"form" | "success">("form")
  const [submittedClaimId, setSubmittedClaimId] = useState<string>("")
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [formData, setFormData] = useState({
    policyId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    vinNumber: "",
    incidentLocation: "",
    vehicle: "",
    incidentDate: "",
    incidentDescription: "",
  })

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const newFile: UploadedFile = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          url: event.target?.result as string,
          preview: event.target?.result as string,
        }
        setUploadedFiles((prev) => [...prev, newFile])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    console.log("[v0] Form submission started")
    console.log("[v0] Form data:", formData)
    console.log("[v0] Uploaded files count:", uploadedFiles.length)

    if (uploadedFiles.length === 0) {
      console.log("[v0] Submission blocked: No photos uploaded")
      alert("Please upload at least one photo of the damage before submitting.")
      return
    }

    console.log("[v0] Submitting claim with", uploadedFiles.length, "photos")

    const claim = generateAIAssessment({
      policyId: formData.policyId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      vinNumber: formData.vinNumber,
      incidentLocation: formData.incidentLocation,
      vehicle: formData.vehicle,
      incidentDate: formData.incidentDate,
      incidentDescription: formData.incidentDescription,
      photos: uploadedFiles,
    })

    console.log(
      "[v0] Generated claim:",
      claim.id,
      "with confidence:",
      claim.confidenceScore,
      "and source:",
      claim.source,
    )

    saveClaim(claim)
    setSubmittedClaimId(claim.id)
    setStep("success")
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full p-12 text-center bg-card border-border">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
          </div>
          <h1 className="text-3xl font-semibold mb-4">Claim Submitted Successfully</h1>
          <p className="text-muted-foreground mb-2">Your claim ID: {submittedClaimId}</p>

          <div className="flex gap-4 justify-center mt-8">
            <Button onClick={() => router.push("/?view=policyholder")} variant="outline">
              Cancel
            </Button>
            <Button
              onClick={() => {
                setStep("form")
                setFormData({
                  policyId: "",
                  firstName: "",
                  lastName: "",
                  email: "",
                  phone: "",
                  vinNumber: "",
                  incidentLocation: "",
                  vehicle: "",
                  incidentDate: "",
                  incidentDescription: "",
                })
                setUploadedFiles([])
              }}
              className="bg-gradient-blob text-white"
            >
              Submit Another Claim
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="w-8 h-8 bg-gradient-blob rounded-lg" />
            <h1 className="text-xl font-semibold">Claims AI</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold mb-3 text-balance">Submit a New Claim</h1>
          <p className="text-muted-foreground text-lg">Provide your policy details and upload photos of the damage.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Policy Information */}
          <Card className="p-8 mb-6 bg-card border-border">
            <h2 className="text-2xl font-semibold mb-6">Policy Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="policyId">Policy ID *</Label>
                <Input
                  id="policyId"
                  placeholder="POL-123456"
                  required
                  value={formData.policyId}
                  onChange={(e) => setFormData({ ...formData, policyId: e.target.value })}
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-secondary border-border"
                />
              </div>
            </div>
          </Card>

          {/* Vehicle & Incident Details */}
          <Card className="p-8 mb-6 bg-card border-border">
            <h2 className="text-2xl font-semibold mb-6">Vehicle & Incident Details</h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="vehicle">Vehicle Information *</Label>
                <Input
                  id="vehicle"
                  placeholder="e.g., 2022 Toyota Camry"
                  required
                  value={formData.vehicle}
                  onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                  className="bg-secondary border-border"
                />
                <p className="text-sm text-muted-foreground">Year, Make, and Model</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vinNumber">VIN Number *</Label>
                <Input
                  id="vinNumber"
                  placeholder="1HGBH41JXMN109186"
                  required
                  value={formData.vinNumber}
                  onChange={(e) => setFormData({ ...formData, vinNumber: e.target.value })}
                  className="bg-secondary border-border font-mono"
                />
                <p className="text-sm text-muted-foreground">17-character Vehicle Identification Number</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="incidentLocation">Incident Location *</Label>
                <Input
                  id="incidentLocation"
                  placeholder="e.g., Interstate 95, Exit 42, Baltimore, MD"
                  required
                  value={formData.incidentLocation}
                  onChange={(e) => setFormData({ ...formData, incidentLocation: e.target.value })}
                  className="bg-secondary border-border"
                />
                <p className="text-sm text-muted-foreground">Street address, intersection, or general location</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="incidentDate">Date of Incident *</Label>
                <Input
                  id="incidentDate"
                  type="date"
                  required
                  value={formData.incidentDate}
                  onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                  className="bg-secondary border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="incidentDescription">Incident Description *</Label>
                <Textarea
                  id="incidentDescription"
                  placeholder="Please describe what happened, including location, weather conditions, and any other relevant details..."
                  required
                  value={formData.incidentDescription}
                  onChange={(e) => setFormData({ ...formData, incidentDescription: e.target.value })}
                  className="bg-secondary border-border min-h-32"
                />
              </div>
            </div>
          </Card>

          {/* Photo Upload */}
          <Card className="p-8 mb-6 bg-card border-border">
            <h2 className="text-2xl font-semibold mb-2">Damage Photos *</h2>
            <p className="text-muted-foreground mb-6">
              Upload clear photos of all damaged areas. Include multiple angles for accurate and faster analysis.
            </p>

            <div className="mb-6">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG or HEIC (MAX. 10MB each)</p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </label>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-secondary border border-border">
                      <img
                        src={file.preview || "/placeholder.svg"}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <p className="text-xs text-muted-foreground mt-2 truncate">{file.name}</p>
                  </div>
                ))}
              </div>
            )}

            {uploadedFiles.length === 0 && (
              <div className="flex items-center gap-3 p-4 bg-accent/5 border border-accent/20 rounded-lg">
                <ImageIcon className="w-5 h-5 text-accent" />
                <p className="text-sm text-muted-foreground">No photos uploaded yet. Please add at least one photo.</p>
              </div>
            )}
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link href="/">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={uploadedFiles.length === 0}
              className="bg-gradient-blob text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Claim
            </Button>
          </div>
          {uploadedFiles.length === 0 && (
            <div className="flex justify-end mt-2">
              <p className="text-sm text-muted-foreground">Please upload at least one photo to submit your claim</p>
            </div>
          )}
        </form>
      </main>
    </div>
  )
}
