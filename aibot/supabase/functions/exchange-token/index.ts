import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { SignJWT, jwtVerify } from "https://deno.land/x/jose@v5.2.0/index.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TokenPayload {
  parentId: string;
  data?: string;
  type?: string;
  iat: number;
  exp: number;
}

interface ProfileData {
  fullName?: string;
  email?: string;
  avatarUrl?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { access_token, profile_data } = await req.json() as {
      access_token: string;
      profile_data?: ProfileData;
    };

    if (!access_token) {
      return new Response(
        JSON.stringify({ error: "access_token is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get secrets
    const gmbbriefcaseSecret = Deno.env.get("JWT_SECRET_KEY");
    const supabaseJwtSecret = Deno.env.get("SKELETON_JWT_SECRET");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!gmbbriefcaseSecret || !supabaseJwtSecret || !supabaseUrl || !serviceRoleKey) {
      console.error("Missing required secrets");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the GMBBriefcase token
    let parentId: string;
    try {
      const secretKey = new TextEncoder().encode(gmbbriefcaseSecret);
      const { payload } = await jwtVerify(access_token, secretKey);
      parentId = (payload as unknown as TokenPayload).parentId;

      if (!parentId) {
        throw new Error("parentId not found in token");
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      return new Response(
        JSON.stringify({ error: "Invalid access token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create admin Supabase client
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Check if profile exists with this external_user_id
    const { data: existingProfile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id, email")
      .eq("external_user_id", parentId)
      .maybeSingle();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return new Response(
        JSON.stringify({ error: "Database error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let userId: string;
    let userEmail: string;

    if (existingProfile) {
      // Profile exists - check if auth user exists
      userId = existingProfile.id;
      userEmail = existingProfile.email || profile_data?.email || `${parentId}@gmbbriefcase.local`;

      // Check if auth user exists
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(userId);

      if (!authUser?.user) {
        // Create auth user with the same ID as profile
        console.log("Creating auth user for existing profile:", userId);
        const { error: createUserError } = await supabaseAdmin.auth.admin.createUser({
          id: userId,
          email: userEmail,
          email_confirm: true,
          user_metadata: {
            external_user_id: parentId,
            full_name: profile_data?.fullName,
          },
        });

        if (createUserError) {
          console.error("Error creating auth user:", createUserError);
          // Continue anyway - the profile exists, we can still generate a token
        }
      }
    } else {
      // No profile exists - create both auth user and profile
      const newUserId = crypto.randomUUID();
      userEmail = profile_data?.email || `${parentId}@gmbbriefcase.local`;

      console.log("Creating new auth user and profile:", newUserId);

      // Create auth user first
      const { data: newAuthUser, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
        id: newUserId,
        email: userEmail,
        email_confirm: true,
        user_metadata: {
          external_user_id: parentId,
          full_name: profile_data?.fullName,
        },
      });

      if (createUserError) {
        console.error("Error creating auth user:", createUserError);
        return new Response(
          JSON.stringify({ error: "Failed to create user" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      userId = newAuthUser.user.id;

      // Create or update profile with same ID (upsert handles trigger-created profiles)
      const { error: upsertError } = await supabaseAdmin
        .from("profiles")
        .upsert({
          id: userId,
          external_user_id: parentId,
          full_name: profile_data?.fullName || null,
          email: userEmail,
          avatar_url: profile_data?.avatarUrl || null,
        }, { onConflict: "id" });

      if (upsertError) {
        console.error("Error upserting profile:", upsertError);
        // Try to clean up auth user
        await supabaseAdmin.auth.admin.deleteUser(userId);
        return new Response(
          JSON.stringify({ error: "Failed to create profile" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Generate Supabase-compatible JWT
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = 3600; // 1 hour

    const secretKey = new TextEncoder().encode(supabaseJwtSecret);

    const supabaseAccessToken = await new SignJWT({
      aud: "authenticated",
      exp: now + expiresIn,
      iat: now,
      iss: `${supabaseUrl}/auth/v1`,
      sub: userId,
      email: userEmail,
      role: "authenticated",
      app_metadata: {
        provider: "gmbbriefcase",
      },
      user_metadata: {
        external_user_id: parentId,
        full_name: profile_data?.fullName,
      },
    })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .sign(secretKey);

    // Generate a refresh token
    const supabaseRefreshToken = await new SignJWT({
      sub: userId,
      iat: now,
      exp: now + 604800, // 7 days
      type: "refresh",
    })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .sign(secretKey);

    console.log("Token exchange successful for user:", userId);

    return new Response(
      JSON.stringify({
        access_token: supabaseAccessToken,
        refresh_token: supabaseRefreshToken,
        profile_id: userId,
        expires_in: expiresIn,
        token_type: "bearer",
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Exchange token error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
