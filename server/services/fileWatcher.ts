import chokidar from 'chokidar';
import { EventEmitter } from 'events';

class FileWatcher extends EventEmitter {
  private watcher: chokidar.FSWatcher | null = null;
  private watchedPaths: string[] = [];

  start(paths?: string[]): void {
    if (this.watcher) {
      this.stop();
    }

    this.watchedPaths = paths || [];

    if (this.watchedPaths.length === 0) {
      return;
    }

    this.watcher = chokidar.watch(this.watchedPaths, {
      persistent: true,
      ignoreInitial: true,
    });

    this.watcher
      .on('add', (path) => this.emit('change', { type: 'add', path }))
      .on('change', (path) => this.emit('change', { type: 'change', path }))
      .on('unlink', (path) => this.emit('change', { type: 'unlink', path }));

    console.log('File watcher started for:', this.watchedPaths);
  }

  stop(): void {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
      console.log('File watcher stopped');
    }
  }

  updatePaths(paths: string[]): void {
    this.start(paths);
  }
}

export const fileWatcher = new FileWatcher();
