<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

interface ReleaseAsset {
  name: string
  browser_download_url: string
  size: number
}

interface PlatformAssets {
  windows: ReleaseAsset | null
  mac_intel: ReleaseAsset | null
  mac_arm: ReleaseAsset | null
  linux_deb: ReleaseAsset | null
  linux_appimage: ReleaseAsset | null
}

interface ReleaseResponse {
  version: string
  tag_name: string
  html_url: string
  platform_assets?: PlatformAssets
  error?: string
  fetched_at?: string
}

const props = defineProps<{
  lang?: 'zh' | 'en'
}>()

const isZh = computed(() => props.lang !== 'en')

const t = computed(() => ({
  fetching: isZh.value ? '正在获取最新版本信息...' : 'Fetching latest version info...',
  releaseNotes: isZh.value ? '📋 查看发行说明 →' : '📋 Release Notes →',
  choosePlatform: isZh.value ? '选择你的平台' : 'Choose Your Platform',
  downloadInstaller: isZh.value ? '下载安装包' : 'Download Installer',
  downloadDmg: isZh.value ? '下载 DMG' : 'Download DMG',
  downloadDeb: isZh.value ? '下载 DEB' : 'Download DEB',
  downloadAppImage: isZh.value ? '下载 AppImage' : 'Download AppImage',
  visitReleases: isZh.value ? '前往 GitHub Releases' : 'Visit GitHub Releases',
  allReleases: isZh.value ? '所有历史版本请访问' : 'For all historical releases, visit',
  windows: 'Windows',
  macIntel: 'macOS (Intel)',
  macArm: 'macOS (Apple Silicon)',
  linuxDeb: 'Linux (DEB)',
  linuxAppImage: 'Linux (AppImage)',
}))

const loading = ref(true)
const error = ref('')
const version = ref('...')
const tagName = ref('')
const releaseUrl = ref('https://github.com/Janson20/FMCL/releases/latest')
const fetchedAt = ref('')
const platforms = ref<PlatformAssets>({
  windows: null,
  mac_intel: null,
  mac_arm: null,
  linux_deb: null,
  linux_appimage: null,
})

function formatSize(bytes: number): string {
  if (!bytes || bytes === 0) return ''
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}

function proxyDownload(filename: string): string {
  if (!tagName.value || !filename) return releaseUrl.value
  return `https://fmcl.jingdu.qzz.io/download/${tagName.value}/${filename}`
}

