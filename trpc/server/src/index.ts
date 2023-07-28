import express from 'express'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import {
  createOpenApiExpressMiddleware,
  generateOpenApiDocument,
} from 'trpc-openapi'
import { createTRPCContext, createTRPCRouter } from './trpc'
import swaggerUI from 'swagger-ui-express'
import cors from 'cors'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { router } from './router'

const app = express()

app.use(cors())

export const appRouter = createTRPCRouter({
  router,
})

export type AppRouter = typeof appRouter

export type RouterInputs = inferRouterInputs<AppRouter>

export type RouterOutputs = inferRouterOutputs<AppRouter>

app.use(
  '/api/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext: createTRPCContext,
  })
)

app.use(
  '/api',
  createOpenApiExpressMiddleware({
    router: appRouter,
    createContext: createTRPCContext,
    onError: undefined,
    responseMeta: undefined!,
    maxBodySize: undefined!,
  })
)

const url = 'http://localhost:3000/'

const openApiDocument = generateOpenApiDocument(appRouter, {
  title: 'api',
  version: '1.0.0',
  baseUrl: url,
})

app.use('/api-docs', swaggerUI.serve)
app.get('/api-docs', swaggerUI.setup(openApiDocument))
app.get('/openapi.json', (_, res) => {
  res.status(200).json(openApiDocument)
})

app.listen(3000, () => {
  console.log(`started at ${url}`)
})
