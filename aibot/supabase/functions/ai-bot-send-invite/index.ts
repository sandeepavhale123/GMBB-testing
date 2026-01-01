import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InviteEmailRequest {
  email: string;
  workspaceName: string;
  inviterName: string;
  role: string;
}

const getRoleDescription = (role: string): string => {
  switch (role) {
    case "admin":
      return "As an Admin, you can manage workspace settings, invite members, and have full access to all bots.";
    case "editor":
      return "As an Editor, you can create, edit, and manage bots in the workspace.";
    case "viewer":
      return "As a Viewer, you can view all bots and their analytics in the workspace.";
    default:
      return "You have been granted access to this workspace.";
  }
};

const getEmailHtml = (
  email: string,
  workspaceName: string,
  inviterName: string,
  role: string,
  loginUrl: string,
): string => {
  const roleDescription = getRoleDescription(role);
  const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Workspace Invitation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid #e4e4e7;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #18181b;">You're Invited!</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #3f3f46;">
                Hi there,
              </p>
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #3f3f46;">
                <strong style="color: #18181b;">${inviterName}</strong> has invited you to join 
                <strong style="color: #18181b;">"${workspaceName}"</strong> as a <strong style="color: #18181b;">${capitalizedRole}</strong>.
              </p>
              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #3f3f46;">
                ${roleDescription}
              </p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${loginUrl}" style="display: inline-block; padding: 14px 32px; background-color: #18181b; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">
                      Accept Invitation
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0; font-size: 14px; line-height: 1.6; color: #71717a;">
                If you don't have an account yet, you can create one using the email address: <strong>${email}</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px 40px; text-align: center; border-top: 1px solid #e4e4e7;">
              <p style="margin: 0; font-size: 14px; color: #a1a1aa;">
                Powered by GMBBriefcase
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, workspaceName, inviterName, role }: InviteEmailRequest = await req.json();

    // Validate required fields
    if (!email || !workspaceName || !inviterName || !role) {
      console.error("Missing required fields:", { email, workspaceName, inviterName, role });
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Get the origin from the request headers or use a default
    const origin = req.headers.get("origin") || "https://sup.gmbbriefcase.com";
    const loginUrl = `${origin}/ai-bot-login`;

    console.log(`Sending invitation email to ${email} for workspace "${workspaceName}"`);

    const emailHtml = getEmailHtml(email, workspaceName, inviterName, role, loginUrl);

    const emailResponse = await resend.emails.send({
      from: "GMBBriefcase-Ai Chatbot <noreply@sup.gmbbriefcase.com>",
      to: [email],
      subject: `You've been invited to join "${workspaceName}"`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending invitation email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
