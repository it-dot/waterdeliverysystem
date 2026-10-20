"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Droplets,
  ArrowRight,
  Check,
  Plus,
  Minus,
  MapPin,
  Bike,
  Building2,
  UserCheck,
  Search,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Truck,
  Gauge,
  Clock,
  ChevronRight,
  Activity,
  Layers,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";

interface Product {
  id: string;
  name: string;
  desc: string;
  price: number;
  requiresSwap: boolean;
  unit: string;
  badge?: string;
}

const PRODUCTS: Product[] = [
  {
    id: "slim-refill",
    name: "19L Slim Jug Refill",
    desc: "Swap your empty slim carboy with molded handle. Freshly sanitized & sealed.",
    price: 50,
    requiresSwap: true,
    unit: "jug",
    badge: "Most Popular",
  },
  {
    id: "round-refill",
    name: "19L Round Dispenser Refill",
    desc: "Standard round carboy for top-load & bottom-load water dispensers.",
    price: 50,
    requiresSwap: true,
    unit: "jug",
  },
  {
    id: "new-jug",
    name: "19L Brand New Jug + Water",
    desc: "First-time order or extra container. Certified BPA-free food grade bottle.",
    price: 250,
    requiresSwap: false,
    unit: "jug",
    badge: "No Empty Needed",
  },
  {
    id: "case-500",
    name: "500 mL Bottled Case (24s)",
    desc: "Sealed single-use bottles for conferences, events, and family travel.",
    price: 180,
    requiresSwap: false,
    unit: "case",
  },
  {
    id: "case-1000",
    name: "1 L Bottled Case (12s)",
    desc: "Convenient liter bottles for family dining tables and active sports.",
    price: 160,
    requiresSwap: false,
    unit: "case",
  },
];

const SLOTS = [
  { id: "s1", time: "07:00 – 10:00", label: "Morning Route", eta: "Departs 7:15 AM" },
  { id: "s2", time: "10:00 – 13:00", label: "Midday Route", eta: "Fastest Dispatch" },
  { id: "s3", time: "13:00 – 16:00", label: "Afternoon Route", eta: "Departs 1:15 PM" },
  { id: "s4", time: "16:00 – 19:00", label: "Evening Route", eta: "Last Order 6 PM" },
];

const COVERAGE_LIST = [
  { name: "Poblacion & Downtown Core", eta: "15–25 min", status: "Active Hub" },
  { name: "San Jose & West Residential", eta: "20–30 min", status: "Active Hub" },
  { name: "Heights & North Hills", eta: "25–35 min", status: "Active Hub" },
  { name: "South Harbor & Coastal Road", eta: "30–40 min", status: "Active Hub" },
  { name: "East Commercial & University Belt", eta: "20–30 min", status: "Active Hub" },
];

