import { SettingsHierarchy, ClaudeSettings } from '../types/settings';

const API_BASE = '/api';

export async function fetchSettings(): Promise<SettingsHierarchy> {
  const response = await fetch(`${API_BASE}/settings`);
  if (!response.ok) {
    throw new Error('Failed to fetch settings');
  }
  return response.json();
}

export async function updateSettings(
  type: 'user' | 'project' | 'local',
  settings: ClaudeSettings
): Promise<void> {
  const response = await fetch(`${API_BASE}/settings/${type}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    throw new Error(`Failed to update ${type} settings`);
  }
}

export async function deleteSettings(type: 'user' | 'project' | 'local'): Promise<void> {
  const response = await fetch(`${API_BASE}/settings/${type}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete ${type} settings`);
  }
}
