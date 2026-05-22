import fs from 'fs'
import path from 'path'

const IGNORE = new Set([
  'node_modules', '.next', '.git', '.vercel', '.admin-backups',
  '.turbo', 'dist', 'out', '.cache',
])

interface Node {
  name: string
  path: string
  type: 'file' | 'directory'
  children?: Node[]
}

function buildTree(dir: string): Node[] {
  let entries: fs.Dirent[]
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return []
  }

  const nodes: Node[] = []
  for (const e of entries) {
    if (IGNORE.has(e.name)) continue
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      nodes.push({ name: e.name, path: full, type: 'directory', children: buildTree(full) })
    } else {
      nodes.push({ name: e.name, path: full, type: 'file' })
    }
  }

  return nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'directory' ? -1 : 1
    return a.name.localeCompare(b.name)
  })
}

export async function GET() {
  return Response.json({ tree: buildTree(process.cwd()) })
}
