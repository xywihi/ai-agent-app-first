import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { type CookieOptions, createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }
  const response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: Array<{
            name: string;
            value: string;
            options?: CookieOptions;
          }>
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          } catch (error) {}
        },
      },
    }
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  // const isProtected = request.nextUrl.pathname.startsWith("/chat");
  console.log("全局路由守卫");
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // return response;
}

export const config = {
  matcher: [
    "/",
    "/frontend/:path*",
    "/design/:path*",
    "/user/:path*",
    "/chat/:path*",
    "/ai-agent/:path*",
  ],
};
