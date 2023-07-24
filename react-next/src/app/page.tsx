import { db } from '../../../db'
import { revalidatePath } from 'next/cache'

export default async function Home() {
  const todos = await db.query('SELECT * FROM "Todos";')

  async function create(data: FormData) {
    'use server'

    await db.query(
      `INSERT INTO "Todos" ("content", "completed") VALUES ("${data.get(
        'content'
      )}", false);`
    )

    revalidatePath('/')
  }

  return (
    <main className='p-4'>
      {todos.map(({ content, completed }) => {
        return (
          <div>
            <label className='flex gap-2 items-center'>
              {content}
              <input disabled type='checkbox' defaultChecked={completed} />
            </label>
          </div>
        )
      })}
      <form action={create}>
        <input className='border border-gray-400' type='text' name='content' />
        <button
          className='hover:bg-gray-100 border border-gray-400'
          type='submit'
        >
          New
        </button>
      </form>
    </main>
  )
}
