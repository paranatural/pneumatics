import path from 'node:path'
import fs from 'node:fs/promises'

import chokidar, { FSWatcher } from 'chokidar'
import * as async from 'async'

import { files } from '../model/files'

import {
  configSchema, Config,
  configInternalSchema, ConfigInternal,
  configDefault,
} from './config'

export class Pneumatics {
  private fsWatchers: Array<FSWatcher> | null = null
  private config: ConfigInternal

  constructor(config: Config) {
    configSchema.parse(config)
    this.config = configInternalSchema.parse({
      ...config,
      ...configDefault,
    })
  }

  async start() {
    const watchRoots = this.config.paths.map(p => (
      path.join(this.config.cwd, p)
    ))

    watchRoots.forEach(watchRoot => {
      const fsWatcher = chokidar.watch(watchRoot, {
        ignoreInitial: false,
        alwaysStat: true,
        awaitWriteFinish: true,
        disableGlobbing: true,
        cwd: watchRoot,
      })

      fsWatcher.on('add', async (pathRelative, stats) => {
        files.add({
          pathRelative,
          pathAbsolute: path.join(watchRoot, pathRelative),
          pathRoot: watchRoot,
          content: (await fs.readFile(path.join(watchRoot, pathRelative))).toString(),
        })
      })

      fsWatcher.on('change', async (pathRelative, stats) => {
        files.change({
          pathRelative,
          pathAbsolute: path.join(watchRoot, pathRelative),
          pathRoot: watchRoot,
          content: (await fs.readFile(path.join(watchRoot, pathRelative))).toString(),
        })
      })

      fsWatcher.on('unlink', async (pathRelative) => {
        files.remove(pathRelative)
      })
    })
  }

  watch (cb: (files: any) => void) {
    files.list.watch(cb)
  }

  async stop() {
    if (this.fsWatchers) {
      await async.forEach(this.fsWatchers, async fsWatcher => await fsWatcher.close())
    }
    this.fsWatchers = null
  }
}
