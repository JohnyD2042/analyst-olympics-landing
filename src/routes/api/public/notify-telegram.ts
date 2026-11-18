import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/notify-telegram")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { handleTelegramNotification } = await import("@/lib/telegram-notification.server");
        return handleTelegramNotification(request, {
          verifySecret: async (secret) => {
            // This restricted RPC is only an authorization check; no application data is read.
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
            const { data, error } = await supabaseAdmin.rpc("verify_telegram_webhook_secret", { _secret: secret });
            if (error) throw new Error("Webhook verification unavailable");
            return data === true;
          },
          send: async (text) => {
            const token = process.env.TELEGRAM_BOT_TOKEN;
            const chatId = process.env.TELEGRAM_CHAT_ID;
            if (!token || !chatId) throw new Error("Telegram is not configured");
            return fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true }),
              signal: AbortSignal.timeout(4000),
            });
          },
        });
      },
    },
  },
});