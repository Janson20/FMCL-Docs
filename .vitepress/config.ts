import { defineConfig } from 'vitepress'
import { createReleasePlugin } from './release-plugin'

const releasePlugin = createReleasePlugin()

export default defineConfig({
  base: '/',
  title: 'FMCL',
  description: 'Fusion Minecraft Launcher - 基于 Qt Quick 的 Minecraft 启动器',
  head: [],
  lastUpdated: true,
  cleanUrls: true,

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

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'FMCL - Fusion Minecraft Launcher',
      description: '基于 Qt Quick（QML）的 Minecraft 启动器，支持版本管理、模组生态、开服、联机、备份、音乐、成就与 AI 助手',
      themeConfig: {
        nav: [
          { text: '首页', link: '/' },
          { text: '下载', link: '/download' },
          {
            text: '文档',
            items: [
              { text: '功能一览', link: '/features' },
              { text: '使用指南', link: '/guide' },
              { text: '配置说明', link: '/config' },
              { text: '插件开发', link: '/plugin' },
              { text: '常见问题', link: '/faq' },
              { text: '更新日志', link: '/changelog' },
            ],
          },
          { text: '关于', link: '/about' },
          { text: '用户协议', link: '/terms' },
        ],
        sidebar: {
          '/': [
            {
              text: '开始使用',
              items: [
                { text: '下载安装', link: '/download' },
                { text: '功能一览', link: '/features' },
                { text: '使用指南', link: '/guide' },
              ],
            },
            {
              text: '参考',
              items: [
                { text: '配置说明', link: '/config' },
                { text: '常见问题', link: '/faq' },
                { text: '更新日志', link: '/changelog' },
              ],
            },
            {
              text: '开发者',
              items: [
                { text: '插件开发', link: '/plugin' },
              ],
            },
            {
              text: '其它',
              items: [
                { text: '关于', link: '/about' },
                { text: '用户协议', link: '/terms' },
              ],
            },
          ],
        },
        outline: { label: '本页目录' },
        docFooter: { prev: '上一页', next: '下一页' },
        darkModeSwitchLabel: '深色模式',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
        sidebarMenuLabel: '菜单',
        returnToTopLabel: '回到顶部',
        langMenuLabel: '切换语言',
        externalLinkIcon: true,
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
      title: 'FMCL - Fusion Minecraft Launcher',
      description: 'A Minecraft launcher built on Qt Quick (QML) with version management, mod ecosystem, server hosting, backups, music, achievements and an AI assistant',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Download', link: '/en/download' },
          {
            text: 'Docs',
            items: [
              { text: 'Features', link: '/en/features' },
              { text: 'Guide', link: '/en/guide' },
              { text: 'Configuration', link: '/en/config' },
              { text: 'Plugin Development', link: '/en/plugin' },
              { text: 'FAQ', link: '/en/faq' },
              { text: 'Changelog', link: '/en/changelog' },
            ],
          },
          { text: 'About', link: '/en/about' },
          { text: 'Terms', link: '/en/terms' },
        ],
        sidebar: {
          '/en/': [
            {
              text: 'Getting Started',
              items: [
                { text: 'Download', link: '/en/download' },
                { text: 'Features', link: '/en/features' },
                { text: 'Guide', link: '/en/guide' },
              ],
            },
            {
              text: 'Reference',
              items: [
                { text: 'Configuration', link: '/en/config' },
                { text: 'FAQ', link: '/en/faq' },
                { text: 'Changelog', link: '/en/changelog' },
              ],
            },
            {
              text: 'Developers',
              items: [
                { text: 'Plugin Development', link: '/en/plugin' },
              ],
            },
            {
              text: 'More',
              items: [
                { text: 'About', link: '/en/about' },
                { text: 'Terms of Use', link: '/en/terms' },
              ],
            },
          ],
        },
        outline: { label: 'On this page' },
        docFooter: { prev: 'Previous page', next: 'Next page' },
        darkModeSwitchLabel: 'Dark mode',
        lightModeSwitchTitle: 'Switch to light mode',
        darkModeSwitchTitle: 'Switch to dark mode',
        sidebarMenuLabel: 'Menu',
        returnToTopLabel: 'Back to top',
        langMenuLabel: 'Change language',
        externalLinkIcon: true,
        lastUpdated: { text: 'Last updated' },
        notFound: {
          title: 'Page Not Found',
          quote: 'You have wandered into the unknown...',
          linkLabel: 'Go back home',
        },
      },
    },
  },

  vite: {
    plugins: [releasePlugin],
  },
})
