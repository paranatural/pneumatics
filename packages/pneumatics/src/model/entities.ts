import { combine, Store } from 'effector'
import justGroupBy from 'just-group-by'

import { FileEnriched, filesEnriched } from './files-enriched'

export interface Entity {
  files: Array<FileEnriched>
}

export const entitiesStore: Store<Array<Entity>> = combine(
  filesEnriched,
  files => {
    const fileGroups = Object.values(
      justGroupBy(
        files,
        file => `${file.entityKind}/${file.entityId}`
      )
    )

    return fileGroups.map(fileGroup => ({
      files: fileGroup
    }))
  }
)
