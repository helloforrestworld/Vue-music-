<template>
  <scroll @scrollBefore="scrollBefore" class="suggest" ref="suggest" :data="searchResult" @scrollToEnd="pullupLoad" :pullup="true" :scrollBefore="true">
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" :class="checkInvaid(item)" v-for="(item, index) in searchResult" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text">{{getDisplayName(item)}}</p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !searchResult.length">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>
<script>
import {getSearchResult} from 'api/search';
import {ERR_OK} from 'api/config';
import {processSongsUrl} from 'api/handlesongurl';
import {createSong} from 'common/js/songFactory';
import Loading from 'base/loading/loading';
import Scroll from 'base/scroll/scroll';
import NoResult from 'base/no-result/no-result';
import {SingFactory} from 'common/js/singFactory';
import {mapMutations, mapActions} from 'vuex';

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
    selectItem(item) {
      if (item.inviald) return;
      let singer = new SingFactory({
        id: item.singermid,
        name: item.singername
      });
      if (item.type === TYPE_SINGER) { // 点击歌手
        this.$router.push(`/search/${singer.id}`);
        this.setSinger(singer);
      } else {
        this.insertSong(item); // 点击歌曲
      };
      this.$emit('select');
    },
    pullupLoad() { // 上滑加载更多
      if (!this.hasMore) return;
      this.page++;
      this._search();
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
    scrollBefore() { // 列表滚动前
      this.$emit('listScrollBefore');
    },
    refresh() {
      this.$refs.suggest.refresh();
    },
    checkInvaid(song) { // 检查歌曲URL是否无效
      if (song.url === 'http://dl.stream.qqmusic.qq.com/') {
        song.inviald = true;
        return 'inviald';
      } else {
        song.inviald = false;
        return '';
      }
    },
    _checkMore(data) { // 是否还有更多数据
      let song = data.song;
      if (!song.list.length || (song.curpage * perpage >= song.totalnum)) {
        this.hasMore = false;
      };
    },
    _getSearchResult() { // 获取第一次搜索结果
      this.page = 1;
      this.searchResult = [];
      this.$refs.suggest.scrollTo(0, 0);
      this.hasMore = true;
      this._search();
    },
    _search() {
      getSearchResult(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this._normalizeSearch(res.data);
        };
      });
    },
    _normalizeSearch(data) { // 格式化搜索结果
      let ret = [];
      if (data.zhida && data.zhida.singerid) {
        ret.push({...data.zhida, ...{type: TYPE_SINGER}});
      };
      if (data.song) {
        let songlist = this._normalizeSongs(data.song.list);
        processSongsUrl(songlist).then((res) => { // 获取歌曲url
          songlist = res;
          ret = ret.concat(songlist);
          this.searchResult = this.searchResult.concat(ret);
          this._checkMore(data);
        });
      };
    },
    _normalizeSongs(list) { // 格式化歌曲列表
      let ret = [];
      list.forEach((musicData) => {
        ret.push(createSong(musicData));
      });
      return ret;
    },
    ...mapMutations({
      'setSinger': 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    query() {
      this._getSearchResult();
    }
  },
  components: {
    Loading,
    Scroll,
    NoResult
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
      &.inviald{
        .name{
          text-decoration: line-through;
        }
      }
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