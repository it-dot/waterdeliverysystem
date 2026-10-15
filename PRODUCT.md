# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Station Operators & Admins**: Managers operating the water refilling station. They oversee container inventory (full vs. empty 19L jugs, bottles, caps, seals), dispatch delivery orders, manage rider route assignments, record payments, and track customer accounts.
- **Delivery Riders**: Field delivery personnel handling delivery runs, executing container swaps (collecting empties while dropping off full bottles), updating delivery progress, and viewing delivery route maps.
- **Customers (Residential & Small Commercial)**: Households and office managers ordering drinking water refills, purchasing new 19L bottles or packaged cases, selecting delivery slots, and managing invoices.

## Product Purpose

Clearwell powers end-to-end water refilling station operations, unifying walk-in retail, doorstep delivery scheduling, and rider fleet logistics into a single operational system. Success means frictionless empty container returns, zero inventory leakage, timely slot fulfillment, and clear real-time coordination across station dispatch, riders, and customers.

## Positioning

A purpose-built operational platform for water refilling businesses featuring integrated doorstep container swap and deposit tracking, eliminating manual tally errors and lost bottle deposits.

## Operating Context

- **Physical Container Lifecycle**: Constant circulation of 19L (5-gallon) reusable polycarbonate/PET jugs requiring deposit management and doorstep swap reconciliation.
- **Scheduled Time Windows**: Deliveries scheduled in dedicated 3-hour windows ("7 – 10 AM", "10 AM – 1 PM", "1 – 4 PM", "4 – 7 PM").
- **Multi-device Environments**: Mobile web on the move for delivery riders outdoors; desktop/tablet for station dispatch and counter inventory; responsive web for customer self-service ordering.

## Capabilities and Constraints

- **Role-Based Access Control**: Discrete interfaces for Station Admin, Customer, and Rider authenticated via Supabase.
- **Inventory & Order Management**: Real-time tracking of water products (19L refills, 19L new containers, 500 mL cases, 1 L cases), stock levels, and empty container swaps.
- **Route & Delivery Logistics**: Delivery dispatching with scheduled delivery windows and map-based tracking (Leaflet / Google Maps).
- **Billing & Accounting**: Automated invoice generation, payment status tracking, and downloadable PDF receipts (jsPDF).
- **Technical Architecture**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Supabase (auth/storage/data).

## Brand Commitments

- **Name**: Clearwell
- **Voice**: Dependable, clean, practical, and transparent.

## Evidence on Hand

- Public ordering interface and landing flow in [app/page.tsx](file:///c:/waterdeliverysystem/app/page.tsx).
- Complete station management routes in [app/(admin)/admin/](file:///c:/waterdeliverysystem/app/(admin)/admin/) (Dashboard, Deliveries, Customers, Inventory, Invoices, Orders, Payments, Reports, Schedules).
- Customer self-service dashboard and order history in [app/(customer)/customer/](file:///c:/waterdeliverysystem/app/(customer)/customer/).
- Rider delivery workflows and route view in [app/(rider)/rider/](file:///c:/waterdeliverysystem/app/(rider)/rider/).

## Product Principles

1. **Frictionless Doorstep Swaps**: Treat container exchange as a core transaction unit; every order clearly accounts for returned empties and deposits.
2. **Predictable Delivery Windows**: Respect customers' schedules by organizing dispatch strictly around predictable time slots.
3. **Operational Glanceability**: Interfaces for riders on the go and dispatchers in noisy station environments must be clear, actionable, and rapid.
4. **Physical-to-Digital Reconciliation**: Digital stock counts must always mirror physical warehouse counts (full containers, empties in transit, and bottles with customers).

## Accessibility & Inclusion

- High contrast and legible typography suited for mobile riders working outdoors in daylight.
- Minimum 44x44px touch targets on all interactive actions.
- Tabular data structured for screen readers and keyboard navigation across administrative dashboards.
