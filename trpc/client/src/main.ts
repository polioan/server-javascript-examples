import type { AppRouter } from '../../server/src/index'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc',
    }),
  ],
})

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<main class='p-4'>
<div id='todos'></div>
<form>
<input class='border border-gray-400' type='text' name='content' />
<button class='hover:bg-gray-100 border border-gray-400' type='submit'>New</button>
</form>
</main>
`

async function updateTodos() {
  const todos = await client.router.getTodos.query()
  document.querySelector<HTMLDivElement>('#todos')!.innerHTML = todos
    .map(({ content, completed }) => {
      return `
      <div>
        <label class='flex gap-2 items-center'>
          ${content}
          <input disabled type='checkbox' ${completed ? 'checked' : ''} />
        </label>
      </div>
    `
    })
    .join('')
}

document
  .querySelector<HTMLFormElement>('form')!
  .addEventListener('submit', async e => {
    e.preventDefault()
    const content = document.querySelector<HTMLInputElement>(
      'input[name="content"]'
    )!.value
    await client.router.createTodo.mutate({ content })
    await updateTodos()
  })

await updateTodos()
