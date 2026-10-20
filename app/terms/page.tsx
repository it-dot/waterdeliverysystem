import Link from 'next/link'
import { Droplets, ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background py-12 px-6 sm:px-12 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Droplets className="size-5" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">Clearwell OS</h1>
            <p className="text-xs font-mono text-muted-foreground uppercase">Terms of Service</p>
          </div>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          <ArrowLeft className="size-4" /> Back to Login
        </Link>
      </div>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">1. Terminal Authorization & Access</h2>
          <p>
            Access to the Clearwell Water Dispatch OS console is restricted to certified terminal operators, dispatchers,
            and authorized personnel. Unauthorized access attempts are logged and reported.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">2. Operational Telemetry & SCADA Use</h2>
          <p>
            Operators are required to verify flow telemetry, reservoir pressure benchmarks, and route capacity constraints
            prior to authorizing emergency water dispatch sequences.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">3. Fleet & Dispatch Compliance</h2>
          <p>
            All delivery units dispatched through this console operate under regional municipal water management regulations.
            Weigh-station reports and automated sensor logs are retained for auditing.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">4. Support & Incident Response</h2>
          <p>
            For password resets or terminal de-authorization, contact your designated Station Systems Administrator.
          </p>
        </section>
      </div>
    </main>
  )
}
