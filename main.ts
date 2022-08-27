import chalk from "npm:chalk@5"
import {table} from "npm:table@6.8.0"

export function add(a: number, b: number): number {
  return a + b
}

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  console.log("Add 2 + 3 =", add(2, 3))
}

console.log(chalk.cyan("asdas"))

const data = [
  ["0A", "0B", "0C"],
  ["1A", "1B", "1C"],
  ["2A", "2B", "2C"],
]

console.log(table(data))
