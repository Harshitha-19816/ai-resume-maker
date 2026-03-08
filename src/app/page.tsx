import Link from "next/link";
import {
  FileText,
  Sparkles,
  Download,
  Share2,
  ArrowRight,
  Zap,
  Shield,
  Palette,
  Eye,
  Brain,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/shared/navbar";

const FEATURES = [
  {
    icon: Brain,
    title: "AI-Powered Content",
    description: "Generate professional summaries and bullet points with a single click.",
    gradient: "from-emerald-500 to-cyan-500",
  },
  {
    icon: Palette,
    title: "Beautiful Templates",
    description: "Choose from 4 professionally designed templates that stand out.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: Download,
    title: "One-Click Export",
    description: "Download your resume as a perfectly formatted PDF instantly.",
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    icon: Eye,
    title: "Live Preview",
    description: "See changes in real-time as you type with our split-panel editor.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Shield,
    title: "ATS Optimized",
    description: "Built-in optimization ensures your resume passes screening systems.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Share2,
    title: "Share Anywhere",
    description: "Generate a public link to share your resume with recruiters.",
    gradient: "from-pink-500 to-rose-500",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Choose a Template",
    description: "Pick from our collection of professional, ATS-friendly resume templates.",
  },
  {
    step: "02",
    title: "Fill in Your Details",
    description: "Use our guided editor with AI assistance to craft perfect content.",
  },
  {
    step: "03",
    title: "Download & Share",
    description: "Export as PDF or share via a public link — ready in minutes.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#060918] noise-overlay">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="aurora-hero absolute inset-0" />

        {/* Floating orbs */}
        <div className="absolute top-20 left-[15%] w-72 h-72 bg-emerald-500/8 rounded-full blur-[120px] animate-glow" />
        <div className="absolute bottom-10 right-[10%] w-96 h-96 bg-cyan-500/6 rounded-full blur-[140px] animate-glow delay-200" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-up opacity-0">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-slate-300 font-medium">AI-Powered Resume Builder</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 animate-fade-up opacity-0 delay-100">
            <span className="text-slate-100">Build Resumes That</span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
              Land Interviews
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up opacity-0 delay-200">
            Create stunning, ATS-optimized resumes with AI-powered content
            generation, beautiful templates, and instant PDF export.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up opacity-0 delay-300">
            <Link href="/signup">
              <Button
                size="lg"
                className="text-base px-8 py-6 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white border-0 rounded-2xl shadow-lg shadow-emerald-500/25 font-semibold gap-2"
              >
                Start Building <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/templates">
              <Button
                variant="outline"
                size="lg"
                className="text-base px-8 py-6 border-slate-700/50 text-slate-300 hover:text-white hover:bg-white/5 rounded-2xl gap-2"
              >
                See Templates <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative py-8 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {[
            { value: "10,000+", label: "Resumes Created" },
            { value: "4", label: "Pro Templates" },
            { value: "AI", label: "Powered Content" },
            { value: "100%", label: "ATS Friendly" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-slate-100">{stat.value}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
              Everything You Need to{" "}
              <span className="text-emerald-400">Stand Out</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Professional tools designed to help you create the perfect resume in minutes, not hours.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="glass-card rounded-2xl p-6 group cursor-default"
                >
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 aurora-bg" />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
              Three Steps to Your{" "}
              <span className="text-cyan-400">Dream Resume</span>
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto">
              Our guided process makes it effortless to go from blank page to polished resume.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((item, i) => (
              <div key={item.step} className="relative text-center">
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t border-dashed border-slate-700/50" />
                )}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
                  <span className="text-xl font-bold text-emerald-400">{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center glass-card rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-cyan-500/8 rounded-full blur-[80px]" />

          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
              Ready to Build Your Resume?
            </h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Join thousands of professionals who&apos;ve landed their dream jobs with AI Resume Studio.
            </p>
            <Link href="/signup">
              <Button
                size="lg"
                className="text-base px-10 py-6 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white border-0 rounded-2xl shadow-lg shadow-emerald-500/25 font-semibold gap-2"
              >
                Get Started — It&apos;s Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                  <FileText className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-slate-200">
                  AI Resume <span className="text-emerald-400">Studio</span>
                </span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Build professional, ATS-optimized resumes with the power of AI. Free to use, always.
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Product</h4>
                <div className="space-y-2">
                  <Link href="/templates" className="block text-sm text-slate-500 hover:text-emerald-400 transition-colors">Templates</Link>
                  <Link href="/dashboard" className="block text-sm text-slate-500 hover:text-emerald-400 transition-colors">Dashboard</Link>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Account</h4>
                <div className="space-y-2">
                  <Link href="/login" className="block text-sm text-slate-500 hover:text-emerald-400 transition-colors">Sign In</Link>
                  <Link href="/signup" className="block text-sm text-slate-500 hover:text-emerald-400 transition-colors">Sign Up</Link>
                </div>
              </div>
            </div>

            {/* Legal */}
            <div className="text-right">
              <p className="text-xs text-slate-600">
                Built with Next.js, Supabase & AI
              </p>
              <p className="text-xs text-slate-600 mt-1">
                © 2026 AI Resume Studio — All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
