# Architecture
- Keep `/` and `/konkurs2027` in separate content route files so future design changes to the copied page do not alter the original.
- Restore historical presentation code selectively; preserve current deployment and generated Cloud configuration to avoid infrastructure regressions.
- Share the next-award date calculation in a browser-safe utility with calendar boundary tests to preserve the restored monthly rule on both pages.
- Keep season-specific amounts and award-date bounds in a tested browser-safe season module; do not change the original page's date policy.
- Scope season styling to its page and load its stylesheet in the leaf head so the original presentation stays unchanged.