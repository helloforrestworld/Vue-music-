import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
const Recommend = (resolve) => {
  import('components/recommend/recommend').then((module) => {
    resolve(module);
  });
};
const DiscDetail = (resolve) => {
  import('components/disc-detail/disc-detail').then((module) => {
    resolve(module);
  });
};
const Singer = (resolve) => {
  import('components/singer/singer').then((module) => {
    resolve(module);
  });
};
const SingerDetail = (resolve) => {
  import('components/singer-detail/singer-detail').then((module) => {
    resolve(module);
  });
};
const Rank = (resolve) => {
  import('components/rank/rank').then((module) => {
    resolve(module);
  });
};
const topDetail = (resolve) => {
  import('components/top-detail/top-detail').then((module) => {
    resolve(module);
  });
};
const Search = (resolve) => {
  import('components/search/search').then((module) => {
    resolve(module);
  });
};
const UserCenter = (resolve) => {
  import('components/user-center/user-center').then((module) => {
    resolve(module);
  });
};

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
      component: Rank,
      children: [
        {
          path: ':id',
          component: topDetail
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
});
