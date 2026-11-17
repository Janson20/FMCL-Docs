import type { Plugin } from 'vite'

const PROXY_API_URL = 'https://fmcl.jingdu.qzz.io/api/releases/latest'
const GITHUB_RELEASES_API = 'https://api.github.com/repos/Janson20/FMCL/releases?per_page=15'
const USER_AGENT = 'FMCL-Docs/1.1 (VitePress build-time fetcher)'

export interface ReleaseAsset {
  name: string
  browser_download_url: string
  size: number
}

export interface PlatformAssets {
  windows: ReleaseAsset | null
  windows_lite: ReleaseAsset | null
  linux_tarball: ReleaseAsset | null
  sha256sums: ReleaseAsset | null
}

export interface ReleaseData {
  version: string
  tag_name: string
  html_url: string
  published_at: string
  body: string
  assets: ReleaseAsset[]
  fetched_at: string
  error?: string
}

export interface ReleaseHistoryItem {
  tag_name: string
  name: string
  published_at: string
  html_url: string
  prerelease: boolean
}

const FALLBACK_DATA: ReleaseData = {
  version: '3.0.0',
  tag_name: 'v3.0.0',
  html_url: 'https://github.com/Janson20/FMCL/releases/tag/v3.0.0',
  published_at: '2026-11-15T01:53:23Z',
  body: '',
  assets: [],
  fetched_at: '',
  error: 'build_fallback',
}

const FALLBACK_HISTORY: ReleaseHistoryItem[] = [
  {
    tag_name: 'v3.0.0',
    name: 'v3.0.0',
    published_at: '2026-11-15T01:53:23Z',
    html_url: 'https://github.com/Janson20/FMCL/releases/tag/v3.0.0',
    prerelease: false,
  },
]

export function getPlatformAssets(assets: ReleaseAsset[]): PlatformAssets {
  const result: PlatformAssets = {
    windows: null,
    windows_lite: null,
    linux_tarball: null,
    sha256sums: null,
  }

  for (const asset of assets) {
    const name = asset.name.toLowerCase()
    if (name.startsWith('fmcl-setup-') && name.endsWith('.exe')) {
      if (name.includes('without-dotnetsdk')) {
        result.windows_lite = asset
      } else {
        result.windows = asset
      }
    } else if (name.startsWith('fmcl-') && name.includes('linux') && name.endsWith('.tar.gz')) {
      result.linux_tarball = asset
    } else if (name === 'sha256sums') {
      result.sha256sums = asset
    }
  }

  return result
}

async function fetchReleaseData(): Promise<ReleaseData> {
  const resp = await fetch(PROXY_API_URL, {
    headers: { 'User-Agent': USER_AGENT },
    signal: AbortSignal.timeout(15000),
  })

  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status}: ${resp.statusText}`)
  }

  const release = (await resp.json()) as Record<string, unknown>
  const tagName = String(release.tag_name || '')
  const remoteVersion = tagName.replace(/^v/, '')

  const assets: ReleaseAsset[] = []
  if (Array.isArray(release.assets)) {
    for (const a of release.assets) {
      assets.push({
        name: String(a.name || ''),
        browser_download_url: String(a.browser_download_url || ''),
        size: Number(a.size || 0),
      })
    }
  }

  return {
    version: remoteVersion,
    tag_name: tagName,
    html_url: String(release.html_url || ''),
    published_at: String(release.published_at || ''),
    body: String(release.body || ''),
    assets,
    fetched_at: new Date().toISOString(),
  }
}

async function fetchReleaseHistory(): Promise<ReleaseHistoryItem[]> {
  const resp = await fetch(GITHUB_RELEASES_API, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/vnd.github+json',
    },
    signal: AbortSignal.timeout(15000),
  })

  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status}: ${resp.statusText}`)
  }

  const list = (await resp.json()) as Record<string, unknown>[]
  return list
    .filter((item) => !item.draft)
    .map((item) => ({
      tag_name: String(item.tag_name || ''),
      name: String(item.name || item.tag_name || ''),
      published_at: String(item.published_at || ''),
      html_url: String(item.html_url || ''),
      prerelease: Boolean(item.prerelease),
    }))
}

let cachedPayload: string | null = null
let cachedHistory: string | null = null

async function getPayload(): Promise<string> {
  if (cachedPayload) return cachedPayload

  let releaseData: ReleaseData
  try {
    releaseData = await fetchReleaseData()
    console.log(
      `[fmcl-release] Fetched latest version: ${releaseData.version} (${releaseData.assets.length} assets)`,
    )
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.warn(`[fmcl-release] Failed to fetch release data: ${msg}. Using fallback.`)
    releaseData = { ...FALLBACK_DATA, error: msg }
  }

  cachedPayload = JSON.stringify({
    ...releaseData,
    platform_assets: getPlatformAssets(releaseData.assets),
  })

  return cachedPayload
}

async function getHistory(): Promise<string> {
  if (cachedHistory) return cachedHistory

  let history: ReleaseHistoryItem[]
  try {
    history = await fetchReleaseHistory()
    console.log(`[fmcl-release] Fetched ${history.length} releases for history`)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.warn(`[fmcl-release] Failed to fetch release history: ${msg}. Using fallback.`)
    history = FALLBACK_HISTORY
  }

  cachedHistory = JSON.stringify({ releases: history, fetched_at: new Date().toISOString() })
  return cachedHistory
}

export function createReleasePlugin(): Plugin {
  return {
    name: 'fmcl-release-data',

    async generateBundle(_, bundle) {
      const [payload, history] = await Promise.all([getPayload(), getHistory()])
      const target = bundle as Record<string, unknown>
      target['release-data.json'] = {
        type: 'asset',
        fileName: 'release-data.json',
        source: payload,
        needsCodeReference: false,
      }
      target['release-history.json'] = {
        type: 'asset',
        fileName: 'release-history.json',
        source: history,
        needsCodeReference: false,
      }
    },

    configureServer(server) {
      server.middlewares.use('/release-data.json', async (_req, res) => {
        try {
          const payload = await getPayload()
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Cache-Control', 'public, max-age=3600')
          res.end(payload)
        } catch {
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'fetch_failed' }))
        }
      })

      server.middlewares.use('/release-history.json', async (_req, res) => {
        try {
          const history = await getHistory()
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Cache-Control', 'public, max-age=3600')
          res.end(history)
        } catch {
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'fetch_failed' }))
        }
      })
    },
  }
}
