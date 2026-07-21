import { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'

const IGNORE = new Set([
  'node_modules', '.next', '.git', '.vercel', '.admin-backups',
  '.turbo', 'dist', 'out',
])

const KEYWORDS = ['email', 'mail', 'brevo', 'template', 'notification']

interface TemplateFile {
  name: string
  path: string
  relativePath: string
}

function scan(dir: string, root: string, results: TemplateFile[]) {
  let entries: fs.Dirent[]
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return
  }

  for (const e of entries) {
    if (IGNORE.has(e.name)) continue
    const full = path.join(dir, e.name)
    const rel = path.relative(root, full)
    if (e.isDirectory()) {
      scan(full, root, results)
    } else {
      const lower = rel.toLowerCase()
      if (KEYWORDS.some((k) => lower.includes(k))) {
        results.push({ name: e.name, path: full, relativePath: rel })
      }
    }
  }
}

export async function GET(req: NextRequest) {
  if (req.headers.get('x-admin-secret') !== process.env.ADMIN_SECRET) {
    return Response.json({ error: 'Non autorisé' }, { status: 401 })
  }
  const root = process.cwd()
  const files: TemplateFile[] = []
  scan(root, root, files)
  files.sort((a, b) => a.relativePath.localeCompare(b.relativePath))
  return Response.json({ files })
}
