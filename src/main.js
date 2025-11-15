import './assets/main.css'
import 'vant/lib/index.css';

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import api from './api'


const app = createApp(App)
// 在实例上绑定属性
app.config.globalProperties.$api = api

router.beforeEach((to, form) => {
    if (to.path !== '/login') {
        if (!localStorage.getItem('h5_token')) {
            return '/login'
        }
    }
    
})

app.use(router)

app.mount('#app')
