// import {z} from "https://deno.land/x/zod@v3.18.0/mod.ts"
// import {table} from "https://deno.land/x/minitable@v1.0/mod.ts"
import {exec} from "https://deno.land/x/execute@v1.1.0/mod.ts"
import * as colors from "https://deno.land/std@0.153.0/fmt/colors.ts"
import {Table} from "https://deno.land/x/cliffy@v0.24.3/table/mod.ts"

// npm view {package} ---> to get latest version from shell or  yarn info {package} versions or npm show {package} version

const tableW = new Table()
  .header(["Title", "Current version", "Available Stable Version"])
  .maxColWidth(70)
  .padding(1)
  .indent(2)
  .border(true)
// .render()

const args = Deno.args

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

const getDependencies = async (dependencies: Record<string, string>) =>
  await Promise.all(
    Object.entries(dependencies).map(async ([title, version]) => ({
      Title: title,
      CurrentVersion: version,
      AvailableStableVersion: await getLatestVersion(title),
    }))
  )

if (packages !== null) {
  let dep: any
  if (args[0] === "dev") {
    dep = await getDependencies(packages.devDependencies)
  } else {
    dep = await getDependencies(packages.dependencies)
  }
  dep = dep.map((p: Record<string, string>) => Object.values(p))
  tableW.body(dep)
}

async function getLatestVersion(title: string) {
  return await exec(`npm show ${title} version`)
}

tableW.render()

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return String(error)
}
