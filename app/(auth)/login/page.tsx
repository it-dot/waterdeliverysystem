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
  Sparkles,
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

  const [selectedDemo, setSelectedDemo] = useState<'dispatcher' | 'rider' | 'customer' | null>('dispatcher')

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
    setSelectedDemo(role)
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
    <main className="min-h-screen w-full flex flex-col lg:flex-row bg-background selection:bg-primary/20">
      {/* =========================================
          LEFT / HERO PANEL (Enterprise Brand & Value)
          ========================================= */}
      <div className="relative hidden lg:flex lg:w-1/2 xl:w-7/12 flex-col justify-between overflow-hidden bg-slate-950 p-12 text-slate-100">
        {/* Layered fluid ambient light & glowing water caustics */}
        <div className="absolute -top-32 -left-32 size-96 rounded-full bg-cyan-500/15 blur-[100px] pointer-events-none animate-pulse duration-7000" />
        <div className="absolute -bottom-32 -right-32 size-[32rem] rounded-full bg-blue-600/15 blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(56,189,248,0.18),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(37,99,235,0.12),transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Top Branding */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_24px_rgba(6,182,212,0.3)] transition-transform duration-300 hover:scale-105">
              <Droplets className="size-6" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Clearwell
                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/25 shadow-xs">
                  Refill OS
                </span>
              </span>
              <span className="block text-xs text-slate-400">
                Water Refill & Delivery Management
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-full shadow-xs backdrop-blur-sm">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            Station Hub Online
          </div>
        </div>

        {/* Main Value Proposition */}
        <div className="relative z-10 my-auto max-w-xl py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-cyan-300 bg-cyan-950/70 border border-cyan-800/50 mb-6 shadow-xs backdrop-blur-sm">
            <Activity className="size-3.5" /> Direct Doorstep & Store Delivery
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl leading-tight">
            Pure drinking water delivery,{' '}
            <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-300 bg-clip-text text-transparent">
              managed with precision.
            </span>
          </h2>
          <p className="mt-4 text-base text-slate-400 leading-relaxed">
            Connecting neighborhood refilling stations with riders and households for rapid 19L carboy exchanges, scheduled delivery routes, and transparent cash & digital payments.
          </p>

          {/* Key Product Capability Badges with tactile lift */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="group p-4.5 rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:bg-slate-900/70 hover:shadow-lg hover:shadow-cyan-950/30">
              <div className="flex items-center gap-2.5 text-slate-200 font-semibold text-sm">
                <div className="flex size-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:scale-110 transition-all duration-200">
                  <Truck className="size-4" />
                </div>
                <span>Smart Route Dispatch</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">Batch stops assigned by time windows for prompt customer drop-offs.</p>
            </div>

            <div className="group p-4.5 rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40 hover:bg-slate-900/70 hover:shadow-lg hover:shadow-cyan-950/30">
              <div className="flex items-center gap-2.5 text-slate-200 font-semibold text-sm">
                <div className="flex size-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:scale-110 transition-all duration-200">
                  <Package className="size-4" />
                </div>
                <span>Container & Deposit Tracking</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">Accurate records of slim & round 19L carboy swaps and empty returns.</p>
            </div>
          </div>
        </div>

        {/* Bottom Social Proof & Metrics */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xl font-bold text-white tabular-nums">15,000+</p>
              <p className="text-[11px] text-slate-400">Jugs Delivered</p>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <p className="text-xl font-bold text-white">4 Daily Routes</p>
              <p className="text-[11px] text-slate-400">Morning to Evening</p>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div>
              <p className="text-xl font-bold text-white tabular-nums">99.8%</p>
              <p className="text-[11px] text-slate-400">On-Time Drop Rate</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-lg shadow-xs">
            <ShieldCheck className="size-4 text-cyan-400" />
            Reverse Osmosis Certified
          </div>
        </div>
      </div>

      {/* =========================================
          RIGHT PANEL (Authentication Form / Skeleton)
          ========================================= */}
      <div className="relative flex-1 flex flex-col justify-center items-center px-4 py-12 sm:px-8 lg:px-12 xl:px-16 bg-background overflow-hidden">
        {/* Soft atmospheric ambient light */}
        <div className="absolute top-1/4 -right-16 size-80 rounded-full bg-primary/8 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 -left-16 size-80 rounded-full bg-cyan-500/6 blur-[100px] pointer-events-none" />

        <div className={`relative z-10 mx-auto w-full transition-all duration-300 ${loading ? 'max-w-md' : 'max-w-md'} sm:p-8 sm:rounded-2xl sm:border sm:border-border/80 sm:bg-card/75 sm:backdrop-blur-xl sm:shadow-xl sm:shadow-black/5`}>
          {loading ? (
            <LoginRoleSkeleton role={loadingRole} />
          ) : (
            <>
              {/* Mobile-only Brand Header */}
              <div className="flex lg:hidden items-center gap-3 mb-8">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20">
                  <Droplets className="size-5" strokeWidth={2.5} />
                </div>
                <div>
                  <span className="text-lg font-bold tracking-tight text-foreground">Clearwell</span>
                  <span className="block text-xs text-muted-foreground">
                    Water Refill & Delivery
                  </span>
                </div>
              </div>

              {/* Form Header */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Welcome back
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Sign in to manage deliveries, routes, or order refills.
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4" aria-busy={loading}>
                <div className="space-y-1.5 group">
                  <Label
                    htmlFor="email"
                    className="text-xs font-semibold text-foreground group-focus-within:text-primary transition-colors"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setSelectedDemo(null)
                      }}
                      placeholder="dispatcher@clearwell.com"
                      required
                      className="pl-10 h-10.5 text-sm transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/15 shadow-2xs"
                    />
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5 group">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="text-xs font-semibold text-foreground group-focus-within:text-primary transition-colors"
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
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setSelectedDemo(null)
                      }}
                      placeholder="••••••••••••"
                      required
                      className="pl-10 pr-10 h-10.5 text-sm transition-all duration-200 focus:border-primary focus:ring-4 focus:ring-primary/15 shadow-2xs"
                    />
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="relative group overflow-hidden w-full h-10.5 mt-2 font-semibold transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-primary/20 active:scale-[0.98] cursor-pointer"
                  disabled={loading}
                  aria-live="polite"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span>Sign in</span>
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                  {/* Subtle shimmer sweep on hover */}
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                </Button>
              </form>

              {/* Quick Demo Assist / Role Selector with active pill state */}
              <div className="mt-6 p-3.5 rounded-xl border border-border/80 bg-muted/30 text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs font-semibold flex items-center gap-1.5">
                    <Sparkles className="size-3 text-primary" /> Quick Demo Logins
                  </span>
                  <span className="text-[11px] text-primary font-medium">1-Click Fill</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials('dispatcher')}
                    className={`py-2 px-1 rounded-lg text-xs font-semibold text-center transition-all duration-200 cursor-pointer ${
                      selectedDemo === 'dispatcher'
                        ? 'bg-primary text-primary-foreground shadow-xs ring-2 ring-primary/20'
                        : 'bg-background hover:bg-muted text-foreground border border-border/80 hover:border-primary/40'
                    }`}
                  >
                    Station Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials('rider')}
                    className={`py-2 px-1 rounded-lg text-xs font-semibold text-center transition-all duration-200 cursor-pointer ${
                      selectedDemo === 'rider'
                        ? 'bg-primary text-primary-foreground shadow-xs ring-2 ring-primary/20'
                        : 'bg-background hover:bg-muted text-foreground border border-border/80 hover:border-primary/40'
                    }`}
                  >
                    Delivery Rider
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials('customer')}
                    className={`py-2 px-1 rounded-lg text-xs font-semibold text-center transition-all duration-200 cursor-pointer ${
                      selectedDemo === 'customer'
                        ? 'bg-primary text-primary-foreground shadow-xs ring-2 ring-primary/20'
                        : 'bg-background hover:bg-muted text-foreground border border-border/80 hover:border-primary/40'
                    }`}
                  >
                    Customer
                  </button>
                </div>
              </div>

              <div className="mt-8 text-center text-xs text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="font-semibold text-primary hover:underline">
                  Sign up for water delivery
                </Link>
              </div>

              {/* Footer Security Badges */}
              <div className="mt-12 pt-6 border-t border-border/70 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="size-3.5 text-emerald-500" /> Secure SSL Connection
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
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your registered email address to receive secure password recovery instructions.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleResetPassword} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="reset-email" className="text-xs font-semibold text-foreground">
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="reset-email"
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="you@clearwell.ph"
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
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-primary bg-primary/10 border border-primary/20">
            <Activity className="size-3.5 text-primary" />
            Station Admin Portal
          </div>
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            Signing in...
          </span>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        {/* 4 Admin Metric Cards (2x2) */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {[
            { label: 'Active Routes', valWidth: 'w-16' },
            { label: 'Orders Today', valWidth: 'w-20' },
            { label: 'Inventory (Jugs)', valWidth: 'w-14' },
            { label: 'Riders on Route', valWidth: 'w-18' },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-xl border border-border/70 bg-card shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="size-6 rounded-md" />
              </div>
              <Skeleton className={`h-6 ${item.valWidth}`} />
              <Skeleton className="h-2.5 w-20" />
            </div>
          ))}
        </div>

        {/* Dispatch Queue Skeleton */}
        <div className="p-3.5 rounded-xl border border-border/70 bg-card shadow-2xs space-y-2.5">
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
          <Loader2 className="size-3.5 animate-spin text-primary" />
          <span>Opening station dashboard...</span>
        </div>
      </div>
    )
  }

  if (role === 'rider') {
    return (
      <div className="space-y-4 animate-in fade-in duration-300">
        <div className="flex items-center justify-between pb-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20">
            <Truck className="size-3.5 text-blue-500" />
            Delivery Rider App
          </div>
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            Loading route...
          </span>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-3/5" />
        </div>

        {/* 2 Rider Stats Cards */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className="p-3 rounded-xl border border-border/70 bg-card shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="size-6 rounded-md" />
            </div>
            <Skeleton className="h-6 w-14" />
            <Skeleton className="h-2.5 w-16" />
          </div>
          <div className="p-3 rounded-xl border border-border/70 bg-card shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="size-6 rounded-md" />
            </div>
            <Skeleton className="h-6 w-14" />
            <Skeleton className="h-2.5 w-16" />
          </div>
        </div>

        {/* Route Manifest Stop Skeleton */}
        <div className="p-3.5 rounded-xl border border-border/70 bg-card shadow-2xs space-y-2.5">
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
          <span>Syncing assigned delivery stops...</span>
        </div>
      </div>
    )
  }

  // Customer Role Skeleton
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
          <Droplets className="size-3.5 text-emerald-500" />
          Customer Water Portal
        </div>
        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
          Connecting...
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
          <div key={i} className="p-2.5 rounded-xl border border-border/70 bg-card shadow-2xs space-y-1.5">
            <Skeleton className="h-3 w-10" />
            <Skeleton className={`h-5 ${m.width}`} />
          </div>
        ))}
      </div>

      {/* Active Refill Order Tracker Card */}
      <div className="p-3.5 rounded-xl border border-border/70 bg-card shadow-2xs space-y-2.5">
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
        <span>Loading water orders & refill history...</span>
      </div>
    </div>
  )
}