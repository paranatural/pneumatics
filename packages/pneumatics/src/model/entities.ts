import path from 'node:path'

import { combine, Store } from 'effector'

import { FileRaw, files } from './files'

export interface Entity {
  files: Array<FileRaw>
}

// @ts-ignore
export const entitiesStore: Store<Array<Entity>> = combine(
  files.list,
  files => {
    const groups = new Map<FileRaw['pathAbsolute'], Array<FileRaw>>

    const jointFiles = files.filter(file => (
      path.basename(file.pathRelative, path.extname(file.pathRelative)) === 'joint'
    ))

    const nonJointFiles = files.filter(file => (
      path.basename(file.pathRelative, path.extname(file.pathRelative)) !== 'joint'
    ))

    nonJointFiles.forEach(file => {

    })

    return Array.from(groups.values())
  }
)
