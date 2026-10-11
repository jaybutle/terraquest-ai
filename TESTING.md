# TerraQuest AI manual checks

1. Run `npm run dev` and optionally `npm run server` with Ollama running.
2. Create a quest using the curated fallback and verify it is labeled `Curated local guide`.
3. Save it, refresh the browser, and reopen it from My quests.
4. Start Pocket Quest Mode, use the timer, check steps, and mark it complete.
5. Add, edit, delete, and photo-attach a Nature Journal entry.
6. Confirm Passport totals change from the saved records only.
7. Disable network access and verify saved quests and journal records remain available.
8. Change accessibility settings and confirm new quests inherit the preferences.
9. With `ollama pull gemma3:4b`, run `npm run server` and verify the API response is labeled `Quest Council · Gemma`.
10. For the Vercel frontend-only deployment, verify the live site loads on desktop and mobile, displays `Curated local guide` when the API is not configured, and does not claim that live Gemma generation is available.

Model generation, unsafe-output rejection, and service-worker behavior require the corresponding local setup and should not be reported as passed without running those checks.
