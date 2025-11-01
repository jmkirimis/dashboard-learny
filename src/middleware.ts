import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas que exigem autenticação
const protectedRoutes = ['/configuracoes', '/dashboard', '/feedback', '/perfil'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Verifica se a rota atual é protegida
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  // Se a rota for protegida e não houver token → redireciona para login (ou página inicial)
  if (isProtected && !token) {
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Se o usuário já tiver token e tentar acessar a página de login, redireciona ao dashboard
  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Caso contrário, segue o fluxo normal
  return NextResponse.next();
}

// Aplica o middleware apenas às rotas definidas
export const config = {
  matcher: [
    '/',
    '/configuracoes/:path*',
    '/dashboard/:path*',
    '/feedback/:path*',
    '/perfil/:path*',
  ],
};
