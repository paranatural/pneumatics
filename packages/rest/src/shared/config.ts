import { program } from 'commander'

import { Config, configSchema } from '@paranatural/pneumatics'

program.parse()

export const config: Config = configSchema.parse({
  path: program.args[0]
})
