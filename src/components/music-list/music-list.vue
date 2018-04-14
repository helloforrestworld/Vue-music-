<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back" @click="back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length > 0" ref="playBtn" @click="randomAll">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="bgLayer"></div>
    <scroll
      :songs="songs"
      class="list"
      ref="list"
      :probe-type="probeType"
      :listen-scroll="listenScroll"
      @scroll="scroll"
    >
      <div class="song-list-wrapper">
        <song-list @select="selectItem" :songs="songs"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>
<script>
import Scroll from 'base/scroll/scroll';
import SongList from 'base/song-list/song-list';
import Loading from 'base/loading/loading';
import {prefixStyle} from 'common/js/dom';
import {mapActions} from 'vuex';

let transform = prefixStyle('transform');
let backDrop = prefixStyle('backdrop-filter');
const TOP_HEIHGT = 40; // title高度

export default {
  name: 'music-list',
  props: {
    songs: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    },
    'bgImage': {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      scrollY: -1 // song-list滚动位置
    };
  },
  components: {
    Scroll,
    SongList,
    Loading
  },
  created() {
    // Scroll设置的参数
    this.probeType = 3;
    this.listenScroll = true;
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight; // 图片高度
    this.minTransalteY = -this.imageHeight + TOP_HEIHGT; // bg-layer最小滚动位置
    this.$refs.list.$el.style.top = this.imageHeight + 'px'; // 根据图片高度设置list的top
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this['bgImage']})`;
    }
  },
  methods: {
    back() { // 后退
      this.$router.back();
    },
    scroll(pos) { // 监听Scroll派发的滚动事件
      this.scrollY = pos.y;
    },
    selectItem(song, index) { // song-list 点击
      this.selectPlay({ // 播放初始化
        list: this.songs,
        index
      });
    },
    randomAll() { // 随机播放全部
      this.sellAllRondom({
        list: this.songs
      });
    },
    ...mapActions([
      'selectPlay',
      'sellAllRondom'
    ])
  },
  watch: {
    scrollY(newY) {
      // 滚动位置发生变化
      // bg-layer跟随移动
      let translateY = Math.max(this.minTransalteY, newY);
      this.$refs.bgLayer.style[transform] = `translate3d(0,${translateY}px,0)`;
      // 处理滚动到阈值 列表没被遮盖问题
      let zIndex = 0;
      let bgImage = this.$refs.bgImage;
      if (newY < translateY) {
        zIndex = 10;
        bgImage.style.paddingTop = 0;
        bgImage.style.height = TOP_HEIHGT + 'px';
        this.$refs.playBtn.style.display = 'none';
      } else {
        bgImage.style.paddingTop = '';
        bgImage.style.height = '';
        this.$refs.playBtn.style.display = '';
      }
      // 下拉图片放大
      let scale = 1;
      let blur = 0;
      let percent = Math.abs(newY / this.imageHeight);
      if (newY > 0) {
        scale = 1 + percent;
        zIndex = 10;
      } else {
        blur = Math.min(20, 20 * percent);
      };
      bgImage.style.zIndex = zIndex;
      bgImage.style[transform] = `scale(${scale})`;
      // 上滑图片模糊
      this.$refs.filter.style[backDrop] = `blur(${blur}px)`;
    }
  }
};
</script>
<style lang="less" scoped>
@import "~common/less/variable";
@import "~common/less/mixin";

.music-list{
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: @color-background;
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
  .title{
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    .no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: @font-size-large;
    color: @color-text;
  }
  .bg-image{
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;
    .play-wrapper{
      position: absolute;
      bottom: 20px;
      z-index: 50;
      width: 100%;
      .play{
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid @color-theme;
        color: @color-theme;
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
    }
    .filter{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .bg-layer{
    position: relative;
    height: 100%;
    background: @color-background;
  }
  .list{
    position: fixed;
    bottom: 0;
    width: 100%;
    background: @color-background;
    .song-list-wrapper{
      padding: 20px 30px;
    }
    .loading-container{
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>