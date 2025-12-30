import { supabase } from "@/integrations/supabase/client";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  iss: string;
  iat: number;
  exp: number;
  data: string;
  parentId: string;
  type: string;
}

interface ProfileData {
  fullName?: string;
  email?: string;
  avatarUrl?: string;
}

/**
 * Hook for syncing user profile with Supabase after login
 * Decodes the access token to get parentId, checks if profile exists,
 * creates new profile if needed, and stores supabase_profile_id in localStorage
 */
export const useSupabaseProfileSync = () => {
  /**
   * Syncs or creates a Supabase profile based on the external parentId from JWT
   * @param accessToken - The JWT access token from login response
   * @param profileData - Optional profile data to use when creating new profile
   * @returns The Supabase profile ID
   */
  const syncSupabaseProfile = async (
    accessToken: string,
    profileData?: ProfileData
  ): Promise<string | null> => {
    try {
      // Decode the access token to get parentId
      const decoded = jwtDecode<DecodedToken>(accessToken);
      const parentId = decoded.parentId;

      if (!parentId) {
        console.error("No parentId found in token");
        return null;
      }

      // Check if profile exists with this external_user_id (parentId)
      const { data: existingProfile, error: fetchError } = await supabase
        .from("profiles")
        .select("id")
        .eq("external_user_id", parentId)
        .maybeSingle();

      if (fetchError) {
        console.error("Error fetching profile:", fetchError);
        return null;
      }

      let supabaseProfileId: string;

      if (existingProfile) {
        // Profile exists, use existing ID
        supabaseProfileId = existingProfile.id;
      } else {
        // Create new profile with external_user_id
        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: crypto.randomUUID(),
            external_user_id: parentId,
            full_name: profileData?.fullName || null,
            email: profileData?.email || null,
            avatar_url: profileData?.avatarUrl || null,
          })
          .select("id")
          .single();

        if (insertError) {
          console.error("Error creating profile:", insertError);
          return null;
        }

        supabaseProfileId = newProfile.id;
      }

      // Store supabase_profile_id in localStorage for future use
      localStorage.setItem("supabase_profile_id", supabaseProfileId);

      return supabaseProfileId;
    } catch (error) {
      console.error("Error syncing Supabase profile:", error);
      return null;
    }
  };

  /**
   * Gets the stored Supabase profile ID from localStorage
   */
  const getSupabaseProfileId = (): string | null => {
    return localStorage.getItem("supabase_profile_id");
  };

  /**
   * Clears the stored Supabase profile ID (useful for logout)
   */
  const clearSupabaseProfileId = (): void => {
    localStorage.removeItem("supabase_profile_id");
  };

  return {
    syncSupabaseProfile,
    getSupabaseProfileId,
    clearSupabaseProfileId,
  };
};
