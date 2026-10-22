"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Droplets,
  ArrowRight,
  Check,
  MapPin,
  Bike,
  Building2,
  UserCheck,
  CheckCircle2,
  Clock,
  ChevronDown,
  Activity,
  Layers,
  Award,
  ShieldCheck,
  Sparkles,
  Truck,
  RotateCcw,
  Zap,
  Phone,
  HelpCircle,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface ProductSpec {
  name: string;
  type: string;
  refillPrice: number;
  newPrice: number;
  specs: string;
  bestFor: string;
}

const PRODUCTS: ProductSpec[] = [
  {
    name: "19L Slim Gallon Carboy",
    type: "Polycarbonate Slim with Handle",
    refillPrice: 50,
    newPrice: 250,
    specs: "BPA-free food grade, molded side handle, standard neck",
    bestFor: "Easy manual pouring, apartments, and compact kitchens",
  },
  {
    name: "19L Round Dispenser Carboy",
    type: "Standard Round Barrel",
    refillPrice: 50,
    newPrice: 250,
    specs: "Universal top & bottom-load dispenser compatible",
    bestFor: "Hot/Cold water dispensers in homes and offices",
  },
  {
    name: "500 mL Bottled Case (24 pcs)",
    type: "Single-Use Sealed PET",
    refillPrice: 180,
    newPrice: 180,
    specs: "Shrink-wrapped carton, tamper-proof screw caps",
    bestFor: "Meetings, travel, family gatherings, and hospitality",
  },
  {
    name: "1 L Bottled Case (12 pcs)",
    type: "Single-Use Sealed PET",
    refillPrice: 160,
    newPrice: 160,
    specs: "Family table size, ergonomic grip bottles",
    bestFor: "Dining tables, sports events, and daily hydration",
  },
];

const SCHEDULE_WINDOWS = [
  {
    id: "morning",
    time: "07:00 – 10:00",
    name: "Morning Route",
    cutoff: "Order by 6:30 AM",
    description: "First dispatch of the day. Ideal for homes and breakfast prep.",
  },
  {
    id: "midday",
    time: "10:00 – 13:00",
    name: "Midday Route",
    cutoff: "Order by 9:30 AM",
    description: "Peak morning replenishment for offices, stores, and active households.",
  },
  {
    id: "afternoon",
    time: "13:00 – 16:00",
    name: "Afternoon Route",
    cutoff: "Order by 12:30 PM",
    description: "Afternoon reloads before school and workplace closing hours.",
  },
  {
    id: "evening",
    time: "16:00 – 19:00",
    name: "Evening Route",
    cutoff: "Order by 5:30 PM",
    description: "Final evening delivery sweep. Fresh water ready for the night.",
  },
];

const SYSTEM_WORKFLOW = [
  {
    step: "01",
    title: "Customer Order & Scheduling",
    actor: "Customer Portal",
    desc: "Households or businesses choose their container type (19L slim or round carboys), select quantities, choose an arrival window, and confirm empty bottles ready for swap.",
  },
  {
    step: "02",
    title: "Station Batching & Route Optimization",
    actor: "Station Admin Console",
    desc: "Station dispatchers group pending orders into geographically optimized routes. The system validates inventory balances and assigns stops to on-duty delivery couriers.",
  },
  {
    step: "03",
    title: "Turn-by-Turn Mobile Dispatch",
    actor: "Rider Mobile App",
    desc: "Couriers view their route manifest with live turn-by-turn navigation, customer phone dialers, bottle quantity tags, and payment collection instructions.",
  },
  {
    step: "04",
    title: "Gate Exchange & Instant Settlement",
    actor: "Doorstep Fulfillment",
    desc: "The rider delivers sealed, sanitized containers, inspects and retrieves empty carboys, and marks the drop fulfilled via Cash on Delivery or digital payment scan.",
  },
];

