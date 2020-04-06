import Vue from 'vue'
import App from './App.vue'

Vue.use(require('vue-pusher'), {
  api_key: 'ae75b27fe10620645391',
  options: {
      cluster: 'mt1',
      authEndpoint: process.env.VUE_APP_BASEURL+'/pusher_auth.php'
      // encrypted: true,
  }
});

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
