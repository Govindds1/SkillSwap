import { clerkClient, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/restricted"]);
const ALLOWED_EMAIL_DOMAIN = "@srmist.edu.in";

export default clerkMiddleware(async (auth, req) => {
  const pathname = req.nextUrl.pathname;

  // Never redirect away from the restricted page.
  if (pathname === "/restricted") {
    return;
  }

  if (isPublicRoute(req)) {
    return;
  }

  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const primaryEmail = user.emailAddresses.find(
    (email) => email.id === user.primaryEmailAddressId,
  )?.emailAddress;

  const email = primaryEmail?.toLowerCase();
  console.log("User email is: " + (email ?? "undefined"));

  if (!email?.endsWith(ALLOWED_EMAIL_DOMAIN)) {
    const restrictedUrl = new URL("/restricted", req.url);
    return NextResponse.redirect(restrictedUrl);
  }

  // Allow onboarding and profile setup endpoint without existing profile.
  if (pathname === "/onboarding" || pathname.startsWith("/api/profile")) {
    return;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !(supabaseServiceRoleKey || supabaseAnonKey)) {
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey ?? supabaseAnonKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    return;
  }

  if (!profile) {
    const onboardingUrl = new URL("/onboarding", req.url);
    return NextResponse.redirect(onboardingUrl);
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
