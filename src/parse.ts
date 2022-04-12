/// <reference lib="dom" />
import { DOMParser } from '@xmldom/xmldom'

export async function parse (xml: string): Promise<Document> {
  const domParser = new DOMParser()
  const document = domParser.parseFromString(xml)
  return document
}
