import { NextResponse, type NextRequest } from "next/server";
import { getAuth, withClerkMiddleware } from "@clerk/nextjs/server";

const publicPaths = [
  "/",
  "/sign-in*",
  "/organisation*",
  "/sign-up*",
  "/api/trpc*",
  "/api/webhooks*",
];

const isPublic = (reqPath: string) => {
  return publicPaths.find((publicPath) =>
    reqPath.match(new RegExp(`^${publicPath}$`.replace("*$", "($|/)")))
  );
};

export default withClerkMiddleware((request: NextRequest) => {
  const { userId } = getAuth(request);
  if (isPublic(request.nextUrl.pathname)) {
    // if (userId) {
    //   const url = request.nextUrl.clone();

    //   if (url.pathname === "/") {
    //     url.pathname = "/dashboard";

    //     return NextResponse.rewrite(url);
    //   }
    // }
    return NextResponse.next();
  }

  if (!userId) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect_url", request.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

// Stop Middleware running on static files and public folder
export const config = {
  matcher: "/((?!_next/image|_next/static|favicon.ico|site.webmanifest).*)",
};
