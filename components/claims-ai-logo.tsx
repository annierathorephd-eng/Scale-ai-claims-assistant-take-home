import { Shield } from "lucide-react"

export function ClaimsAILogo({ size = "default" }: { size?: "default" | "large" }) {
  const iconSize = size === "large" ? "w-10 h-10" : "w-8 h-8"
  const textSize = size === "large" ? "text-2xl" : "text-xl"

  return (
    <div className="flex items-center gap-3">
      <div className={`${iconSize} bg-gradient-blob rounded-lg flex items-center justify-center`}>
        <Shield className={`${size === "large" ? "w-6 h-6" : "w-5 h-5"} text-white`} />
      </div>
      <h1 className={`${textSize} font-semibold`}>
        Claims <span className="gradient-text">AI</span>
      </h1>
    </div>
  )
}