onMounted(async () => {
  try {
    const resp = await fetch('/FMCL-Docs/release-data.json')
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    const data: ReleaseResponse = await resp.json()
    version.value = data.version || '2.9.7'
    tagName.value = data.tag_name || 'v2.9.7'
    releaseUrl.value = data.html_url || releaseUrl.value
    fetchedAt.value = data.fetched_at || ''
    const pa = data.platform_assets
    if (pa) {
      platforms.value = {
        windows: pa.windows || null,
        mac_intel: pa.mac_intel || null,
        mac_arm: pa.mac_arm || null,
        linux_deb: pa.linux_deb || null,
        linux_appimage: pa.linux_appimage || null,
      }
    }
    if (data.error && data.error !== 'build_fallback') {
      const prefix = isZh.value ? '版本数据获取时出现警告' : 'Warning during version fetch'
      error.value = `${prefix}: ${data.error}`
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    error.value = isZh.value ? `无法加载版本数据: ${msg}` : `Failed to load version data: ${msg}`
    version.value = '2.9.7'
    tagName.value = 'v2.9.7'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-if="loading" style="text-align:center;padding:48px">
    {{ t.fetching }}
  </div>

  <div v-else>
    <div class="version-info">
      <span class="version-badge">v{{ version }}</span>
      <span class="version-meta" v-if="fetchedAt">
        {{ new Date(fetchedAt).toLocaleString(isZh ? 'zh-CN' : 'en-US') }}
      </span>
      <a class="release-notes-link" :href="releaseUrl" target="_blank">{{ t.releaseNotes }}</a>
    </div>

    <div v-if="error" style="background:var(--vp-c-warning-soft);border:1px solid var(--vp-c-warning-1);border-radius:8px;padding:12px 16px;margin-bottom:16px;font-size:14px">
      ⚠️ {{ error }}
    </div>

    <h2>{{ t.choosePlatform }}</h2>

    <div class="download-grid">

      <div class="download-card">
        <div class="platform-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="9" height="9"/><rect x="13" y="3" width="9" height="9"/><rect x="2" y="14" width="9" height="9"/><rect x="13" y="14" width="9" height="9"/></svg></div>
        <h3>{{ t.windows }}</h3>
        <div class="file-name" v-if="platforms.windows">{{ platforms.windows.name }}</div>
        <div class="file-size" v-if="platforms.windows">{{ formatSize(platforms.windows.size) }}</div>
        <a v-if="platforms.windows" class="vp-button vp-button-brand" :href="proxyDownload(platforms.windows.name)" target="_blank">{{ t.downloadInstaller }}</a>
        <div v-else style="font-size:13px;color:var(--vp-c-text-3)">{{ t.visitReleases }}</div>
      </div>

      <div class="download-card">
        <div class="platform-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg></div>
        <h3>{{ t.macIntel }}</h3>
        <div class="file-name" v-if="platforms.mac_intel">{{ platforms.mac_intel.name }}</div>
        <div class="file-size" v-if="platforms.mac_intel">{{ formatSize(platforms.mac_intel.size) }}</div>
        <a v-if="platforms.mac_intel" class="vp-button vp-button-brand" :href="proxyDownload(platforms.mac_intel.name)" target="_blank">{{ t.downloadDmg }}</a>
        <div v-else style="font-size:13px;color:var(--vp-c-text-3)">{{ t.visitReleases }}</div>
      </div>

      <div class="download-card">
        <div class="platform-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg></div>
        <h3>{{ t.macArm }}</h3>
        <div class="file-name" v-if="platforms.mac_arm">{{ platforms.mac_arm.name }}</div>
        <div class="file-size" v-if="platforms.mac_arm">{{ formatSize(platforms.mac_arm.size) }}</div>
        <a v-if="platforms.mac_arm" class="vp-button vp-button-brand" :href="proxyDownload(platforms.mac_arm.name)" target="_blank">{{ t.downloadDmg }}</a>
        <div v-else style="font-size:13px;color:var(--vp-c-text-3)">{{ t.visitReleases }}</div>
      </div>

      <div class="download-card">
        <div class="platform-icon"><svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="12" cy="9" rx="5" ry="6"/><circle cx="9.5" cy="8" r="1"/><circle cx="14.5" cy="8" r="1"/><ellipse cx="12" cy="11" rx="2" ry="1"/><path d="M8 16c0 3 2 5 4 5s4-2 4-5"/><path d="M8 16c-2 0-3 2-2 3"/><path d="M16 16c2 0 3 2 2 3"/></svg></div>
        <h3>{{ t.linuxDeb }}</h3>
        <div class="file-name" v-if="platforms.linux_deb">{{ platforms.linux_deb.name }}</div>
        <div class="file-size" v-if="platforms.linux_deb">{{ formatSize(platforms.linux_deb.size) }}</div>
        <a v-if="platforms.linux_deb" class="vp-button vp-button-brand" :href="proxyDownload(platforms.linux_deb.name)" target="_blank">{{ t.downloadDeb }}</a>
        <div v-else style="font-size:13px;color:var(--vp-c-text-3)">{{ t.visitReleases }}</div>
      </div>

      <div class="download-card">
        <div class="platform-icon"><svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="12" cy="9" rx="5" ry="6"/><circle cx="9.5" cy="8" r="1"/><circle cx="14.5" cy="8" r="1"/><ellipse cx="12" cy="11" rx="2" ry="1"/><path d="M8 16c0 3 2 5 4 5s4-2 4-5"/><path d="M8 16c-2 0-3 2-2 3"/><path d="M16 16c2 0 3 2 2 3"/></svg></div>
        <h3>{{ t.linuxAppImage }}</h3>
        <div class="file-name" v-if="platforms.linux_appimage">{{ platforms.linux_appimage.name }}</div>
        <div class="file-size" v-if="platforms.linux_appimage">{{ formatSize(platforms.linux_appimage.size) }}</div>
        <a v-if="platforms.linux_appimage" class="vp-button vp-button-brand" :href="proxyDownload(platforms.linux_appimage.name)" target="_blank">{{ t.downloadAppImage }}</a>
        <div v-else style="font-size:13px;color:var(--vp-c-text-3)">{{ t.visitReleases }}</div>
      </div>

    </div>

    <div style="margin-top:16px;text-align:center;font-size:14px;color:var(--vp-c-text-2)">
      {{ t.allReleases }} <a :href="releaseUrl" target="_blank">GitHub Releases</a>
    </div>
  </div>
</template>
