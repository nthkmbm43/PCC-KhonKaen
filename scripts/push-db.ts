import { getPayload } from 'payload'
import config from '../src/payload.config'

async function push() {
  try {
    console.log('Initializing Payload to force schema push...')
    const payload = await getPayload({ config })
    console.log('Payload initialized. Schema should be created if push: true is set.')
    process.exit(0)
  } catch (e) {
    console.error('Error during payload initialization:', e)
    process.exit(1)
  }
}

push()
