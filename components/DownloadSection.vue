<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

interface ReleaseAsset {
  name: string
  browser_download_url: string
  size: number
}

interface PlatformAssets {
  windows: ReleaseAsset | null
  windows_lite: ReleaseAsset | null
  linux_tarball: ReleaseAsset | null
  sha256sums: ReleaseAsset | null
}

interface ReleaseResponse {
  version: string
  tag_name: string
  html_url: string
  published_at?: string
  platform_assets?: Partial<PlatformAssets>
  error?: string
  fetched_at?: string
}

const props = defineProps<{
  lang?: 'zh' | 'en'
}>()

const isZh = computed(() => props.lang !== 'en')

const t = computed(() => ({
  fetching: isZh.value ? '正在获取最新版本信息...' : 'Fetching latest version info...',
  releaseNotes: isZh.value ? '查看发行说明' : 'Release Notes',
  choosePlatform: isZh.value ? '选择你的平台' : 'Choose Your Platform',
  downloadInstaller: isZh.value ? '下载安装包' : 'Download Installer',
  downloadTarball: isZh.value ? '下载 tar.gz' : 'Download tar.gz',
  githubLink: isZh.value ? 'GitHub 备用下载' : 'GitHub mirror',
  visitReleases: isZh.value ? '前往 GitHub Releases' : 'Visit GitHub Releases',
  allReleases: isZh.value ? '所有历史版本请访问' : 'For all historical releases, visit',
  checksum: isZh.value ? '校验文件' : 'Checksums',
  windows: 'Windows x64',
  windowsFull: isZh.value ? '完整版，内置 .NET 10 SDK' : 'Full build with bundled .NET 10 SDK',
  windowsLite: isZh.value ? 'Windows x64（精简版）' : 'Windows x64 (Lite)',
  windowsLiteSub: isZh.value ? '不含 .NET SDK，体积更小' : 'No .NET SDK, smaller download',
  linux: isZh.value ? 'Linux x86_64' : 'Linux x86_64',
  linuxSub: isZh.value ? '目录产物，解压即用' : 'Directory build, extract and run',
  macos: 'macOS',
  macosNote: isZh.value
    ? '暂不提供二进制包，请从源码运行'
    : 'No binary build yet, run from source',
  sourceGuide: isZh.value ? '查看源码运行说明' : 'Run from source',
  warnFetch: isZh.value ? '版本数据获取时出现警告' : 'Warning during version fetch',
  failedLoad: isZh.value ? '无法加载版本数据' : 'Failed to load version data',
}))

const ICONS = {
  windows:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="9" height="9"/><rect x="13" y="3" width="9" height="9"/><rect x="2" y="14" width="9" height="9"/><rect x="13" y="14" width="9" height="9"/></svg>',
  linux:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="9" rx="5" ry="6"/><circle cx="9.5" cy="8" r="1"/><circle cx="14.5" cy="8" r="1"/><ellipse cx="12" cy="11" rx="2" ry="1"/><path d="M8 16c0 3 2 5 4 5s4-2 4-5"/><path d="M8 16c-2 0-3 2-2 3"/><path d="M16 16c2 0 3 2 2 3"/></svg>',
  mac: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>',
}

const loading = ref(true)
const error = ref('')
const version = ref('...')
const tagName = ref('')
const publishedAt = ref('')
const releaseUrl = ref('https://github.com/Janson20/FMCL/releases/latest')
const fetchedAt = ref('')
const platforms = ref<PlatformAssets>({
  windows: null,
  windows_lite: null,
  linux_tarball: null,
  sha256sums: null,
})

