#!/Users/marcis/.deno/bin/deno

import {z} from "https://deno.land/x/zod@v3.18.0/mod.ts"

import {exec} from "https://deno.land/x/execute@v1.1.0/mod.ts"
import * as colors from "https://deno.land/std@0.153.0/fmt/colors.ts"
import {Table} from "https://deno.land/x/cliffy@v0.24.3/table/mod.ts"

import Ask from "https://deno.land/x/ask@1.0.6/mod.ts"

const ask = new Ask() // global options are also supported! (see below)

const firstPrompt = await ask.prompt([
  {
    name: "option",
    type: "input",
    message: "Enter --dev for dev dependencies or leave it empty fro dependencies",
  },
])

const tableW = new Table()
  .header(["Title", "Current version", "Available Stable Version"])
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
  AvailableStableVersion: z.string(),
})
const DependenciesList = z.array(Dependency)
const getDependencies = async (dependencies: Record<string, string>) => {
  const res = await Promise.all(
    Object.entries(dependencies).map(async ([title, version]) => ({
      Title: title,
      CurrentVersion: version,
      AvailableStableVersion: await getLatestVersion(title, version),
    }))
  )
  return DependenciesList.parse(res)
}

if (packages !== null) {
  if (firstPrompt.option === "--dev") {
    const dep = await getDependencies(packages.devDependencies)
    const r = dep.map((p: Record<string, string>) => Object.values(p))
    tableW.body(r)
  } else {
    const dep = await getDependencies(packages.dependencies)
    const res = dep.map((p: Record<string, string>) => Object.values(p))
    tableW.body(res)
  }
}

async function getLatestVersion(title: string, version: string) {
  const res = await exec(`npm show ${title} version`)
  const latest = res.split(".").map(Number)
  const current = version
    .split(".")
    .map(x => x.replace(/\W/, ""))
    .map(Number)
  if (latest[0] > current[0]) {
    return colors.bgYellow(colors.black(res))
  }
  return res
}

tableW.render()

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return String(error)
}
