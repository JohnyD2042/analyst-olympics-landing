import { test } from "node:test";
import assert from "node:assert/strict";
import { handleTelegramNotification } from "./telegram-notification.server";

const payload = { name: "Тест <аналитика>", status: "Частный аналитик", link: "https://t.me/test_channel", email: "@analyst_pro" };
function request(body: unknown = payload, secret: string | null = "test-secret") {
  return new Request("https://example.com/api/public/notify-telegram", {
    method: "POST",
    headers: secret ? { "x-webhook-secret": secret } : {},
    body: JSON.stringify(body),
  });
}
for (const email of ["@analyst_pro", "you@example.com"]) {
  test(`sends an application with contact ${email}`, async () => {
    let sent = "";
    const response = await handleTelegramNotification(request({ ...payload, email }), {
      verifySecret: async () => true,
      send: async (text) => { sent = text; return Response.json({ ok: true }); },
    });
    assert.equal(response.status, 200);
    assert.ok(sent.includes(email));
    assert.ok(sent.includes("&lt;аналитика&gt;"));
    assert.equal(sent.includes("<аналитика>"), false);
  });
}
for (const secret of [null, "wrong-secret"]) {
  test(`rejects ${secret === null ? "missing" : "invalid"} webhook secret without sending`, async () => {
    let sends = 0;
    const response = await handleTelegramNotification(request(payload, secret), {
      verifySecret: async (value) => value === "test-secret",
      send: async () => { sends++; return Response.json({ ok: true }); },
    });
    assert.equal(response.status, 401);
    assert.equal(sends, 0);
  });
}
test("rejects a contact without email or @username", async () => {
  let sends = 0;
  const response = await handleTelegramNotification(request({ ...payload, email: "analyst_pro" }), {
    verifySecret: async () => true,
    send: async () => { sends++; return Response.json({ ok: true }); },
  });
  assert.equal(response.status, 400);
  assert.equal(sends, 0);
});
test("surfaces Telegram failure even in a 200 response", async () => {
  const response = await handleTelegramNotification(request(), {
    verifySecret: async () => true,
    send: async () => Response.json({ ok: false, error_code: 403, description: "Forbidden" }),
  });
  assert.equal(response.status, 502);
  assert.equal((await response.json()).status, 403);
});
test("preserves provider status and body", async () => {
  const response = await handleTelegramNotification(request(), {
    verifySecret: async () => true,
    send: async () => new Response("Bad chat", { status: 400 }),
  });
  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), { error: "Telegram error", status: 400, detail: "Bad chat" });
});