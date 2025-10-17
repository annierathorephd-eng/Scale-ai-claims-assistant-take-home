import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ClaimsAILogo } from "@/components/claims-ai-logo"
import { ArrowRight, Zap, Shield, Clock, CheckCircle2, Sparkles, Brain, FileCheck } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <ClaimsAILogo className="w-8 h-8" />
              <span className="text-xl font-semibold">Claims AI</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </Link>
              <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Button asChild size="sm">
                <Link href="/">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-background to-background" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 px-4 py-1.5">
              <Sparkles className="w-3 h-3 mr-1.5" />
              Powered by Advanced AI
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-balance">
              Process insurance claims <span className="gradient-text">10x faster</span> with AI
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty leading-relaxed">
              Automate claim assessment, damage analysis, and routing with intelligent AI that learns from every claim.
              Reduce processing time from days to minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="text-base px-8">
                <Link href="/">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base px-8 bg-transparent">
                <Link href="#demo">Watch Demo</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">No credit card required • 14-day free trial</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border/50 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "10x", label: "Faster Processing", subtext: "vs manual review" },
              { value: "95%", label: "Accuracy Rate", subtext: "in damage assessment" },
              { value: "60%", label: "Cost Reduction", subtext: "in claim operations" },
              { value: "24/7", label: "Availability", subtext: "automated processing" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2 gradient-text">{stat.value}</div>
                <div className="text-sm font-medium mb-1">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.subtext}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
              Everything you need to process claims intelligently
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Our AI-powered platform handles the entire claims workflow from submission to approval.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: "AI Damage Assessment",
                description: "Automatically analyze photos to detect and assess vehicle damage with 95% accuracy.",
              },
              {
                icon: Zap,
                title: "Instant Processing",
                description:
                  "Process claims in minutes instead of days with automated workflows and intelligent routing.",
              },
              {
                icon: Shield,
                title: "Fraud Detection",
                description: "Advanced AI models identify suspicious patterns and flag potential fraud automatically.",
              },
              {
                icon: FileCheck,
                title: "Smart Routing",
                description:
                  "Automatically route claims to agents or adjusters based on confidence scores and complexity.",
              },
              {
                icon: Clock,
                title: "Real-time Updates",
                description: "Keep policyholders informed with automated status updates and transparent processing.",
              },
              {
                icon: CheckCircle2,
                title: "Compliance Ready",
                description: "Built-in compliance checks ensure every claim meets regulatory requirements.",
              },
            ].map((feature, i) => (
              <Card key={i} className="p-6 hover:border-accent/50 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 md:py-32 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              How It Works
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Simple, automated, intelligent</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              From submission to approval in three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Submit Claim",
                description:
                  "Policyholders upload photos and details through a simple form. AI instantly begins analysis.",
              },
              {
                step: "02",
                title: "AI Assessment",
                description:
                  "Our AI analyzes damage, estimates costs, and assigns confidence scores in seconds. High-confidence claims are auto-approved.",
              },
              {
                step: "03",
                title: "Smart Routing",
                description:
                  "Low-confidence claims are routed to agents for review. Adjusters handle final approvals with AI-generated insights.",
              },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-bold text-accent/20 mb-4">{step.step}</div>
                <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                {i < 2 && (
                  <ArrowRight className="hidden md:block absolute top-12 -right-8 w-6 h-6 text-muted-foreground/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm text-muted-foreground mb-8">Trusted by leading insurance companies</p>
            <div className="flex flex-wrap items-center justify-center gap-12 opacity-50">
              {["Allstate", "Progressive", "State Farm", "GEICO", "Liberty Mutual"].map((company, i) => (
                <div key={i} className="text-2xl font-semibold">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-card/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Ready to transform your claims process?</h2>
          <p className="text-xl text-muted-foreground mb-10 text-pretty">
            Join hundreds of insurance companies processing claims faster and more accurately with AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="text-base px-8">
              <Link href="/">
                Start Free Trial
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base px-8 bg-transparent">
              <Link href="#contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ClaimsAILogo className="w-6 h-6" />
                <span className="font-semibold">Claims AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered insurance claims processing for the modern era.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#demo" className="hover:text-foreground transition-colors">
                    Demo
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#about" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#careers" className="hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#privacy" className="hover:text-foreground transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#terms" className="hover:text-foreground transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#security" className="hover:text-foreground transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
            © 2025 Claims AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
