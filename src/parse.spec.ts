import { parse } from './parse'

describe('parse', () => {
  it('parses valid XML', async () => {
    const document = await parse(`<root attribute="123">
  <child />
</root>`)
    expect(document).not.toBeUndefined()
  })

  it('provides information about node namespace (default)', async () => {
    const document = await parse('<root xmlns="test" />')
    const root = document.firstChild
    expect(root).not.toBeNull()
    if (root !== null) {
      expect(root.nodeName).toStrictEqual('root')
      expect(root.lookupNamespaceURI('')).toStrictEqual('test')
    }
  })

  it('provides information about node namespace (prefix)', async () => {
    const document = await parse('<tst:root xmlns:tst="test" />')
    const root = document.firstChild
    expect(root).not.toBeNull()
    if (root !== null) {
      expect(root.nodeName).toStrictEqual('tst:root')
      expect(root.lookupNamespaceURI('tst')).toStrictEqual('test')
    }
  })

  it('provides information about node location (prefix)', async () => {
    const document = await parse('<tst:root xmlns:tst="test" />')
    const root = document.firstChild
    expect(root).not.toBeNull()
    if (root !== null) {
      expect(root.nodeName).toStrictEqual('tst:root')
      expect(root.lookupNamespaceURI('tst')).toStrictEqual('test')
    }
  })
})
