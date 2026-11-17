import DefaultTheme from 'vitepress/theme'
import DownloadSection from '../../components/DownloadSection.vue'
import ReleaseHistory from '../../components/ReleaseHistory.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: { app: any }) {
    app.component('DownloadSection', DownloadSection)
    app.component('ReleaseHistory', ReleaseHistory)
  },
}
