'use client'

import { useState } from 'react'
import { login, resetPassword } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Droplets,
  Loader2,
  ArrowRight,
  Eye,
  EyeOff,
  Gauge,
  Truck,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Mail,
  KeyRound,
  Radio,
  MapPin,
  Package,
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

type UserRole = 'admin' | 'rider' | 'customer'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [loadingRole, setLoadingRole] = useState<UserRole>('admin')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Forgot password modal state
  const [forgotOpen, setForgotOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetLoading, setResetLoading] = useState(false)

  const inferRoleFromEmail = (inputEmail: string): UserRole => {
    const lower = inputEmail.toLowerCase()
    if (lower.includes('rider') || lower.includes('dave') || lower.includes('chris') || lower.includes('mark') || lower.includes('alex') || lower.includes('zane')) {
      return 'rider'
    }
    if (lower.includes('customer') || lower.includes('juan') || lower.includes('john') || lower.includes('vince') || lower.includes('@example.com')) {
      return 'customer'
    }
    return 'admin'
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const targetRole = inferRoleFromEmail(email)
    setLoadingRole(targetRole)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    try {
      // Ensure skeleton is displayed smoothly during authentication
      const [result] = await Promise.all([
        login(formData),
        new Promise((resolve) => setTimeout(resolve, 600)),
      ])

      if (result?.error) {
        toast.error(result.error)
        setLoading(false)
        return
      }

      if (result?.redirectUrl) {
        if (result.redirectUrl.includes('/rider')) setLoadingRole('rider')
        else if (result.redirectUrl.includes('/customer')) setLoadingRole('customer')
        else setLoadingRole('admin')

        toast.success('Signed in successfully')
        window.location.href = result.redirectUrl
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.'
      toast.error(message)
      setLoading(false)
    }
  }

  // Quick helper for dev/demo mode supporting all roles
  const fillDemoCredentials = (role: 'dispatcher' | 'rider' | 'customer' = 'dispatcher') => {
    if (role === 'dispatcher') {
      setEmail('dispatcher@clearwell.com')
      setPassword('demo-station-2026')
      setLoadingRole('admin')
      toast.info('Loaded demo dispatcher credentials')
    } else if (role === 'rider') {
      setEmail('dave@clearwell.com')
      setPassword('password123')
      setLoadingRole('rider')
      toast.info('Loaded demo delivery rider credentials')
    } else {
      setEmail('juan@example.com')
      setPassword('password123')
      setLoadingRole('customer')
      toast.info('Loaded demo customer credentials')
    }
  }

  async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!resetEmail) {
      toast.error('Please enter your operator email')
      return
    }

    setResetLoading(true)
    try {
      const res = await resetPassword(resetEmail)
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success('Password reset link sent! Check your inbox.')
        setForgotOpen(false)
      }
    } catch {
      toast.error('Failed to send reset link. Please contact station administrator.')
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-full flex flex-col lg:flex-row bg-background">
      {/* =========================================
          LEFT / HERO PANEL (Enterprise Brand & Value)
          ========================================= */}
      <div className="relative hidden lg:flex lg:w-1/2 xl:w-7/12 flex-col justify-between overflow-hidden bg-slate-950 p-12 text-slate-100">
        {/* Subtle industrial background grid & ambient water glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.15),transparent_50%)] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"
        />

        {/* Top Branding & Live Telemetry Badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 backdrop-blur-md shadow-inner">
              <Droplets className="size-6" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Clearwell
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-medium tracking-normal bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  v3.8 LTS
                </span>
              </span>
              <span className="block text-[11px] font-mono text-slate-400 uppercase tracking-widest">
                Water Utility & Fleet Dispatch OS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-full">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            All 18 Hubs Operational
          </div>
        </div>

        {/* Main Value Proposition */}
        <div className="relative z-10 my-auto max-w-xl py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-800/40 mb-6">
            <Activity className="size-3.5" /> Next-Gen Hydrological Logistics
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl leading-tight">
            Precision control for municipal & bulk water operations.
          </h2>
          <p className="mt-4 text-base text-slate-400 leading-relaxed">
            Automating route optimization, tank level telemetry, flow rate monitoring, and rapid emergency water dispatch across regional networks.
          </p>

          {/* Key Product Capability Badges */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm">
              <div className="flex items-center gap-2.5 text-slate-200 font-semibold text-sm">
                <Truck className="size-4 text-cyan-400" /> Dynamic Route Queues
              </div>
              <p className="text-xs text-slate-400 mt-1">Real-time GPS routing with automated weigh-station integration.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm">
              <div className="flex items-center gap-2.5 text-slate-200 font-semibold text-sm">
                <Gauge className="size-4 text-cyan-400" /> SCADA & Flow Telemetry
              </div>
              <p className="text-xs text-slate-400 mt-1">Instant sync with reservoir sensors and automated cutoff valves.</p>
            </div>
          </div>
        </div>

        {/* Bottom Social Proof & Metrics */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-lg font-bold text-white font-mono">1.2M+ kL</p>
              <p className="text-[11px] text-slate-400">Monthly Dispatched</p>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <p className="text-lg font-bold text-white font-mono">&lt; 90s</p>
              <p className="text-[11px] text-slate-400">Avg Incident Response</p>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <p className="text-lg font-bold text-white font-mono">99.99%</p>
              <p className="text-[11px] text-slate-400">Uptime SLA</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="size-4 text-cyan-400" />
            SOC-2 Type II Certified
          </div>
        </div>
      </div>

      {/* =========================================
          RIGHT PANEL (Authentication Form / Skeleton)
          ========================================= */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24 bg-card">
        <div className={`mx-auto w-full transition-all duration-300 ${loading ? 'max-w-md' : 'max-w-sm'}`}>
          {loading ? (
            <LoginRoleSkeleton role={loadingRole} />
          ) : (
            <>
              {/* Mobile-only Brand Header */}
              <div className="flex lg:hidden items-center gap-3 mb-8">
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
              <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Sign in to Operations Console
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Enter your corporate credentials to manage terminal stations.
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4" aria-busy={loading}>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Operator Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dispatcher@clearwell.com"
                    required
                    className="h-10 text-sm focus-visible:ring-1"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      Password
                    </Label>
                    <button
                      type="button"
                      onClick={() => {
                        setResetEmail(email || 'dispatcher@clearwell.com')
                        setForgotOpen(true)
                      }}
                      className="text-xs font-medium text-primary hover:underline cursor-pointer transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
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

                <Button
                  type="submit"
                  className="w-full h-10 mt-3 font-medium transition-all shadow-sm"
                  disabled={loading}
                  aria-live="polite"
                >
                  <span>Sign in to Dispatch</span>
                  <ArrowRight className="size-4 ml-1.5" />
                </Button>
              </form>

              {/* Quick Demo Assist / Role Selector */}
              <div className="mt-6 p-3.5 rounded-2xl border border-border/80 bg-muted/30 text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-mono text-[11px] font-bold uppercase tracking-wider">Demo Quick Access</span>
                  <span className="text-[10px] font-mono text-primary font-semibold">1-Click Auth Fill</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials('dispatcher')}
                    className="tactile-btn py-2 px-1 rounded-xl bg-background border border-border/80 text-[11px] font-bold text-foreground hover:border-primary/40 text-center shadow-xs"
                  >
                    Dispatcher
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials('rider')}
                    className="tactile-btn py-2 px-1 rounded-xl bg-background border border-border/80 text-[11px] font-bold text-foreground hover:border-primary/40 text-center shadow-xs"
                  >
                    Courier Rider
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials('customer')}
                    className="tactile-btn py-2 px-1 rounded-xl bg-background border border-border/80 text-[11px] font-bold text-foreground hover:border-primary/40 text-center shadow-xs"
                  >
                    Customer
                  </button>
                </div>
              </div>

              <div className="mt-8 text-center text-xs text-muted-foreground">
                Don&apos;t have an assigned terminal?{' '}
                <Link href="/signup" className="font-semibold text-primary hover:underline">
                  Request station access
                </Link>
              </div>

              {/* Footer Security Badges */}
              <div className="mt-12 pt-6 border-t border-border flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="size-3 text-emerald-500" /> 256-bit TLS Encrypted
                </span>
                <span>•</span>
                <Link href="/terms" className="hover:underline">Terms</Link>
                <span>•</span>
                <Link href="/privacy" className="hover:underline">Privacy</Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Forgot Password Reset Dialog */}
      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2">
              <KeyRound className="size-5" />
            </div>
            <DialogTitle>Reset Terminal Password</DialogTitle>
            <DialogDescription>
              Enter your registered operator email to receive secure recovery instructions.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleResetPassword} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="reset-email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Operator Email
              </Label>
              <div className="relative">
                <Input
                  id="reset-email"
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="operator@clearwell.com"
                  className="pl-9 h-10 text-sm"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setForgotOpen(false)}
                disabled={resetLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={resetLoading}>
                {resetLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}

/**
 * Dedicated Skeleton view tailored to the authenticating account role
 */
function LoginRoleSkeleton({ role }: { role: UserRole }) {
  if (role === 'admin') {
    return (
      <div className="space-y-4 animate-in fade-in duration-300">
        <div className="flex items-center justify-between pb-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20">
            <Activity className="size-3.5 animate-pulse text-cyan-500" />
            Admin Operations Console
          </div>
          <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1.5">
            <Radio className="size-3 text-cyan-500 animate-ping" /> Synchronizing...
          </span>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        {/* 4 Admin Metric Cards (2x2) */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {[
            { label: 'Active Hubs', valWidth: 'w-16' },
            { label: 'Dispatches Today', valWidth: 'w-20' },
            { label: 'SCADA Telemetry', valWidth: 'w-14' },
            { label: 'Fleet Online', valWidth: 'w-18' },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-xl border border-border/70 bg-card/60 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="size-6 rounded-md" />
              </div>
              <Skeleton className={`h-6 ${item.valWidth}`} />
              <Skeleton className="h-2.5 w-20" />
            </div>
          ))}
        </div>

        {/* Terminal Dispatch Queue Skeleton */}
        <div className="p-3.5 rounded-xl border border-border/70 bg-card/60 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-border/50">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-5 w-16 rounded-md" />
          </div>
          <div className="space-y-2 pt-1">
            <Skeleton className="h-8 w-full rounded-lg" />
            <Skeleton className="h-8 w-full rounded-lg" />
            <Skeleton className="h-8 w-full rounded-lg" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
          <Loader2 className="size-3.5 animate-spin text-cyan-500" />
          <span>Mounting terminal dispatch controls...</span>
        </div>
      </div>
    )
  }

  if (role === 'rider') {
    return (
      <div className="space-y-4 animate-in fade-in duration-300">
        <div className="flex items-center justify-between pb-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20">
            <Truck className="size-3.5 animate-pulse text-blue-500" />
            Fleet Rider Terminal
          </div>
          <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1.5">
            <MapPin className="size-3 text-blue-500 animate-bounce" /> Loading GPS...
          </span>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-3/5" />
        </div>

        {/* 2 Rider Stats Cards */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className="p-3 rounded-xl border border-border/70 bg-card/60 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="size-6 rounded-md" />
            </div>
            <Skeleton className="h-6 w-14" />
            <Skeleton className="h-2.5 w-16" />
          </div>
          <div className="p-3 rounded-xl border border-border/70 bg-card/60 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="size-6 rounded-md" />
            </div>
            <Skeleton className="h-6 w-14" />
            <Skeleton className="h-2.5 w-16" />
          </div>
        </div>

        {/* Active Route Manifest Stop Skeleton */}
        <div className="p-3.5 rounded-xl border border-border/70 bg-card/60 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Skeleton className="size-6 rounded-lg" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56" />
            <div className="flex gap-2 pt-1.5">
              <Skeleton className="h-8 flex-1 rounded-lg" />
              <Skeleton className="h-8 flex-1 rounded-lg" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
          <Loader2 className="size-3.5 animate-spin text-blue-500" />
          <span>Syncing assigned delivery stops & route manifest...</span>
        </div>
      </div>
    )
  }

  // Customer Role Skeleton
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
          <Droplets className="size-3.5 animate-pulse text-emerald-500" />
          Customer Water Hub
        </div>
        <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1.5">
          <Package className="size-3 text-emerald-500 animate-pulse" /> Connecting...
        </span>
      </div>

      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        {[
          { label: 'Active', width: 'w-8' },
          { label: 'Gallons', width: 'w-10' },
          { label: 'Orders', width: 'w-8' },
        ].map((m, i) => (
          <div key={i} className="p-2.5 rounded-xl border border-border/70 bg-card/60 shadow-2xs space-y-1.5">
            <Skeleton className="h-3 w-10" />
            <Skeleton className={`h-5 ${m.width}`} />
          </div>
        ))}
      </div>

      {/* Active Refill Order Tracker Card */}
      <div className="p-3.5 rounded-xl border border-border/70 bg-card/60 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between pb-2 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Skeleton className="size-6 rounded-lg" />
            <Skeleton className="h-4 w-28" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <div className="pt-1.5">
            <Skeleton className="h-8 w-full rounded-lg" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
        <Loader2 className="size-3.5 animate-spin text-emerald-500" />
        <span>Loading water dispenser ledger & deliveries...</span>
      </div>
    </div>
  )
}