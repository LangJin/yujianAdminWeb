import Vue from 'vue'
import App from './App.vue'
import {
  initRouter
} from './router'
import './theme/index.less'
import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
import '@/mock'
import store from './store'
import 'animate.css/source/animate.css'
import Plugins from '@/plugins'
import {
  initI18n
} from '@/utils/i18n'
import bootstrap from '@/bootstrap'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import moment from 'moment'
import 'moment/locale/zh-cn'
import '@/assets/default.less'

const router = initRouter(store.state.setting.asyncRoutes)
const i18n = initI18n('CN', 'US')

Vue.use(Antd)
Vue.config.productionTip = false
Vue.use(Viser)
Vue.use(Plugins)
Vue.use(Viewer)
Viewer.setDefaults({
  Options: {
    "inline": true,
    "button": true,
    "navbar": true,
    "title": true,
    "toolbar": true,
    "tooltip": true,
    "movable": true,
    "zoomable": true,
    "rotatable": true,
    "scalable": true,
    "transition": true,
    "fullscreen": true,
    "keyboard": true,
    "url": "data-source"
  }
});

bootstrap({
  router,
  store,
  i18n,
  message: Vue.prototype.$message
})

router.beforeEach((to, from, next) => {
  localStorage.setItem('actionUrl', to.path.substring(to.path.lastIndexOf('/') + 1));
  next();
})

Vue.filter("formatDate", function (value) {
  return moment(value).format('YYYY-MM-DD HH:mm:ss');
});

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')