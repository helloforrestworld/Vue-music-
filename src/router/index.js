import Vue from 'vue';
import Router from 'vue-router';

import Recommend from 'components/recommend/recommend';
import DiscDetail from 'components/disc-detail/disc-detail';
import Singer from 'components/singer/singer';
import SingerDetail from 'components/singer-detail/singer-detail';
import Rank from 'components/rank/rank';
import Search from 'components/search/search';
Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: DiscDetail
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank
    },
    {
      path: '/search',
      component: Search
    }
  ]
});
