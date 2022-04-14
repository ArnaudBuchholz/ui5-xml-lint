import { Library, aliases, getNamespaces, getApiRef } from './ui5-cache'
import nock from 'nock'

export function setupOpenUI5Nock () {
  nock(aliases[Library.openui5])
    .get('/neo-app.json')
    .reply(200, {
      routes: [{
        target: {
          version: '1.100.1'
        }
      }]
    })
  nock(aliases[Library.openui5])
    .get('/1.90.0/discovery/all_libs')
    .reply(200, {
      all_libs: [{
        entry: 'sap/m'
      }]
    })
  nock(aliases[Library.openui5])
    .get('/1.100.1/discovery/all_libs')
    .reply(200, {
      all_libs: [{
        entry: 'sap/f'
      }, {
        entry: 'sap/m'
      }]
    })
  nock(aliases[Library.openui5].replace('https:', 'http:'))
    .get('/1.100.1/discovery/all_libs')
    .reply(200, {
      all_libs: [{
        entry: 'sap/f'
      }, {
        entry: 'sap/m'
      }]
    })
  nock(aliases[Library.openui5])
    .get('/1.100.1/test-resources/sap/f/designtime/apiref/api.json')
    .reply(200, {
      '$schema-ref': 'http://schemas.sap.com/sapui5/designtime/api.json/1.0',
      version: '1.100.1',
      library: 'sap.f'
    })
}

describe('ui5-cache', () => {
  beforeEach(setupOpenUI5Nock)

  it('validates the library name', async () => expect(() => getNamespaces('unknown')).rejects.toBeInstanceOf(Error))

  describe('retrieves the latest version', () => {
    it('downloads the latest version', async () => {
      const namespaces = await getNamespaces(Library.openui5)
      expect(namespaces.length).toStrictEqual(2)
    })

    it('uses the cache', async () => {
      const namespaces = await getNamespaces(Library.openui5)
      expect(namespaces.length).toStrictEqual(2)
    })

    it('gets api reference', async () => {
      const apiRef = await getApiRef(Library.openui5, 'sap/f')
      expect(apiRef.version).toStrictEqual('1.100.1')
      expect(apiRef.library).toStrictEqual('sap.f')
    })
  })

  describe('retrieves a specific version', () => {
    it('downloads the specific version', async () => {
      const namespaces = await getNamespaces(Library.openui5, '1.90.0')
      expect(namespaces.length).toStrictEqual(1)
    })
  })
})