const cards = computed(() => [
  {
    key: 'windows',
    title: t.value.windows,
    subtitle: t.value.windowsFull,
    asset: platforms.value.windows,
    action: t.value.downloadInstaller,
    icon: ICONS.windows,
  },
  {
    key: 'windows-lite',
    title: t.value.windowsLite,
    subtitle: t.value.windowsLiteSub,
    asset: platforms.value.windows_lite,
    action: t.value.downloadInstaller,
    icon: ICONS.windows,
  },
  {
    key: 'linux',
    title: t.value.linux,
    subtitle: t.value.linuxSub,
    asset: platforms.value.linux_tarball,
    action: t.value.downloadTarball,
    icon: ICONS.linux,
  },
  {
    key: 'macos',
    title: t.value.macos,
    subtitle: t.value.macosNote,
    asset: null,
    action: '',
    icon: ICONS.mac,
  },
])

const sourceLink = computed(() => (isZh.value ? '/download#macos' : '/en/download#macos'))

function formatSize(bytes: number): string {
  if (!bytes || bytes === 0) return ''
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}

function proxyDownload(filename: string): string {
  if (!tagName.value || !filename) return releaseUrl.value
  return `https://fmcl.jingdu.qzz.io/download/${tagName.value}/${filename}`
}

function formatDate(value: string): string {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(isZh.value ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(async () => {
  try {
    const resp = await fetch('/release-data.json')
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    const data: ReleaseResponse = await resp.json()
    version.value = data.version || '3.0.0'
    tagName.value = data.tag_name || 'v3.0.0'
    releaseUrl.value = data.html_url || releaseUrl.value
    publishedAt.value = data.published_at || ''
    fetchedAt.value = data.fetched_at || ''
    const pa = data.platform_assets
    if (pa) {
      platforms.value = {
        windows: pa.windows || null,
        windows_lite: pa.windows_lite || null,
        linux_tarball: pa.linux_tarball || null,
        sha256sums: pa.sha256sums || null,
      }
    }
    if (data.error && data.error !== 'build_fallback') {
      error.value = `${t.value.warnFetch}: ${data.error}`
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    error.value = `${t.value.failedLoad}: ${msg}`
    version.value = '3.0.0'
    tagName.value = 'v3.0.0'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-if="loading" class="release-loading">
    {{ t.fetching }}
  </div>

  <div v-else>
    <div class="version-info">
      <span class="version-badge">v{{ version }}</span>
      <span class="version-meta" v-if="publishedAt">{{ formatDate(publishedAt) }}</span>
      <span class="version-meta" v-else-if="fetchedAt">{{ formatDate(fetchedAt) }}</span>
      <a class="release-notes-link" :href="releaseUrl" target="_blank">{{ t.releaseNotes }}</a>
    </div>

    <div v-if="error" class="release-warning">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 2.4 17a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>
      <span>{{ error }}</span>
    </div>

    <h2>{{ t.choosePlatform }}</h2>

    <div class="download-grid">
      <div class="download-card" v-for="card in cards" :key="card.key">
        <div class="platform-icon" v-html="card.icon"></div>
        <h3>{{ card.title }}</h3>
        <div class="card-subtitle">{{ card.subtitle }}</div>
        <template v-if="card.asset">
          <div class="file-name">{{ card.asset.name }}</div>
          <div class="file-size">{{ formatSize(card.asset.size) }}</div>
          <a class="vp-button vp-button-brand" :href="proxyDownload(card.asset.name)" target="_blank">
            {{ card.action }}
          </a>
          <a class="mirror-link" :href="card.asset.browser_download_url" target="_blank">{{ t.githubLink }}</a>
        </template>
        <template v-else>
          <div class="file-name">{{ t.visitReleases }}</div>
          <a class="mirror-link" :href="sourceLink">{{ t.sourceGuide }}</a>
        </template>
      </div>
    </div>

    <div class="download-footer">
      <span>
        {{ t.allReleases }} <a :href="releaseUrl" target="_blank">GitHub Releases</a>
      </span>
      <span v-if="platforms.sha256sums" class="checksum">
        {{ t.checksum }}:
        <a :href="proxyDownload(platforms.sha256sums.name)" target="_blank">{{ platforms.sha256sums.name }}</a>
      </span>
    </div>
  </div>
</template>
