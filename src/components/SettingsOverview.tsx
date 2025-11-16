import { SettingsHierarchy } from '../types/settings'
import { Check, X, AlertCircle, RefreshCw } from 'lucide-react'

interface SettingsOverviewProps {
  hierarchy: SettingsHierarchy
  onRefresh: () => void
}

export function SettingsOverview({ hierarchy, onRefresh }: SettingsOverviewProps) {
  const locations = [
    { key: 'enterprise', label: 'Enterprise Managed', data: hierarchy.enterprise, priority: 4 },
    { key: 'local', label: 'Project Local', data: hierarchy.local, priority: 3 },
    { key: 'project', label: 'Project Shared', data: hierarchy.project, priority: 2 },
    { key: 'user', label: 'User Global', data: hierarchy.user, priority: 1 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Settings Overview</h2>
          <p className="text-sm text-muted-foreground mt-1">
            View all Claude Code settings files and their hierarchy
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <h3 className="font-semibold mb-4">Settings Hierarchy</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Settings are applied with the following precedence (highest to lowest):
        </p>

        <div className="space-y-3">
          {locations.map((location) => (
            <div
              key={location.key}
              className="flex items-start gap-4 p-4 border rounded-md bg-muted/30"
            >
              <div className="flex-shrink-0 mt-0.5">
                {location.data.exists ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : location.data.error ? (
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                ) : (
                  <X className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{location.label}</h4>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                    Priority: {location.priority}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{location.data.path}</p>
                {location.data.error && (
                  <p className="text-sm text-yellow-600 mt-1">Error: {location.data.error}</p>
                )}
                {!location.data.exists && !location.data.error && (
                  <p className="text-sm text-muted-foreground mt-1">File does not exist</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <h3 className="font-semibold mb-4">Merged Settings Preview</h3>
        <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
          {JSON.stringify(hierarchy.merged, null, 2)}
        </pre>
      </div>
    </div>
  )
}
