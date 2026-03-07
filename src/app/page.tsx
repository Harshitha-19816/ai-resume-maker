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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/shared/navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 pb-32 px-4 overflow-hidden">
        {/* Background blurs */}
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-600/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Resume Builder
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6">
            Build Your Perfect
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Resume in Minutes
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Create stunning, ATS-optimized resumes with AI-powered content
            generation, beautiful templates, and one-click PDF export.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/templates">
              <Button
                size="lg"
                className="text-base px-8 py-6 gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 shadow-xl shadow-violet-500/25 border-0"
              >
                Browse Templates <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                variant="outline"
                size="lg"
                className="text-base px-8 py-6 border-white/10 text-gray-300 hover:text-white hover:bg-white/5"
              >
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 px-4 border-y border-white/5">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-12 sm:gap-16">
          {[
            { value: "10K+", label: "Resumes Created" },
            { value: "4", label: "Pro Templates" },
            { value: "95%", label: "ATS Pass Rate" },
            { value: "Free", label: "To Get Started" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                land your dream job
              </span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Professional tools designed to make resume building effortless.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Brain,
                title: "AI Content Generation",
                description:
                  "Generate professional summaries and enhance experience descriptions with AI in one click.",
                gradient: "from-violet-500/20 to-purple-500/20",
              },
              {
                icon: Palette,
                title: "Beautiful Templates",
                description:
                  "Choose from multiple professionally designed, ATS-friendly templates for every industry.",
                gradient: "from-blue-500/20 to-cyan-500/20",
              },
              {
                icon: Eye,
                title: "Live Preview",
                description:
                  "See real-time changes as you edit — split-panel editor shows exactly what recruiters see.",
                gradient: "from-cyan-500/20 to-teal-500/20",
              },
              {
                icon: Download,
                title: "PDF Export",
                description:
                  "Download your resume as a pixel-perfect PDF ready for job applications.",
                gradient: "from-green-500/20 to-emerald-500/20",
              },
              {
                icon: Share2,
                title: "Share Anywhere",
                description:
                  "Generate a public link to share your resume with recruiters instantly.",
                gradient: "from-orange-500/20 to-amber-500/20",
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description:
                  "Your data is encrypted and protected with row-level security. Only you control access.",
                gradient: "from-rose-500/20 to-pink-500/20",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl border border-white/5 bg-[#12121a] hover:border-white/10 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-lg text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-violet-600/10 via-blue-600/5 to-cyan-600/5 border border-violet-500/10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to build your resume?
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Join thousands of professionals creating standout resumes with AI.
            </p>
            <Link href="/templates">
              <Button
                size="lg"
                className="text-base px-10 py-6 gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 shadow-xl shadow-violet-500/25 border-0"
              >
                Get Started — It&apos;s Free <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileText className="w-4 h-4" />
            <span>AI Resume Studio © 2026</span>
          </div>
          <p className="text-sm text-gray-600">
            Built with Next.js, Supabase & AI
          </p>
        </div>
      </footer>
    </div>
  );
}
