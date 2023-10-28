import { createServer } from 'node:http'
import { createYoga } from 'graphql-yoga'
import { renderGraphiQL } from '@graphql-yoga/render-graphiql'

import { schema } from '../../model/schema'
import { logger } from '../../shared/logger'

import { Service } from '../service'

export class Server implements Service {
  private yoga
  private server

  constructor () {
    this.yoga = createYoga({
      graphiql: true,
      schema: context => schema.store.getState(),
      renderGraphiQL,
    })
    this.server = createServer(this.yoga)
  }

  async start () {
    this.server.listen(4000)
    logger.info({ msg: 'server: started', host: 'http://localhost:4000/' })
  }

  isWorking () {
    return this.server.listening
  }

  stop () {
    this.server.close()
  }
}
