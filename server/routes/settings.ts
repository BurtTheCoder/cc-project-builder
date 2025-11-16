import { Router } from 'express';
import { SettingsService } from '../services/settingsService.js';
import { fileWatcher } from '../services/fileWatcher.js';

export const settingsRouter = Router();
const settingsService = new SettingsService();

// Get all settings (hierarchy)
settingsRouter.get('/', async (req, res) => {
  try {
    const settings = await settingsService.getAllSettings();
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update settings for a specific level
settingsRouter.put('/:type', async (req, res) => {
  try {
    const type = req.params.type as 'user' | 'project' | 'local';

    if (!['user', 'project', 'local'].includes(type)) {
      return res.status(400).json({ error: 'Invalid settings type' });
    }

    await settingsService.writeSettings(type, req.body);

    // Update file watcher paths
    fileWatcher.updatePaths(settingsService.getWatchPaths());

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete settings for a specific level
settingsRouter.delete('/:type', async (req, res) => {
  try {
    const type = req.params.type as 'user' | 'project' | 'local';

    if (!['user', 'project', 'local'].includes(type)) {
      return res.status(400).json({ error: 'Invalid settings type' });
    }

    await settingsService.deleteSettings(type);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get watch paths
settingsRouter.get('/watch/paths', (req, res) => {
  res.json({ paths: settingsService.getWatchPaths() });
});
