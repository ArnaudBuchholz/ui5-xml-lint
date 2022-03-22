'use strict'

import EventEmitter from 'events'
import http from 'http'
import https from 'https'

const body = async (response: EventEmitter): Promise<string> => await new Promise((resolve, reject) => {
  const buffer: string[] = []
  response
    .on('data', (chunk: Buffer) => buffer.push(chunk.toString()))
    .on('error', reject)
    .on('end', () => resolve(buffer.join('')))
})

export async function download (url: string): Promise<string> {
  let request: unknown
  if (url.startsWith('https')) {
    request = https
  } else {
    request = http
  }
  return await new Promise((resolve, reject) => {
    (request as typeof http)
      .get(url, {}, async (response: EventEmitter) => resolve(body(response)))
      .on('error', reject)
  })
}
