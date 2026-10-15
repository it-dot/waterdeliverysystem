import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { autoCreateInvoiceForOrder } from '@/lib/actions/invoices'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 1. Verify PayMongo signature here using process.env.PAYMONGO_WEBHOOK_SECRET
    // ...

    // 2. Identify the related order/payment
    const eventType = body.data?.attributes?.type
    
    if (eventType === 'payment.paid') {
      const paymentIntentId = body.data?.attributes?.data?.attributes?.payment_intent_id
      
      if (paymentIntentId) {
        const supabase = await createAdminClient()
        
        // Update payment status in Supabase
        const { data: payment } = await supabase
          .from('payments')
          .update({ status: 'success' })
          .eq('external_reference', paymentIntentId)
          .select('order_id')
          .single()
          
        if (payment?.order_id) {
          // Additionally update order status
          await supabase
            .from('orders')
            .update({ payment_status: 'paid' })
            .eq('id', payment.order_id)

          // Auto-generate invoice
          await autoCreateInvoiceForOrder(supabase, payment.order_id)
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  }
}
