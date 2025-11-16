import express from 'express';
import cors from 'cors';
import { settingsRouter } from './routes/settings.js';
import { fileWatcher } from './services/fileWatcher.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/settings', settingsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start file watcher
fileWatcher.start();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Cleanup on exit
process.on('SIGINT', () => {
  fileWatcher.stop();
  process.exit(0);
});
