import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CheckoutRequest {
  plan_id: string;
  quantity?: number;
  success_url?: string;
  cancel_url?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY not configured");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Get auth user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    const { plan_id, quantity = 1, success_url, cancel_url }: CheckoutRequest = await req.json();

    if (!plan_id) {
      throw new Error("plan_id is required");
    }

    // Get plan details
    const { data: plan, error: planError } = await supabaseClient
      .from("ab_plans")
      .select("*")
      .eq("id", plan_id)
      .single();

    if (planError || !plan) {
      throw new Error("Plan not found");
    }

    if (!plan.stripe_price_id) {
      throw new Error("Plan does not have a Stripe price configured");
    }

    // Check for existing Stripe customer
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    let customerId: string;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: user.id,
        },
      });
      customerId = customer.id;
    }

    const origin = req.headers.get("origin") || "https://gmbai.lovable.app";
    const defaultSuccessUrl = `${origin}/module/ai-bot/payment-success?session_id={CHECKOUT_SESSION_ID}`;
    const defaultCancelUrl = `${origin}/module/ai-bot/subscription`;

    // Create checkout session based on plan type
    const isRecurring = plan.plan_type === "recurring";
    
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      line_items: [
        {
          price: plan.stripe_price_id,
          quantity: quantity,
        },
      ],
      mode: isRecurring ? "subscription" : "payment",
      success_url: success_url || defaultSuccessUrl,
      cancel_url: cancel_url || defaultCancelUrl,
      metadata: {
        user_id: user.id,
        plan_id: plan_id,
        plan_type: plan.plan_type,
        plan_name: plan.name,
        quantity: quantity.toString(),
      },
      payment_intent_data: !isRecurring ? {
        metadata: {
          user_id: user.id,
          plan_id: plan_id,
          plan_type: plan.plan_type,
        },
      } : undefined,
      subscription_data: isRecurring ? {
        metadata: {
          user_id: user.id,
          plan_id: plan_id,
          plan_type: plan.plan_type,
        },
      } : undefined,
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log("Checkout session created:", {
      sessionId: session.id,
      planId: plan_id,
      planType: plan.plan_type,
      quantity,
      userId: user.id,
    });

    return new Response(
      JSON.stringify({ 
        url: session.url,
        session_id: session.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
