import { useState } from 'react'
import { SettingsHierarchy, ClaudeSettings, Hooks } from '../types/settings'
import { updateSettings } from '../services/api'
import { Plus, Trash2 } from 'lucide-react'
import { SettingsLevelSelector } from './SettingsLevelSelector'

interface HooksEditorProps {
  hierarchy: SettingsHierarchy
  onUpdate: () => void
}

export function HooksEditor({ hierarchy, onUpdate }: HooksEditorProps) {
  const [level, setLevel] = useState<'user' | 'project' | 'local'>('project')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentSettings = hierarchy[level].settings || {}
  const currentHooks = currentSettings.hooks || {}

  const [selectedHookType, setSelectedHookType] = useState('PreToolUse')
  const [hookCommand, setHookCommand] = useState('')

  const hookTypes = [
    'PreToolUse',
    'PostToolUse',
    'Stop',
    'UserPromptSubmit',
  ]

  const handleAddHook = async () => {
    if (!hookCommand.trim()) return

    try {
      setSaving(true)
      setError(null)

      const newHooks: Hooks = {
        ...currentHooks,
        [selectedHookType]: [
          {
            type: 'command',
            command: hookCommand,
          },
        ],
      }

      const newSettings: ClaudeSettings = {
        ...currentSettings,
        hooks: newHooks,
      }

      await updateSettings(level, newSettings)
      await onUpdate()
      setHookCommand('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveHook = async (hookType: string) => {
    try {
      setSaving(true)
      setError(null)

      const newHooks = { ...currentHooks }
      delete newHooks[hookType]

      const newSettings: ClaudeSettings = {
        ...currentSettings,
        hooks: newHooks,
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
        <h2 className="text-xl font-semibold">Hooks</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure custom commands to run before/after tool executions
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
          <h3 className="font-semibold mb-4">Current Hooks</h3>
          {Object.keys(currentHooks).length === 0 ? (
            <p className="text-sm text-muted-foreground">No hooks configured</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(currentHooks).map(([hookType, hooks]) => (
                <div key={hookType} className="border rounded-md p-4 bg-muted/30">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{hookType}</h4>
                      <pre className="text-xs mt-2 bg-background p-2 rounded overflow-x-auto">
                        {JSON.stringify(hooks, null, 2)}
                      </pre>
                    </div>
                    <button
                      onClick={() => handleRemoveHook(hookType)}
                      disabled={saving}
                      className="ml-4 p-2 border border-destructive/20 text-destructive rounded-md hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Add New Hook</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Hook Type</label>
              <select
                value={selectedHookType}
                onChange={(e) => setSelectedHookType(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                {hookTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Command</label>
              <input
                type="text"
                value={hookCommand}
                onChange={(e) => setHookCommand(e.target.value)}
                placeholder="e.g., ~/.claude/hooks/pre-tool-use.sh"
                className="w-full px-3 py-2 border rounded-md bg-background"
              />
            </div>

            <button
              onClick={handleAddHook}
              disabled={saving || !hookCommand.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Add Hook
            </button>
          </div>
        </div>
      </div>

      <div className="bg-muted/30 border rounded-lg p-4">
        <h4 className="font-medium mb-2">Hook Types</h4>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• <strong>PreToolUse</strong> - Run before any tool execution</li>
          <li>• <strong>PostToolUse</strong> - Run after any tool execution</li>
          <li>• <strong>Stop</strong> - Run when session ends</li>
          <li>• <strong>UserPromptSubmit</strong> - Run when user submits a prompt</li>
        </ul>
      </div>
    </div>
  )
}
