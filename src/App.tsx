import { useState, useEffect } from 'react'
import { Settings, FileJson, Server, Shield, Code, Variable } from 'lucide-react'
import { SettingsHierarchy } from './types/settings'
import { fetchSettings } from './services/api'
import { Tabs } from './components/Tabs'
import { SettingsOverview } from './components/SettingsOverview'
import { PermissionsEditor } from './components/PermissionsEditor'
import { HooksEditor } from './components/HooksEditor'
import { EnvironmentEditor } from './components/EnvironmentEditor'
import { McpEditor } from './components/McpEditor'
import { GeneralSettings } from './components/GeneralSettings'

function App() {
  const [settingsHierarchy, setSettingsHierarchy] = useState<SettingsHierarchy | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  const loadSettings = async () => {
    try {
      setLoading(true)
      const data = await fetchSettings()
      setSettingsHierarchy(data)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileJson },
    { id: 'general', label: 'General', icon: Settings },
    { id: 'permissions', label: 'Permissions', icon: Shield },
    { id: 'hooks', label: 'Hooks', icon: Code },
    { id: 'environment', label: 'Environment', icon: Variable },
    { id: 'mcp', label: 'MCP Servers', icon: Server },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
            <p className="text-destructive font-semibold mb-2">Error loading settings</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <button
              onClick={loadSettings}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Claude Code Settings Manager
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your Claude Code settings with an intuitive interface
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mt-6">
          {activeTab === 'overview' && (
            <SettingsOverview hierarchy={settingsHierarchy!} onRefresh={loadSettings} />
          )}
          {activeTab === 'general' && (
            <GeneralSettings hierarchy={settingsHierarchy!} onUpdate={loadSettings} />
          )}
          {activeTab === 'permissions' && (
            <PermissionsEditor hierarchy={settingsHierarchy!} onUpdate={loadSettings} />
          )}
          {activeTab === 'hooks' && (
            <HooksEditor hierarchy={settingsHierarchy!} onUpdate={loadSettings} />
          )}
          {activeTab === 'environment' && (
            <EnvironmentEditor hierarchy={settingsHierarchy!} onUpdate={loadSettings} />
          )}
          {activeTab === 'mcp' && (
            <McpEditor hierarchy={settingsHierarchy!} onUpdate={loadSettings} />
          )}
        </div>
      </div>
    </div>
  )
}

export default App
