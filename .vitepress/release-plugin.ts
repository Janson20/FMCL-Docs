import type { Plugin } from 'vite'

const PROXY_API_URL = 'https://fmcl.jingdu.qzz.io/api/releases/latest'

export interface ReleaseAsset {
  name: string
  browser_download_url: string
  size: number
}

export interface ReleaseData {
  version: string
  tag_name: string
  html_url: string
  body: string
  assets: ReleaseAsset[]
  fetched_at: string
  error?: string
}

const FALLBACK_DATA: ReleaseData = {
  version: '2.9.7',
  tag_name: 'v2.9.7',
  html_url: 'https://github.com/Janson20/FMCL/releases/tag/v2.9.7',
  body: '',
  assets: [],
  fetched_at: '',
  error: 'build_fallback',
}

function getPlatformAssets(assets: ReleaseAsset[]) {
  const result: Record<string, ReleaseAsset | null> = {
    windows: null,
    mac_intel: null,
    mac_arm: null,
    linux_deb: null,
    linux_appimage: null,
  }

  for (const asset of assets) {
    const name = asset.name.toLowerCase()
    if (name.includes('setup') && name.endsWith('.exe')) {
      result.windows = asset
    } else if (name.includes('mac') && name.includes('arm64') && name.endsWith('.dmg')) {
      result.mac_arm = asset
    } else if (name.includes('mac') && name.includes('amd64') && name.endsWith('.dmg')) {
      result.mac_intel = asset
    } else if (name.endsWith('.appimage')) {
      result.linux_appimage = asset
    } else if (name.endsWith('.deb')) {
      result.linux_deb = asset
    }
  }

  return result
}

async function fetchReleaseData(): Promise<ReleaseData> {
  const headers = {
    'User-Agent': 'FMCL-Docs/1.0 (VitePress build-time fetcher)',
  }

  const resp = await fetch(PROXY_API_URL, {
    headers,
    signal: AbortSignal.timeout(15000),
  })

  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status}: ${resp.statusText}`)
  }

  const release = await resp.json() as Record<string, unknown>
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
    body: String(release.body || ''),
    assets,
    fetched_at: new Date().toISOString(),
  }
}

let cachedPayload: string | null = null

async function getPayload(): Promise<string> {
  if (cachedPayload) return cachedPayload

  let releaseData: ReleaseData
  try {
    releaseData = await fetchReleaseData()
    console.log(`[fmcl-release] Fetched latest version: ${releaseData.version} (${releaseData.assets.length} assets)`)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.warn(`[fmcl-release] Failed to fetch release data: ${msg}. Using fallback.`)
    releaseData = { ...FALLBACK_DATA, error: msg }
  }

  const platformAssets = getPlatformAssets(releaseData.assets)

  cachedPayload = JSON.stringify({
    ...releaseData,
    platform_assets: platformAssets,
  })

  return cachedPayload
}

export function createReleasePlugin(): Plugin {
  return {
    name: 'fmcl-release-data',

    async generateBundle(_, bundle) {
      const payload = await getPayload()
      ;(bundle as Record<string, unknown>)['release-data.json'] = {
        type: 'asset',
        fileName: 'release-data.json',
        source: payload,
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
        } catch (err) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'fetch_failed' }))
        }
      })
    },
  }
}
