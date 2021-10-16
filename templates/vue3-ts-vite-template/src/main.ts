import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import {
  Tabbar,
  TabbarItem
} from 'vant'
import 'styles/index.scss'

const app = createApp(App)
app.use(store)
app.use(Tabbar)
app.use(TabbarItem)
app.use(router)
app.mount('#app')
