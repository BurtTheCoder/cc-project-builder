import { useState } from 'react'
import { SettingsHierarchy, ClaudeSettings } from '../types/settings'
import { updateSettings } from '../services/api'
import { Save } from 'lucide-react'
import { SettingsLevelSelector } from './SettingsLevelSelector'

interface GeneralSettingsProps {
  hierarchy: SettingsHierarchy
  onUpdate: () => void
}

export function GeneralSettings({ hierarchy, onUpdate }: GeneralSettingsProps) {
  const [level, setLevel] = useState<'user' | 'project' | 'local'>('project')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentSettings = hierarchy[level].settings || {}

  const [formData, setFormData] = useState({
    model: currentSettings.model || '',
    cleanupPeriodDays: currentSettings.cleanupPeriodDays || 30,
    includeCoAuthoredBy: currentSettings.includeCoAuthoredBy !== false,
    disableAllHooks: currentSettings.disableAllHooks || false,
    outputStyle: currentSettings.outputStyle || '',
    forceLoginMethod: currentSettings.forceLoginMethod || '',
  })

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)

      const newSettings: ClaudeSettings = {
        ...currentSettings,
        ...formData,
        model: formData.model || undefined,
        outputStyle: formData.outputStyle || undefined,
        forceLoginMethod: formData.forceLoginMethod || undefined,
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
        <h2 className="text-xl font-semibold">General Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure general Claude Code behavior
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
          <label className="block text-sm font-medium mb-2">
            Default Model
          </label>
          <input
            type="text"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            placeholder="claude-sonnet-4-5-20250929"
            className="w-full px-3 py-2 border rounded-md bg-background"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Override the default model to use for Claude Code
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Cleanup Period (days)
          </label>
          <input
            type="number"
            value={formData.cleanupPeriodDays}
            onChange={(e) => setFormData({ ...formData, cleanupPeriodDays: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border rounded-md bg-background"
          />
          <p className="text-xs text-muted-foreground mt-1">
            How long to retain chat transcripts based on last activity date
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Output Style
          </label>
          <input
            type="text"
            value={formData.outputStyle}
            onChange={(e) => setFormData({ ...formData, outputStyle: e.target.value })}
            placeholder="Explanatory"
            className="w-full px-3 py-2 border rounded-md bg-background"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Configure an output style to adjust the system prompt
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Force Login Method
          </label>
          <select
            value={formData.forceLoginMethod}
            onChange={(e) => setFormData({ ...formData, forceLoginMethod: e.target.value })}
            className="w-full px-3 py-2 border rounded-md bg-background"
          >
            <option value="">None</option>
            <option value="claudeai">Claude.ai</option>
            <option value="console">Console (API)</option>
          </select>
          <p className="text-xs text-muted-foreground mt-1">
            Restrict login to specific account type
          </p>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.includeCoAuthoredBy}
              onChange={(e) => setFormData({ ...formData, includeCoAuthoredBy: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm font-medium">Include co-authored-by Claude in commits</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.disableAllHooks}
              onChange={(e) => setFormData({ ...formData, disableAllHooks: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm font-medium">Disable all hooks</span>
          </label>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
