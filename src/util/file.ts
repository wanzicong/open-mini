import { readFile, writeFile, mkdir, stat, readdir } from "fs/promises"
import { dirname, join, relative, isAbsolute, parse } from "path"
import { existsSync } from "fs"

export async function readFileContent(filePath: string): Promise<string> {
  const content = await readFile(filePath, "utf-8")
  return content
}

export async function writeFileContent(filePath: string, content: string): Promise<void> {
  const normalizedPath = filePath.replace(/\\/g, "/")
  const dir = dirname(normalizedPath)
  
  if (dir && dir !== "." && !existsSync(dir)) {
    try {
      await mkdir(dir, { recursive: true })
    } catch (e: any) {
      if (e.code !== "EEXIST" && e.code !== "ENOENT") {
        throw e
      }
    }
  }
  
  await writeFile(normalizedPath, content, "utf-8")
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath)
    return true
  } catch {
    return false
  }
}

export async function isDirectory(filePath: string): Promise<boolean> {
  try {
    const stats = await stat(filePath)
    return stats.isDirectory()
  } catch {
    return false
  }
}

export async function listDirectory(dirPath: string): Promise<string[]> {
  const entries = await readdir(dirPath)
  return entries.map(entry => join(dirPath, entry))
}

export function getRelativePath(from: string, to: string): string {
  return relative(from, to)
}
