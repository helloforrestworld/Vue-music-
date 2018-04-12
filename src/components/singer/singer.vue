<template>
  <div class="singer" ref="singer">
    <list-view :data="singers"></list-view>
  </div>
</template>
<script>
import {getSingerList} from 'api/singer';
import {ERR_OK} from 'api/config';
import {SingFactory} from 'common/js/singFactory';
import ListView from 'base/listview/listview';
export default {
  name: 'singer',
  data() {
    return {
      singers: []
    };
  },
  created() {
    this._getSingerList();
  },
  components: {
    ListView
  },
  methods: {
    _getSingerList() {
      getSingerList().then((res) => {
        if (ERR_OK === res.code) {
          this.singers = this._normalize(res.data.list);
        };
      });
    },
    _normalize(list) { // 格式化歌手数据
      let map = {
        hot: {
          title: '热门',
          items: []
        }
      };
      for (let i = 0; i < list.length; i++) {
        let key = list[i].Findex;
        if (!(/[a-zA-Z]/.test(key))) {
          continue;
        };
        if (i < 10) {
          map['hot'].items.push(new SingFactory({
            name: list[i].Fsinger_name,
            id: list[i].Fsinger_mid
          }));
        };
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        };
        map[key].items.push(new SingFactory({
          name: list[i].Fsinger_name,
          id: list[i].Fsinger_mid
        }));
      };
      // 排序
      let hot = [];
      let ret = [];
      for (let key in map) {
        if (/[a-zA-Z]/.test(map[key].title)) {
          ret.push(map[key]);
        } else {
          hot.push(map[key]);
        }
      };
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(ret);
    }
  }
};
</script>
<style lang="less" scoped>
  .singer{
    position: fixed;
    top: 88px;
    bottom: 0;
    width: 100%;
  }
</style>