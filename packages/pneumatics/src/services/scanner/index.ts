import path from 'node:path'
import chokidar, { FSWatcher } from 'chokidar'

import { config } from '../../shared/config'
import { filesRaw } from '../../model/files-raw'
import { Service } from '../../shared/service'

export class Scanner implements Service {
  private fsWatcher: FSWatcher | null = null

  constructor () {}

  async start () {
    const watchRoot = path.join(process.cwd(), config.path)

    this.fsWatcher = chokidar.watch(watchRoot, {
      ignoreInitial: false,
      alwaysStat: true,
    })

    this.fsWatcher.on('add', async (pathAbsolute, stats) => {
      const pathRelative = path.relative(watchRoot, pathAbsolute)
      await filesRaw.add(pathRelative)
    })

    this.fsWatcher.on('change', async (pathAbsolute, stats) => {
      const pathRelative = path.relative(watchRoot, pathAbsolute)
      await filesRaw.change(pathRelative)
    })

    this.fsWatcher.on('unlink', async (pathAbsolute) => {
      const pathRelative = path.relative(watchRoot, pathAbsolute)
      filesRaw.remove(pathRelative)
    })
  }

  isWorking () {
    return this.fsWatcher !== null
  }

  async stop () {
    await this.fsWatcher?.close()
    this.fsWatcher = null
  }
}
