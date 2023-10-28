import path from 'node:path'

import { combine, Store } from 'effector'

import { filesRaw } from './files-raw'

export interface FileEnriched {
  pathRelative: string
  content: string
  entityKind: string
  entityId: string
  language: string | null
  extension: string
}

export const filesEnriched: Store<Array<FileEnriched>> = combine(
  filesRaw.store,
  files => {
    const filesRawAsArray =
      Array.from(files.entries()).map(([pathRelative, fileRaw]) => fileRaw)

    return filesRawAsArray.map(fileRaw => {
      const fileLocationSegments = path.dirname(fileRaw.pathRelative).split(path.sep)
      if (fileLocationSegments.length === 1) throw new Error('top-level files are not allowed')

      const fileName = path.basename(fileRaw.pathRelative)
      const fileNameSegments = fileName.split('.')
      if (fileNameSegments.length === 1) throw new Error('unknown file extension')

      const entityKind = fileLocationSegments.shift()!
      const extension = fileNameSegments.pop()!
      const language = (fileNameSegments.length >= 2)
        ? fileNameSegments.pop()!
        : null
      const entityId =
        [...fileLocationSegments, fileNameSegments.join('.')]
          .filter(segment => segment !== 'index')
          .join(path.sep)

      return {
        pathRelative: fileRaw.pathRelative,
        content: fileRaw.content,
        entityKind,
        entityId,
        language,
        extension,
      }
    })
  }
)
