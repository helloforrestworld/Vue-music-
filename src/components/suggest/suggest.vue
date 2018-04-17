<template>
  <scroll class="suggest" ref="suggest" :data="searchResult" @scrollToEnd="pullupLoad" :pullup="true">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item, index) in searchResult" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text">{{getDisplayName(item)}}</p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
  </scroll>
</template>
<script>
import {getSearchResult} from 'api/search';
import {ERR_OK} from 'api/config';
import {createSong} from 'common/js/songFactory';
import Loading from 'base/loading/loading';
import Scroll from 'base/scroll/scroll';

const TYPE_SINGER = 'singer';
const perpage = 20;

export default {
  name: 'suggest',
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: { // 是否显示歌手检索结果
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      searchResult: [],
      hasMore: true
    };
  },
  methods: {
    pullupLoad() { // 上滑加载更多
      if (!this.hasMore) return;
      this.page++;
      getSearchResult(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this.searchResult = this.searchResult.concat(this._normalizeSearch(res.data));
          this._checkMore(res.data);
        };
      });
    },
    getIconCls(item) { // 图标cls
      if (item.type === TYPE_SINGER) {
        return 'icon-mine';
      } else {
        return 'icon-music';
      }
    },
    getDisplayName(item) { // 展示文本
      if (item.type === TYPE_SINGER) {
        return item.singername;
      } else {
        return `${item.name}-${item.singer}`;
      }
    },
    _checkMore(data) { // 是否还有更多数据
      let song = data.song;
      if (!song.list.length || (song.curpage * perpage >= song.totalnum)) {
        this.hasMore = false;
      } else {
        this.hasMore = true;
      }
    },
    _getSearchResult() { // 获取搜索结果
      this.page = 1;
      this.$refs.suggest.scrollTo(0, 0);
      getSearchResult(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this.searchResult = this._normalizeSearch(res.data);
          this._checkMore(res.data);
        };
      });
    },
    _normalizeSearch(data) { // 格式化搜索结果
      let ret = [];
      if (data.zhida && data.zhida.singerid) {
        ret.push({...data.zhida, ...{type: TYPE_SINGER}});
      };
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list));
      };
      return ret;
    },
    _normalizeSongs(list) { // 格式化歌曲列表
      let ret = [];
      list.forEach((musicData) => {
        ret.push(createSong(musicData));
      });
      return ret;
    }
  },
  watch: {
    query() {
      this._getSearchResult();
    }
  },
  components: {
    Loading,
    Scroll
  }
};
</script>
<style lang="less" scoped>
@import "~common/less/variable";
@import "~common/less/mixin";

.suggest{
  height: 100%;
  overflow: hidden;
  .suggest-list{
    padding: 0 30px;
    .suggest-item{
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      .icon{
        flex: 0 0 30px;
        width: 30px;
        [class^="icon-"]{
          font-size: 14px;
          color: @color-text-d;
        }
      }
      .name{
        flex: 1;
        font-size: @font-size-medium;
        color: @color-text-d;
        overflow: hidden;
        .text{
          .no-wrap();
        }
      }
    }
  }
  .no-result-wrapper{
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>