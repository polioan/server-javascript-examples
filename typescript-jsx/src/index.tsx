import express from 'express'
import * as elements from 'typed-html'
import { db } from '../../db'

const app = express()

app.get('/', async (req, res) => {
  if (req.query.content) {
    await db.query(
      `INSERT INTO "Todos" ("content", "completed") VALUES ("${req.query.content}", false);`
    )
  }

  const todos = await db.query('SELECT * FROM "Todos";')

  res.send(`
    <!DOCTYPE html>
    ${(
      <html lang='en' dir='ltr'>
        <head>
          <meta charset='UTF-8' />
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1.0'
          />
          <script src='https://cdn.tailwindcss.com'></script>
        </head>
        <body>
          <main class='p-4'>
            {todos.map(({ content, completed }) => {
              return (
                <div>
                  <label class='flex gap-2 items-center'>
                    {content}
                    <input disabled type='checkbox' checked={completed} />
                  </label>
                </div>
              )
            })}
            <form action='/'>
              <input
                class='border border-gray-400'
                type='text'
                name='content'
              />
              <button
                class='hover:bg-gray-100 border border-gray-400'
                type='submit'
              >
                New
              </button>
            </form>
          </main>
        </body>
      </html>
    )}`)
})

app.listen(3000, () => {
  console.log('started at http://localhost:3000/')
})
