<template>
    <transition name="slide">
      <div class="user-center">
        <div class="back" @click="back">
          <i class="icon-back"></i>
        </div>
        <div class="switches-wrapper">
          <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
        </div>
        <div class="play-btn" ref="playBtn" @click="randomAll">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
        <div class="list-wrapper" ref="listWrapper">
          <scroll class="list-scroll" v-if="currentIndex === 0" :data="favoriteList" ref="favoriteList">
            <div class="list-inner">
              <song-list :songs="favoriteList" @select="selectSong"></song-list>
            </div>
          </scroll>
          <scroll class="list-scroll" v-if="currentIndex === 1" :data="playHistory" ref="playHistory">
            <div class="list-inner">
              <song-list :songs="playHistory" @select="selectSong"></song-list>
            </div>
          </scroll>
        </div>
        <div class="no-result-wrapper" v-if="showNoResult">
          <no-result :title="getNoResultDes"></no-result>
        </div>
      </div>
    </transition>
</template>
<script>
import Switches from 'base/switches/switches';
import Scroll from 'base/scroll/scroll';
import SongList from 'base/song-list/song-list';
import NoResult from 'base/no-result/no-result';
import {mapGetters, mapActions} from 'vuex';
import {playlistMixin} from 'common/js/mixin';
export default {
  name: 'user-center',
  mixins: [playlistMixin],
  data() {
    return {
      switches: ['我喜欢的', '最近播放'],
      currentIndex: 0
    };
  },
  methods: {
    playlistHandler(playlist) {
      let bottom = playlist.length > 0 ? '60px' : '0';
      this.$refs.listWrapper.style.bottom = bottom;
      this.currentIndex === 0 ? this.$refs.favoriteList.refresh() : this.$refs.playHistory.refresh();
    },
    back() {
      this.$router.back();
    },
    switchItem(index) {
      this.currentIndex = index;
    },
    selectSong(song, index) { 
      if (this.currentIndex === 0) {
        this.selectPlay({ // 播放整个收藏列表
          list: this.favoriteList,
          index
        });
        return;
      };
      this.insertSong(song); // 插入一首歌
    },
    randomAll() { // 随机播放全部
      let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory;
      if (!list.length) return;
      this.selectAllRandom({
        list
      });
    },
    ...mapActions([
      'insertSong',
      'selectAllRandom',
      'selectPlay'
    ])
  },
  components: {
    Switches,
    Scroll,
    SongList,
    NoResult
  },
  computed: {
    showNoResult() { // 暂无结果
      if (this.currentIndex === 0) {
        return !this.favoriteList.length;
      } else {
        return !this.playHistory.length;
      }
    },
    getNoResultDes() {
      if (this.currentIndex === 0) {
        return '快去收藏歌曲呗';
      } else {
        return '你还没听过歌曲';
      }
    },
    ...mapGetters([
      'favoriteList',
      'playHistory'
    ])
  }
};
</script>
<style lang="less" scoped>
@import "~common/less/variable";

.user-center{
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  background: @color-background;
  &.slide-enter-active, &.slide-leave-active{
    transition: all 0.3s;
  }
  &.slide-enter, &.slide-leave-to{
    transform: translate3d(100%, 0, 0);
  }
  .back{
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;
    .icon-back{
      display: block;
      padding: 10px;
      font-size: @font-size-large-x;
      color: @color-theme;
    }
  }
  .switches-wrapper{
    margin: 10px 0 30px 0;
  }
  .play-btn{
    box-sizing: border-box;
    width: 135px;
    padding: 7px 0;
    margin: 0 auto;
    text-align: center;
    border: 1px solid  @color-text-l;
    color: @color-text-l;
    border-radius: 100px;
    font-size: 0;
    .icon-play{
      display: inline-block;
      vertical-align: middle;
      margin-right: 6px;
      font-size: @font-size-medium-x;
    }
    .text{
      display: inline-block;
      vertical-align: middle;
      font-size: @font-size-small;
    }
  }
  .list-wrapper{
    position: absolute;
    top: 110px;
    bottom: 0;
    width: 100%;
    .list-scroll{
      height: 100%;
      overflow: hidden;
      .list-inner{
        padding: 20px 30px;
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