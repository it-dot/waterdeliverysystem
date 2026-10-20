-- ==============================================================================
-- Migration: Add ON DELETE CASCADE / SET NULL to public.profiles & orders relations
-- Execute this in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. Cascade delete orders when a customer profile is deleted
ALTER TABLE IF EXISTS public.orders 
  DROP CONSTRAINT IF EXISTS orders_customer_id_fkey,
  ADD CONSTRAINT orders_customer_id_fkey 
    FOREIGN KEY (customer_id) 
    REFERENCES public.profiles(id) 
    ON DELETE CASCADE;

-- 2. Cascade delete invoices when a customer profile is deleted
ALTER TABLE IF EXISTS public.invoices 
  DROP CONSTRAINT IF EXISTS invoices_customer_id_fkey,
  ADD CONSTRAINT invoices_customer_id_fkey 
    FOREIGN KEY (customer_id) 
    REFERENCES public.profiles(id) 
    ON DELETE CASCADE;

-- 3. Cascade delete schedules when a customer profile is deleted
ALTER TABLE IF EXISTS public.schedules 
  DROP CONSTRAINT IF EXISTS schedules_customer_id_fkey,
  ADD CONSTRAINT schedules_customer_id_fkey 
    FOREIGN KEY (customer_id) 
    REFERENCES public.profiles(id) 
    ON DELETE CASCADE;

-- 4. Cascade delete order items when an order is deleted
ALTER TABLE IF EXISTS public.order_items 
  DROP CONSTRAINT IF EXISTS order_items_order_id_fkey,
  ADD CONSTRAINT order_items_order_id_fkey 
    FOREIGN KEY (order_id) 
    REFERENCES public.orders(id) 
    ON DELETE CASCADE;

-- 5. Cascade delete deliveries when an order is deleted, and set NULL if rider is deleted
ALTER TABLE IF EXISTS public.deliveries 
  DROP CONSTRAINT IF EXISTS deliveries_order_id_fkey,
  ADD CONSTRAINT deliveries_order_id_fkey 
    FOREIGN KEY (order_id) 
    REFERENCES public.orders(id) 
    ON DELETE CASCADE;

ALTER TABLE IF EXISTS public.deliveries 
  DROP CONSTRAINT IF EXISTS deliveries_rider_id_fkey,
  ADD CONSTRAINT deliveries_rider_id_fkey 
    FOREIGN KEY (rider_id) 
    REFERENCES public.profiles(id) 
    ON DELETE SET NULL;

-- 6. Cascade delete payments when an order is deleted
ALTER TABLE IF EXISTS public.payments 
  DROP CONSTRAINT IF EXISTS payments_order_id_fkey,
  ADD CONSTRAINT payments_order_id_fkey 
    FOREIGN KEY (order_id) 
    REFERENCES public.orders(id) 
    ON DELETE CASCADE;