const FAQS = [
  {
    q: "How does the empty carboy exchange work?",
    a: "When ordering a ₱50 refill, have an equivalent number of standard 19-liter empty containers ready at your gate. Our courier will inspect the bottles for structural cleanliness and swap them for freshly sanitized, hermetically sealed refills. If you don't have empties, you can purchase brand-new containers for ₱250.",
  },
  {
    q: "How are delivery fees calculated?",
    a: "Delivery is 100% FREE for orders of 4 or more 19L carboys. For smaller orders of 1 to 3 bottles, a flat ₱20 courier trip fee applies regardless of distance within our municipal delivery sectors.",
  },
  {
    q: "What payment methods are supported?",
    a: "We support Cash on Delivery (COD) paid directly to your assigned courier upon arrival, as well as digital payments via GCash, Maya, and credit/debit cards processed securely through PayMongo.",
  },
  {
    q: "How is the drinking water purified and tested?",
    a: "Every drop undergoes our certified 5-stage purification sequence: sediment and active carbon filtration, water softening, high-pressure 0.0001-micron Reverse Osmosis (RO), UV sterilization, and ozone treatment. Total Dissolved Solids (TDS) are maintained below 10 ppm, conforming to national drinking water standards.",
  },
  {
    q: "Can businesses and corporate offices set up automated recurring deliveries?",
    a: "Yes. Corporate accounts can configure recurring weekly refill schedules (e.g. every Monday and Thursday morning) and receive consolidated monthly digital invoices through our Customer Portal.",
  },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<"customer" | "rider" | "admin">("customer");

  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      {/* Ambient background water illumination */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-sky-400/15 via-blue-600/5 to-transparent blur-3xl opacity-75" />
        <div className="absolute top-[35%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[65%] left-[-10%] w-[500px] h-[500px] bg-blue-500/8 blur-[120px] rounded-full" />
      </div>

      {/* 1. Frosted Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-sm shadow-blue-500/25 transition-transform duration-200 group-hover:scale-105">
                <Droplets className="size-5" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-foreground leading-none">
                  Clearwell
                </span>
                <span className="text-[11px] font-medium text-muted-foreground mt-0.5">
                  Water Delivery System
                </span>
              </div>
            </Link>

            <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span>Station Active • Delivering Today</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-muted-foreground">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#apps" className="hover:text-foreground transition-colors">
              The System Apps
            </a>
            <a href="#purification" className="hover:text-foreground transition-colors">
              Water Quality
            </a>
            <a href="#pricing" className="hover:text-foreground transition-colors">
              Rates & Products
            </a>
            <a href="#faq" className="hover:text-foreground transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />

            <Link
              href="/login"
              className="tactile-btn inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm shadow-primary/25 hover:bg-primary/90"
            >
              <span>Access System</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Main Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Hero Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 dark:bg-blue-500/20 px-4 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 border border-blue-500/20 mb-6 shadow-xs">
            <Sparkles className="size-3.5 text-blue-600 dark:text-blue-400" />
            <span>Modern Drinking Water Logistics & Station Management</span>
          </div>

          {/* Primary Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.08] max-w-4xl mx-auto">
            Pure drinking water delivered to your gate.{" "}
            <span className="text-gradient-primary block mt-1">
              Managed with precision.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Clearwell is an all-in-one water delivery system connecting neighborhood refilling stations, couriers, and households. Transparent 19L carboy swaps, scheduled delivery windows, and synchronized inventory.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/login"
              className="tactile-btn inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90"
            >
              <span>Sign in to Your Portal</span>
              <ArrowRight className="size-4" />
            </Link>

            <a
              href="#how-it-works"
              className="tactile-btn inline-flex items-center justify-center gap-2 rounded-xl border border-border/80 bg-card/80 px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-muted"
            >
              <span>How the System Works</span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </a>
          </div>

          {/* Key System Statistics Strip */}
          <div className="mt-14 sm:mt-18 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 sm:p-5 rounded-2xl border border-border/80 bg-card/75 backdrop-blur-sm shadow-xs">
              <span className="text-xs font-medium text-muted-foreground block">Purity Standard</span>
              <p className="text-xl sm:text-2xl font-bold font-mono text-primary mt-1">0.0001μ</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Reverse Osmosis filtration</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl border border-border/80 bg-card/75 backdrop-blur-sm shadow-xs">
              <span className="text-xs font-medium text-muted-foreground block">Total Dissolved Solids</span>
              <p className="text-xl sm:text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">&lt; 10 ppm</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Ultra-pure laboratory grade</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl border border-border/80 bg-card/75 backdrop-blur-sm shadow-xs">
              <span className="text-xs font-medium text-muted-foreground block">Route Schedules</span>
              <p className="text-xl sm:text-2xl font-bold font-mono text-foreground mt-1">4 Shifts</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Daily morning to evening</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl border border-border/80 bg-card/75 backdrop-blur-sm shadow-xs">
              <span className="text-xs font-medium text-muted-foreground block">Container Deposit</span>
              <p className="text-xl sm:text-2xl font-bold font-mono text-foreground mt-1">1:1 Swap</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Clean carboy replacement</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. System Workflow / How It Works */}
      <section id="how-it-works" className="py-16 sm:py-24 border-t border-border/70 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
              End-to-End Operational Pipeline
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mt-1.5">
              How the Clearwell System Works
            </h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              From online order placement to gate delivery and bottle exchange, every stage of the lifecycle is synchronized in real time.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {SYSTEM_WORKFLOW.map((item) => (
              <div
                key={item.step}
                className="relative rounded-2xl border border-border/80 bg-card p-6 shadow-xs flex flex-col justify-between hover:border-primary/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary font-mono font-bold text-sm border border-primary/20">
                      {item.step}
                    </span>
                    <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                      {item.actor}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-border/60 flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-3.5" />
                  <span>Real-time verification</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Three Unified Apps Breakdown */}
      <section id="apps" className="py-16 sm:py-24 border-t border-border/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
              Unified Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mt-1.5">
              Three Dedicated Workspaces
            </h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Clearwell coordinates customers, delivery couriers, and station managers with role-specific applications tailored to their exact workflow.
            </p>
          </div>

          {/* Interactive Role Switcher */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-xl border border-border/80 bg-muted/40 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab("customer")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === "customer"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Customer App
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("rider")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === "rider"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Courier Mobile App
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("admin")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === "admin"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Station Admin Console
              </button>
            </div>
          </div>

          {/* Role Feature Cards */}
          <div className="rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl p-6 sm:p-10 shadow-lg">
            {activeTab === "customer" && (
              <div className="grid lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-300">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                    <UserCheck className="size-3.5" />
                    For Households & Commercial Clients
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    Instant Water Refill Booking in 30 Seconds
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Customers can order water refills, select preferred 3-hour arrival slots, and track ongoing deliveries without calling dispatch or waiting in lines.
                  </p>
                  
                  <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-foreground">
                    <li className="flex items-center gap-2.5">
                      <Check className="size-4 text-primary shrink-0" />
                      <span>One-tap reordering of favorite container quantities</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="size-4 text-primary shrink-0" />
                      <span>Live status updates as the rider departs the station and approaches</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="size-4 text-primary shrink-0" />
                      <span>Transparent bottle exchange accounting with deposit credit balances</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="size-4 text-primary shrink-0" />
                      <span>Automated itemized invoice generation with Cash & GCash options</span>
                    </li>
                  </ul>

                  <div className="pt-4">
                    <Link
                      href="/login"
                      className="tactile-btn inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                      <span>Explore Customer Portal</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-5 rounded-2xl border border-border/80 bg-muted/30 p-6 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-border/60">
                    <span className="font-bold text-foreground">Customer Refill Preview</span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">● Active Dispatch</span>
                  </div>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Item:</span>
                      <strong className="text-foreground">3 × 19L Slim Gallon Refill</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Window:</span>
                      <strong className="text-foreground">10:00 – 13:00 (Midday)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Empties:</span>
                      <strong className="text-foreground">3 bottles ready for swap</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment:</span>
                      <strong className="text-foreground">₱150.00 (Cash on Delivery)</strong>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-background border border-border/70 text-[11px] text-muted-foreground">
                    ✓ Courier Dave is en route (ETA ~15 mins)
                  </div>
                </div>
              </div>
            )}

            {activeTab === "rider" && (
              <div className="grid lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-300">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                    <Bike className="size-3.5" />
                    For Delivery Couriers & Drivers
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    Glanceable Mobile Route Manifest
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Engineered specifically for riders on motorcycles and trucks. High-contrast typography, large tap targets, and quick actions designed to operate smoothly with gloves or in bright daylight.
                  </p>
                  
                  <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-foreground">
                    <li className="flex items-center gap-2.5">
                      <Check className="size-4 text-primary shrink-0" />
                      <span>One-tap turn-by-turn road navigation via Google Maps</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="size-4 text-primary shrink-0" />
                      <span>Direct phone dialer button for customer arrival calls</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="size-4 text-primary shrink-0" />
                      <span>Clear Cash-on-Delivery balance alerts to prevent uncollected payments</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="size-4 text-primary shrink-0" />
                      <span>Empty carboy counter to ensure physical bottles match delivery counts</span>
                    </li>
                  </ul>

                  <div className="pt-4">
                    <Link
                      href="/login"
                      className="tactile-btn inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                      <span>Explore Courier App</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-5 rounded-2xl border border-border/80 bg-muted/30 p-6 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-border/60">
                    <span className="font-bold text-foreground">Rider Route Card #1</span>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold">En Route</span>
                  </div>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Stop:</span>
                      <strong className="text-foreground">Maria Santos</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Drop Address:</span>
                      <strong className="text-foreground truncate max-w-[200px]">Block 4 Lot 12, San Jose</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>To Collect:</span>
                      <strong className="text-amber-600 dark:text-amber-400 font-bold">₱150.00 COD</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Empty Carboys:</span>
                      <strong className="text-foreground">3 jugs to collect</strong>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <div className="flex-1 py-2 text-center rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">
                      Call Customer
                    </div>
                    <div className="flex-1 py-2 text-center rounded-lg bg-primary/10 text-primary font-bold text-[11px]">
                      GPS Route
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "admin" && (
              <div className="grid lg:grid-cols-12 gap-8 items-center animate-in fade-in duration-300">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                    <Building2 className="size-3.5" />
                    For Station Operators & Dispatchers
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    Complete Command Over Hub Operations
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Station administrators have total visibility into daily order queues, carboy inventory levels, driver assignments, route completion rates, and daily revenue collection.
                  </p>
                  
                  <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-foreground">
                    <li className="flex items-center gap-2.5">
                      <Check className="size-4 text-primary shrink-0" />
                      <span>Live dispatch board with drag-and-drop order reassignments</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="size-4 text-primary shrink-0" />
                      <span>Automated container inventory (filled jugs vs empty carboys in yard)</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="size-4 text-primary shrink-0" />
                      <span>End-of-day driver cash remittance reconciliation & audit log</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="size-4 text-primary shrink-0" />
                      <span>Customer address database with historical delivery notes</span>
                    </li>
                  </ul>

                  <div className="pt-4">
                    <Link
                      href="/login"
                      className="tactile-btn inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                      <span>Explore Station Admin</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-5 rounded-2xl border border-border/80 bg-muted/30 p-6 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-border/60">
                    <span className="font-bold text-foreground">Station Hub Dashboard</span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">All 4 Routes Active</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center pt-1">
                    <div className="p-2.5 rounded-xl bg-background border border-border/70">
                      <span className="text-[10px] text-muted-foreground block">Deliveries Today</span>
                      <strong className="text-lg text-foreground font-bold">142 drops</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-background border border-border/70">
                      <span className="text-[10px] text-muted-foreground block">Yard Inventory</span>
                      <strong className="text-lg text-primary font-bold">380 jugs</strong>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-background border border-border/70 text-[11px] text-muted-foreground">
                    Remittance: ₱7,100 collected • 0 failed drops
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Water Purification Standard */}
      <section id="purification" className="py-16 sm:py-24 border-t border-border/70 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
              Filtration & Laboratory Standards
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mt-1.5">
              5-Stage Purity Sequence
            </h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Every drop is filtered through our certified water treatment plant, hermetically tested and sealed before delivery dispatch.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5 text-xs">
            <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-2">
              <span className="size-7 rounded-lg bg-primary/10 text-primary font-mono font-bold flex items-center justify-center text-xs">
                1
              </span>
              <h4 className="font-bold text-foreground text-sm">Sediment & Sand</h4>
              <p className="text-muted-foreground leading-relaxed">
                Dual multi-media pre-filters trap micro-particles, sand, and particulate matter down to 5 microns.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-2">
              <span className="size-7 rounded-lg bg-primary/10 text-primary font-mono font-bold flex items-center justify-center text-xs">
                2
              </span>
              <h4 className="font-bold text-foreground text-sm">Activated Carbon</h4>
              <p className="text-muted-foreground leading-relaxed">
                High-grade coconut shell carbon absorbs chlorine, volatile organic compounds, and unwanted odors.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-2">
              <span className="size-7 rounded-lg bg-primary/10 text-primary font-mono font-bold flex items-center justify-center text-xs">
                3
              </span>
              <h4 className="font-bold text-foreground text-sm">Reverse Osmosis</h4>
              <p className="text-muted-foreground leading-relaxed">
                Industrial RO membranes separate heavy metals, bacteria, and minerals at 0.0001 microns.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-2">
              <span className="size-7 rounded-lg bg-primary/10 text-primary font-mono font-bold flex items-center justify-center text-xs">
                4
              </span>
              <h4 className="font-bold text-foreground text-sm">UV Sterilization</h4>
              <p className="text-muted-foreground leading-relaxed">
                High-output ultraviolet rays eradicate biological pathogens and micro-organisms in real time.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-2">
              <span className="size-7 rounded-lg bg-primary/10 text-primary font-mono font-bold flex items-center justify-center text-xs">
                5
              </span>
              <h4 className="font-bold text-foreground text-sm">Ozone & Tamper Seal</h4>
              <p className="text-muted-foreground leading-relaxed">
                Active ozone sanitizes bottle interiors, finalized with heat-shrink tamper-evident cap film.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Pricing & Official Station Catalog */}
      <section id="pricing" className="py-16 sm:py-24 border-t border-border/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 sm:mb-12">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
                Transparent Pricing
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mt-1.5">
                Standard Rates & Container Specs
              </h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                Fixed regional rates with zero hidden fees. Free delivery when ordering 4 or more 19L carboys.
              </p>
            </div>

            <div className="mt-4 sm:mt-0 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                <Check className="size-3.5" /> Free Delivery on 4+ Jugs
              </span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border/80 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-3.5 px-5">Product & Container Type</th>
                  <th className="py-3.5 px-5">Specifications</th>
                  <th className="py-3.5 px-5 text-right">With Bottle Swap</th>
                  <th className="py-3.5 px-5 text-right">New Jug (No Swap)</th>
                  <th className="py-3.5 px-5 text-center">Delivery Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {PRODUCTS.map((p) => (
                  <tr key={p.name} className="hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-5">
                      <strong className="text-foreground text-sm block">{p.name}</strong>
                      <span className="text-muted-foreground text-[11px]">{p.type}</span>
                    </td>
                    <td className="py-4 px-5 text-muted-foreground max-w-xs">
                      {p.specs}
                    </td>
                    <td className="py-4 px-5 text-right font-mono font-bold text-foreground text-sm">
                      {p.refillPrice ? `₱${p.refillPrice.toFixed(2)}` : "—"}
                    </td>
                    <td className="py-4 px-5 text-right font-mono text-muted-foreground">
                      ₱{p.newPrice.toFixed(2)}
                    </td>
                    <td className="py-4 px-5 text-center font-medium">
                      {p.name.includes("19L") ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                          Free on 4+ units
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-[11px]">
                          ₱20 flat per order
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 7. Schedule Windows Section */}
      <section className="py-16 sm:py-24 border-t border-border/70 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
              Reliable Daily Dispatches
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mt-1.5">
              Scheduled Delivery Windows
            </h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              We operate 4 scheduled route departures every day to ensure fast, reliable fulfillment across all municipal sectors.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SCHEDULE_WINDOWS.map((slot) => (
              <div
                key={slot.id}
                className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-primary uppercase font-mono">
                    {slot.name}
                  </span>
                  <Clock className="size-4 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold font-mono text-foreground">
                  {slot.time}
                </h3>
                <span className="inline-block text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  {slot.cutoff}
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed pt-1 border-t border-border/60">
                  {slot.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Interactive Frequently Asked Questions */}
      <section id="faq" className="py-16 sm:py-24 border-t border-border/70">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
              Common Inquiries
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mt-1.5">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Everything you need to know about our water delivery service, empty bottle swaps, and corporate logistics.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-muted/30 transition-colors"
                  >
                    <span className="font-semibold text-sm sm:text-base text-foreground">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`size-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Support desk callout */}
          <div className="mt-10 rounded-2xl border border-border/80 bg-muted/30 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm text-foreground">Still have questions?</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Our station support team is available Monday through Saturday, 7:00 AM – 7:00 PM.
              </p>
            </div>
            <Link
              href="/login"
              className="tactile-btn inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shrink-0"
            >
              <Phone className="size-3.5" />
              <span>Contact Station Desk</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Final Call to Action */}
      <section className="py-16 sm:py-20 border-t border-border/70 bg-gradient-to-b from-background to-muted/40">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto border border-primary/20">
            <Droplets className="size-6" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Ready to experience effortless water delivery?
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Sign in to start booking refills, manage your daily courier routes, or access station administration console.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/login"
              className="tactile-btn inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90"
            >
              <span>Sign in to Clearwell</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="border-t border-border/80 bg-muted/20 py-10 text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex size-6 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Droplets className="size-3.5" />
            </div>
            <span className="font-bold text-foreground">Clearwell Water Technologies</span>
            <span>• Drinking Water Logistics System</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/login" className="hover:text-foreground transition-colors font-medium text-primary">
              Portal Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}