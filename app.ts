import {z} from "https://deno.land/x/zod@v3.18.0/mod.ts"
import {table} from "https://deno.land/x/minitable@v1.0/mod.ts"
import {exec} from "https://deno.land/x/execute@v1.1.0/mod.ts"

let ff = await exec("deno -V")
let f = await exec(["which", "deno"])
console.log(f)

const fruits = [
  {name: "mango", color: "orange", quantity: 3},
  {name: "lemon", color: "yellow", quantity: 1},
  {name: "strawberry", color: "", quantity: 5},
  {name: "tomato", color: "red", quantity: 17},
]
const t = table(fruits, ["color", "name"], {
  padding: 4,
  upcaseHeader: true,
  emptyReplacer: "NO DATA POINT",
})

console.log(t)
