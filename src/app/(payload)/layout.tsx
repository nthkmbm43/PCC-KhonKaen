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

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <RootLayout serverFunction={serverFunction} importMap={importMap} config={config}>{children}</RootLayout>
      </body>
    </html>
  )
}
