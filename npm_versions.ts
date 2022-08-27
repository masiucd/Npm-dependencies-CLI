import {z} from "https://deno.land/x/zod@v3.18.0/mod.ts"
import {table} from "https://deno.land/x/minitable@v1.0/mod.ts"
import {exec} from "https://deno.land/x/execute@v1.1.0/mod.ts"

// npm view {package} ---> to get latest version from shell or  yarn info {package} versions or npm show {package} version

//EX  npm view remix

// let ff = await exec("npm view remix")
// console.log("ff", ff)
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

const getDependencies = async (dependencies: Record<string, string>) => {
  const availableStableVersion = await getLatestVersion("react")
  return Object.entries(dependencies).map(([title, currentVersion]) => {
    return {
      title,
      currentVersion,
      availableStableVersion,
    }
  })
}
if (packages !== null) {
  const dep = getDependencies(packages.dependencies)
  const devDep = getDependencies(packages.devDependencies)
}

// TODO use table library

if (packages !== null) {
  // const a = getDependencies(packages.dependencies)
  const b = await getDependencies(packages.devDependencies)
  // console.log(a)
  // const t1 = table(a, ["title", "currentVersion", "availableStableVersion"], {
  //   padding: 4,
  //   upcaseHeader: true,
  //   emptyReplacer: "Empty",
  // })
  const t2 = table(b, ["title", "currentVersion", "availableStableVersion"], {
    padding: 4,
    upcaseHeader: true,
    emptyReplacer: "Empty",
  })
  console.log(t2)
}
async function getLatestVersion(title: string) {
  return await exec(`npm show ${title} version`)
}
