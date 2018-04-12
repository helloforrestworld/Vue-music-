import Vue from 'vue';
import Vuex from 'vuex';
import state from './state';
import mutations from './mutations';
import * as getters from './getters';
import * as actions from './actions';
import createLogger from 'vuex/dist/logger';
const debug = process.env.NODE_ENV !== 'production';

Vue.use(Vuex);
let store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  strict: debug,
  plugins: debug ? [createLogger()] : []
});
export default store;