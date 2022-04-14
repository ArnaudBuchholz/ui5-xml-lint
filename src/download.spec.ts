import { download } from './download'
import { setupOpenUI5Nock } from './uit5-cache.spec'

describe('download', () => {
  beforeEach(setupOpenUI5Nock)

  it('handles HTTPS', async () => {
    const response = await download('https://openui5.hana.ondemand.com/1.90.0/discovery/all_libs')
    const allLibs = JSON.parse(response)
    expect(allLibs.all_libs.length).toStrictEqual(1)
  })

  it('handles HTTP', async () => {
    const response = await download('http://openui5.hana.ondemand.com/1.100.1/discovery/all_libs')
    const allLibs = JSON.parse(response)
    expect(allLibs.all_libs.length).toStrictEqual(2)
  })
})
