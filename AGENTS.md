# Architecture
- Keep Telegram notifications in a dynamically imported server-only handler, validating the database webhook secret before sending; accept the same contact formats as the application form and never log token-bearing fetch exceptions.
- Keep `/` and `/konkurs2027` in separate content route files so future design changes to the copied page do not alter the original.
- Restore historical presentation code selectively; preserve current deployment and generated Cloud configuration to avoid infrastructure regressions.
- Share the next-award date calculation in a browser-safe utility with calendar boundary tests to preserve the restored monthly rule on both pages.
- Keep season-specific amounts and award-date bounds in a tested browser-safe season module; do not change the original page's date policy.
- Scope season styling to its page and load its stylesheet in the leaf head so the original presentation stays unchanged.
- Keep benefit light controls in an isolated browser-safe component with tested independent switch and all-closed hint state; use a full-card switch behind pointer-transparent artwork and a separate cord drag control to avoid double activation, preserving keyboard and release animations.