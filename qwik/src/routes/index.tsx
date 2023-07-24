import { db } from '../../../db'
import { component$ } from '@builder.io/qwik'
import { routeLoader$, server$, useNavigate } from '@builder.io/qwik-city'

const useTodos = routeLoader$(async () => {
  return await db.query('SELECT * FROM "Todos";')
})

const create = server$(async (content: string) => {
  await db.query(
    `INSERT INTO "Todos" ("content", "completed") VALUES ("${content}", false);`
  )
})

export default component$(() => {
  const todos = useTodos()
  const nav = useNavigate()

  return (
    <main class='p-4'>
      {todos.value.map(({ content, completed }) => {
        return (
          <div>
            <label class='flex gap-2 items-center'>
              {content}
              <input disabled type='checkbox' checked={completed} />
            </label>
          </div>
        )
      })}
      <form
        preventdefault:submit
        onSubmit$={async e => {
          const data = new FormData(e.target as HTMLFormElement)
          await create(data.get('content') as string)
          nav()
        }}
      >
        <input class='border border-gray-400' type='text' name='content' />
        <button class='hover:bg-gray-100 border border-gray-400' type='submit'>
          New
        </button>
      </form>
    </main>
  )
})
