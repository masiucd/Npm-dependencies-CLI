const decoder = new TextDecoder()
const file = await Deno.readFile("a.json")
const f = decoder.decode(file)

const parsed = JSON.parse(f)
console.log(parsed)
