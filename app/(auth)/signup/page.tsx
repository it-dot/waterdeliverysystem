'use client'

import { useState } from 'react'
import { signup } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Droplets, Loader2, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function SignupPage() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const result = await signup(formData)

    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
    }
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
          Create an account
        </h1>
        <p className="mt-1.5 text-center text-sm text-muted-foreground">
          Register to order water refills and track station deliveries
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs">
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="full_name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Full Name
              </Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                required
                placeholder="Maria Santos"
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="maria@example.com"
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="h-10"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="09171234567"
                  pattern="^(09|\+639)\d{9}$"
                  maxLength={11}
                  title="Please enter a valid Philippine mobile number"
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Delivery Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Block 4, Lot 12..."
                  className="h-10"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-10 mt-3 font-medium" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="size-4 ml-1.5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-muted-foreground border-t border-border/70 pt-5">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

