// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ee from 'event-emitter'
import router from './router'
import './assets/icon/iconfont.css'
import './publics/public.css'
import store from './store/store'
require('./assets/icon/iconfont')
import ElementUI  from "element-ui"
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(ElementUI)

window.EE = ee()
window.baseUrl = 'http://192.168.0.133:8080'
// window.baseUrl = 'http://996cpq.natappfree.cc'
window.mergeUrl = '/imgmerge'
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
export default {
  components: {
    'remote-js': {
      render(createElement) {
        return createElement('script', { attrs: { type: 'text/javascript', src: this.src }});
      },
      props: {
        src: { type: String, required: true },
      }
    }
  }
}
