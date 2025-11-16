import { useState } from 'react'
import { SettingsHierarchy, ClaudeSettings } from '../types/settings'
import { updateSettings } from '../services/api'
import { Save, Plus, Trash2 } from 'lucide-react'
import { SettingsLevelSelector } from './SettingsLevelSelector'

interface EnvironmentEditorProps {
  hierarchy: SettingsHierarchy
  onUpdate: () => void
}

export function EnvironmentEditor({ hierarchy, onUpdate }: EnvironmentEditorProps) {
  const [level, setLevel] = useState<'user' | 'project' | 'local'>('project')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentSettings = hierarchy[level].settings || {}
  const currentEnv = currentSettings.env || {}

  const [envVars, setEnvVars] = useState<Record<string, string>>(currentEnv)
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')

  const handleAddVar = () => {
    if (!newKey.trim()) return
    setEnvVars({ ...envVars, [newKey]: newValue })
    setNewKey('')
    setNewValue('')
  }

  const handleRemoveVar = (key: string) => {
    const updated = { ...envVars }
    delete updated[key]
    setEnvVars(updated)
  }

  const handleUpdateVar = (key: string, value: string) => {
    setEnvVars({ ...envVars, [key]: value })
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)

      const newSettings: ClaudeSettings = {
        ...currentSettings,
        env: envVars,
      }

      await updateSettings(level, newSettings)
      await onUpdate()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Environment Variables</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure environment variables for Claude Code sessions
        </p>
      </div>

      <SettingsLevelSelector level={level} onChange={setLevel} />

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="bg-card border rounded-lg p-6 space-y-6">
        <div>
          <h3 className="font-semibold mb-4">Current Variables</h3>
          {Object.keys(envVars).length === 0 ? (
            <p className="text-sm text-muted-foreground">No environment variables configured</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(envVars).map(([key, value]) => (
                <div key={key} className="flex gap-2">
                  <input
                    type="text"
                    value={key}
                    disabled
                    className="w-1/3 px-3 py-2 border rounded-md bg-muted text-sm font-mono"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleUpdateVar(key, e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md bg-background text-sm font-mono"
                  />
                  <button
                    onClick={() => handleRemoveVar(key)}
                    className="px-3 py-2 border border-destructive/20 text-destructive rounded-md hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Add New Variable</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="VARIABLE_NAME"
              className="w-1/3 px-3 py-2 border rounded-md bg-background text-sm font-mono"
            />
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="value"
              className="flex-1 px-3 py-2 border rounded-md bg-background text-sm font-mono"
            />
            <button
              onClick={handleAddVar}
              disabled={!newKey.trim()}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="border-t pt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Environment Variables'}
          </button>
        </div>
      </div>

      <div className="bg-muted/30 border rounded-lg p-4">
        <h4 className="font-medium mb-2">Common Environment Variables</h4>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• <code className="bg-background px-1 rounded">ANTHROPIC_MODEL</code> - Override default model</li>
          <li>• <code className="bg-background px-1 rounded">DISABLE_TELEMETRY</code> - Disable telemetry (set to 1)</li>
          <li>• <code className="bg-background px-1 rounded">BASH_DEFAULT_TIMEOUT_MS</code> - Default bash timeout</li>
          <li>• <code className="bg-background px-1 rounded">MAX_THINKING_TOKENS</code> - Enable extended thinking</li>
        </ul>
      </div>
    </div>
  )
}
