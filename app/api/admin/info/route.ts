import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  if (req.headers.get('x-admin-secret') !== process.env.ADMIN_SECRET) {
    return Response.json({ error: 'Non autorisé' }, { status: 401 })
  }
  return Response.json({ root: process.cwd() })
}
