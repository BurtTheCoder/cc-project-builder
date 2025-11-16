# Claude Code Settings Manager

A modern, web-based GUI application for managing Claude Code settings at both project and user levels. Built with React, TypeScript, and Express.

## Features

- **Intuitive Interface**: Clean, modern UI built with React and Tailwind CSS
- **Multi-Level Settings**: Manage user, project, and local settings in one place
- **Settings Hierarchy Visualization**: See how settings override each other
- **Comprehensive Editors**:
  - General settings (model, cleanup period, output style, etc.)
  - Permissions (allow/ask/deny rules)
  - Hooks (pre/post tool execution commands)
  - Environment variables
  - MCP server configuration
- **Real-time Updates**: Changes are immediately saved to settings files
- **Type-Safe**: Full TypeScript support throughout the stack

## Prerequisites

- Node.js 18+ and npm
- Claude Code installed

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cc-project-builder
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Development Mode

Run both the backend and frontend in development mode with hot reload:

```bash
npm run dev
```

This will start:
- Backend API server on `http://localhost:3001`
- Frontend development server on `http://localhost:3000`

Open your browser and navigate to `http://localhost:3000` to use the application.

### Production Build

Build the application for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Project Structure

```
cc-project-builder/
├── server/               # Backend (Express + TypeScript)
│   ├── index.ts         # Server entry point
│   ├── routes/          # API routes
│   │   └── settings.ts  # Settings CRUD endpoints
│   ├── services/        # Business logic
│   │   ├── settingsService.ts  # Settings file operations
│   │   └── fileWatcher.ts      # File change detection
│   └── types/           # TypeScript type definitions
│       └── settings.ts
├── src/                 # Frontend (React + TypeScript)
│   ├── components/      # React components
│   │   ├── Tabs.tsx
│   │   ├── SettingsOverview.tsx
│   │   ├── GeneralSettings.tsx
│   │   ├── PermissionsEditor.tsx
│   │   ├── HooksEditor.tsx
│   │   ├── EnvironmentEditor.tsx
│   │   ├── McpEditor.tsx
│   │   └── SettingsLevelSelector.tsx
│   ├── services/        # API client
│   │   └── api.ts
│   ├── types/           # TypeScript type definitions
│   │   └── settings.ts
│   ├── lib/             # Utilities
│   │   └── utils.ts
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # React entry point
│   └── index.css        # Global styles
└── package.json         # Dependencies and scripts
```

## Settings Hierarchy

The application manages settings across four levels (in order of precedence):

1. **Enterprise Managed** (highest priority): `/etc/claude-code/managed-settings.json`
2. **Project Local**: `.claude/settings.local.json` (not in git)
3. **Project Shared**: `.claude/settings.json` (in git)
4. **User Global** (lowest priority): `~/.claude/settings.json`

Higher priority settings override lower priority ones.

## Features Guide

### Overview Tab
- View all settings file locations
- See which files exist and their paths
- Check for errors
- Preview merged settings

### General Settings
- Configure default model
- Set cleanup period for chat transcripts
- Choose output style
- Force login method
- Toggle co-authored-by attribution
- Enable/disable all hooks

### Permissions
- **Allow Rules**: Auto-approve specific tool uses
- **Ask Rules**: Prompt before executing
- **Deny Rules**: Block tool uses completely
- Examples:
  - `Bash(npm run test)` - Allow npm test commands
  - `Read(.env)` - Block reading .env files
  - `Read(./secrets/**)` - Block entire directories

### Hooks
- Configure commands to run before/after tool executions
- Supported hook types:
  - PreToolUse
  - PostToolUse
  - Stop
  - UserPromptSubmit

### Environment Variables
- Set session-specific environment variables
- Common variables:
  - `ANTHROPIC_MODEL`
  - `DISABLE_TELEMETRY`
  - `BASH_DEFAULT_TIMEOUT_MS`
  - `MAX_THINKING_TOKENS`

### MCP Servers
- Auto-approve all project MCP servers
- Enable specific servers
- Disable specific servers

## API Endpoints

### Get All Settings
```
GET /api/settings
```

Returns the complete settings hierarchy including user, project, local, and enterprise settings, plus the merged result.

### Update Settings
```
PUT /api/settings/:type
Content-Type: application/json

{
  "permissions": { ... },
  "env": { ... },
  ...
}
```

Where `:type` is one of: `user`, `project`, or `local`.

### Delete Settings
```
DELETE /api/settings/:type
```

## Technology Stack

**Backend:**
- Node.js + Express
- TypeScript
- Chokidar (file watching)

**Frontend:**
- React 18
- TypeScript
- Vite (build tool)
- Tailwind CSS
- Lucide React (icons)

## Development

### Scripts

- `npm run dev` - Run both backend and frontend in development mode
- `npm run dev:backend` - Run only the backend server
- `npm run dev:frontend` - Run only the frontend
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run preview` - Preview production build

### Adding New Settings

1. Update `server/types/settings.ts` and `src/types/settings.ts` with new setting types
2. Create a new editor component in `src/components/`
3. Add the new tab to `src/App.tsx`
4. Settings are automatically persisted via the existing API

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues, feature requests, or questions, please open an issue on GitHub.

## Acknowledgments

Built for the Claude Code community to make settings management easier and more accessible.
