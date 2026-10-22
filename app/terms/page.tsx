import Link from 'next/link'
import { Droplets, ArrowLeft, RotateCcw, Clock, CreditCard, ShieldCheck, Mail } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Navigation & Header */}
        <div className="mb-10 pb-6 border-b border-border/80">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Clearwell</span>
            </Link>

            <Link
              href="/privacy"
              className="text-xs font-medium text-primary hover:underline"
            >
              Privacy Policy
            </Link>
          </div>

          <div className="mt-6 flex items-start gap-4">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
              <Droplets className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Terms of Service
                </h1>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                  Updated Oct 2026
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Terms governing water refill orders, bottle exchange deposits, and delivery fulfillment.
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section className="space-y-2.5">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <RotateCcw className="size-4 text-primary" />
              1. Bottle Swap & Container Exchange
            </h2>
            <p>
              When placing an order for 19L refills (Slim or Round dispenser jugs):
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>Customers must hand over an equivalent number of clean, undamaged empty containers to the rider at the time of delivery.</li>
              <li>Containers must be standard food-grade 19-liter (5-gallon) carboys without cracks, deep punctures, or chemical contamination.</li>
              <li>If you do not have an empty jug to exchange, please select the <em>&quot;Brand New Jug + Water&quot;</em> container deposit option during checkout.</li>
            </ul>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Clock className="size-4 text-primary" />
              2. Delivery Windows & Gate Drop-off
            </h2>
            <p>
              Deliveries are dispatched within your chosen schedule window (Morning, Midday, Afternoon, or Evening). Our couriers will ring or call upon arrival. Please ensure an authorized household member or building representative is present to receive the bottles and hand over empties.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <CreditCard className="size-4 text-primary" />
              3. Payment & Settlement
            </h2>
            <p>
              We support Cash on Delivery (COD) and digital payments (GCash, Maya, cards). For cash payments, please prepare the exact amount where possible to assist swift rider transit. Digital payments are processed securely upon checkout confirmation.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              4. Water Quality & Sanitation Standards
            </h2>
            <p>
              Every Clearwell refill undergoes multi-stage reverse osmosis filtration and UV sterilization. Each carboy is pressure-washed, disinfected, and hermetically sealed with tamper-evident heat-shrink film prior to dispatch. If a seal is compromised upon arrival, our rider will replace the jug immediately at no extra charge.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-semibold text-foreground">5. Rescheduling & Cancellations</h2>
            <p>
              Orders may be rescheduled or canceled without penalty at any time before your assigned rider departs the station hub. To adjust your delivery, update your order in the Customer Portal or contact station dispatch.
            </p>
          </section>

          {/* Support Callout */}
          <div className="rounded-xl border border-border/80 bg-muted/30 p-5 mt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Questions or commercial bulk accounts?</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Contact our customer desk for corporate refill accounts and water dispenser lease programs.
              </p>
            </div>
            <a
              href="mailto:support@clearwell.ph"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
            >
              <Mail className="size-3.5" />
              <span>Contact Station Desk</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
