import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { ClaudeSettings, SettingsHierarchy, SettingsLocation } from '../types/settings.js';

export class SettingsService {
  private userSettingsPath: string;
  private projectSettingsPath: string;
  private localSettingsPath: string;
  private enterpriseSettingsPath: string;

  constructor(projectRoot?: string) {
    const homeDir = os.homedir();
    this.userSettingsPath = path.join(homeDir, '.claude', 'settings.json');

    const root = projectRoot || process.cwd();
    this.projectSettingsPath = path.join(root, '.claude', 'settings.json');
    this.localSettingsPath = path.join(root, '.claude', 'settings.local.json');

    // Enterprise settings path (Linux)
    this.enterpriseSettingsPath = '/etc/claude-code/managed-settings.json';
  }

  async readSettingsFile(filePath: string): Promise<SettingsLocation> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const settings = JSON.parse(content) as ClaudeSettings;
      return {
        type: this.getSettingsType(filePath),
        path: filePath,
        exists: true,
        settings,
      };
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return {
          type: this.getSettingsType(filePath),
          path: filePath,
          exists: false,
        };
      }
      return {
        type: this.getSettingsType(filePath),
        path: filePath,
        exists: false,
        error: error.message,
      };
    }
  }

  private getSettingsType(filePath: string): 'user' | 'project' | 'local' | 'enterprise' {
    if (filePath === this.userSettingsPath) return 'user';
    if (filePath === this.projectSettingsPath) return 'project';
    if (filePath === this.localSettingsPath) return 'local';
    return 'enterprise';
  }

  async getAllSettings(): Promise<SettingsHierarchy> {
    const [enterprise, user, project, local] = await Promise.all([
      this.readSettingsFile(this.enterpriseSettingsPath),
      this.readSettingsFile(this.userSettingsPath),
      this.readSettingsFile(this.projectSettingsPath),
      this.readSettingsFile(this.localSettingsPath),
    ]);

    // Merge settings with proper precedence (enterprise > local > project > user)
    const merged = this.mergeSettings([
      user.settings || {},
      project.settings || {},
      local.settings || {},
      enterprise.settings || {},
    ]);

    return { enterprise, user, project, local, merged };
  }

  private mergeSettings(settingsArray: ClaudeSettings[]): ClaudeSettings {
    return settingsArray.reduce((acc, settings) => {
      return { ...acc, ...settings };
    }, {} as ClaudeSettings);
  }

  async writeSettings(
    type: 'user' | 'project' | 'local',
    settings: ClaudeSettings
  ): Promise<void> {
    const filePath = this.getFilePath(type);

    // Ensure directory exists
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });

    // Write settings with pretty formatting
    await fs.writeFile(filePath, JSON.stringify(settings, null, 2), 'utf-8');

    // If creating local settings, add to .gitignore
    if (type === 'local') {
      await this.ensureGitignore();
    }
  }

  private async ensureGitignore(): Promise<void> {
    const gitignorePath = path.join(path.dirname(this.projectSettingsPath), '.gitignore');
    const entryToAdd = 'settings.local.json';

    try {
      let gitignoreContent = '';
      try {
        gitignoreContent = await fs.readFile(gitignorePath, 'utf-8');
      } catch {
        // File doesn't exist, will create it
      }

      if (!gitignoreContent.includes(entryToAdd)) {
        const newContent = gitignoreContent
          ? `${gitignoreContent}\n${entryToAdd}\n`
          : `${entryToAdd}\n`;
        await fs.writeFile(gitignorePath, newContent, 'utf-8');
      }
    } catch (error) {
      console.error('Failed to update .gitignore:', error);
    }
  }

  private getFilePath(type: 'user' | 'project' | 'local'): string {
    switch (type) {
      case 'user':
        return this.userSettingsPath;
      case 'project':
        return this.projectSettingsPath;
      case 'local':
        return this.localSettingsPath;
    }
  }

  async deleteSettings(type: 'user' | 'project' | 'local'): Promise<void> {
    const filePath = this.getFilePath(type);
    try {
      await fs.unlink(filePath);
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  getWatchPaths(): string[] {
    return [
      this.userSettingsPath,
      this.projectSettingsPath,
      this.localSettingsPath,
      this.enterpriseSettingsPath,
    ];
  }
}
