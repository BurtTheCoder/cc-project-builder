import { useState } from 'react'
import { SettingsHierarchy, ClaudeSettings, Permissions } from '../types/settings'
import { updateSettings } from '../services/api'
import { Save, Plus, Trash2 } from 'lucide-react'
import { SettingsLevelSelector } from './SettingsLevelSelector'

interface PermissionsEditorProps {
  hierarchy: SettingsHierarchy
  onUpdate: () => void
}

export function PermissionsEditor({ hierarchy, onUpdate }: PermissionsEditorProps) {
  const [level, setLevel] = useState<'user' | 'project' | 'local'>('project')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentSettings = hierarchy[level].settings || {}
  const currentPermissions = currentSettings.permissions || {}

  const [permissions, setPermissions] = useState<Permissions>({
    allow: currentPermissions.allow || [],
    ask: currentPermissions.ask || [],
    deny: currentPermissions.deny || [],
    additionalDirectories: currentPermissions.additionalDirectories || [],
  })

  const addRule = (type: 'allow' | 'ask' | 'deny') => {
    setPermissions({
      ...permissions,
      [type]: [...(permissions[type] || []), ''],
    })
  }

  const updateRule = (type: 'allow' | 'ask' | 'deny', index: number, value: string) => {
    const rules = [...(permissions[type] || [])]
    rules[index] = value
    setPermissions({ ...permissions, [type]: rules })
  }

  const removeRule = (type: 'allow' | 'ask' | 'deny', index: number) => {
    const rules = [...(permissions[type] || [])]
    rules.splice(index, 1)
    setPermissions({ ...permissions, [type]: rules })
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)

      const newSettings: ClaudeSettings = {
        ...currentSettings,
        permissions: {
          ...permissions,
          allow: permissions.allow?.filter(r => r.trim() !== ''),
          ask: permissions.ask?.filter(r => r.trim() !== ''),
          deny: permissions.deny?.filter(r => r.trim() !== ''),
        },
      }

      await updateSettings(level, newSettings)
      await onUpdate()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const RulesList = ({ type, title, description }: { type: 'allow' | 'ask' | 'deny', title: string, description: string }) => (
    <div className="space-y-3">
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {(permissions[type] || []).map((rule, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            value={rule}
            onChange={(e) => updateRule(type, index, e.target.value)}
            placeholder={`e.g., Bash(npm run test), Read(.env), WebFetch`}
            className="flex-1 px-3 py-2 border rounded-md bg-background text-sm"
          />
          <button
            onClick={() => removeRule(type, index)}
            className="px-3 py-2 border border-destructive/20 text-destructive rounded-md hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        onClick={() => addRule(type)}
        className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-accent text-sm"
      >
        <Plus className="w-4 h-4" />
        Add {title} Rule
      </button>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Permissions</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure what tools and operations Claude Code can perform
        </p>
      </div>

      <SettingsLevelSelector level={level} onChange={setLevel} />

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="bg-card border rounded-lg p-6 space-y-6">
        <RulesList
          type="allow"
          title="Allow Rules"
          description="Automatically allow these tool uses without asking"
        />

        <div className="border-t pt-6">
          <RulesList
            type="ask"
            title="Ask Rules"
            description="Prompt for confirmation before executing these tools"
          />
        </div>

        <div className="border-t pt-6">
          <RulesList
            type="deny"
            title="Deny Rules"
            description="Block these tool uses completely (e.g., sensitive files)"
          />
        </div>

        <div className="border-t pt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Permissions'}
          </button>
        </div>
      </div>

      <div className="bg-muted/30 border rounded-lg p-4">
        <h4 className="font-medium mb-2">Permission Rule Examples</h4>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• <code className="bg-background px-1 rounded">Bash(npm run test)</code> - Allow npm test commands</li>
          <li>• <code className="bg-background px-1 rounded">Read(.env)</code> - Block reading .env files</li>
          <li>• <code className="bg-background px-1 rounded">Read(./secrets/**)</code> - Block reading secrets directory</li>
          <li>• <code className="bg-background px-1 rounded">WebFetch</code> - Block all web fetching</li>
        </ul>
      </div>
    </div>
  )
}
