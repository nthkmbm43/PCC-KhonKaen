export const dynamic = 'force-dynamic'

export function GET() {
  return Response.json({
    url: process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL
  })
}
