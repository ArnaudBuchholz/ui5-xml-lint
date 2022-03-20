import { download } from './download'

describe('download', () => {
  it('generates HTTP gets', async () => {
    const response = await download('https://sapui5.hana.ondemand.com/1.99.0/discovery/all_libs')
    const allLibs = JSON.parse(response)
    expect(allLibs.all_libs.length).toStrictEqual(24)
  })
})
