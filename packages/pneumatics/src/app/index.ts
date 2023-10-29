import path from 'node:path'
import chokidar, { FSWatcher } from 'chokidar'
import z from 'zod'

import { filesRaw } from '../model/files-raw'

export const pneumaticsConfigSchema = z.object({
  path: z.string(),
})

export type PneumaticsConfig = z.infer<typeof pneumaticsConfigSchema>

export class Pneumatics {
  private fsWatcher: FSWatcher | null = null
  private config

  constructor (config: PneumaticsConfig) {
    pneumaticsConfigSchema.parse(config)
    this.config = {
      ...config,
      cwd: process.cwd(),
    }
  }

  async start () {
    const watchRoot = path.join(this.config.cwd, this.config.path)

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

  async stop () {
    await this.fsWatcher?.close()
    this.fsWatcher = null
  }
}
