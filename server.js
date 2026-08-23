import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3000;
const frontendOrigin = process.env.FRONTEND_ORIGIN || '*';
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', frontendOrigin);
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-File-Name');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json({ limit: '1mb' }));

const supabaseHeaders = () => ({
  apikey: supabaseServiceRoleKey || '',
  Authorization: `Bearer ${supabaseServiceRoleKey || ''}`,
  'Content-Type': 'application/json',
});

app.get('/api/products', async (_req, res) => {
  if (!supabaseUrl || !supabaseServiceRoleKey) return res.status(503).json({ error: 'Catalog database is not configured' });
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/products?select=*`, { headers: supabaseHeaders() });
    res.status(response.status).send(await response.text());
  } catch (error) {
    res.status(502).json({ error: error instanceof Error ? error.message : 'Catalog request failed' });
  }
});

app.post('/api/uploads/product-image', express.raw({ type: /^image\//, limit: '10mb' }), async (req, res) => {
  if (!supabaseUrl || !supabaseServiceRoleKey) return res.status(503).json({ error: 'Image storage is not configured' });
  const fileName = String(req.header('X-File-Name') || 'product-image').replace(/[^a-zA-Z0-9._-]/g, '-');
  const storagePath = `products/${Date.now()}-${fileName}`;
  try {
    const response = await fetch(`${supabaseUrl}/storage/v1/object/product-images/${storagePath}`, {
      method: 'POST',
      headers: { apikey: supabaseServiceRoleKey, Authorization: `Bearer ${supabaseServiceRoleKey}`, 'Content-Type': req.header('Content-Type') || 'application/octet-stream' },
      body: req.body,
    });
    if (!response.ok) return res.status(response.status).json({ error: await response.text() });
    res.json({ url: `${supabaseUrl}/storage/v1/object/public/product-images/${storagePath}` });
  } catch (error) {
    res.status(502).json({ error: error instanceof Error ? error.message : 'Image upload failed' });
  }
});

app.post('/api/products', async (req, res) => {
  if (!supabaseUrl || !supabaseServiceRoleKey) return res.status(503).json({ error: 'Catalog database is not configured' });
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/products`, {
      method: 'POST',
      headers: { ...supabaseHeaders(), Prefer: 'return=representation' },
      body: JSON.stringify(req.body),
    });
    const payload = await response.json();
    res.status(response.status).json(Array.isArray(payload) ? payload[0] : payload);
  } catch (error) {
    res.status(502).json({ error: error instanceof Error ? error.message : 'Product insert failed' });
  }
});

app.patch('/api/products/:id', async (req, res) => {
  if (!supabaseUrl || !supabaseServiceRoleKey) return res.status(503).json({ error: 'Catalog database is not configured' });
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/products?id=eq.${encodeURIComponent(req.params.id)}`, {
      method: 'PATCH',
      headers: { ...supabaseHeaders(), Prefer: 'return=representation' },
      body: JSON.stringify(req.body),
    });
    const payload = await response.json();
    res.status(response.status).json(Array.isArray(payload) ? payload[0] : payload);
  } catch (error) {
    res.status(502).json({ error: error instanceof Error ? error.message : 'Product update failed' });
  }
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'fresh-groceries' });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`FreshGroceries app listening on port ${PORT}`);
});
