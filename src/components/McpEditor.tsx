import { useState } from 'react'
import { SettingsHierarchy, ClaudeSettings } from '../types/settings'
import { updateSettings } from '../services/api'
import { Save, Plus, Trash2 } from 'lucide-react'
import { SettingsLevelSelector } from './SettingsLevelSelector'

interface McpEditorProps {
  hierarchy: SettingsHierarchy
  onUpdate: () => void
}

export function McpEditor({ hierarchy, onUpdate }: McpEditorProps) {
  const [level, setLevel] = useState<'user' | 'project' | 'local'>('project')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentSettings = hierarchy[level].settings || {}

  const [enableAll, setEnableAll] = useState(currentSettings.enableAllProjectMcpServers || false)
  const [enabledServers, setEnabledServers] = useState<string[]>(
    currentSettings.enabledMcpjsonServers || []
  )
  const [disabledServers, setDisabledServers] = useState<string[]>(
    currentSettings.disabledMcpjsonServers || []
  )
  const [newServer, setNewServer] = useState('')

  const handleAddEnabled = () => {
    if (!newServer.trim() || enabledServers.includes(newServer)) return
    setEnabledServers([...enabledServers, newServer])
    setNewServer('')
  }

  const handleAddDisabled = () => {
    if (!newServer.trim() || disabledServers.includes(newServer)) return
    setDisabledServers([...disabledServers, newServer])
    setNewServer('')
  }

  const handleRemoveEnabled = (server: string) => {
    setEnabledServers(enabledServers.filter((s) => s !== server))
  }

  const handleRemoveDisabled = (server: string) => {
    setDisabledServers(disabledServers.filter((s) => s !== server))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)

      const newSettings: ClaudeSettings = {
        ...currentSettings,
        enableAllProjectMcpServers: enableAll,
        enabledMcpjsonServers: enabledServers.length > 0 ? enabledServers : undefined,
        disabledMcpjsonServers: disabledServers.length > 0 ? disabledServers : undefined,
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
        <h2 className="text-xl font-semibold">MCP Servers</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure Model Context Protocol server permissions
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
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={enableAll}
              onChange={(e) => setEnableAll(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm font-medium">
              Auto-approve all project MCP servers
            </span>
          </label>
          <p className="text-xs text-muted-foreground mt-1 ml-6">
            Automatically approve all MCP servers defined in project .mcp.json files
          </p>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Enabled Servers</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Specific MCP servers from .mcp.json files to approve
          </p>
          {enabledServers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No servers enabled</p>
          ) : (
            <div className="space-y-2 mb-3">
              {enabledServers.map((server) => (
                <div key={server} className="flex items-center gap-2">
                  <span className="flex-1 px-3 py-2 border rounded-md bg-muted text-sm font-mono">
                    {server}
                  </span>
                  <button
                    onClick={() => handleRemoveEnabled(server)}
                    className="px-3 py-2 border border-destructive/20 text-destructive rounded-md hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={newServer}
              onChange={(e) => setNewServer(e.target.value)}
              placeholder="Server name (e.g., github, memory)"
              className="flex-1 px-3 py-2 border rounded-md bg-background text-sm"
            />
            <button
              onClick={handleAddEnabled}
              disabled={!newServer.trim()}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-4">Disabled Servers</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Specific MCP servers from .mcp.json files to reject
          </p>
          {disabledServers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No servers disabled</p>
          ) : (
            <div className="space-y-2 mb-3">
              {disabledServers.map((server) => (
                <div key={server} className="flex items-center gap-2">
                  <span className="flex-1 px-3 py-2 border rounded-md bg-muted text-sm font-mono">
                    {server}
                  </span>
                  <button
                    onClick={() => handleRemoveDisabled(server)}
                    className="px-3 py-2 border border-destructive/20 text-destructive rounded-md hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={newServer}
              onChange={(e) => setNewServer(e.target.value)}
              placeholder="Server name (e.g., filesystem)"
              className="flex-1 px-3 py-2 border rounded-md bg-background text-sm"
            />
            <button
              onClick={handleAddDisabled}
              disabled={!newServer.trim()}
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
            {saving ? 'Saving...' : 'Save MCP Settings'}
          </button>
        </div>
      </div>

      <div className="bg-muted/30 border rounded-lg p-4">
        <h4 className="font-medium mb-2">About MCP Servers</h4>
        <p className="text-sm text-muted-foreground">
          MCP (Model Context Protocol) servers extend Claude Code with additional capabilities.
          You can configure which servers from project .mcp.json files are automatically approved,
          enabled, or disabled.
        </p>
      </div>
    </div>
  )
}
