import { DOMParser } from '@xmldom/xmldom'
import { readFile } from 'fs/promises'
import { join } from 'path'

async function main (): Promise<void> {
  const buffer = await readFile(join(__dirname, 'view.xml'))
  const xmlSource = buffer.toString()
  const xmlDom = new DOMParser().parseFromString(xmlSource)

  console.log(xmlDom)
}

main().catch(reason => console.error(reason))
