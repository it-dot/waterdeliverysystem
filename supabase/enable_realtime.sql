-- Run this in the Supabase Dashboard -> SQL Editor to safely enable Realtime
-- This script checks if the table is already added before trying to add it, avoiding errors.

DO $$
BEGIN
  -- Add 'orders' if not already in publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE orders;
  END IF;
  
  -- Add 'deliveries' if not already in publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'deliveries'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE deliveries;
  END IF;

  -- Add 'inventory' if not already in publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'inventory'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE inventory;
  END IF;
END
$$;
