# TerraQuest AI

**Less scrolling. More exploring.**

TerraQuest AI is a local-first nature companion for making small outdoor adventures feel easy to start. This first implementation focuses on the core experience: discovering activities, generating a practical quest, saving it in the browser, completing it in a low-distraction mode, and keeping a nature journal.

## Current core features

- Responsive landing / Discover page with activity suggestions and real local impact counters.
- Quest creator with activity, duration, difficulty, and observation-interest inputs.
- Quest Council boundary: Gemma/Ollama generation, structured output validation, and clearly labeled curated fallback.
- Saved, in-progress, completed, searchable-by-tab quest views.
- Active quest mode with checklist and optional timer.
- Nature journal with add, edit, and delete flows.
- Browser `localStorage` persistence for quests and journal entries.
- Nature Passport, Eco-Missions, accessibility preferences, photo attachments, export/reset controls.
- Express local API at `POST /api/quests/generate` and `GET /api/health`.
- Online/offline status indicator and truthful local-storage messaging.
- Reduced-motion-friendly transitions and keyboard-focus states.

## Technology

- React 18 and Vite
- JavaScript functional components
- Lucide React icons
- CSS with responsive layout and nature-inspired design tokens
- Browser localStorage for the current MVP's persistence

## Run locally

```bash
npm install
# terminal 1
npm run server
# terminal 2
npm run dev
```

Then open the local URL printed by Vite. A production build can be checked with:

```bash
npm run build
```

## Deploy the frontend on Vercel

The React/Vite frontend can be deployed to Vercel's free tier directly from
the [GitHub repository](https://github.com/jaybutle/terraquest-ai):

1. Import `jaybutle/terraquest-ai` into Vercel.
2. Keep the detected framework as Vite.
3. Use `npm run build` as the build command.
4. Use `dist` as the output directory.
5. Deploy without setting `VITE_API_URL` for the frontend-only demo.

In this frontend-only deployment, the public site uses the clearly labeled
`Curated local guide` when its API is unavailable. The live Vercel site does
not claim to run Gemma. Ollama on a personal computer is not reachable by
Vercel visitors.

To enable live AI generation later, deploy the Express API separately on a
server that can reach Ollama (or another hosted model), then set
`VITE_API_URL` in Vercel to that API's HTTPS origin. Configure that API's
`CLIENT_ORIGIN` to the Vercel URL. Never commit API keys or `.env` files.

## Open-weight AI and Ollama

The app sends only quest preferences to the local Express API. The API validates input, asks Gemma for JSON, validates the required quest shape, and returns a labeled result. Journal content and browser storage are not sent to the model. If Ollama is unavailable, the frontend uses a clearly labeled curated guide instead.

For that integration, Ollama can be installed from [ollama.com](https://ollama.com), then a model can be pulled with:

```bash
ollama pull gemma3:4b
```

Check the service before generating:

```bash
curl http://localhost:8787/api/health
```

Optional Quest Council review model configuration is available with `OLLAMA_REVIEW_MODEL`; the primary generation path does not require downloading a second model. Local inference keeps the product independent from paid hosted APIs and gives people more control over their data, but it requires compatible hardware and consumes local resources.

## Offline limitations

Quest and journal records are stored in the current browser only. A service worker caches the application shell after first load, while new Ollama generation still requires the local model service. Offline access to previously saved quests does not imply offline AI generation.

## Architecture direction

```mermaid
flowchart LR
  UI[React UI] --> Store[localStorage]
  UI --> API[/api/quests/generate]
  API --> Ollama[Local Ollama model]
  API --> Validate[Input and output validation]
```

## Verification

```bash
npm run build
curl -X POST http://localhost:8787/api/quests/generate \
  -H 'content-type: application/json' \
  -d '{"activity":"Mindful walk","duration":15,"difficulty":"Easy","interest":"birds"}'
```

The API returns `503` when Ollama is not running; that is an explicit service status, not a fake AI response. See [TESTING.md](./TESTING.md) for the manual flow and limitations.

## License

For an open-source submission, an MIT license is a sensible default. Add the license file before publishing.
