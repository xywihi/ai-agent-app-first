import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
export async function createServerAdmin() {
  const cookieStore = await cookies();
  const supabaseServer = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: Array<{
            name: string;
            value: string;
            options?: CookieOptions;
          }>
        ) {
          try {
            cookiesToSet.forEach(
              ({
                name,
                value,
                options,
              }: {
                name: string;
                value: string;
                options?: CookieOptions;
              }) => {
                cookieStore.set(name, value, options);
              }
            );
          } catch (error) {}
        },
      },
    }
  );
  return supabaseServer;
}
