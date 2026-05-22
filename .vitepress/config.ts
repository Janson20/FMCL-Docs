import { defineConfig } from 'vitepress'
import { createReleasePlugin } from './release-plugin'

const releasePlugin = createReleasePlugin()

export default defineConfig({
  base: '/',
  title: '⛏ FMCL',
  description: 'Fusion Minecraft Launcher - A feature-rich Minecraft launcher',
  head: [],
  lastUpdated: true,
  cleanUrls: true,

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: '⛏ FMCL - Fusion Minecraft Launcher',
      description: '一个功能丰富的 Minecraft 启动器，支持国内镜像加速、多模组加载器安装与版本管理',
      themeConfig: {
        nav: [
          { text: '首页', link: '/' },
          { text: '下载', link: '/download' },
          { text: '关于', link: '/about' },
          { text: '用户协议', link: '/terms' },
        ],
        sidebar: {
          '/': [
            { text: '首页', link: '/' },
            { text: '下载', link: '/download' },
            { text: '关于', link: '/about' },
            { text: '用户协议', link: '/terms' },
          ],
        },
        outline: { label: '本页目录' },
        docFooter: { prev: '上一页', next: '下一页' },
        darkModeSwitchLabel: '深色模式',
        sidebarMenuLabel: '菜单',
        returnToTopLabel: '回到顶部',
        lastUpdated: { text: '最后更新' },
        notFound: {
          title: '页面未找到',
          quote: '你来到了未知的领域...',
          linkLabel: '返回首页',
        },
      },
    },
    en: {
      label: 'English',
      lang: 'en-US',
      title: '⛏ FMCL - Fusion Minecraft Launcher',
      description: 'A feature-rich Minecraft launcher with mirror acceleration, multi-mod loader support and version management',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Download', link: '/en/download' },
          { text: 'About', link: '/en/about' },
          { text: 'Terms', link: '/en/terms' },
        ],
        sidebar: {
          '/en/': [
            { text: 'Home', link: '/en/' },
            { text: 'Download', link: '/en/download' },
            { text: 'About', link: '/en/about' },
            { text: 'Terms', link: '/en/terms' },
          ],
        },
        outline: { label: 'On this page' },
        docFooter: { prev: 'Previous page', next: 'Next page' },
        darkModeSwitchLabel: 'Dark mode',
        sidebarMenuLabel: 'Menu',
        returnToTopLabel: 'Back to top',
        lastUpdated: { text: 'Last updated' },
        notFound: {
          title: 'Page Not Found',
          quote: 'You have wandered into the unknown...',
          linkLabel: 'Go back home',
        },
      },
    },
  },

  themeConfig: {
    logo: '/logo.svg',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Janson20/FMCL' },
    ],
    search: {
      provider: 'local',
    },
    footer: {
      message: 'Released under the GPL-3.0 License.',
      copyright: 'Copyright © 2024-2026 Janson20',
    },
  },

  vite: {
    plugins: [releasePlugin],
  },
})
