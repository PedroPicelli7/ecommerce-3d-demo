import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Em uma integração real (ex: Stripe), aqui leríamos o cabeçalho 'stripe-signature'
    // para garantir que a requisição veio mesmo do Stripe e não de um hacker simulando um pagamento.
    
    const { orderId, eventType } = body;

    if (!orderId || !eventType) {
      return NextResponse.json(
        { error: "Dados do evento incompletos." },
        { status: 400 }
      );
    }

    // Só vamos processar se o evento for de sucesso no pagamento
    if (eventType === "payment.success") {
      
      // 1. Verificar se o pedido realmente existe antes de atualizar
      const { data: pedido, error: searchError } = await supabase
        .from("orders")
        .select("id, status")
        .eq("id", orderId)
        .single();

      if (searchError || !pedido) {
        return NextResponse.json(
          { error: "Pedido não encontrado no banco de dados." },
          { status: 404 }
        );
      }

      // 2. EVITAR RETRABALHO: Se já estiver pago, ignora para não rodar duas vezes à toa
      if (pedido.status === "paid") {
        return NextResponse.json({ message: "O pedido já estava marcado como pago." });
      }

      // 3. ATUALIZAÇÃO NO BANCO: Muda o status para 'paid'
      const { error: updateError } = await supabase
        .from("orders")
        .update({ status: "paid" })
        .eq("id", orderId);

      if (updateError) {
        console.error("Erro ao atualizar o status do pedido:", updateError);
        return NextResponse.json(
          { error: "Erro interno ao atualizar status do pedido." },
          { status: 500 }
        );
      }

      console.log(`🚀 Pedido ${orderId} atualizado para PAGO com sucesso!`);
      
      return NextResponse.json({
        success: true,
        message: `Status do pedido ${orderId} atualizado com sucesso para 'paid'.`
      });
    }

    return NextResponse.json({ message: "Evento recebido, mas nenhuma ação era necessária." });

  } catch (error) {
    console.error("Erro crítico no webhook:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor ao processar o webhook." },
      { status: 500 }
    );
  }
}