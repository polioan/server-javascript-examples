import { createTRPCRouter, publicProcedure } from './trpc'
import { z } from 'zod'
import { db } from '../../../db'

export const router = createTRPCRouter({
  getTodos: publicProcedure
    .meta({
      openapi: { method: 'GET', path: '/getTodos' },
    })
    .input(z.void())
    .output(
      z.array(
        z.object({
          id: z.number(),
          content: z.string(),
          completed: z.boolean(),
        })
      )
    )
    .query(async () => {
      return await db.query('SELECT * FROM "Todos";')
    }),
  createTodo: publicProcedure
    .meta({ openapi: { method: 'POST', path: '/createTodo' } })
    .input(
      z.object({
        content: z.string(),
      })
    )
    .output(z.void())
    .mutation(async ({ input }) => {
      await db.query(
        `INSERT INTO "Todos" ("content", "completed") VALUES ("${input.content}", false);`
      )
    }),
})
