export async function GET() {
  return Response.json({ root: process.cwd() })
}
