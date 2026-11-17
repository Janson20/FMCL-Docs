<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

interface ReleaseItem {
  tag_name: string
  name: string
  published_at: string
  html_url: string
  prerelease: boolean
}

const props = defineProps<{
  lang?: 'zh' | 'en'
}>()

const isZh = computed(() => props.lang !== 'en')

const t = computed(() => ({
  loading: isZh.value ? '正在获取版本列表...' : 'Fetching release list...',
  version: isZh.value ? '版本' : 'Version',
  date: isZh.value ? '发布日期' : 'Published',
  type: isZh.value ? '类型' : 'Type',
  notes: isZh.value ? '说明' : 'Notes',
  view: isZh.value ? '查看' : 'View',
  stable: isZh.value ? '正式版' : 'Stable',
  prerelease: isZh.value ? '预发布' : 'Pre-release',
  failed: isZh.value ? '无法加载版本列表，请前往 GitHub Releases 查看' : 'Failed to load release list, please visit GitHub Releases',
  empty: isZh.value ? '暂无版本记录' : 'No releases found',
}))

const loading = ref(true)
const failed = ref(false)
const releases = ref<ReleaseItem[]>([])

function formatDate(value: string): string {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString(isZh.value ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

onMounted(async () => {
  try {
    const resp = await fetch('/release-history.json')
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    const data = await resp.json() as { releases?: ReleaseItem[] }
    releases.value = Array.isArray(data.releases) ? data.releases : []
  } catch {
    failed.value = true
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="release-history">
    <div v-if="loading" class="release-loading">{{ t.loading }}</div>
    <div v-else-if="failed" class="release-warning">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 2.4 17a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>
      <span>{{ t.failed }}</span>
    </div>
    <div v-else-if="releases.length === 0" class="release-loading">{{ t.empty }}</div>
    <table v-else class="release-table">
      <thead>
        <tr>
          <th>{{ t.version }}</th>
          <th>{{ t.date }}</th>
          <th>{{ t.type }}</th>
          <th>{{ t.notes }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in releases" :key="item.tag_name">
          <td><a :href="item.html_url" target="_blank">{{ item.tag_name }}</a></td>
          <td>{{ formatDate(item.published_at) }}</td>
          <td>{{ item.prerelease ? t.prerelease : t.stable }}</td>
          <td><a :href="item.html_url" target="_blank">{{ t.view }}</a></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
