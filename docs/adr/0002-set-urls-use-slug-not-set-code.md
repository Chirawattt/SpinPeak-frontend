# Set URLs use the slug, not the set code

Set pages live at `/sets/<slug>`, e.g. `/sets/primary-p4-bundle`, not `/sets/pr-01` as Requirement §5.4 sketched. A slug is readable without knowing the internal code and carries search terms. Every set slug ends in `-bundle`, so a set slug can never collide with a course slug. Keep that suffix: dropping it later would change URLs and lose search ranking. The set code (`PR-01`) stays internal and appears only on badges.
