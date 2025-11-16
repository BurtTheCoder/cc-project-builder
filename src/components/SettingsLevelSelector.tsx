interface SettingsLevelSelectorProps {
  level: 'user' | 'project' | 'local'
  onChange: (level: 'user' | 'project' | 'local') => void
}

export function SettingsLevelSelector({ level, onChange }: SettingsLevelSelectorProps) {
  return (
    <div className="bg-muted/50 border rounded-lg p-4">
      <label className="block text-sm font-medium mb-2">Settings Level</label>
      <div className="flex gap-2">
        <button
          onClick={() => onChange('user')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            level === 'user'
              ? 'bg-primary text-primary-foreground'
              : 'bg-background border hover:bg-accent'
          }`}
        >
          User (~/.claude)
        </button>
        <button
          onClick={() => onChange('project')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            level === 'project'
              ? 'bg-primary text-primary-foreground'
              : 'bg-background border hover:bg-accent'
          }`}
        >
          Project (Shared)
        </button>
        <button
          onClick={() => onChange('local')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            level === 'local'
              ? 'bg-primary text-primary-foreground'
              : 'bg-background border hover:bg-accent'
          }`}
        >
          Local (Not in git)
        </button>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        {level === 'user' && 'Global settings applied to all projects'}
        {level === 'project' && 'Shared project settings (checked into git)'}
        {level === 'local' && 'Personal project settings (gitignored)'}
      </p>
    </div>
  )
}
