import { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(req: NextRequest) {
  if (req.headers.get('x-admin-secret') !== process.env.ADMIN_SECRET) {
    return new Response('Non autorisé', { status: 401 })
  }
  const filePath = req.nextUrl.searchParams.get('path')
  if (!filePath) return new Response('No path', { status: 400 })

  const root = process.cwd()
  const resolved = path.resolve(filePath)
  if (!resolved.startsWith(root)) return new Response('Forbidden', { status: 403 })

  try {
    const content = fs.readFileSync(resolved, 'utf-8')
    return new Response(content, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
  } catch {
    return new Response('File not found', { status: 404 })
  }
}
