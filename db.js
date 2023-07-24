import { PrismaClient } from '@prisma/client'

/**
 * @returns {PrismaClient}
 */
function getCachedPrisma() {
  if (typeof window === 'object' && window !== null) {
    // @ts-expect-error
    window.prisma ??= new PrismaClient({})
    // @ts-expect-error
    return window.prisma
  }
  if (typeof global === 'object' && global !== null) {
    global.prisma ??= new PrismaClient({})
    return global.prisma
  }
}

const prisma = getCachedPrisma()

if (
  typeof process === 'object' &&
  process !== null &&
  // @ts-expect-error
  process.env.NODE_ENV === 'seed'
) {
  await prisma.todos.deleteMany()

  await prisma.todos.create({ data: { content: 'Buy groceries' } })
  await prisma.todos.create({ data: { content: 'Finish the report' } })
  await prisma.todos.create({
    data: { content: 'Go for a run', completed: true },
  })

  await prisma.$disconnect()
  process.exit(0)
}

/**
 * For illustration only!
 */
class Db {
  /**
   * @param {string} string
   * @returns {Promise<any>}
   */
  async query(string) {
    try {
      return await prisma.$executeRawUnsafe(string)
    } catch (e) {
      if (
        typeof e === 'object' &&
        e !== null &&
        'meta' in e &&
        typeof e.meta === 'object' &&
        e.meta !== null &&
        String(e.meta.message).toLowerCase().includes('returned results')
      ) {
        return await prisma.$queryRawUnsafe(string)
      }
      throw e
    }
  }
}

export const db = new Db()
