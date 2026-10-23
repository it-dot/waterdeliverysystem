'use client'

import { useState } from 'react'
import { signup } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Droplets,
  Loader2,
  ArrowRight,
  Eye,
  EyeOff,
  Clock,
  ShieldCheck,
  CheckCircle2,
  CalendarCheck2,
  MapPin,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function SignupPage() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    try {
      const result = await signup(formData)
      if (result?.error) {
        toast.error(result.error)
      }
    } catch {
      toast.error('Failed to create account. Please check your network connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-full flex flex-col lg:flex-row bg-background">
      {/* =========================================
          LEFT / HERO PANEL (Customer Platform Value)
          ========================================= */}
      <div className="relative hidden lg:flex lg:w-1/2 xl:w-7/12 flex-col justify-between overflow-hidden bg-slate-950 p-12 text-slate-100">
        {/* Ambient background grid & hydrological lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.15),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        {/* Brand Header & Regional Status */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 backdrop-blur-md shadow-inner">
              <Droplets className="size-6" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Clearwell
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-medium tracking-normal bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Client Portal
                </span>
              </span>
              <span className="block text-[11px] font-mono text-slate-400 uppercase tracking-widest">
                Water Dispatch OS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1.5 rounded-full">
            <Sparkles className="size-3.5" /> Instant Account Activation
          </div>
        </div>

        {/* Value Proposition */}
        <div className="relative z-10 my-auto max-w-xl py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-800/40 mb-6">
            <Droplets className="size-3.5" /> Automated Water Replenishment
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl leading-tight">
            Reliable bulk water refills, tracked in real-time.
          </h2>
          <p className="mt-4 text-base text-slate-400 leading-relaxed">
            Eliminate dry tanks and operational downtime. Schedule recurring deliveries, request rapid emergency refills, and monitor station drop-offs live on your dashboard.
          </p>

          {/* Feature Highlights */}
          <div className="mt-8 space-y-3.5">
            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 mt-0.5">
                <CalendarCheck2 className="size-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Scheduled & On-Demand Dispatches</h4>
                <p className="text-xs text-slate-400 mt-0.5">Book recurring delivery windows or trigger urgent same-day tanker dispatches.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 mt-0.5">
                <MapPin className="size-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Live Station Telemetry & ETA</h4>
                <p className="text-xs text-slate-400 mt-0.5">Track your tanker&apos;s en-route progress and get digital proof of delivery with metered volume logs.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Footprint */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-cyan-400" />
              <span>Same-Day Available</span>
            </div>
            <div className="h-4 w-px bg-slate-800" />
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <span>Potable Certified Supply</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="size-4 text-cyan-400" />
            ISO 9001 Compliant
          </div>
        </div>
      </div>

      {/* =========================================
          RIGHT PANEL (Account Registration Form)
          ========================================= */}
      <div className="flex-1 flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-14 xl:px-20 bg-card overflow-y-auto">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile-only Brand Header */}
          <div className="flex lg:hidden items-center gap-3 mb-6">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
              <Droplets className="size-5" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-foreground">Clearwell</span>
              <span className="block text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                Water Dispatch OS
              </span>
            </div>
          </div>

          {/* Form Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Create your account
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Set up your delivery profile to order refills and dispatch water.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" aria-busy={loading}>
            <div className="space-y-1.5">
              <Label
                htmlFor="full_name"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Contact / Representative Name
              </Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                required
                placeholder="Maria Santos"
                className="h-10 text-sm focus-visible:ring-1"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Work or Business Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="maria@clearwell.com"
                className="h-10 text-sm focus-visible:ring-1"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  placeholder="Create a secure password"
                  className="h-10 text-sm pr-10 focus-visible:ring-1"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="phone"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Mobile Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="09171234567"
                  pattern="^(09|\+639)\d{9}$"
                  maxLength={13}
                  title="Please enter a valid Philippine mobile number (e.g. 09171234567)"
                  className="h-10 text-sm focus-visible:ring-1"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="address"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  Facility / Station Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Block 4, Lot 12..."
                  className="h-10 text-sm focus-visible:ring-1"
                />
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{' '}
              and acknowledge our{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>

            <Button
              type="submit"
              className="w-full h-10 mt-2 font-medium transition-all shadow-sm"
              disabled={loading}
              aria-live="polite"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  <span>Provisioning Account...</span>
                </>
              ) : (
                <>
                  <span>Create account</span>
                  <ArrowRight className="size-4 ml-1.5" />
                </>
              )}
            </Button>
          </form>

          {/* Footer Back to Login */}
          <div className="mt-6 text-center text-xs text-muted-foreground border-t border-border/70 pt-5">
            Already have an active station account?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign in to console
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="size-3 text-emerald-500" /> Certified Station Network
            </span>
            <span>•</span>
            <span>256-bit TLS Protection</span>
          </div>
        </div>
      </div>
    </main>
  )
}