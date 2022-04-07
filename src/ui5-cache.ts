import { download } from './download'
import findCacheDir from 'find-cache-dir'
import { readFile, writeFile, stat } from 'fs/promises'

export enum Library {
  ui5 = 'ui5',
  openui5 = 'openui5'
}

export const aliases: Record<Library, string> = {
  ui5: 'https://ui5.sap.com',
  openui5: 'https://openui5.hana.ondemand.com'
}

const latests: Record<string, string> = {}

const join = (...parts: string[]): string => parts.map(part => part.endsWith('/') ? part.substring(0, part.length - 2) : part).join('/')

async function buildUI5Url (cdn: string, version: string): Promise<string> {
  if (!cdn.match(/^https?:\/\//)) {
    cdn = aliases[cdn as Library] ?? ''
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
  return join(cdn, version)
}

async function cache<T> (ui5Url: string, name: string, build: () => Promise<T>): Promise<T> {
  const getCache = findCacheDir({
    name: ui5Url.replace(/:\/\/|\//g, '_'),
    create: true,
    thunk: true
  })
  if (getCache === undefined) {
    throw new Error('Unable to allocate cache folder')
  }

  const fileName = getCache(name)
  if (fileName === undefined) {
    throw new Error('Unable to allocate cache filename')
  }

  try {
    await stat(fileName)
    return JSON.parse((await readFile(fileName)).toString())
  } catch (e) {}

  const content = await build()
  await writeFile(fileName, JSON.stringify(content))
  return content
}

export async function getNamespaces (cdn: string, version = 'latest'): Promise<string[]> {
  const ui5Url: string = await buildUI5Url(cdn, version)
  return cache(ui5Url, 'all_libs', async () => {
    const allLibs = JSON.parse(await download(join(ui5Url, 'discovery/all_libs')))
    return allLibs.all_libs.map(({ entry }: { entry: string }) => entry)
  })
}
