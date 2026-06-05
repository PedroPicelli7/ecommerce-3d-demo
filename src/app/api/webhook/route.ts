import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";
import { MercadoPagoConfig, Payment } from "mercadopago";

// Inicializa o Mercado Pago no servidor
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || "",
});

export async function POST(request: Request) {
  try {
    // O Mercado Pago pode enviar dados via Query Params (?id=...&type=...) ou no Body JSON
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get("data.id") || searchParams.get("id");
    const typeParam = searchParams.get("type");

    // Lendo também o corpo, caso venha no formato alternativo JSON
    let body: any = {};
    try {
      body = await request.json();
    } catch (e) {
      // Corpo vazio ou não-JSON (comum em alguns pings de teste)
    }

    // Consolida o ID do pagamento e o tipo do evento vindo do Mercado Pago
    const paymentId = idParam || (body.data && body.data.id);
    const actionType = typeParam || body.type;

    // Se não for um evento de pagamento, ignoramos (o Mercado Pago avisa sobre outras coisas)
    if (actionType !== "payment" || !paymentId) {
      return NextResponse.json({ message: "Evento ignorado. Apenas monitoramos 'payment'." });
    }

    // 1. Consulta o Mercado Pago para obter os detalhes REAIS do pagamento (Evita Fraudes)
    const paymentClient = new Payment(client);
    const paymentData = await paymentClient.get({ id: Number(paymentId) });

    // O status do pagamento pode ser: approved, pending, in_process, rejected, etc.
    const paymentStatus = (paymentData as any).status;
    const preferenceId = (paymentData as any).preference_id;
    if (!preferenceId) {
      return NextResponse.json({ error: "Preference ID não encontrado no pagamento." }, { status: 400 });
    }

    // 2. Se o pagamento foi aprovado (Pix pago ou Cartão autorizado)
    if (paymentStatus === "approved") {
      
      // Busca o pedido correspondente no Supabase usando o ID da preferência do Mercado Pago
      const { data: pedido, error: searchError } = await supabase
        .from("orders")
        .select("id, status")
        .eq("mp_preference_id", preferenceId)
        .single();

      if (searchError || !pedido) {
        return NextResponse.json({ error: "Pedido correspondente não localizado no Supabase." }, { status: 404 });
      }

      // Se o pedido já constar como pago, finaliza o processo
      if (pedido.status === "paid") {
        return NextResponse.json({ message: "O pedido já constava como pago no banco de dados." });
      }

      // 3. Atualiza o status do pedido para 'paid'
      const { error: updateError } = await supabase
        .from("orders")
        .update({ status: "paid" })
        .eq("id", pedido.id);

      if (updateError) {
        console.error("Erro ao atualizar status do pedido:", updateError);
        return NextResponse.json({ error: "Erro ao salvar status de pago no banco." }, { status: 500 });
      }

      console.log(`🚀 Pedido ${pedido.id} liquidado com sucesso via Webhook!`);
      return NextResponse.json({ success: true, message: "Pedido atualizado para pago." });
    }

    return NextResponse.json({ message: `Evento processado. Status atual do pagamento: ${paymentStatus}` });

  } catch (error) {
    console.error("Erro crítico no processamento do Webhook:", error);
    return NextResponse.json({ error: "Erro interno no servidor do webhook." }, { status: 500 });
  }
}