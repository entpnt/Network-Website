import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/clerk-react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Create a basic Supabase client (for unauthenticated requests)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Custom hook for authenticated Supabase client
export function useSupabase() {
  const { getToken } = useAuth();

  const authenticatedSupabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: async (url, options: RequestInit = {}) => {
        // Get the JWT token from Clerk
        const token = await getToken({ template: "supabase" });
        
        // Add the token to the request headers
        const headers = new Headers(options?.headers);
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        
        return fetch(url, { ...options, headers });
      }
    }
  });

  return authenticatedSupabase;
}

// Export types
export type { Database } from "../types/supabase"; 