// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '../src/css/reset.css'
import Vuelazyload from 'vue-lazyload'

Vue.use(Vuelazyload, {
  preLoad: 1.3,
  error: './src/assets/images/loading_err.png',
  loading: './src/assets/images/loading.gif',
  attempt: 3
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
