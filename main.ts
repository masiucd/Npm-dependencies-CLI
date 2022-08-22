import {z} from "https://deno.land/x/zod@v3.18.0/mod.ts"

const Dog = z.object({
  id: z.string(),
  name: z.string(),
  breed: z.string(),
  age: z.number(),
})

// to use the type from Dog
type DogType = z.infer<typeof Dog>

const getDog = async (id: string) => {
  const res = await fetch(`https://dogs/${id}`)
  const maybeDog = await res.json() // ---> any type. How do we type this?
  const result = Dog.parse(maybeDog)
  return maybeDog
}

const Todo = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
  // cool: z.boolean(),
})
const TodoList = z.array(Todo)
type Todo = z.infer<typeof Todo>
type TodoListType = Todo[]

const getTodos = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos")
  const maybeTodos = await response.json()

  const result = TodoList.parse(maybeTodos)
  return result
}

const res = await getTodos()
console.log(res[0].title)
