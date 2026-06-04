import { supabase } from "./supabase";

export const trackEvent = async (type: "page_view" | "click_buy", url: string, productName?: string) => {
  try {
    await supabase.from("analytics_events").insert([
      {
        event_type: type,
        page_url: url,
        product_name: productName || null
      }
    ]);
  } catch (error) {
    console.error("Erro ao registrar evento de analytics:", error);
  }
};