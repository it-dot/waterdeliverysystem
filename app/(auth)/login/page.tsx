'use client'

import { useState } from 'react'
import { login } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Droplets, Loader2, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const result = await login(formData)

    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
    }
  }

  function fillDemo(demoEmail: string, demoPass: string) {
    setEmail(demoEmail)
    setPassword(demoPass)
    toast.success('Demo credentials loaded')
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
            <Droplets className="size-6" strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-foreground">Clearwell</span>
            <span className="block text-[11px] font-mono text-muted-foreground uppercase tracking-wider">Water Dispatch OS</span>
          </div>
        </div>

        <h1 className="mt-6 text-center text-2xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-1.5 text-center text-sm text-muted-foreground">
          Enter your credentials to access operations
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs">
          <form action={handleSubmit} className="space-y-4" aria-busy={loading}>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@clearwell.com"
                required
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Password
                </Label>
                <button
                  type="button"
                  onClick={() => toast.info('Contact station admin to reset credentials')}
                  className="text-xs text-primary hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-10 mt-2 font-medium"
              disabled={loading}
              aria-live="polite"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="size-4 ml-1.5" />
                </>
              )}
            </Button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-6 pt-5 border-t border-border/70">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Demo Credentials (Tap to fill)
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillDemo('admin@clearwell.com', 'password123')}
                className="min-h-[44px] rounded-lg border border-border/70 bg-muted/40 p-2.5 text-left transition-all hover:bg-muted hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              >
                <p className="font-semibold text-foreground">Admin Station</p>
                <p className="font-mono text-[11px] text-muted-foreground truncate mt-0.5">admin@clearwell.com</p>
                <p className="font-mono text-[10px] text-muted-foreground/70">password123</p>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('zane@clearwell.com', 'password123')}
                className="min-h-[44px] rounded-lg border border-border/70 bg-muted/40 p-2.5 text-left transition-all hover:bg-muted hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              >
                <p className="font-semibold text-foreground">Courier Fleet</p>
                <p className="font-mono text-[11px] text-muted-foreground truncate mt-0.5">zane@clearwell.com</p>
                <p className="font-mono text-[10px] text-muted-foreground/70">password123</p>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

