/// <reference lib="dom" />
import { DOMParser } from '@xmldom/xmldom'
import { getNamespaces, Library } from './ui5-cache'

export interface ParseOptions {
  ui5?: {
    cdn: string
    version: string
  }
}

export async function parse (xml: string, options?: ParseOptions): Promise<Document> {
  const ui5Options: ParseOptions['ui5'] = options?.ui5 ?? { cdn: Library.openui5, version: 'latest' }
  const domParser = new DOMParser()
  const document = domParser.parseFromString(xml)
  const namespaces = await getNamespaces(ui5Options.cdn, ui5Options.version)

  return document
}
