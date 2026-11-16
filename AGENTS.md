# Architecture
- Keep `/` and `/konkurs2027` in separate content route files so future design changes to the copied page do not alter the original.
- Restore historical presentation code selectively; preserve current deployment and generated Cloud configuration to avoid infrastructure regressions.
- Share the next-award date calculation in a browser-safe utility with calendar boundary tests to preserve the restored monthly rule on both pages.