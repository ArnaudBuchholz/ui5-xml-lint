'use strict'

import EventEmitter from 'events'
import http from 'http'
import https from 'https'

const body = async (response: EventEmitter): Promise<string> => await new Promise((resolve, reject) => {
  const buffer: string[] = []
  response
    .on('data', (chunk: any) => buffer.push(chunk.toString()))
    .on('error', reject)
    .on('end', () => resolve(buffer.join('')))
})

export async function download (url: string): Promise<string> {
  let request: any
  if (url.startsWith('https')) {
    request = https
  } else {
    request = http
  }
  return await new Promise((resolve, reject) => {
    request
      .get(url, {}, async (response: EventEmitter) => resolve(body(response)))
      .on('error', reject)
  })
}
