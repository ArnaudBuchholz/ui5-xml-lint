import { download } from './download'
import nock from 'nock'

describe('download', () => {
  beforeEach(() => {
    nock('https://openui5.hana.ondemand.com')
      .get('/1.99.0/discovery/all_libs')
      .reply(200, {
        all_libs: [{
          entry: 'sap/f'
        }, {
          entry: 'sap/m'
        }]
      })

    nock('http://openui5.hana.ondemand.com')
      .get('/1.98.0/discovery/all_libs')
      .reply(200, {
        all_libs: [{
          entry: 'sap/f'
        }, {
          entry: 'sap/m'
        }]
      })
  })

  it('handles HTTPS', async () => {
    const response = await download('https://openui5.hana.ondemand.com/1.99.0/discovery/all_libs')
    const allLibs = JSON.parse(response)
    expect(allLibs.all_libs.length).toStrictEqual(2)
  })

  it('handles HTTP', async () => {
    const response = await download('http://openui5.hana.ondemand.com/1.98.0/discovery/all_libs')
    const allLibs = JSON.parse(response)
    expect(allLibs.all_libs.length).toStrictEqual(2)
  })
})
