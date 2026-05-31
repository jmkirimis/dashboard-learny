import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas que exigem autenticação
const protectedRoutes = ['/configuracoes', '/dashboard', '/feedback', '/perfil', '/home'];

// Decodifica um segmento base64url (parte do JWT) para string.
function decodeBase64Url(segment: string): string {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');

  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

// Verifica se o token está estruturalmente válido e não expirado.
function isTokenActive(token: string | undefined): boolean {
  if (!token) return false;

  const parts = token.split('.');
  if (parts.length !== 3) return false;

  try {
    const payload = JSON.parse(decodeBase64Url(parts[1])) as { exp?: number };
    if (typeof payload.exp !== 'number') return false;
    // `exp` vem em segundos; Date.now() em milissegundos
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isAuthenticated = isTokenActive(token);

  // Verifica se a rota atual é protegida
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  // Rota protegida sem sessão válida → redireciona para login.
  // Se havia um cookie expirado/corrompido, remove para manter o estado consistente.
  if (isProtected && !isAuthenticated) {
    const response = NextResponse.redirect(new URL('/', request.url));
    if (token) {
      response.cookies.delete('token');
    }
    return response;
  }

  // Sessão válida acessando a página de login → vai direto para a home
  if (pathname === '/' && isAuthenticated) {
    return NextResponse.redirect(new URL('/home', request.url));
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
