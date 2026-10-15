export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          address: string | null
          role: 'admin' | 'dispatcher' | 'rider' | 'customer'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          role?: 'admin' | 'dispatcher' | 'rider' | 'customer'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          role?: 'admin' | 'dispatcher' | 'rider' | 'customer'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          status: 'pending' | 'processing' | 'in-transit' | 'delivered' | 'cancelled'
          delivery_address: string
          subtotal: number
          delivery_fee: number
          total_amount: number
          payment_method: 'cash' | 'gcash' | 'card'
          payment_status: 'pending' | 'success' | 'paid' | 'failed' | 'refunded'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          status?: 'pending' | 'processing' | 'in-transit' | 'delivered' | 'cancelled'
          delivery_address: string
          subtotal: number
          delivery_fee: number
          total_amount: number
          payment_method: 'cash' | 'gcash' | 'card'
          payment_status?: 'pending' | 'success' | 'paid' | 'failed' | 'refunded'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          status?: 'pending' | 'processing' | 'in-transit' | 'delivered' | 'cancelled'
          delivery_address?: string
          subtotal?: number
          delivery_fee?: number
          total_amount?: number
          payment_method?: 'cash' | 'gcash' | 'card'
          payment_status?: 'pending' | 'success' | 'paid' | 'failed' | 'refunded'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price_at_time: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price_at_time: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price_at_time?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      inventory: {
        Row: {
          id: string
          product_id: string
          stock_level: number
          low_stock_threshold: number
          last_restocked_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          stock_level?: number
          low_stock_threshold?: number
          last_restocked_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          stock_level?: number
          low_stock_threshold?: number
          last_restocked_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      deliveries: {
        Row: {
          id: string
          order_id: string
          rider_id: string | null
          status: 'assigned' | 'in-transit' | 'delivered' | 'failed'
          scheduled_date: string | null
          completed_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          rider_id?: string | null
          status?: 'assigned' | 'in-transit' | 'delivered' | 'failed'
          scheduled_date?: string | null
          completed_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          rider_id?: string | null
          status?: 'assigned' | 'in-transit' | 'delivered' | 'failed'
          scheduled_date?: string | null
          completed_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deliveries_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliveries_rider_id_fkey"
            columns: ["rider_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      payments: {
        Row: {
          id: string
          order_id: string
          amount: number
          provider: 'cash' | 'paymongo'
          external_reference: string | null
          status: 'pending' | 'success' | 'failed' | 'refunded'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          amount: number
          provider: 'cash' | 'paymongo'
          external_reference?: string | null
          status?: 'pending' | 'success' | 'failed' | 'refunded'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          amount?: number
          provider?: 'cash' | 'paymongo'
          external_reference?: string | null
          status?: 'pending' | 'success' | 'failed' | 'refunded'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
