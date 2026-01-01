import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sendWithResend(apiKey: string, params: { from: string; to: string[]; subject: string; html: string }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend API error: ${errorText}`);
  }
  
  return await response.json();
}


interface EmailRequest {
  to: string;
  name: string;
  plan_name: string;
  amount_cents: number;
  type: "payment_confirmation" | "payment_failed" | "subscription_cancelled";
  invoice_url?: string;
  receipt_url?: string;
  portal_url?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const { to, name, plan_name, amount_cents, type, invoice_url, receipt_url, portal_url }: EmailRequest = await req.json();

    if (!to || !type) {
      throw new Error("Missing required fields: to, type");
    }

    const amount = (amount_cents / 100).toFixed(2);
    let subject: string;
    let html: string;

    switch (type) {
      case "payment_confirmation":
        subject = `Payment Confirmed - ${plan_name}`;
        html = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #3B82F6, #8B5CF6); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
              .highlight { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3B82F6; }
              .button { display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 10px 5px; }
              .footer { text-align: center; color: #666; font-size: 14px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Payment Successful!</h1>
              </div>
              <div class="content">
                <p>Hi ${name},</p>
                <p>Thank you for your purchase! Your subscription is now active.</p>
                
                <div class="highlight">
                  <strong>Plan:</strong> ${plan_name}<br>
                  <strong>Amount:</strong> $${amount}<br>
                  <strong>Status:</strong> ✅ Active
                </div>
                
                <p>You now have access to all the features included in your plan. Start creating amazing AI chatbots today!</p>
                
                <div style="text-align: center; margin-top: 30px;">
                  <a href="https://gmbai.lovable.app/module/ai-bot/dashboard" class="button">Go to Dashboard</a>
                  ${invoice_url ? `<a href="${invoice_url}" class="button" style="background: #6B7280;">View Invoice</a>` : ''}
                </div>
                
                <div class="footer">
                  <p>If you have any questions, please contact our support team.</p>
                  <p>© ${new Date().getFullYear()} GMBBriefcase. All rights reserved.</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `;
        break;

      case "payment_failed":
        subject = `Action Required - Payment Failed`;
        html = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #EF4444; color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
              .highlight { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #EF4444; }
              .button { display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; }
              .footer { text-align: center; color: #666; font-size: 14px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>⚠️ Payment Failed</h1>
              </div>
              <div class="content">
                <p>Hi ${name},</p>
                <p>We were unable to process your payment for <strong>${plan_name}</strong>.</p>
                
                <div class="highlight">
                  <strong>Amount:</strong> $${amount}<br>
                  <strong>Status:</strong> ❌ Failed
                </div>
                
                <p>Please update your payment method to continue using your AI Bot subscription. Your access will be limited until payment is resolved.</p>
                
                <div style="text-align: center; margin-top: 30px;">
                  <a href="${portal_url || 'https://gmbai.lovable.app/module/ai-bot/subscription'}" class="button">Update Payment Method</a>
                </div>
                
                <div class="footer">
                  <p>If you believe this is an error, please contact our support team.</p>
                  <p>© ${new Date().getFullYear()} GMBBriefcase. All rights reserved.</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `;
        break;

      case "subscription_cancelled":
        subject = `Subscription Cancelled`;
        html = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #6B7280; color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
              .button { display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; }
              .footer { text-align: center; color: #666; font-size: 14px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Subscription Cancelled</h1>
              </div>
              <div class="content">
                <p>Hi ${name},</p>
                <p>Your <strong>${plan_name}</strong> subscription has been cancelled.</p>
                
                <p>You've been moved to our Free plan. You can still access basic features, but some premium features are no longer available.</p>
                
                <p>We'd love to have you back! If you change your mind, you can resubscribe anytime.</p>
                
                <div style="text-align: center; margin-top: 30px;">
                  <a href="https://gmbai.lovable.app/module/ai-bot/subscription" class="button">View Plans</a>
                </div>
                
                <div class="footer">
                  <p>Thank you for being a customer. We hope to see you again soon!</p>
                  <p>© ${new Date().getFullYear()} GMBBriefcase. All rights reserved.</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `;
        break;

      default:
        throw new Error(`Unknown email type: ${type}`);
    }

    const emailResponse = await sendWithResend(resendKey, {
      from: "GMBBriefcase <noreply@resend.dev>",
      to: [to],
      subject: subject,
      html: html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, id: emailResponse.id }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
