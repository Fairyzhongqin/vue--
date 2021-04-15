// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// import axios from '../node_modules/axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import './mock/index'
// import _ from 'lodash'
import animate from 'animate.css'
import './assets/css/public.css'
import './assets/css/index.less'
import './assets/font/iconfont.css'
import myLoading from './utils/myLoading'
// E chart
// import echarts from 'echarts'
// Vue.prototype.$echarts = echarts
// end
Vue.config.productionTip = false

Vue.use(ElementUI)

// Vue.prototype.$http = axios
// Vue.prototype.$echarts = echarts
// Vue.prototype._ = _
Vue.prototype.$resetVuex = function(originValue, value) {
  for (let item in originValue) {
    value[item] = originValue[item]
  }
}
Vue.use(myLoading)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: {
    App
  },
  template: '<App/>'
})
