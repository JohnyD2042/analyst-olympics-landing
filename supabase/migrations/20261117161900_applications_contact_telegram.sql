-- Allow a Telegram handle (@username) as the contact in addition to e-mail.
DROP POLICY IF EXISTS "Anyone can submit applications" ON public.applications;
CREATE POLICY "Anyone can submit applications" ON public.applications FOR INSERT TO anon, authenticated WITH CHECK (
  char_length(name) BETWEEN 1 AND 200
  AND status IN ('Частный аналитик', 'Профучастник')
  AND char_length(link) BETWEEN 1 AND 500
  AND char_length(email) BETWEEN 3 AND 254
  AND (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' OR email ~ '^@[A-Za-z0-9_]{5,32}$')
);
