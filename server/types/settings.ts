export interface PermissionRule {
  pattern: string;
}

export interface Permissions {
  allow?: string[];
  ask?: string[];
  deny?: string[];
  additionalDirectories?: string[];
  defaultMode?: string;
  disableBypassPermissionsMode?: string;
}

export interface SandboxSettings {
  enabled?: boolean;
  autoAllowBashIfSandboxed?: boolean;
  excludedCommands?: string[];
  allowUnsandboxedCommands?: boolean;
  network?: {
    allowUnixSockets?: string[];
    allowLocalBinding?: boolean;
    httpProxyPort?: number;
    socksProxyPort?: number;
  };
  enableWeakerNestedSandbox?: boolean;
}

export interface Hook {
  type: string;
  command: string;
}

export interface HookMatcher {
  matcher: string;
  hooks: Hook[];
}

export interface Hooks {
  [key: string]: HookMatcher[] | Hook[];
}

export interface McpServer {
  serverName: string;
}

export interface ClaudeSettings {
  apiKeyHelper?: string;
  cleanupPeriodDays?: number;
  companyAnnouncements?: string[];
  env?: Record<string, string>;
  includeCoAuthoredBy?: boolean;
  permissions?: Permissions;
  hooks?: Hooks;
  disableAllHooks?: boolean;
  model?: string;
  statusLine?: {
    type: string;
    command?: string;
  };
  outputStyle?: string;
  forceLoginMethod?: string;
  forceLoginOrgUUID?: string;
  enableAllProjectMcpServers?: boolean;
  enabledMcpjsonServers?: string[];
  disabledMcpjsonServers?: string[];
  allowedMcpServers?: McpServer[];
  deniedMcpServers?: McpServer[];
  awsAuthRefresh?: string;
  awsCredentialExport?: string;
  sandbox?: SandboxSettings;
  enabledPlugins?: Record<string, boolean>;
  extraKnownMarketplaces?: Record<string, any>;
}

export interface SettingsLocation {
  type: 'user' | 'project' | 'local' | 'enterprise';
  path: string;
  exists: boolean;
  settings?: ClaudeSettings;
  error?: string;
}

export interface SettingsHierarchy {
  user: SettingsLocation;
  project: SettingsLocation;
  local: SettingsLocation;
  enterprise: SettingsLocation;
  merged: ClaudeSettings;
}
