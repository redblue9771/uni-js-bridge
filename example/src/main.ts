import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import routes from './routes'
import { useAppInfo } from './stores/global'
import './style.css'
import 'tdesign-mobile-vue/es/style/index.css';
import TDesign from 'tdesign-mobile-vue';


const pinia = createPinia()
const app = createApp(App)

const router = createRouter({
    history: createWebHistory(),
    routes,
})
app.use(TDesign)
app.use(router)
app.use(pinia)
const appInfo = useAppInfo(pinia)

// 监听加载情况，切换环境
// 建议变更全局状态
if (window.UniBridgeReady) {
    appInfo.switchClient('UniApp')
} else {
    document.addEventListener("UniBridgeReady", function () {
        appInfo.switchClient('UniApp')
    });
}

app.mount('#app')

