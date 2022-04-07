import { Library, aliases, getNamespaces } from './ui5-cache'
import nock from 'nock'
import { rm } from 'fs/promises'
import { join } from 'path'

describe('ui5-cache', () => {
  beforeAll(async () => rm(join(__dirname, '../node_modules/.cache'), { recursive: true }))

  beforeEach(() => {
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
  })

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
  })
})
