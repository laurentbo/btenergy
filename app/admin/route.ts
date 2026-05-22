export async function GET() {
  return new Response('<h1>Admin OK</h1>', { headers: { 'Content-Type': 'text/html' } });
}
