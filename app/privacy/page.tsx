import Link from 'next/link'
import { Droplets, ArrowLeft, Shield, Lock, MapPin, RefreshCw, Mail } from 'lucide-react'

export default function PrivacyPage() {
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
              href="/terms"
              className="text-xs font-medium text-primary hover:underline"
            >
              Terms of Service
            </Link>
          </div>

          <div className="mt-6 flex items-start gap-4">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 shrink-0">
              <Droplets className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Privacy Policy
                </h1>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                  Updated Oct 2026
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                How Clearwell collects, protects, and handles your delivery and account information.
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section className="space-y-2.5">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Shield className="size-4 text-primary" />
              1. Information We Collect
            </h2>
            <p>
              When you order water refills or register an account with Clearwell, we collect only the necessary details required to fulfill your delivery:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li><strong className="text-foreground">Contact details:</strong> Your full name, mobile phone number, and email address.</li>
              <li><strong className="text-foreground">Delivery location:</strong> Street address, unit/gate details, landmark notes, and GPS coordinates for dispatch.</li>
              <li><strong className="text-foreground">Order & container records:</strong> Quantities ordered (19L slim/round carboys, bottled cases), bottle swap credits, and return records.</li>
              <li><strong className="text-foreground">Payment records:</strong> Confirmation of Cash on Delivery (COD) settlement or digital payment receipts (e.g., GCash/Maya via PayMongo). We never store raw credit card numbers.</li>
            </ul>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              2. How We Use Your Information
            </h2>
            <p>
              Your data is strictly utilized for practical fulfillment operations:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>Assigning orders to our neighborhood delivery riders based on your delivery window.</li>
              <li>Sending SMS updates regarding rider departure, arrival, and delivery confirmation.</li>
              <li>Tracking empty container balances to ensure transparent deposit exchanges.</li>
              <li>Facilitating customer support inquiries and order rescheduling.</li>
            </ul>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Lock className="size-4 text-primary" />
              3. Data Security & Rider Privacy
            </h2>
            <p>
              All customer communications and portal sessions are protected using industry-standard TLS encryption. Delivery riders receive access only to active stop details (recipient name, address, and contact number) during their shift. Once a delivery is completed, customer contact numbers are masked on rider devices.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <RefreshCw className="size-4 text-primary" />
              4. Third-Party Sharing
            </h2>
            <p>
              We do not sell, rent, or trade your personal data. Data is shared exclusively with verified service infrastructure partners necessary for operations, including Supabase (secure database hosting), PayMongo (regulated payment processing), and map routing providers.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-base font-semibold text-foreground">5. Managing Your Data</h2>
            <p>
              You may request an update or deletion of your address history and customer profile at any time by contacting your station manager or emailing our support desk.
            </p>
          </section>

          {/* Support Callout */}
          <div className="rounded-xl border border-border/80 bg-muted/30 p-5 mt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Have questions about your data?</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Our station support team is available Monday through Saturday, 7:00 AM – 7:00 PM.
              </p>
            </div>
            <a
              href="mailto:support@clearwell.ph"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
            >
              <Mail className="size-3.5" />
              <span>Contact Support</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
