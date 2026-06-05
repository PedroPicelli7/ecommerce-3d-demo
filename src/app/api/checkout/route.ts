import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";

interface CheckoutBodyItem {
  id: string;
  quantity: number;
}

export async function POST(request: Request) {
  try {
    const body: CheckoutBodyItem[] = await request.json();

    if (!body || body.length === 0) {
      return NextResponse.json(
        { error: "O carrinho está vazio." },
        { status: 400 }
      );
    }

    // 1. Coletar todos os IDs que vieram do carrinho do cliente
    const productIds = body.map((item) => item.id);

    // 2. BUSCA NO BANCO DE DADOS: Puxa os dados reais direto do Supabase
    const { data: produtosReais, error: dbError } = await supabase
      .from("products")
      .select("id, name, price")
      .in("id", productIds);

    if (dbError || !produtosReais || produtosReais.length === 0) {
      console.error("Erro ao buscar produtos no Supabase:", dbError);
      return NextResponse.json(
        { error: "Erro ao validar os produtos no banco de dados." },
        { status: 500 }
      );
    }

    let totalGeral = 0;
    const itensProcessados = [];

    // 3. LÓGICA DE SEGURANÇA: Cruza os dados do carrinho com os valores reais da nuvem
    for (const itemCarrinho of body) {
      const produtoBanco = produtosReais.find((p) => p.id === itemCarrinho.id);

      if (!produtoBanco) {
        return NextResponse.json(
          { error: `O produto com ID ${itemCarrinho.id} não existe no catálogo.` },
          { status: 404 }
        );
      }

      const precoReal = Number(produtoBanco.price);
      const subtotalItem = precoReal * itemCarrinho.quantity;
      totalGeral += subtotalItem;

      itensProcessados.push({
        id: produtoBanco.id,
        name: produtoBanco.name,
        quantity: itemCarrinho.quantity,
        unitPrice: precoReal,
        subtotal: subtotalItem,
      });
    }

    // Link fictício do gateway de pagamento (ex: Stripe/MercadoPago)
    const urlPagamentoSimulada = `https://checkout.stripe.com/pay/simulado_${Math.random().toString(36).substring(7)}`;

    // 4. SALVAR NO BANCO DE DADOS: Cria o registro do pedido na tabela 'orders' como 'pending'
    const { error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          total_amount: totalGeral,
          status: "pending",
          items: itensProcessados, // O PostgreSQL guarda o array inteiro como JSONB perfeitamente
          payment_url: urlPagamentoSimulada
        }
      ]);

    if (orderError) {
      console.error("Erro ao registrar pedido no Supabase:", orderError);
      return NextResponse.json(
        { error: "Erro interno ao salvar o pedido no banco de dados." },
        { status: 500 }
      );
    }

    // Retorna a resposta de sucesso completa para o front-end
    return NextResponse.json({
      success: true,
      message: "Pedido registrado e checkout criado!",
      total: totalGeral,
      products: itensProcessados,
      paymentUrl: urlPagamentoSimulada,
    });

  } catch (error) {
    console.error("Erro crítico no checkout:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar a requisição de checkout." },
      { status: 500 }
    );
  }
}