export default function Home() {
  const [selectedId, setSelectedId] = useState<string>("slim-refill");
  const [qty, setQty] = useState<number>(3);
  const [swapConfirmed, setSwapConfirmed] = useState<boolean>(true);
  const [slotId, setSlotId] = useState<string>("s2");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "gcash">("cash");
  const [searchStreet, setSearchStreet] = useState<string>("");
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedOrder, setSubmittedOrder] = useState<any | null>(null);

  const product = PRODUCTS.find((p) => p.id === selectedId) || PRODUCTS[0];
  const isFreeDelivery = qty >= 4;
  const deliveryFee = isFreeDelivery ? 0 : 20;
  const subtotal = product.price * qty;
  const total = subtotal + deliveryFee;
  const activeSlot = SLOTS.find((s) => s.id === slotId) || SLOTS[1];

  const format = (n: number) => `₱${n.toFixed(2)}`;

  const handleStreetCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchStreet.trim()) {
      setSearchResult(null);
      return;
    }
    const term = searchStreet.trim().toLowerCase();
    const match = COVERAGE_LIST.find((c) => c.name.toLowerCase().includes(term));
    if (match) {
      setSearchResult(`✓ Verified Hub: ${match.name} is in direct dispatch range (${match.eta} avg turnaround).`);
    } else {
      setSearchResult(`✓ In Service Range: Daily scheduled route services "${searchStreet}" every 3 hours.`);
    }
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast.error("Please enter your name, mobile phone number, and delivery address.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedOrder({
        orderNumber: `CW-${Math.floor(10000 + Math.random() * 90000)}`,
        product: product.name,
        qty,
        slot: activeSlot.time,
        total,
        name,
        phone,
        address,
        paymentMethod,
        empties: product.requiresSwap ? (swapConfirmed ? `${qty} empty jugs ready for exchange` : "No empties") : "None required",
      });
      toast.success("Water refill request confirmed! Courier notified.");
    }, 600);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      {/* Ambient background water illumination (Linear/Stripe style) */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-sky-400/15 via-blue-600/5 to-transparent blur-3xl opacity-70" />
        <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full" />
      </div>

      {/* 1. Frosted Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-xl">
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
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mt-0.5">
                  Pure Water Logistics
                </span>
              </div>
            </Link>

            <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-3 py-1 font-mono text-[11px] text-muted-foreground">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span>Hub 01 Operational • Active Routes</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Portal Switchers */}
            <div className="hidden lg:flex items-center gap-1 border-r border-border/60 pr-3 mr-1 text-xs text-muted-foreground font-medium">
              <Link href="/customer/dashboard" className="px-2.5 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/60 transition-colors">
                Customer Portal
              </Link>
              <Link href="/rider/dashboard" className="px-2.5 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/60 transition-colors">
                Courier App
              </Link>
              <Link href="/admin/dashboard" className="px-2.5 py-1.5 rounded-lg hover:text-foreground hover:bg-muted/60 transition-colors">
                Station Admin
              </Link>
            </div>

            <ThemeToggle />

            <Link
              href="/login"
              className="tactile-btn inline-flex items-center justify-center rounded-xl border border-border/80 bg-card px-3.5 py-2 text-xs font-semibold text-foreground shadow-xs hover:bg-muted"
            >
              Sign In
            </Link>

            <a
              href="#refill-engine"
              className="tactile-btn inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm shadow-primary/25 hover:bg-primary/90"
            >
              <span>Instant Refill</span>
              <ArrowRight className="size-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* 2. Hero + Order Engine Split Stage */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          
          {/* Left Column: Premium Value Proposition & Guarantees */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 dark:bg-blue-500/20 px-3.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 border border-blue-500/20">
                <Sparkles className="size-3.5 text-blue-600 dark:text-blue-400" />
                <span>Next-Generation Water Refill & Exchange</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-[1.08]">
                Pure drinking water, <br className="hidden sm:inline" />
                <span className="text-gradient-primary">swapped at your gate.</span>
              </h1>

              <p className="text-base text-muted-foreground leading-relaxed">
                Premium 19-liter drinking water delivered directly to your doorstep in 3-hour windows. Leave empty carboys out; our trained couriers sanitize and swap them seamlessly.
              </p>
            </div>

            {/* Quality Standard Badges (Linear-style metrics) */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm text-center">
                <div className="text-xl font-extrabold font-mono text-primary">0.0001μ</div>
                <div className="text-[11px] text-muted-foreground mt-0.5 font-medium leading-tight">Reverse Osmosis</div>
              </div>
              <div className="p-3.5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm text-center">
                <div className="text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">&lt; 10 ppm</div>
                <div className="text-[11px] text-muted-foreground mt-0.5 font-medium leading-tight">Certified Purity</div>
              </div>
              <div className="p-3.5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm text-center">
                <div className="text-xl font-extrabold font-mono text-foreground">30 min</div>
                <div className="text-[11px] text-muted-foreground mt-0.5 font-medium leading-tight">Avg Dispatch</div>
              </div>
            </div>

            {/* 3 Step Protocol Cards */}
            <div className="rounded-2xl border border-border/80 bg-card/80 p-5 backdrop-blur-sm shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  The Clearwell Protocol
                </span>
                <span className="text-[11px] font-mono text-primary font-semibold">Zero-Contact Option</span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-mono font-bold text-primary text-[11px]">
                    01
                  </span>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">Choose Your Jug Type & Amount</h3>
                    <p className="text-muted-foreground mt-0.5 leading-relaxed">
                      ₱50 for standard 19L slim or round carboy refill with empty swap. New containers are ₱250.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-mono font-bold text-primary text-[11px]">
                    02
                  </span>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">Free Delivery on 4+ Jugs</h3>
                    <p className="text-muted-foreground mt-0.5 leading-relaxed">
                      Flat ₱20 per drop. Delivery fee is <strong>100% waived</strong> when ordering 4 or more containers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-mono font-bold text-primary text-[11px]">
                    03
                  </span>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">Doorstep Exchange & Settlement</h3>
                    <p className="text-muted-foreground mt-0.5 leading-relaxed">
                      Our uniformed courier arrives with factory-sealed bottles and collects your empties. Pay in cash or scan GCash QR.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Coverage Radius Checker */}
            <div className="rounded-2xl border border-border/80 bg-card/80 p-4 backdrop-blur-sm shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-blue-600" />
                  Service Radius Check
                </span>
                <span className="text-[10px] font-mono text-muted-foreground uppercase">Real-Time Routing</span>
              </div>

              <form onSubmit={handleStreetCheck} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchStreet}
                    onChange={(e) => setSearchStreet(e.target.value)}
                    placeholder="Enter subdivision, street, or landmark..."
                    className="w-full rounded-xl border border-border/80 bg-background pl-8 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
                  />
                </div>
                <button
                  type="submit"
                  className="tactile-btn rounded-xl bg-secondary px-3.5 py-2 text-xs font-semibold text-secondary-foreground hover:bg-muted"
                >
                  Verify
                </button>
              </form>

              {searchResult && (
                <div className="text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 rounded-xl p-2.5 border border-emerald-500/20">
                  {searchResult}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: The Refill Engine & Interactive Order Ticket */}
          <div id="refill-engine" className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/95 backdrop-blur-xl p-6 sm:p-8 shadow-xl shadow-blue-950/5">
              
              {submittedOrder ? (
                /* Order Confirmation Ticket */
                <div className="py-8 flex flex-col items-center text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-500/20">
                    <CheckCircle2 className="size-8" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-black text-foreground tracking-tight">Refill Scheduled!</h2>
                    <p className="text-xs font-mono text-muted-foreground mt-1">
                      Tracking Reference: <span className="font-bold text-foreground">{submittedOrder.orderNumber}</span>
                    </p>
                  </div>

                  {/* Perforated Receipt Ticket Aesthetic */}
                  <div className="w-full max-w-md rounded-2xl border border-dashed border-border/90 bg-muted/30 p-5 text-left font-mono text-xs space-y-2.5 relative">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Order Item:</span>
                      <span className="text-foreground font-bold">{submittedOrder.qty} × {submittedOrder.product}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Window:</span>
                      <span className="text-foreground font-semibold">{submittedOrder.slot}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Empty Carboys:</span>
                      <span className="text-foreground">{submittedOrder.empties}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Recipient:</span>
                      <span className="text-foreground">{submittedOrder.name} ({submittedOrder.phone})</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Dropoff Location:</span>
                      <span className="text-foreground truncate max-w-[200px]">{submittedOrder.address}</span>
                    </div>

                    <div className="border-t border-border/60 pt-3 mt-3 flex justify-between items-baseline font-bold text-sm">
                      <span className="text-foreground">Due on Delivery ({submittedOrder.paymentMethod.toUpperCase()}):</span>
                      <span className="text-primary text-lg tabular-nums">{format(submittedOrder.total)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                    Our station fleet has queued your refill for route departure. Courier will arrive at your gate during the selected slot.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md pt-2">
                    <Link
                      href="/login"
                      className="tactile-btn flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                      <span>Track in Customer Portal</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setSubmittedOrder(null)}
                      className="tactile-btn px-4 py-3 rounded-xl border border-border/80 text-xs font-semibold text-foreground hover:bg-muted"
                    >
                      Book Another Refill
                    </button>
                  </div>
                </div>
              ) : (
                /* Main Interactive Order Form */
                <form onSubmit={handleOrderSubmit} className="space-y-6">
                  
                  {/* Step 1: Select Container */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">1</span>
                        Choose Container Type
                      </label>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {PRODUCTS.length} types in stock
                      </span>
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-1">
                      {PRODUCTS.map((p) => {
                        const isSelected = selectedId === p.id;
                        return (
                          <div
                            key={p.id}
                            onClick={() => setSelectedId(p.id)}
                            className={`tactile-card p-3.5 cursor-pointer flex items-center justify-between transition-all ${
                              isSelected
                                ? "border-primary bg-primary/5 ring-1 ring-primary/40 shadow-sm"
                                : "hover:border-border hover:bg-muted/30"
                            }`}
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div
                                className={`flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                                  isSelected
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-muted-foreground/30 bg-background"
                                }`}
                              >
                                {isSelected && <Check className="size-3 stroke-[3]" />}
                              </div>

                              <div className="truncate">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-foreground">
                                    {p.name}
                                  </span>
                                  {p.badge && (
                                    <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                                      {p.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground truncate mt-0.5">
                                  {p.desc}
                                </p>
                              </div>
                            </div>

                            <div className="text-right shrink-0 font-mono pl-3">
                              <span className="text-base font-bold text-foreground tabular-nums">
                                {format(p.price)}
                              </span>
                              <span className="block text-[10px] text-muted-foreground">/{p.unit}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 2: Quantity & Empty Swaps */}
                  <div className="grid gap-4 sm:grid-cols-2 pt-1">
                    {/* Stepper with Free Delivery Threshold */}
                    <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">2</span>
                          Quantity
                        </span>
                        {isFreeDelivery ? (
                          <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            FREE DELIVERY
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {4 - qty} more for Free Delivery
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setQty((q) => Math.max(1, q - 1))}
                            disabled={qty <= 1}
                            className="tactile-btn flex size-9 items-center justify-center rounded-xl border border-border/80 bg-card text-foreground hover:bg-muted disabled:opacity-30"
                          >
                            <Minus className="size-4" />
                          </button>
                          <span className="font-mono text-2xl font-bold tabular-nums text-foreground w-10 text-center">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQty((q) => Math.min(25, q + 1))}
                            className="tactile-btn flex size-9 items-center justify-center rounded-xl border border-border/80 bg-card text-foreground hover:bg-muted"
                          >
                            <Plus className="size-4" />
                          </button>
                        </div>

                        <div className="text-right font-mono text-xs">
                          <span className="text-muted-foreground">Subtotal: </span>
                          <span className="font-bold text-foreground tabular-nums text-sm">
                            {format(subtotal)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Empties Swap Choice */}
                    <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">3</span>
                          Empty Swap
                        </span>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {product.requiresSwap ? "Swap Required" : "Sealed Unit"}
                        </span>
                      </div>

                      {product.requiresSwap ? (
                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setSwapConfirmed(true)}
                            className={`tactile-btn flex-1 rounded-xl py-2 text-xs font-semibold ${
                              swapConfirmed
                                ? "bg-primary text-primary-foreground shadow-xs"
                                : "border border-border/80 bg-card text-foreground hover:bg-muted"
                            }`}
                          >
                            Yes, {qty} empties ready
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSwapConfirmed(false);
                              setSelectedId("new-jug");
                            }}
                            className={`tactile-btn flex-1 rounded-xl py-2 text-xs font-semibold ${
                              !swapConfirmed
                                ? "bg-primary text-primary-foreground shadow-xs"
                                : "border border-border/80 bg-card text-foreground hover:bg-muted"
                            }`}
                          >
                            No empties (Buy new)
                          </button>
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground pt-1.5">
                          Sealed food-grade bottles. No empty jug required for this item.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Step 3: Route Arrival Window */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">4</span>
                      Select Delivery Window (Today)
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {SLOTS.map((slot) => {
                        const isSlotActive = slotId === slot.id;
                        return (
                          <div
                            key={slot.id}
                            onClick={() => setSlotId(slot.id)}
                            className={`tactile-card p-3 text-center cursor-pointer transition-all ${
                              isSlotActive
                                ? "border-primary bg-primary/5 ring-1 ring-primary/40 shadow-xs"
                                : "hover:border-border hover:bg-muted/30"
                            }`}
                          >
                            <div className="font-mono text-xs font-bold tabular-nums text-foreground">
                              {slot.time}
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">
                              {slot.label}
                            </div>
                            <div className="text-[9px] font-mono text-primary font-semibold mt-1">
                              {slot.eta}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 4: Dropoff Information & Payment Mode */}
                  <div className="space-y-3 pt-2 border-t border-border/60">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">5</span>
                      Dropoff Address & Gate Settlement
                    </label>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        required
                        className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
                      />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Mobile # (0917...)"
                        required
                        className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40 font-mono"
                      />
                    </div>

                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House / Unit #, Street name, Barangay, Landmarks"
                      required
                      className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
                    />

                    {/* Payment Mode */}
                    <div className="flex items-center gap-4 pt-1 text-xs">
                      <span className="text-muted-foreground font-mono">Payment method:</span>
                      <label className="flex items-center gap-2 cursor-pointer font-medium">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "cash"}
                          onChange={() => setPaymentMethod("cash")}
                          className="accent-primary"
                        />
                        <span>Cash on Arrival</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer font-medium">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "gcash"}
                          onChange={() => setPaymentMethod("gcash")}
                          className="accent-primary"
                        />
                        <span>GCash QR Scan</span>
                      </label>
                    </div>
                  </div>

                  {/* Itemized Order Breakdown */}
                  <div className="rounded-2xl border border-border/80 bg-muted/30 p-4 space-y-2 font-mono text-xs">
                    <div className="flex justify-between text-muted-foreground">
                      <span>{qty} × {product.name}</span>
                      <span className="text-foreground">{format(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Courier Delivery Fee</span>
                      {isFreeDelivery ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          FREE (4+ Containers)
                        </span>
                      ) : (
                        <span className="text-foreground">{format(deliveryFee)}</span>
                      )}
                    </div>
                    <div className="border-t border-border/60 pt-2.5 flex items-center justify-between text-sm font-bold">
                      <span className="text-foreground">Total on Delivery:</span>
                      <span className="text-primary text-lg tabular-nums">{format(total)}</span>
                    </div>
                  </div>

                  {/* Submit Refill Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="tactile-btn w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Dispatching Order to Station Hub...</span>
                    ) : (
                      <>
                        <span>Confirm Doorstep Refill</span>
                        <span className="font-mono text-xs opacity-90">({format(total)})</span>
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-muted-foreground">
                    No online credit card required. Driver collects empty bottles and payment directly at your gate.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* 3. Transparent Standard Rates Matrix */}
        <section className="mt-20 sm:mt-28 border-t border-border/80 pt-12">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8">
            <div>
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
                Official Station Catalog
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1">
                Transparent Bottle & Refill Rates
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Standard pricing across all network districts. No hidden utility fees or recurring lock-ins.
              </p>
            </div>
            <span className="text-xs font-mono text-muted-foreground mt-2 sm:mt-0 px-3 py-1 rounded-full bg-muted/40 border border-border/60">
              Clearwell Standard 2026
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border/80 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-3.5 px-5">Item & Specification</th>
                  <th className="py-3.5 px-5">Container Grade</th>
                  <th className="py-3.5 px-5 text-right">With Empty Swap</th>
                  <th className="py-3.5 px-5 text-right">Without Swap</th>
                  <th className="py-3.5 px-5 text-center">Delivery Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 font-sans">
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-foreground">19 L Slim Gallon Refill</td>
                  <td className="py-3.5 px-5 text-muted-foreground">Polycarbonate Slim with Molded Handle</td>
                  <td className="py-3.5 px-5 text-right font-mono font-bold text-foreground">₱50.00</td>
                  <td className="py-3.5 px-5 text-right font-mono text-muted-foreground">₱250.00 (New)</td>
                  <td className="py-3.5 px-5 text-center font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Free on 4+ units</td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-foreground">19 L Round Dispenser Refill</td>
                  <td className="py-3.5 px-5 text-muted-foreground">Standard Round (Top/Bottom Load Dispenser)</td>
                  <td className="py-3.5 px-5 text-right font-mono font-bold text-foreground">₱50.00</td>
                  <td className="py-3.5 px-5 text-right font-mono text-muted-foreground">₱250.00 (New)</td>
                  <td className="py-3.5 px-5 text-center font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Free on 4+ units</td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-foreground">19 L Brand New Carboy + Water</td>
                  <td className="py-3.5 px-5 text-muted-foreground">Certified Food-Grade BPA-Free Bottle</td>
                  <td className="py-3.5 px-5 text-right font-mono text-muted-foreground">—</td>
                  <td className="py-3.5 px-5 text-right font-mono font-bold text-foreground">₱250.00</td>
                  <td className="py-3.5 px-5 text-center font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Free on 4+ units</td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-foreground">500 mL Bottled Water Case (24 pcs)</td>
                  <td className="py-3.5 px-5 text-muted-foreground">Sealed PET Bottles in shrink-wrap carton</td>
                  <td className="py-3.5 px-5 text-right font-mono text-muted-foreground">—</td>
                  <td className="py-3.5 px-5 text-right font-mono font-bold text-foreground">₱180.00</td>
                  <td className="py-3.5 px-5 text-center font-mono text-muted-foreground">₱20 flat per order</td>
                </tr>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-foreground">1 L Bottled Water Case (12 pcs)</td>
                  <td className="py-3.5 px-5 text-muted-foreground">Sealed 1-Liter Table Bottles in carton</td>
                  <td className="py-3.5 px-5 text-right font-mono text-muted-foreground">—</td>
                  <td className="py-3.5 px-5 text-right font-mono font-bold text-foreground">₱160.00</td>
                  <td className="py-3.5 px-5 text-center font-mono text-muted-foreground">₱20 flat per order</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Multi-Role Platform Ecosystem */}
        <section className="mt-20 sm:mt-28 border-t border-border/80 pt-12 pb-16">
          <div className="mb-8">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
              Full Platform Infrastructure
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1">
              Integrated Multi-Role Workspaces
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Clearwell harmonizes customer ordering, courier GPS routing, and plant operations in real time.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {/* Customer Portal */}
            <div className="tactile-card rounded-2xl p-6 flex flex-col justify-between hover:border-primary/40">
              <div className="space-y-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <UserCheck className="size-5" />
                </div>
                <h3 className="font-bold text-base text-foreground">Customer App</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  One-tap refill reordering, weekly automated schedules, invoice settlements, and live courier tracking.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-border/60">
                <Link
                  href="/customer/dashboard"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                >
                  <span>Launch Customer View</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>

            {/* Courier Fleet App */}
            <div className="tactile-card rounded-2xl p-6 flex flex-col justify-between hover:border-primary/40">
              <div className="space-y-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  <Bike className="size-5" />
                </div>
                <h3 className="font-bold text-base text-foreground">Courier Fleet App</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Mobile interface for delivery riders: turn-by-turn road routes, cash collection tracking, and one-tap delivery completions.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-border/60">
                <Link
                  href="/rider/dashboard"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                >
                  <span>Launch Courier Fleet View</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>

            {/* Station Admin Console */}
            <div className="tactile-card rounded-2xl p-6 flex flex-col justify-between hover:border-primary/40">
              <div className="space-y-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Building2 className="size-5" />
                </div>
                <h3 className="font-bold text-base text-foreground">Station Admin Console</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Full command center: dynamic fleet dispatching, inventory replenishment, batch invoices, and audit reporting.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-border/60">
                <Link
                  href="/admin/dashboard"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                >
                  <span>Launch Admin Console</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/80 bg-muted/20 py-8 text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Droplets className="size-4 text-primary" />
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
            <Link href="/login" className="hover:text-foreground transition-colors">
              Staff Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}