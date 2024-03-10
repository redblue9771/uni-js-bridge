
import { RouteRecordRaw } from 'vue-router'


const routes: RouteRecordRaw[] = [{
    path: "/",
    name: "主页",
    component:()=>import('../components/HelloWorld.vue')
}]

export default routes