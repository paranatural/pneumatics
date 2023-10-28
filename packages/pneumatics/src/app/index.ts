import { logger } from '../shared/logger'

import { App } from './service'

const app = new App()

await app.start()
logger.info({ msg: 'started successfully' })

;["uncaughtException", "SIGTSTP", "SIGQUIT", "SIGHUP", "SIGTERM", "SIGINT"].forEach(code => {
  process.on(code, async () => {
    await app.stop()
  })
})

process.on('beforeExit', () => {
  logger.info({ msg: 'stopped successfully' })
  process.exit(0)
})
