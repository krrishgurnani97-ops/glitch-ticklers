import express from 'express';
import cors from 'cors';
import compression from 'compression';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(compression());
app.use(express.json());

// Example in-memory store
let portfolios = [];
let users = [];

// Helper: async handler
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// API: Create Portfolio
app.post('/api/portfolios', asyncHandler(async (req, res) => {
  const { username, title, content } = req.body;
  const id = portfolios.length + 1;
  const newPortfolio = { id, username, title, content, created: new Date() };
  portfolios.push(newPortfolio);
  res.status(201).json(newPortfolio);
}));

// API: List Portfolios
app.get('/api/portfolios', asyncHandler(async (req, res) => {
  res.json(portfolios);
}));

// API: Get Portfolio Details
app.get('/api/portfolios/:id', asyncHandler(async (req, res) => {
  const portfolio = portfolios.find(p => p.id == req.params.id);
  if (!portfolio) return res.status(404).json({error: 'Not found'});
  res.json(portfolio);
}));

// API: User Register
app.post('/api/register', asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (users.some(u => u.username === username))
    return res.status(409).json({ error: 'Username exists' });
  users.push({ username, password });
  res.status(201).json({ username });
}));

// API: User Login
app.post('/api/login', asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user)
    return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ username });
}));

// Healthcheck/Root
app.get('/', (req, res) => {
  res.send('DigiPratibha backend is running!');
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Unexpected Error:', err);
  res.status(500).json({ error: 'Server error', detail: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log(Server is running at http://localhost:${PORT});
});