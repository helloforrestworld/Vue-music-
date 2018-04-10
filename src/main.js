import 'babel-polyfill'; // es6一些API polyfill
import Vue from 'vue';
import App from './App';
import router from './router';
import store from '@/store';
import 'common/less/index';
import fastclick from 'fastclick'; // 消除移动端点击延迟

Vue.config.productionTip = false;

fastclick.attach(document.body);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
