// import {z} from "https://deno.land/x/zod@v3.18.0/mod.ts"
import {table} from "https://deno.land/x/minitable@v1.0/mod.ts"
import {exec} from "https://deno.land/x/execute@v1.1.0/mod.ts"
import * as colors from "https://deno.land/std@0.153.0/fmt/colors.ts"

// npm view {package} ---> to get latest version from shell or  yarn info {package} versions or npm show {package} version

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
    // @ts-ignore
    console.error("Can't parse file", error.message)
    return null
  }
}

const packages = parseJsonFile(file)

const getDependencies = async (dependencies: Record<string, string>) =>
  await Promise.all(
    Object.entries(dependencies).map(async ([title, version]) => ({
      Title: colors.bgBlue(colors.black(title)),
      CurrentVersion: colors.bgBrightCyan(colors.black(version)),
      AvailableStableVersion: colors.bgBrightGreen(colors.black(await getLatestVersion(title))),
    }))
  )

if (packages !== null) {
  let dep
  if (args[0] === "dev") {
    dep = await getDependencies(packages.devDependencies)
  } else {
    dep = await getDependencies(packages.dependencies)
  }
  const tableDependencies = table(dep, ["Title", "CurrentVersion", "AvailableStableVersion"], {
    padding: 2,
    upcaseHeader: false,
    emptyReplacer: "Empty",
  })
  console.log(tableDependencies)
}

async function getLatestVersion(title: string) {
  return await exec(`npm show ${title} version`)
}
