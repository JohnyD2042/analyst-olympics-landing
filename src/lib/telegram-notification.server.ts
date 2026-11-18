import { z } from "zod";
import { isValidContact } from "./contact";

export const telegramApplicationSchema = z.object({
  name: z.string().trim().min(1).max(200),
  status: z.enum(["Профучастник", "Частный аналитик"]),
  link: z.string().trim().min(1).max(500),
  email: z.string().trim().max(254).refine(isValidContact),
});

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

type Dependencies = {
  verifySecret: (secret: string) => Promise<boolean>;
  send: (text: string) => Promise<Response>;
};

export async function handleTelegramNotification(request: Request, deps: Dependencies) {
  const secret = request.headers.get("x-webhook-secret");
  if (!secret || secret.length > 1024) return new Response("Unauthorized", { status: 401 });

  try {
    if (!(await deps.verifySecret(secret))) return new Response("Unauthorized", { status: 401 });
  } catch {
    console.error("Telegram webhook verification failed");
    return new Response("Server error", { status: 500 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response("Bad Request", { status: 400 });
  }
  const parsed = telegramApplicationSchema.safeParse(body);
  if (!parsed.success) return new Response("Invalid payload", { status: 400 });

  const { name, status, link, email } = parsed.data;
  const text =
    `🔔 <b>Новая заявка</b>\n\n` +
    `<b>Имя/Бренд:</b> ${escapeHtml(name)}\n` +
    `<b>Статус:</b> ${escapeHtml(status)}\n` +
    `<b>Ссылка:</b> ${escapeHtml(link)}\n` +
    `<b>Контакт:</b> ${escapeHtml(email)}`;

  try {
    const response = await deps.send(text);
    if (!response.ok) {
      const detail = await response.text();
      console.error(`Telegram send failed [${response.status}]: ${detail}`);
      return Response.json({ error: "Telegram error", status: response.status, detail }, { status: 502 });
    }
    const result = await response.json() as { ok?: boolean; description?: string; error_code?: number };
    if (result.ok !== true) {
      console.error(`Telegram send failed [${result.error_code ?? response.status}]: ${result.description ?? "Invalid response"}`);
      return Response.json({ error: "Telegram error", status: result.error_code ?? response.status, detail: result.description ?? "Invalid response" }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch {
    // Do not log fetch exceptions: their URLs may contain the private bot token.
    console.error("Telegram send unavailable");
    return new Response("Telegram error", { status: 502 });
  }
}