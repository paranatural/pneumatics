import { Pneumatics } from '@paranatural/pneumatics'

const pneumatics = new Pneumatics({
  paths: ['data/js-ecosystem-tools'],
})

await pneumatics.start()

pneumatics.watch(console.log)

;["uncaughtException", "SIGTSTP", "SIGQUIT", "SIGHUP", "SIGTERM", "SIGINT", "exit"].forEach(code => {
  process.on(code, async () => {
    await pneumatics.stop()
  })
})

process.on('beforeExit', () => {
  process.exit(0)
})
