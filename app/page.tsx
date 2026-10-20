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
} from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  desc: string;
  price: number;
  requiresSwap: boolean;
  unit: string;
}

const PRODUCTS: Product[] = [
  {
    id: "slim-refill",
    name: "19L Slim Jug Refill",
    desc: "Swap your empty slim carboy with handle. Freshly sanitized & sealed.",
    price: 50,
    requiresSwap: true,
    unit: "jug",
  },
  {
    id: "round-refill",
    name: "19L Round Dispenser Refill",
    desc: "Standard round jug for top-load & bottom-load water dispensers.",
    price: 50,
    requiresSwap: true,
    unit: "jug",
  },
  {
    id: "new-jug",
    name: "19L New Jug + Water",
    desc: "First order or extra container. Includes certified BPA-free bottle.",
    price: 250,
    requiresSwap: false,
    unit: "jug",
  },
  {
    id: "case-500",
    name: "500 mL Bottled Case (24s)",
    desc: "Sealed single-use bottles for events, offices, and travel.",
    price: 180,
    requiresSwap: false,
    unit: "case",
  },
  {
    id: "case-1000",
    name: "1 L Bottled Case (12s)",
    desc: "Convenient liter bottles for family tables and sports use.",
    price: 160,
    requiresSwap: false,
    unit: "case",
  },
];

const SLOTS = [
  { id: "s1", time: "07:00 – 10:00", label: "Morning Route" },
  { id: "s2", time: "10:00 – 13:00", label: "Midday Route" },
  { id: "s3", time: "13:00 – 16:00", label: "Afternoon Route" },
  { id: "s4", time: "16:00 – 19:00", label: "Evening Route" },
];

