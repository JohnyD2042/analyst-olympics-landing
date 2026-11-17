/** Contact for an application: an e-mail address or a Telegram handle like @username. */
export const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/i;
export const TELEGRAM_RE = /^@[A-Za-z0-9_]{5,32}$/;
export function isValidContact(value: string): boolean {
  const v = value.trim();
  return v.length >= 3 && v.length <= 254 && (EMAIL_RE.test(v) || TELEGRAM_RE.test(v));
}
