import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req, secret: process.env.JWT_SECRET });
    const isAuth = !!token;
    const { pathname } = req.nextUrl;

    const publicPages = ["/", "/auth/reset-password"];
    const registerPages = pathname.startsWith("/register");

    const isDashboardPage = pathname.startsWith("/dashboard");
    const isPublicPage = publicPages.includes(pathname);

    if (registerPages) {
      return NextResponse.next();
    }

    if (isPublicPage) {
      return NextResponse.next();
    }

    if (isDashboardPage && !isAuth) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (isDashboardPage && isAuth) { 
      const userRole = token.user.role.code || "GUE";

      const roleRoutePatterns = {
        CLI: /^\/dashboard\/cli-/, // Rutas que empiecen con cli-
        FAC: /^\/dashboard\/fac-/, // Rutas que empiecen con fac-
      };

      for (const [requiredRole, pattern] of Object.entries(roleRoutePatterns)) {
        if (pattern.test(pathname)) {
          if (userRole !== requiredRole) {
            return NextResponse.redirect(new URL("/dashboard/unauthorized", req.url));
          }
        }
      }

    }

    return NextResponse.next();
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    // Incluir todas las rutas del dashboard y excluir archivos estáticos
    "/((?!api|_next/static|_next/image|favicon.ico|imgs/|data/terms.md|terms.md).*)",
  ],
};
