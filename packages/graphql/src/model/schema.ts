import { buildGraphQLSchema, createTypesFactory } from 'gqtx'
import { combine } from 'effector'

import { entities, Entity } from './entities'

const t = createTypesFactory()

const store = combine(
  entities.store,
  entities => {
    const types = []

    const EntityType = t.objectType<Entity>({
      name: 'entity',
      fields: () => [
        t.field({ name: 'id', type: t.NonNull(t.ID) }),
        t.field({ name: 'kind', type: t.NonNull(t.String) }),
      ],
    })

    types.push(
      EntityType
    )

    const Query = t.queryType({
      fields: () => [
        t.field({
          name: 'entity',
          type: EntityType,
          args: {
            id: t.arg(t.NonNullInput(t.ID)),
          },
          resolve: (src, args, ctx, info) => entities.get(args.id),
        }),
      ],
    })

    return buildGraphQLSchema({
      query: Query,
      types: types,
    })
  }
)

export const schema = {
  store,
}
