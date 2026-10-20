import Link from 'next/link'
import { Droplets, ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background py-12 px-6 sm:px-12 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Droplets className="size-5" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">Clearwell OS</h1>
            <p className="text-xs font-mono text-muted-foreground uppercase">Privacy Policy</p>
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
          <h2 className="text-base font-semibold text-foreground mb-2">1. Data Collected</h2>
          <p>
            Clearwell logs terminal operator authentication tokens, IP addresses, SCADA telemetry interactions,
            and route dispatch decisions to ensure operational safety and compliance.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">2. Security & Encryption</h2>
          <p>
            All terminal communications and API payloads are transmitted over 256-bit TLS encryption. Access credentials
            and sensitive session tokens are never stored in plain text.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">3. Telemetry Retention</h2>
          <p>
            Hydrological data, flow rates, and reservoir levels are maintained in high-availability clusters to support
            predictive maintenance and regulatory audits.
          </p>
        </section>
      </div>
    </main>
  )
}
