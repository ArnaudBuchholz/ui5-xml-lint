import { download } from './download'
import findCacheDir from 'find-cache-dir'
import { readFile, writeFile, stat } from 'fs/promises'

const aliases: Record<string, string> = {
  ui5: 'https://ui5.sap.com',
  openui5: 'https://openui5.hana.ondemand.com'
}

const latests: Record<string, string> = {}

const join = (...parts: string[]): string => parts.map(part => part.endsWith('/') ? part.substring(0, part.length - 2) : part).join('/')

export async function read (cdn: string, version = 'latest', namespace = '*'): Promise<object> {
  if (!cdn.match(/^https?:\/\//)) {
    cdn = aliases[cdn] ?? ''
  }
  if (cdn === '') {
    throw new Error('Invalid cdn')
  }

  if (version === 'latest') {
    let latestVersion = latests[cdn]
    if (latestVersion === undefined) {
      const neoApp = JSON.parse(await download(join(cdn, 'neo-app.json')))
      latestVersion = neoApp.routes[0].target.version
      latests[cdn] = latestVersion
    }
    version = latestVersion
  }
  cdn = join(cdn, version)

  const cache = findCacheDir({
    name: cdn,
    create: true,
    thunk: true
  })
  if (cache === undefined) {
    throw new Error('Unable to allocate cache dir')
  }

  async function cached (rel: string): Promise<string> {
    const fileName = cache!(rel)
    try {
      await stat(fileName)
      return (await readFile(fileName)).toString()
    } catch (e) {}
    const content = await download(join(cdn, rel))
    await writeFile(fileName, content)
    return content
  }

  const allLibs = JSON.parse(await cached('discovery/all_libs'))
  if (namespace === '*') {
    return allLibs.all_libs.map((item: any) => item.entry)
  }

  return {}
}
