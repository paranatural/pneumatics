import { program } from 'commander'
import z from 'zod'

const configSchema = z.object({
  cwd: z.string(),
  path: z.string(),
})

type Config = z.infer<typeof configSchema>

program.parse()

export const config: Config = configSchema.parse({
  cwd: process.cwd(),
  path: program.args[0]
})
