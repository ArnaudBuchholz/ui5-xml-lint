import { rm } from 'fs/promises'
import { join } from 'path'

export default async function () {
  await rm(join(__dirname, '../node_modules/.cache'), { recursive: true })
}