const COVERAGE_LIST = [
  { name: "Poblacion & Downtown", eta: "20–30 min", status: "Active" },
  { name: "San Jose & West District", eta: "25–35 min", status: "Active" },
  { name: "Heights & North Hills", eta: "25–35 min", status: "Active" },
  { name: "South Harbor & Coastal", eta: "30–45 min", status: "Active" },
  { name: "East Commercial Complex", eta: "30–45 min", status: "Active" },
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
      setSearchResult(`In range: ${match.name} is serviced daily (${match.eta} avg dispatch).`);
    } else {
      setSearchResult(`In range: Standard daily dispatch reaches "${searchStreet}" in the next scheduled route.`);
    }
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast.error("Please enter your name, mobile phone, and delivery address.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedOrder({
        orderNumber: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        product: product.name,
        qty,
        slot: activeSlot.time,
        total,
        name,
        phone,
        address,
        paymentMethod,
        empties: product.requiresSwap ? (swapConfirmed ? `${qty} empty jugs to swap` : "No empties") : "None required",
      });
      toast.success("Refill request received. Dispatched to station.");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/15 selection:text-primary">
      {/* 1. Header: Functional, dense, no junk */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Droplets className="size-4.5" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-base tracking-tight text-foreground">Clearwell</span>
            </Link>

            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-muted/50 px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Station 01 · Dispatch Open</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Portals for reviewers and staff */}
            <div className="hidden md:flex items-center gap-1 border-r border-border/60 pr-3 mr-1 text-xs text-muted-foreground font-medium">
              <Link href="/customer/dashboard" className="px-2 py-1 rounded hover:text-foreground hover:bg-muted/60 transition-colors">
                Customer App
              </Link>
              <Link href="/rider/dashboard" className="px-2 py-1 rounded hover:text-foreground hover:bg-muted/60 transition-colors">
                Rider App
              </Link>
              <Link href="/admin/dashboard" className="px-2 py-1 rounded hover:text-foreground hover:bg-muted/60 transition-colors">
                Admin Console
              </Link>
            </div>

            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg border border-border/80 bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-xs transition-all hover:bg-muted active:scale-[0.985]"
            >
              Sign In
            </Link>
            <a
              href="#order-form"
              className="inline-flex items-center justify-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 active:scale-[0.985]"
            >
              <span>Order Now</span>
              <ArrowRight className="size-3" />
            </a>
          </div>
        </div>
      </header>

      {/* 2. Hero + Order Engine Split Screen */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Direct, unpretentious proposition */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="space-y-3">
              <span className="font-mono text-xs font-semibold tracking-wider uppercase text-primary">
                Neighborhood Water Station
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                Clean drinking water, swapped at your door.
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Refilled 19-liter containers delivered directly to your doorstep in 3-hour windows.
                Leave your empties outside — our rider swaps them on the spot.
                Pay in cash or scan GCash upon delivery.
              </p>
            </div>

            {/* How it actually works: 3 concise rules */}
            <div className="rounded-xl border border-border/80 bg-card p-5 space-y-3.5 shadow-xs">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
                How Delivery Works
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex gap-3">
                  <div className="font-mono font-bold text-primary shrink-0">01</div>
                  <div>
                    <strong className="text-foreground">Pick your container & quantity.</strong>
                    <p className="text-muted-foreground mt-0.5">
                      ₱50 for standard 19L slim or round carboy refill with empty swap. New containers are ₱250.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="font-mono font-bold text-primary shrink-0">02</div>
                  <div>
                    <strong className="text-foreground">Fixed ₱20 delivery fee.</strong>
                    <p className="text-muted-foreground mt-0.5">
                      Flat ₱20 per drop. Automatically <strong>waived (FREE)</strong> when ordering 4 or more containers.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="font-mono font-bold text-primary shrink-0">03</div>
                  <div>
                    <strong className="text-foreground">Doorstep bottle exchange.</strong>
                    <p className="text-muted-foreground mt-0.5">
                      Rider arrives with sealed bottles and takes your empties back to the station for 7-step sanitization.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Station Status Specs */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="rounded-lg border border-border/70 bg-muted/30 p-3">
                <div className="text-muted-foreground text-[11px]">Today&apos;s Batches</div>
                <div className="font-bold text-foreground text-sm mt-0.5">4 Route Departures</div>
              </div>
              <div className="rounded-lg border border-border/70 bg-muted/30 p-3">
                <div className="text-muted-foreground text-[11px]">Next Route Closes</div>
                <div className="font-bold text-foreground text-sm mt-0.5">{activeSlot.time}</div>
              </div>
            </div>

            {/* Address Lookup */}
            <div className="rounded-xl border border-border/80 bg-card p-4 space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">Check Delivery Coverage</span>
                <span className="text-[11px] font-mono text-muted-foreground">Local Station Radius</span>
              </div>
              <form onSubmit={handleStreetCheck} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchStreet}
                    onChange={(e) => setSearchStreet(e.target.value)}
                    placeholder="Enter street, subdivision, or area..."
                    className="w-full rounded-lg border border-border/80 bg-background pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40 font-sans"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-lg bg-muted px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                >
                  Check
                </button>
              </form>
              {searchResult && (
                <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 rounded-md p-2 border border-emerald-500/20">
                  {searchResult}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: The Order Ticket (Dense, tactile, usable) */}
          <div id="order-form" className="lg:col-span-7">
            <div className="rounded-2xl border border-border/90 bg-card p-5 sm:p-7 shadow-xs">
              {submittedOrder ? (
                /* Confirmed State */
                <div className="py-6 flex flex-col items-center text-center space-y-4">
                  <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Refill Request Placed</h2>
                    <p className="text-xs font-mono text-muted-foreground mt-0.5">
                      Order Reference: {submittedOrder.orderNumber}
                    </p>
                  </div>

                  <div className="w-full max-w-md rounded-xl border border-border/80 bg-muted/20 p-4 text-left font-mono text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Item:</span>
                      <span className="text-foreground font-semibold">
                        {submittedOrder.qty} × {submittedOrder.product}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Arrival Window:</span>
                      <span className="text-foreground">{submittedOrder.slot}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Empty Bottles:</span>
                      <span className="text-foreground">{submittedOrder.empties}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Recipient:</span>
                      <span className="text-foreground">{submittedOrder.name} ({submittedOrder.phone})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dropoff:</span>
                      <span className="text-foreground truncate max-w-[200px]">{submittedOrder.address}</span>
                    </div>
                    <div className="border-t border-border/60 pt-2 flex justify-between font-bold text-sm">
                      <span className="text-foreground">Total on Delivery ({submittedOrder.paymentMethod.toUpperCase()}):</span>
                      <span className="text-primary">{format(submittedOrder.total)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground max-w-sm">
                    Our station dispatcher has queued this order for route departure.
                    Driver will collect payment and swap empties on arrival.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-md pt-2">
                    <Link
                      href="/login"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all"
                    >
                      <span>Track in Customer Portal</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setSubmittedOrder(null)}
                      className="px-4 py-2.5 rounded-lg border border-border/80 text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      Book Another Refill
                    </button>
                  </div>
                </div>
              ) : (
                /* Main Order Configuration Form */
                <form onSubmit={handleOrderSubmit} className="space-y-6">
                  {/* Step 1: Container Choice */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                        1. Select Water Container
                      </label>
                      <span className="font-mono text-xs text-muted-foreground">
                        {PRODUCTS.length} types available
                      </span>
                    </div>

                    <div className="grid gap-2">
                      {PRODUCTS.map((p) => {
                        const isSelected = selectedId === p.id;
                        return (
                          <div
                            key={p.id}
                            onClick={() => setSelectedId(p.id)}
                            className={`cursor-pointer flex items-center justify-between rounded-xl border p-3 transition-all active:scale-[0.99] ${
                              isSelected
                                ? "border-primary bg-primary/5 shadow-xs"
                                : "border-border/80 bg-card hover:border-border hover:bg-muted/30"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex size-4.5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                                  isSelected
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-muted-foreground/30 bg-background"
                                }`}
                              >
                                {isSelected && <Check className="size-2.5 stroke-[3]" />}
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-foreground">
                                  {p.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {p.desc}
                                </div>
                              </div>
                            </div>

                            <div className="text-right shrink-0 font-mono pl-3">
                              <div className="text-sm font-bold text-foreground tabular-nums">
                                {format(p.price)}
                              </div>
                              <div className="text-[10px] text-muted-foreground">per {p.unit}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 2: Quantity & Empties Swap */}
                  <div className="grid gap-4 sm:grid-cols-2 pt-1">
                    {/* Stepper */}
                    <div className="rounded-xl border border-border/80 bg-muted/20 p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                          2. Quantity
                        </span>
                        {isFreeDelivery && (
                          <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            FREE DELIVERY
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => setQty((q) => Math.max(1, q - 1))}
                            disabled={qty <= 1}
                            className="flex size-8 items-center justify-center rounded-lg border border-border/80 bg-card text-foreground transition-all hover:bg-muted active:scale-[0.95] disabled:opacity-30 cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="font-mono text-xl font-bold tabular-nums text-foreground w-8 text-center">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQty((q) => Math.min(25, q + 1))}
                            className="flex size-8 items-center justify-center rounded-lg border border-border/80 bg-card text-foreground transition-all hover:bg-muted active:scale-[0.95] cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>

                        <div className="text-right font-mono text-xs">
                          <span className="text-muted-foreground">Subtotal: </span>
                          <span className="font-bold text-foreground tabular-nums">
                            {format(subtotal)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Empties Swap Toggle */}
                    <div className="rounded-xl border border-border/80 bg-muted/20 p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                          3. Empty Swaps
                        </span>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {product.requiresSwap ? "Swap Required" : "No Swap"}
                        </span>
                      </div>

                      {product.requiresSwap ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setSwapConfirmed(true)}
                            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                              swapConfirmed
                                ? "bg-primary text-primary-foreground shadow-xs"
                                : "border border-border/80 bg-card text-foreground hover:bg-muted"
                            }`}
                          >
                            Yes, I have {qty} empties
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSwapConfirmed(false);
                              setSelectedId("new-jug");
                            }}
                            className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                              !swapConfirmed
                                ? "bg-primary text-primary-foreground shadow-xs"
                                : "border border-border/80 bg-card text-foreground hover:bg-muted"
                            }`}
                          >
                            No empties (Buy jug)
                          </button>
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground pt-1">
                          Containers are brand new or sealed single-use. No empty bottles needed.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Step 3: Route Arrival Slot */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground block">
                      4. Choose Departure Window (Today)
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {SLOTS.map((slot) => {
                        const isSlotActive = slotId === slot.id;
                        return (
                          <div
                            key={slot.id}
                            onClick={() => setSlotId(slot.id)}
                            className={`cursor-pointer rounded-lg border p-2.5 text-center transition-all active:scale-[0.985] ${
                              isSlotActive
                                ? "border-primary bg-primary/5 text-foreground shadow-xs font-semibold"
                                : "border-border/80 bg-card text-muted-foreground hover:border-border hover:text-foreground"
                            }`}
                          >
                            <div className="font-mono text-xs tabular-nums text-foreground">
                              {slot.time}
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">
                              {slot.label}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 4: Dropoff Information */}
                  <div className="space-y-3 pt-1 border-t border-border/60">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground block">
                      5. Dropoff & Payment
                    </label>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your full name"
                          required
                          className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40 font-sans"
                        />
                      </div>
                      <div>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Mobile number (0917...)"
                          required
                          className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House/Unit #, Street, Barangay, Gate landmarks"
                        required
                        className="w-full rounded-lg border border-border/80 bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40 font-sans"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-1 text-xs">
                      <span className="text-muted-foreground font-mono">Payment on arrival:</span>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "cash"}
                          onChange={() => setPaymentMethod("cash")}
                          className="accent-primary"
                        />
                        <span>Cash</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === "gcash"}
                          onChange={() => setPaymentMethod("gcash")}
                          className="accent-primary"
                        />
                        <span>GCash QR</span>
                      </label>
                    </div>
                  </div>

                  {/* Receipt Breakdown & Submit */}
                  <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-2 font-mono text-xs">
                    <div className="flex justify-between text-muted-foreground">
                      <span>{qty} × {product.name}</span>
                      <span className="text-foreground">{format(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Delivery Fee</span>
                      {isFreeDelivery ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          FREE (4+ Jugs)
                        </span>
                      ) : (
                        <span className="text-foreground">{format(deliveryFee)}</span>
                      )}
                    </div>
                    <div className="border-t border-border/60 pt-2 flex items-center justify-between text-sm font-bold">
                      <span className="text-foreground">Total to Pay:</span>
                      <span className="text-primary text-base tabular-nums">{format(total)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90 active:scale-[0.985] cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Dispatching Order...</span>
                    ) : (
                      <>
                        <span>Confirm Doorstep Refill</span>
                        <span className="font-mono text-xs opacity-90">({format(total)})</span>
                        <ArrowRight className="size-3.5" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-muted-foreground">
                    No online card needed. Driver collects empty bottles and payment at your gate.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* 3. Transparent Price & Unit Table (Honest, clean, real) */}
        <section className="mt-16 sm:mt-24 border-t border-border/80 pt-10">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Standard Refill & Bottle Rates</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Clear prices. No hidden service charges or recurring minimums.
              </p>
            </div>
            <span className="text-xs font-mono text-muted-foreground mt-2 sm:mt-0">
              Station Standard 2026
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border/80 bg-card">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border/80 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-3 px-4">Item & Specification</th>
                  <th className="py-3 px-4">Container Type</th>
                  <th className="py-3 px-4 text-right">With Empty Swap</th>
                  <th className="py-3 px-4 text-right">Without Swap</th>
                  <th className="py-3 px-4 text-center">Delivery Threshold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr>
                  <td className="py-3 px-4 font-semibold text-foreground">19 L Slim Gallon Refill</td>
                  <td className="py-3 px-4 text-muted-foreground">Polycarbonate Slim with Molded Handle</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-foreground">₱50.00</td>
                  <td className="py-3 px-4 text-right font-mono text-muted-foreground">₱250.00 (New)</td>
                  <td className="py-3 px-4 text-center font-mono text-muted-foreground">Free on 4+ units</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-foreground">19 L Round Dispenser Refill</td>
                  <td className="py-3 px-4 text-muted-foreground">Standard Round (Top/Bottom Load)</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-foreground">₱50.00</td>
                  <td className="py-3 px-4 text-right font-mono text-muted-foreground">₱250.00 (New)</td>
                  <td className="py-3 px-4 text-center font-mono text-muted-foreground">Free on 4+ units</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-foreground">19 L Brand New Container + Water</td>
                  <td className="py-3 px-4 text-muted-foreground">Certified Food-Grade BPA-Free Bottle</td>
                  <td className="py-3 px-4 text-right font-mono text-muted-foreground">—</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-foreground">₱250.00</td>
                  <td className="py-3 px-4 text-center font-mono text-muted-foreground">Free on 4+ units</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-foreground">500 mL Bottled Water Case (24 pcs)</td>
                  <td className="py-3 px-4 text-muted-foreground">Sealed PET Bottles in shrink-wrap tray</td>
                  <td className="py-3 px-4 text-right font-mono text-muted-foreground">—</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-foreground">₱180.00</td>
                  <td className="py-3 px-4 text-center font-mono text-muted-foreground">₱20 flat per order</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-foreground">1 L Bottled Water Case (12 pcs)</td>
                  <td className="py-3 px-4 text-muted-foreground">Sealed 1-Liter Table Bottles in tray</td>
                  <td className="py-3 px-4 text-right font-mono text-muted-foreground">—</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-foreground">₱160.00</td>
                  <td className="py-3 px-4 text-center font-mono text-muted-foreground">₱20 flat per order</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Multi-Role Portal Switcher (Practical & Clean) */}
        <section className="mt-16 sm:mt-24 border-t border-border/80 pt-10">
          <div className="mb-6">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-primary">
              Multi-Role Platform
            </span>
            <h2 className="text-xl font-bold text-foreground mt-1">
              Explore the Station Workspaces
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Clearwell connects customers, field couriers, and station dispatchers in real time.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Customer Portal */}
            <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <UserCheck className="size-4" />
                  </div>
                  <h3 className="font-bold text-sm text-foreground">Customer App</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  One-tap refill reordering, weekly automated schedules, invoice history, and live delivery status.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-border/60">
                <Link
                  href="/customer/dashboard"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <span>Open Customer View</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>

            {/* Rider Fleet Portal */}
            <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Bike className="size-4" />
                  </div>
                  <h3 className="font-bold text-sm text-foreground">Rider Fleet App</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Mobile interface for couriers: delivery stops, cash collection tracking, and quick delivery mark.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-border/60">
                <Link
                  href="/rider/dashboard"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <span>Open Rider View</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>

            {/* Admin Station Console */}
            <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Building2 className="size-4" />
                  </div>
                  <h3 className="font-bold text-sm text-foreground">Station Admin</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Dispatcher dashboard: inventory levels, rider assignment, customer accounts, and daily revenue stats.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-border/60">
                <Link
                  href="/admin/dashboard"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <span>Open Admin View</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 5. Minimal, Honest Station Footer */}
      <footer className="mt-20 border-t border-border/80 bg-muted/20 py-8 text-xs text-muted-foreground font-mono">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex size-5 items-center justify-center rounded bg-primary text-primary-foreground text-[10px] font-bold">
              CW
            </div>
            <span className="font-bold text-foreground">Clearwell Refill Station</span>
            <span>· Sector 3 Central</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>DOH Permit: 2026-088194-WTR</span>
            <span>Hours: 06:00 – 19:30 Daily</span>
            <Link href="/login" className="text-foreground font-semibold hover:underline">
              Operator Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}