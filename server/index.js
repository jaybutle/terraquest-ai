import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

const app = express();
const port = Number(process.env.PORT || 8787);
const ollamaUrl = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
const primaryModel = process.env.OLLAMA_PRIMARY_MODEL || 'gemma3:4b';
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173,http://localhost:4173')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy violation'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '32kb' }));

function validateInput(body) {
  const allowed = ['Walking', 'Mindful walk', 'Hiking', 'Birdwatching', 'Gardening', 'Running', 'Nature photography'];
  if (!body || !allowed.includes(body.activity)) return 'Choose a supported activity.';
  const duration = Number(body.duration);
  if (![5, 10, 15, 30, 60].includes(duration)) return 'Choose a supported duration.';
  if (typeof body.interest !== 'string' || body.interest.length > 120) return 'Interest is too long.';
  return null;
}

function parseQuest(text, input) {
  const parsed = JSON.parse(text.replace(/^```json\s*|\s*```$/g, '').trim());
  if (!parsed.title || !parsed.description || !Array.isArray(parsed.steps) || parsed.steps.length < 3 || parsed.steps.length > 5) throw new Error('Model response did not match the quest schema.');
  return { ...parsed, activity: input.activity, duration: Number(input.duration), difficulty: input.difficulty || 'Easy', generatedBy: primaryModel };
}

app.get('/api/health', async (_req, res) => {
  try {
    const response = await fetch(`${ollamaUrl}/api/tags`, { signal: AbortSignal.timeout(3000) });
    const payload = response.ok ? await response.json() : {};
    const models = Array.isArray(payload.models) ? payload.models.map(model => model.name) : [];
    res.json({ ollama: response.ok, configuredModel: primaryModel, models });
  } catch {
    res.status(503).json({ ollama: false, configuredModel: primaryModel, models: [], error: 'Ollama is unavailable.' });
  }
});

app.post('/api/quests/generate', async (req, res) => {
  const error = validateInput(req.body);
  if (error) return res.status(400).json({ error });
  const input = req.body;
  const prompt = `You are TerraQuest, a careful outdoor activity planner. Return JSON only with keys title, description, steps (3-5 strings), observe (array), fact, safety. Create a safe, inclusive ${input.duration}-minute ${input.activity} quest. Interest: ${input.interest || 'small natural details'}. Accessibility: ${input.accessibility || 'offer adaptable options'}. Never encourage touching wildlife, eating plants, entering restricted areas, dangerous terrain, or unsupported weather predictions.`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(process.env.OLLAMA_TIMEOUT_MS || 120000));
  try {
    const response = await fetch(`${ollamaUrl}/api/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ model: process.env.OLLAMA_PRIMARY_MODEL || primaryModel, prompt, format: 'json', stream: false }), signal: controller.signal });
    if (!response.ok) throw new Error(`Ollama returned ${response.status}.`);
    const payload = await response.json();
    return res.json({ quest: parseQuest(payload.response, input), source: 'Quest Council · Gemma' });
  } catch (err) {
    if (err instanceof SyntaxError || err.message.includes('quest schema')) return res.status(502).json({ error: 'Ollama returned invalid quest JSON.' });
    return res.status(503).json({ error: err.name === 'AbortError' ? 'Ollama request timed out.' : 'Local Ollama is unavailable.' });
  } finally { clearTimeout(timeout); }
});

if (existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(port, () => console.log(`TerraQuest local AI API listening on http://localhost:${port}`));
