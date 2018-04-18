<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
      <scroll :data="shortcut" class="shortcut" ref="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addKey(item.k)" class="item"  v-for="(item, index) in hotKeys" :key="index">
                {{item.k}}
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list @delete="deleteOneSearch" @select="addKey" :searches="searchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult" >
      <suggest @select="saveSearch" @listScrollBefore="blurInput" :query="query" :showSinger="true" ref="suggest"></suggest>
    </div>
    <confirm ref="confirm" text="是否清空搜索历史记录" confirmBtnText="清空" @confirm="clearSearch"></confirm>
    <router-view></router-view>
  </div>
</template>
<script>
import SearchBox from 'base/search-box/search-box';
import {getHotKey} from 'api/search';
import {ERR_OK} from 'api/config';
import Suggest from 'components/suggest/suggest';
import SearchList from 'base/search-list/search-list';
import Confirm from 'base/confirm/confirm';
import Scroll from 'base/scroll/scroll';
import {mapActions, mapGetters} from 'vuex';
import {playlistMixin} from 'common/js/mixin';

export default {
  name: 'search',
  mixins: [playlistMixin],
  data() {
    return {
      hotKeys: [],
      query: ''
    };
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  },
  created() {
    this._getHotKey();
  },
  computed: {
    shortcut() { // 合并hotkey 和 history数据 用于scroll组件更新高度
      return this.hotKeys.concat(this.searchHistory);
    },
    ...mapGetters(['searchHistory'])
  },
  watch: {
    query(newQuery) { // 用于scroll组件更新高度
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh();
        }, 20);
      };
    }
  },
  methods: {
    playlistHandler(playlist) {
      let bottom = playlist.length > 0 ? 60 : 0;
      this.$refs.shortcutWrapper.style.bottom = bottom + 'px';
      this.$refs.shortcut.refresh();
      this.$refs.searchResult.style.bottom = bottom + 'px';
      this.$refs.suggest.refresh();
    },
    deleteOneSearch(item) { // 删除某条搜索记录
      this.deleteSearchHistory(item);
    },
    saveSearch() { // 保存搜索历史
      this.saveSearchHistory(this.query);
    },
    showConfirm() { // 弹出对话框
      this.$refs.confirm.show();
    },
    clearSearch() { // 清空搜索历史
      this.clearSearchHistory();
    },
    onQueryChange(query) { // 搜索框query变化
      this.query = query;
    },
    addKey(key) { // 填充 搜索框
      this.$refs.searchBox.fillInput(key);
    },
    blurInput() { // 滚动前搜索框失去焦点 收起键盘
      this.$refs.searchBox.blur();
    },
    _getHotKey() { // 获取热搜词
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotKeys = res.data.hotkey.slice(0, 10);
        };
      });
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory'
    ])
  }
};
</script>
<style lang="less" scoped>
@import "~common/less/variable";
@import "~common/less/mixin";

.search{
  .search-box-wrapper{
    margin: 20px;
  }
  .shortcut-wrapper{
    position: fixed;
    top: 178px;
    bottom: 0;
    width: 100%;
    .shortcut{
      height: 100%;
      overflow: hidden;
      .hot-key{
        margin: 0 20px 20px 20px;
        .title{
          margin-bottom: 20px;
          font-size: @font-size-medium;
          color: @color-text-l;
        }
        .item{
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: @color-highlight-background;
          font-size: @font-size-medium;
          color: @color-text-d;
        }
      }
      .search-history{
        position: relative;
        margin: 0 20px;
        .title{
          display: flex;
          align-items: center;
          height: 40px;
          font-size: @font-size-medium;
          color: @color-text-l;
          .text{
            flex: 1;
          }
          .clear{
            .extend-click();
            .icon-clear{
              font-size: @font-size-medium;
              color: @color-text-d;
            }
          }
        }
      }
    }
  }
  .search-result{
    position: fixed;
    width: 100%;
    top: 178px;
    bottom: 0;
  }
}

</style>