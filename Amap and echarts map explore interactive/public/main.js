import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import websoket2 from './utils/websoket2'
import components from '@/utils/components.js'
import Toast from '@/components/dialog/Toast.js'
import modalComponentMixin from './mxins/modalComponentMixin'
import HdSelectTree from '@/components/HdSelectTree.vue'
import HdPageSelect from '@/components/HdPageSelect.vue'
//easytable组件
import '@/assets/less/easytable-variables.less'
import { VeTable } from 'vue-easytable'
Vue.use(VeTable)

Vue.use(components)
import './plugins/element.js'
import '@/assets/css/reset.css'
import '@/assets/css/public.css'
import './permission'
import HdScrollView from '@/components/HdScrollView.vue'
Vue.component('HdScrollView', HdScrollView)
Vue.component('HdSelectTree', HdSelectTree)
Vue.component('HdPageSelect', HdPageSelect)
Vue.prototype.$toast = Toast

Vue.config.productionTip = false
Vue.mixin(websoket2)
Vue.mixin(modalComponentMixin)
Vue.prototype.$EventBus = new Vue()
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
