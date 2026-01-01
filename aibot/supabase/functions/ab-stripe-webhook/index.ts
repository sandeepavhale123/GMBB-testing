import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  
  if (!signature) {
    console.error("No stripe-signature header");
    return new Response("No signature", { status: 400 });
  }

  let event: Stripe.Event;
  const body = await req.text();

  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // For development without webhook secret
      event = JSON.parse(body);
      console.warn("STRIPE_WEBHOOK_SECRET not set, skipping signature verification");
    }
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  console.log("Received Stripe event:", event.type);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
      
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }
      
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }
      
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }
      
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return new Response(`Webhook Error: ${error.message}`, { status: 500 });
  }
});

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const metadata = session.metadata || {};
  const userId = metadata.user_id;
  const planId = metadata.plan_id;
  const planType = metadata.plan_type;
  const planName = metadata.plan_name;
  const quantity = parseInt(metadata.quantity || "1");

  if (!userId || !planId) {
    console.error("Missing user_id or plan_id in session metadata");
    return;
  }

  console.log("Processing checkout completed:", { userId, planId, planType, quantity });

  const isLtd = planType === "ltd";
  const now = new Date().toISOString();

  // Check for existing subscription
  const { data: existingSub } = await supabaseAdmin
    .from("ab_subscriptions")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  // Deactivate any existing subscription
  if (existingSub) {
    await supabaseAdmin
      .from("ab_subscriptions")
      .update({ status: "cancelled", updated_at: now })
      .eq("id", existingSub.id);
  }

  // Create new subscription
  const subscriptionData = {
    user_id: userId,
    plan_id: planId,
    status: "active",
    stripe_customer_id: session.customer as string,
    stripe_subscription_id: session.subscription as string || null,
    lifetime_access: isLtd,
    purchased_at: isLtd ? now : null,
    quantity: quantity,
    current_period_start: isLtd ? null : now,
    current_period_end: isLtd ? null : null, // Will be updated from subscription data
  };

  const { data: newSub, error: subError } = await supabaseAdmin
    .from("ab_subscriptions")
    .insert(subscriptionData)
    .select()
    .single();

  if (subError) {
    console.error("Error creating subscription:", subError);
    throw subError;
  }

  // Record payment history
  const amountTotal = session.amount_total || 0;
  await supabaseAdmin.from("ab_payment_history").insert({
    user_id: userId,
    subscription_id: newSub.id,
    stripe_payment_intent_id: session.payment_intent as string,
    amount_cents: amountTotal,
    currency: session.currency || "usd",
    status: "succeeded",
    plan_name: planName,
    plan_type: planType,
    description: `${planName} - ${isLtd ? "Lifetime" : "Subscription"}`,
  });

  // Trigger email notification
  try {
    await sendPaymentEmail(userId, planName || "AI Bot Plan", amountTotal, session.customer as string);
  } catch (emailError) {
    console.error("Error sending payment email:", emailError);
    // Don't fail the webhook for email errors
  }

  console.log("Checkout completed successfully for user:", userId);
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;
  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const userId = subscription.metadata?.user_id;

  if (!userId) {
    console.error("No user_id in subscription metadata");
    return;
  }

  // Update subscription period
  await supabaseAdmin
    .from("ab_subscriptions")
    .update({
      status: "active",
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscriptionId);

  // Record payment
  const { data: subRecord } = await supabaseAdmin
    .from("ab_subscriptions")
    .select("id, plan:ab_plans(name, plan_type)")
    .eq("stripe_subscription_id", subscriptionId)
    .maybeSingle();

  if (subRecord) {
    await supabaseAdmin.from("ab_payment_history").insert({
      user_id: userId,
      subscription_id: subRecord.id,
      stripe_invoice_id: invoice.id,
      stripe_invoice_url: invoice.hosted_invoice_url,
      stripe_receipt_url: invoice.invoice_pdf,
      amount_cents: invoice.amount_paid,
      currency: invoice.currency,
      status: "succeeded",
      plan_name: (subRecord.plan as any)?.name,
      plan_type: (subRecord.plan as any)?.plan_type,
      description: `Subscription renewal`,
    });
  }

  console.log("Invoice paid for subscription:", subscriptionId);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;
  if (!subscriptionId) return;

  await supabaseAdmin
    .from("ab_subscriptions")
    .update({
      status: "past_due",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscriptionId);

  console.log("Payment failed for subscription:", subscriptionId);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const quantity = subscription.items.data[0]?.quantity || 1;

  await supabaseAdmin
    .from("ab_subscriptions")
    .update({
      quantity: quantity,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      status: subscription.cancel_at_period_end ? "cancelled" : "active",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id);

  console.log("Subscription updated:", subscription.id);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.user_id;

  // Update subscription status
  await supabaseAdmin
    .from("ab_subscriptions")
    .update({
      status: "expired",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id);

  // Get free plan
  const { data: freePlan } = await supabaseAdmin
    .from("ab_plans")
    .select("id")
    .eq("slug", "free")
    .single();

  // Create free subscription if we have user
  if (userId && freePlan) {
    await supabaseAdmin.from("ab_subscriptions").insert({
      user_id: userId,
      plan_id: freePlan.id,
      status: "active",
      quantity: 1,
    });
  }

  console.log("Subscription deleted, user downgraded to free:", subscription.id);
}

async function sendPaymentEmail(userId: string, planName: string, amountCents: number, customerId: string) {
  // Get user email
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("email, full_name")
    .eq("id", userId)
    .maybeSingle();

  if (!profile?.email) {
    console.log("No email found for user:", userId);
    return;
  }

  // Call the email function
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  await fetch(`${supabaseUrl}/functions/v1/ab-send-payment-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${serviceRoleKey}`,
    },
    body: JSON.stringify({
      to: profile.email,
      name: profile.full_name || "Customer",
      plan_name: planName,
      amount_cents: amountCents,
      type: "payment_confirmation",
    }),
  });
}
