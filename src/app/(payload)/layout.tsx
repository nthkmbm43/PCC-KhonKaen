import config from '@/payload.config'
import '@payloadcms/next/css'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import React from 'react'
import { importMap } from './admin/importMap.js'

const serverFunction = async function (args: any) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

import { getPayload } from 'payload'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const originalNodeEnv = process.env.NODE_ENV
  try {
    // Trick Payload into thinking it's development to force push: true
    ;(process.env as any).NODE_ENV = 'development'
    await getPayload({ config })
    ;(process.env as any).NODE_ENV = originalNodeEnv
  } catch (e) {
    ;(process.env as any).NODE_ENV = originalNodeEnv
  }

  return (
    <html lang="en">
      <body>
        <RootLayout serverFunction={serverFunction} importMap={importMap} config={config}>{children}</RootLayout>
      </body>
    </html>
  )
}
