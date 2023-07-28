import { initTRPC } from '@trpc/server'
import type { OpenApiMeta } from 'trpc-openapi'
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express'

export function createTRPCContext(opts: CreateExpressContextOptions) {
  return opts
}

const t = initTRPC
  .context<typeof createTRPCContext>()
  .meta<OpenApiMeta>()
  .create()

export const createTRPCRouter = t.router

export const publicProcedure = t.procedure
