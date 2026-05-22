import { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'

function guardPath(filePath: string): string | null {
  const root = process.cwd()
  const resolved = path.resolve(filePath)
  if (!resolved.startsWith(root + path.sep) && resolved !== root) return null
  return resolved
}

export async function GET(req: NextRequest) {
  const filePath = req.nextUrl.searchParams.get('path')
  if (!filePath) return Response.json({ error: 'No path' }, { status: 400 })

  const safe = guardPath(filePath)
  if (!safe) return Response.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const content = fs.readFileSync(safe, 'utf-8')
    return Response.json({ content, path: safe })
  } catch {
    return Response.json({ error: 'File not found' }, { status: 404 })
  }
}

export async function POST(req: NextRequest) {
  const { path: filePath, content } = await req.json()
  if (!filePath || content === undefined) {
    return Response.json({ error: 'Missing params' }, { status: 400 })
  }

  const safe = guardPath(filePath)
  if (!safe) return Response.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const backupDir = path.join(process.cwd(), '.admin-backups')
    fs.mkdirSync(backupDir, { recursive: true })

    if (fs.existsSync(safe)) {
      const rel = path.relative(process.cwd(), safe).replace(/[\\/]/g, '_')
      const ts = new Date().toISOString().replace(/[:.]/g, '-')
      fs.copyFileSync(safe, path.join(backupDir, `${rel}.${ts}.bak`))
    }

    fs.writeFileSync(safe, content, 'utf-8')
    return Response.json({ success: true })
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const { path: filePath, content = '' } = await req.json()
  if (!filePath) return Response.json({ error: 'No path' }, { status: 400 })

  const safe = guardPath(filePath)
  if (!safe) return Response.json({ error: 'Forbidden' }, { status: 403 })

  if (fs.existsSync(safe)) {
    return Response.json({ error: 'File already exists' }, { status: 409 })
  }

  try {
    fs.mkdirSync(path.dirname(safe), { recursive: true })
    fs.writeFileSync(safe, content, 'utf-8')
    return Response.json({ success: true, path: safe })
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 })
  }
}
