"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Sparkles, ThumbsUp, ThumbsDown, CheckCircle2, AlertCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AIFeedbackDialogProps {
  claimId: string
  aiConfidence: number
  estimatedCost: number
}

type FeedbackRating = "positive" | "negative" | null
type FeedbackCategory =
  | "accuracy"
  | "relevance"
  | "cost-estimation"
  | "damage-detection"
  | "image-analysis"
  | "false-positive"
  | "false-negative"
  | "other"

interface FeedbackCategoryOption {
  value: FeedbackCategory
  label: string
  description: string
  icon: typeof CheckCircle2
}

const positiveFeedbackCategories: FeedbackCategoryOption[] = [
  {
    value: "accuracy",
    label: "Accurate Assessment",
    description: "AI correctly identified damage and severity",
    icon: CheckCircle2,
  },
  {
    value: "cost-estimation",
    label: "Cost Accuracy",
    description: "Estimated costs were accurate and reasonable",
    icon: CheckCircle2,
  },
  {
    value: "damage-detection",
    label: "Damage Detection",
    description: "All damage was properly detected and categorized",
    icon: CheckCircle2,
  },
  {
    value: "image-analysis",
    label: "Image Analysis",
    description: "AI effectively analyzed photo quality and content",
    icon: CheckCircle2,
  },
]

const negativeFeedbackCategories: FeedbackCategoryOption[] = [
  {
    value: "accuracy",
    label: "Inaccurate Assessment",
    description: "AI misidentified damage type or severity",
    icon: XCircle,
  },
  {
    value: "cost-estimation",
    label: "Cost Estimation Error",
    description: "Estimated costs were significantly off",
    icon: AlertCircle,
  },
  {
    value: "false-positive",
    label: "False Positive",
    description: "AI detected damage that doesn't exist",
    icon: XCircle,
  },
  {
    value: "false-negative",
    label: "Missed Damage",
    description: "AI failed to detect actual damage",
    icon: AlertCircle,
  },
  {
    value: "image-analysis",
    label: "Image Analysis Issue",
    description: "AI struggled with photo quality or angles",
    icon: AlertCircle,
  },
  {
    value: "other",
    label: "Other Issue",
    description: "Different problem not listed above",
    icon: AlertCircle,
  },
]

export function AIFeedbackDialog({ claimId, aiConfidence, estimatedCost }: AIFeedbackDialogProps) {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState<FeedbackRating>(null)
  const [selectedCategories, setSelectedCategories] = useState<FeedbackCategory[]>([])
  const [additionalComments, setAdditionalComments] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleRatingChange = (newRating: FeedbackRating) => {
    setRating(newRating)
    setSelectedCategories([]) // Reset categories when rating changes
  }

  const toggleCategory = (category: FeedbackCategory) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  const handleSubmit = async () => {
    if (!rating) {
      toast({
        title: "Rating Required",
        description: "Please select whether the AI assessment was helpful or not.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call to submit feedback
    const feedbackData = {
      claimId,
      rating,
      categories: selectedCategories,
      comments: additionalComments,
      aiConfidence,
      estimatedCost,
      timestamp: new Date().toISOString(),
    }

    console.log("[v0] AI Feedback submitted:", feedbackData)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    setIsSubmitting(false)
    setOpen(false)

    toast({
      title: "Feedback Submitted",
      description: "Thank you! Your feedback helps improve our AI model.",
    })

    // Reset form
    setRating(null)
    setSelectedCategories([])
    setAdditionalComments("")
  }

  const handleCancel = () => {
    setOpen(false)
    // Reset form after dialog closes
    setTimeout(() => {
      setRating(null)
      setSelectedCategories([])
      setAdditionalComments("")
    }, 200)
  }

  const currentCategories = rating === "positive" ? positiveFeedbackCategories : negativeFeedbackCategories

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-accent/50 text-accent hover:bg-accent/10 hover:text-accent bg-transparent"
        >
          <Sparkles className="w-4 h-4" />
          AI Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-blob flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl">Improve AI Assessment</DialogTitle>
              <DialogDescription className="text-sm">
                Help us train better models by providing feedback on this AI analysis
              </DialogDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Badge variant="outline" className="text-xs">
              Claim: {claimId}
            </Badge>
            <Badge variant="outline" className="text-xs">
              AI Confidence: {(aiConfidence * 100).toFixed(0)}%
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Rating Selection */}
          <div>
            <label className="text-sm font-semibold mb-3 block">
              How would you rate this AI assessment?
              <span className="text-destructive ml-1">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRatingChange("positive")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  rating === "positive"
                    ? "border-success bg-success/10"
                    : "border-border hover:border-success/50 hover:bg-success/5"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <ThumbsUp className={`w-6 h-6 ${rating === "positive" ? "text-success" : "text-muted-foreground"}`} />
                  <span className={`font-medium ${rating === "positive" ? "text-success" : "text-foreground"}`}>
                    Helpful
                  </span>
                  <span className="text-xs text-muted-foreground text-center">AI assessment was accurate</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleRatingChange("negative")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  rating === "negative"
                    ? "border-destructive bg-destructive/10"
                    : "border-border hover:border-destructive/50 hover:bg-destructive/5"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <ThumbsDown
                    className={`w-6 h-6 ${rating === "negative" ? "text-destructive" : "text-muted-foreground"}`}
                  />
                  <span className={`font-medium ${rating === "negative" ? "text-destructive" : "text-foreground"}`}>
                    Not Helpful
                  </span>
                  <span className="text-xs text-muted-foreground text-center">AI assessment had issues</span>
                </div>
              </button>
            </div>
          </div>

          {/* Category Selection */}
          {rating && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-sm font-semibold block">
                {rating === "positive" ? "What did the AI do well?" : "What issues did you find?"}
                <span className="text-muted-foreground font-normal ml-2">(Select all that apply)</span>
              </label>
              <div className="grid gap-2">
                {currentCategories.map((category) => {
                  const Icon = category.icon
                  const isSelected = selectedCategories.includes(category.value)
                  return (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() => toggleCategory(category.value)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        isSelected
                          ? rating === "positive"
                            ? "border-success bg-success/10"
                            : "border-destructive bg-destructive/10"
                          : "border-border hover:border-accent/50 hover:bg-accent/5"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon
                          className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                            isSelected
                              ? rating === "positive"
                                ? "text-success"
                                : "text-destructive"
                              : "text-muted-foreground"
                          }`}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm mb-0.5">{category.label}</div>
                          <div className="text-xs text-muted-foreground">{category.description}</div>
                        </div>
                        {isSelected && (
                          <CheckCircle2
                            className={`w-5 h-5 flex-shrink-0 ${
                              rating === "positive" ? "text-success" : "text-destructive"
                            }`}
                          />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Additional Comments */}
          {rating && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-sm font-semibold block">
                Additional Comments
                <span className="text-muted-foreground font-normal ml-2">(Optional)</span>
              </label>
              <Textarea
                placeholder={
                  rating === "positive"
                    ? "Share any additional positive observations about the AI assessment..."
                    : "Describe the specific issues or provide suggestions for improvement..."
                }
                value={additionalComments}
                onChange={(e) => setAdditionalComments(e.target.value)}
                className="min-h-[100px] bg-secondary/50 border-border resize-none"
                maxLength={1000}
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  This feedback is used solely for model training, not case documentation
                </p>
                <span className="text-xs text-muted-foreground">{additionalComments.length}/1000</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!rating || isSubmitting} className="gap-2">
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Submit Feedback
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
