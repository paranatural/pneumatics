import z from 'zod'
import iso6391 from 'iso-639-1'

export const configSchema = z.object({
  paths: z.string().array().min(1),
  skipFsErrors: z.boolean().optional(),
  skipParseErrors: z.boolean().optional(),
  skipLogicErrors: z.boolean().optional(),
  fileSizeLimit: z.number().optional(),
  fileNumberLimit: z.number().optional(),
  locales: z.string().array().min(1).optional(),
  jointFileName: z.string().optional(),
  indexFileName: z.string().optional(),
})

export type Config = z.infer<typeof configSchema>

export const configInternalSchema = configSchema.extend({
  cwd: z.string(),
})

export type ConfigInternal = z.infer<typeof configInternalSchema>

export const configDefault: Partial<ConfigInternal> = {
  cwd: process.cwd(),
  skipFsErrors: false,
  skipParseErrors: false,
  skipLogicErrors: false,
  fileSizeLimit: 10000,
  fileNumberLimit: 1000,
  locales: iso6391.getAllCodes(),
  jointFileName: 'joint',
  indexFileName: 'index',
}
