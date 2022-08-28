#!/Users/marcis/.deno/bin/deno
import {z} from "https://deno.land/x/zod@v3.18.0/mod.ts"
import {Table} from "https://deno.land/x/cliffy@v0.24.3/table/mod.ts"
import Ask from "https://deno.land/x/ask@1.0.6/mod.ts"
import {getErrorMessage, getLatestVersion, getObjectValues} from "./helpers.ts"

const ask = new Ask()
const input = await ask.prompt([
  {
    name: "option",
    type: "input",
    message: "Enter --dev for dev dependencies or leave it empty fro dependencies",
  },
])

const tableW = new Table()
  .header(["Title", "Current version", "Latest Version"])
  .maxColWidth(70)
  .padding(1)
  .indent(2)
  .border(true)

const getJsonFile = async () => {
  const decoder = new TextDecoder()
  const file = await Deno.readFile("a.json")
  return decoder.decode(file)
}

const file = await getJsonFile()
const parseJsonFile = (file: string) => {
  try {
    const {dependencies, devDependencies} = JSON.parse(file)
    return {dependencies, devDependencies}
  } catch (error) {
    const message = getErrorMessage(error)
    console.error(`Can't parse file ${file}`, message)
    return null
  }
}

const packages = parseJsonFile(file)

const Dependency = z.object({
  Title: z.string(),
  CurrentVersion: z.string(),
  LatestVersion: z.string(),
})
const DependenciesList = z.array(Dependency)
const getDependencies = async (dependencies: Record<string, string>) => {
  const res = await Promise.all(
    Object.entries(dependencies).map(async ([title, version]) => ({
      Title: title,
      CurrentVersion: version,
      LatestVersion: await getLatestVersion(title, version),
    }))
  )
  return DependenciesList.parse(res)
}

if (packages !== null) {
  if (input.option === "--dev") {
    const dep = await getDependencies(packages.devDependencies)
    const r = getObjectValues(dep)
    tableW.body(r)
  } else {
    const dep = await getDependencies(packages.dependencies)
    const res = getObjectValues(dep)
    tableW.body(res)
  }
}

tableW.render()
