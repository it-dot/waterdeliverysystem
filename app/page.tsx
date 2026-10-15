"use client";

import { useState } from "react";

const CURRENCY = "$"; // change to your local currency symbol
const DELIVERY_FEE = 2;

const PRODUCTS = [
  { id: "refill", name: "19 L refill", note: "Swap your empty container", price: 3 },
  { id: "new", name: "19 L new container", note: "Includes container and water", price: 12 },
  { id: "case-500", name: "500 mL case of 24", note: "Single-use bottles", price: 8 },
  { id: "case-1l", name: "1 L case of 12", note: "Single-use bottles", price: 7 },
];

const SLOTS = ["7 – 10 AM", "10 AM – 1 PM", "1 – 4 PM", "4 – 7 PM"];

const STEPS = [
  { title: "Choose your water", body: "Pick a size and how many you need." },
  { title: "Pick a time window", body: "We deliver in three-hour slots." },
  { title: "Hand over empties", body: "Our driver swaps them at the door." },
];

export default function Home() {
  const [productId, setProductId] = useState("refill");
  const [qty, setQty] = useState(2);
  const [slot, setSlot] = useState(SLOTS[1]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [placed, setPlaced] = useState(false);

  const product = PRODUCTS.find((p) => p.id === productId)!;
  const subtotal = product.price * qty;
  const total = subtotal + DELIVERY_FEE;
  const canOrder = name.trim() !== "" && address.trim() !== "";

  const money = (n: number) => `${CURRENCY}${n.toFixed(2)}`;
  const field =
    "w-full rounded-lg border border-[#B9D3DA] bg-white px-3 py-2.5 text-[#0A2E40] placeholder:text-[#7E9CA6] focus:border-[#0A5C7A] focus:outline-none focus:ring-2 focus:ring-[#0A5C7A]/30";

  return (
    <div className="min-h-screen bg-[#E8F2F4] font-sans text-[#0A2E40]">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <span className="text-xl font-semibold tracking-tight">Clearwell</span>
        <a href="#order" className="text-sm font-medium underline underline-offset-4">
          Order now
        </a>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-24">
        <section className="grid gap-10 py-12 md:grid-cols-[1.1fr_1fr] md:items-start">
          <div className="flex flex-col gap-6">
            <h1 className="max-w-md text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              Clean drinking water, delivered to your door.
            </h1>
            <p className="max-w-md text-lg leading-8 text-[#3F6474]">
              Order refills or bottled cases online. Choose a time window and we&apos;ll be there,
              empties collected on the spot.
            </p>
            <ol className="mt-4 flex flex-col gap-5">
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0A5C7A] text-sm font-semibold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium">{s.title}</p>
                    <p className="text-[#3F6474]">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div id="order" className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            {placed ? (
              <div className="flex flex-col gap-4 py-8 text-center">
                <h2 className="text-2xl font-semibold">Order placed</h2>
                <p className="text-[#3F6474]">
                  {qty} × {product.name} arrives {slot}. Total {money(total)}, paid on delivery.
                </p>
                <button
                  onClick={() => setPlaced(false)}
                  className="mx-auto mt-2 rounded-full border border-[#0A5C7A] px-5 py-2.5 font-medium text-[#0A5C7A] transition-colors hover:bg-[#0A5C7A]/10"
                >
                  Place another order
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (canOrder) setPlaced(true);
                }}
                className="flex flex-col gap-6"
              >
                <fieldset className="flex flex-col gap-2">
                  <legend className="mb-2 font-medium">What do you need?</legend>
                  {PRODUCTS.map((p) => (
                    <label
                      key={p.id}
                      className={`flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 transition-colors ${productId === p.id
                          ? "border-[#0A5C7A] bg-[#0A5C7A]/8"
                          : "border-[#B9D3DA] hover:border-[#0A5C7A]/60"
                        }`}
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="product"
                          checked={productId === p.id}
                          onChange={() => setProductId(p.id)}
                          className="accent-[#0A5C7A]"
                        />
                        <span>
                          <span className="block font-medium">{p.name}</span>
                          <span className="block text-sm text-[#3F6474]">{p.note}</span>
                        </span>
                      </span>
                      <span className="font-medium">{money(p.price)}</span>
                    </label>
                  ))}
                </fieldset>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Quantity</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="h-9 w-9 rounded-full border border-[#B9D3DA] text-lg hover:bg-[#E8F2F4]"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-medium tabular-nums">{qty}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQty((q) => Math.min(20, q + 1))}
                      className="h-9 w-9 rounded-full border border-[#B9D3DA] text-lg hover:bg-[#E8F2F4]"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="slot" className="font-medium">
                    Delivery window
                  </label>
                  <select id="slot" value={slot} onChange={(e) => setSlot(e.target.value)} className={field}>
                    {SLOTS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-3">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    aria-label="Full name"
                    className={field}
                  />
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Delivery address and landmarks"
                    aria-label="Delivery address"
                    rows={2}
                    className={field}
                  />
                </div>

                <dl className="flex flex-col gap-1 border-t border-[#B9D3DA] pt-4 text-[#3F6474]">
                  <div className="flex justify-between">
                    <dt>
                      {qty} × {product.name}
                    </dt>
                    <dd>{money(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Delivery</dt>
                    <dd>{money(DELIVERY_FEE)}</dd>
                  </div>
                  <div className="mt-2 flex justify-between text-lg font-semibold text-[#0A2E40]">
                    <dt>Total</dt>
                    <dd>{money(total)}</dd>
                  </div>
                </dl>

                <button
                  type="submit"
                  disabled={!canOrder}
                  className="h-12 rounded-full bg-[#0A5C7A] font-medium text-white transition-colors hover:bg-[#08475F] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Place order
                </button>
                {!canOrder && (
                  <p className="-mt-3 text-center text-sm text-[#3F6474]">
                    Add your name and address to place the order.
                  </p>
                )}
              </form>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}