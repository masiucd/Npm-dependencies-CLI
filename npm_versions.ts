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

const getDependencies = (dependencies: Record<string, string>) => {
  return Object.entries(dependencies).map(([title, currentVersion]) => ({
    title,
    currentVersion,
    amiableStableVersion: "",
  }))
}
if (packages !== null) {
  const dep = getDependencies(packages.dependencies)
  const devDep = getDependencies(packages.devDependencies)
}

// TODO use table library
