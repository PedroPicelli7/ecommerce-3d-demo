import { NextResponse } from "next/server";
import productsData from "../../../data/products.json";

// Definição do formato que a API espera receber do front-end
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

    let totalGeral = 0;
    const itensProcessados = [];

    // LÓGICA DE SEGURANÇA: Validar os preços direto do servidor (JSON/Banco)
    for (const itemCard of body) {
      // Busca o produto real no "banco" para garantir que o usuário não alterou o preço no inspecionar elemento
      const produtoReal = productsData.find((p) => p.id === itemCard.id);

      if (!produtoReal) {
        return NextResponse.json(
          { error: `Produto com ID ${itemCard.id} não foi encontrado.` },
          { status: 404 }
        );
      }

      const subtotalItem = produtoReal.price * itemCard.quantity;
      totalGeral += subtotalItem;

      itensProcessados.push({
        id: produtoReal.id,
        nome: produtoReal.name,
        quantidade: itemCard.quantity,
        precoUnitario: produtoReal.price,
        subtotal: subtotalItem,
      });
    }

    // SIMULAÇÃO DE INTEGRAÇÃO COM GATEWAY (Stripe / Mercado Pago)
    // Aqui enviaríamos os 'itensProcessados' para a API deles e receberíamos a URL de pagamento
    const urlPagamentoSimulada = `https://checkout.stripe.com/pay/simulado_${Math.random().toString(36).substring(7)}`;

    // Retorna a resposta de sucesso para o front-end
    return NextResponse.json({
      success: true,
      message: "Sessão de checkout criada com sucesso!",
      total: totalGeral,
      products: itensProcessados,
      paymentUrl: urlPagamentoSimulada, // O link para onde vamos redirecionar o cliente
    });

  } catch (error) {
    console.error("Erro no checkout:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar o checkout." },
      { status: 500 }
    );
  }
}