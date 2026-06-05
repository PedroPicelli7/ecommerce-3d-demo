import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";
import { MercadoPagoConfig, Preference } from "mercadopago";

// Inicializa o Mercado Pago com o token seguro do servidor
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || "",
});

interface CheckoutBody {
  items: { id: string; quantity: number }[];
  couponCode?: string;
}

export async function POST(request: Request) {
  try {
    const { items, couponCode }: CheckoutBody = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "O carrinho está vazio." }, { status: 400 });
    }

    // 1. Busca os dados reais dos produtos na nuvem
    const productIds = items.map((item) => item.id);
    const { data: produtosReais, error: dbError } = await supabase
      .from("products")
      .select("id, name, price")
      .in("id", productIds);

    if (dbError || !produtosReais || produtosReais.length === 0) {
      return NextResponse.json({ error: "Erro ao validar os produtos no catálogo." }, { status: 500 });
    }

    // 2. Valida o Cupom de Desconto direto no servidor (Segurança máxima)
    let discountPercentage = 0;
    if (couponCode) {
      const { data: couponData } = await supabase
        .from("coupons")
        .select("discount_percentage, is_active, expires_at")
        .eq("code", couponCode.trim().toUpperCase())
        .single();

      if (couponData && couponData.is_active && new Date(couponData.expires_at) > new Date()) {
        discountPercentage = couponData.discount_percentage;
      }
    }

    let totalGeral = 0;
    const itensProcessados = [];

    // 3. Monta a lista de compras cruzando os dados
    for (const itemCarrinho of items) {
      const produtoBanco = produtosReais.find((p) => p.id === itemCarrinho.id);
      if (!produtoBanco) {
        return NextResponse.json({ error: "Produto inválido no carrinho." }, { status: 404 });
      }

      const precoReal = Number(produtoBanco.price);
      // Se houver cupom, aplica a redução proporcional no valor unitário do item
      const precoComDesconto = discountPercentage > 0 
        ? parseFloat((precoReal * (1 - discountPercentage / 100)).toFixed(2))
        : precoReal;

      const subtotalItem = precoComDesconto * itemCarrinho.quantity;
      totalGeral += subtotalItem;

      itensProcessados.push({
        id: produtoBanco.id,
        title: produtoBanco.name, // O Mercado Pago exige o campo como 'title'
        quantity: itemCarrinho.quantity,
        unit_price: precoComDesconto, // Exige como 'unit_price'
        currency_id: "BRL",
      });
    }

    // 4. Cria a preferência de checkout no Mercado Pago
    const requestUrl = new URL(request.url);
    const origin = requestUrl.origin;

    const preference = new Preference(client);
    const mpResponse = await preference.create({
      body: {
        items: itensProcessados,
        back_urls: {
          success: `${origin}/shop?payment=success`,
          failure: `${origin}/shop?payment=failure`,
          pending: `${origin}/shop?payment=pending`,
        },
        auto_return: "approved",
        statement_descriptor: "PHLOX SHOP", // Nome que aparece na fatura do cartão
      },
    });

    // 5. Salva o pedido pendente com o ID real de rastreio do Mercado Pago
    const { error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          total_amount: totalGeral,
          status: "pending",
          items: itensProcessados,
          payment_url: mpResponse.init_point, // Link oficial de pagamento do MP
          mp_preference_id: mpResponse.id,
        },
      ]);

    if (orderError) {
      console.error("Erro ao registrar pedido:", orderError);
      return NextResponse.json({ error: "Erro ao registrar pedido no banco." }, { status: 500 });
    }

    // Retorna o link oficial gerado pelo Mercado Pago
    return NextResponse.json({
      success: true,
      paymentUrl: mpResponse.init_point, 
    });

  } catch (error) {
    console.error("Erro crítico no checkout do Mercado Pago:", error);
    return NextResponse.json({ error: "Erro interno no servidor de pagamentos." }, { status: 500 });
  }
}