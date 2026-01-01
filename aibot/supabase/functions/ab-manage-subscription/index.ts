import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ManageRequest {
  action: "add_bots" | "cancel" | "resume" | "portal" | "get_subscription";
  quantity?: number;
}

serve(async (req) => {
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

    const { action, quantity }: ManageRequest = await req.json();

    // Get user's current subscription
    const { data: subscription, error: subError } = await supabaseClient
      .from("ab_subscriptions")
      .select("*, plan:ab_plans(*)")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (action === "get_subscription") {
      return new Response(
        JSON.stringify({ subscription }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!subscription) {
      throw new Error("No active subscription found");
    }

    const origin = req.headers.get("origin") || "https://gmbai.lovable.app";

    switch (action) {
      case "add_bots": {
        if (!subscription.stripe_subscription_id) {
          throw new Error("Cannot add bots to a lifetime subscription. Please upgrade your LTD tier.");
        }

        if (!quantity || quantity < 1) {
          throw new Error("Invalid quantity");
        }

        const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id);
        const subscriptionItemId = stripeSubscription.items.data[0].id;
        const newQuantity = (subscription.quantity || 1) + quantity;

        await stripe.subscriptions.update(subscription.stripe_subscription_id, {
          items: [{ id: subscriptionItemId, quantity: newQuantity }],
          proration_behavior: "always_invoice",
        });

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `Added ${quantity} bot(s) to your subscription`,
            new_quantity: newQuantity,
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      case "cancel": {
        if (!subscription.stripe_subscription_id) {
          throw new Error("Lifetime subscriptions cannot be cancelled");
        }

        await stripe.subscriptions.update(subscription.stripe_subscription_id, {
          cancel_at_period_end: true,
        });

        // Update local status
        await supabaseClient
          .from("ab_subscriptions")
          .update({ status: "cancelled" })
          .eq("id", subscription.id);

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Subscription will be cancelled at the end of the billing period",
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      case "resume": {
        if (!subscription.stripe_subscription_id) {
          throw new Error("Cannot resume a lifetime subscription");
        }

        await stripe.subscriptions.update(subscription.stripe_subscription_id, {
          cancel_at_period_end: false,
        });

        // Update local status
        await supabaseClient
          .from("ab_subscriptions")
          .update({ status: "active" })
          .eq("id", subscription.id);

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Subscription has been resumed",
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      case "portal": {
        if (!subscription.stripe_customer_id) {
          throw new Error("No Stripe customer found");
        }

        const portalSession = await stripe.billingPortal.sessions.create({
          customer: subscription.stripe_customer_id,
          return_url: `${origin}/module/ai-bot/subscription`,
        });

        return new Response(
          JSON.stringify({ url: portalSession.url }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error: any) {
    console.error("Error managing subscription:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
