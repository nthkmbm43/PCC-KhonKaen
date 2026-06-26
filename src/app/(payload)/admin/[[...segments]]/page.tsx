import config from '@/payload.config'
import { RootPage } from '@payloadcms/next/views'
import React from 'react'
import { importMap } from '../importMap.js'

export default function Page(props: { params: Promise<{ segments: string[] }>; searchParams: Promise<{ [key: string]: string | string[] }> }) {
  return <RootPage importMap={importMap} config={config} searchParams={props.searchParams} params={props.params} />
}
