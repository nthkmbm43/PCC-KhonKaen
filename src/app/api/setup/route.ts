import { getPayload } from 'payload'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

export async function GET() {
  const originalNodeEnv = process.env.NODE_ENV
  try {
    // Trick Payload into thinking we are in development
    // This forces Payload's init() to honor push: true
    ;(process.env as any).NODE_ENV = 'development'
    
    console.log('Initializing Payload to push database schema...')
    const payload = await getPayload({ config })
    
    // Restore NODE_ENV
    ;(process.env as any).NODE_ENV = originalNodeEnv
    
    return Response.json({ 
      success: true, 
      message: 'Database schema successfully pushed! You can now visit /admin' 
    })
  } catch (error) {
    // Restore NODE_ENV even on error
    ;(process.env as any).NODE_ENV = originalNodeEnv
    console.error('Error during schema push:', error)
    return Response.json({ 
      success: false, 
      error: String(error) 
    }, { status: 500 })
  }
}
