import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    // Realiza o handshake trocando o código de autenticação do Google por uma sessão ativa
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Com o usuário autenticado com sucesso, redireciona de volta para o catálogo
  return NextResponse.redirect(`${requestUrl.origin}/shop`);
}