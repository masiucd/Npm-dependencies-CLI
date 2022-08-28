import {exec} from "https://deno.land/x/execute@v1.1.0/mod.ts"
import * as colors from "https://deno.land/std@0.153.0/fmt/colors.ts"

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return String(error)
}

const getObjectValues = (list: Record<string, string>[]) =>
  list.map((p: Record<string, string>) => Object.values(p))

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
  if (latest[0] === current[0] && latest[1] > current[1]) {
    return colors.bgBlue(colors.black(res))
  }
  if (latest[0] === current[0] && latest[1] === current[1] && latest[2] > current[2]) {
    return colors.bgBrightRed(colors.black(res))
  }
  return res
}

export {getErrorMessage, getObjectValues, getLatestVersion}
