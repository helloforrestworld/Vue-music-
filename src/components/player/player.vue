<template>
  <div class="player" v-show="playlist.length>0">
    <transition 
        name="normal"
        @enter="enter"
        @after-enter="afterEnter"
        @leave="leave"
        @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div
          class="middle"
          @touchstart.prevent="middleTouchStart"
          @touchmove.prevent="middleTouchMove"
          @touchend="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="rotate">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric" v-show="notLyric">纯音乐，请欣赏</div>
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList">
            <div class="lyric-wrapper">
              <div>
                <div class="text" v-show="notLyric">纯音乐，请欣赏</div>
                <p 
                  ref="lyricLine"
                  class="text"
                  v-for="(line, index) in currentLyric.lines"
                  :key="index"
                  :class="{'current': index === currentLineNum}"
                >
                  {{line.txt}}
                </p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percent-change="percentChange"></progress-bar>
            </div>
            <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" @click="prev">
              <i class="icon-prev"></i>
            </div>
            <div class="icon i-center" @click="togglePlay">
              <i :class="iconPlay"></i>
            </div>
            <div class="icon i-right" @click="next">
              <i class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :class="rotate" width="40" height="40" :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control" @click.stop="togglePlay">
          <progress-circle :radius="radius" :percent="percent">
            <i class="icon-mini" :class="mIconPlay"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio 
      :src="currentSong.url"
      ref="audio"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex';
import animations from 'create-keyframe-animation';
import Scroll from 'base/scroll/scroll';
import ProgressBar from 'base/progress-bar/progress-bar';
import ProgressCircle from 'base/progress-circle/progress-circle';
import {prefixStyle} from 'common/js/dom';
import {playMode} from 'common/js/config';
import {shuffle} from 'common/js/shuffle';
import {getLyric} from 'api/getLyric';
import LyricParse from 'lyric-parser';
import {Base64} from 'js-base64';
let transform = prefixStyle('transform');
let transitionDuration = prefixStyle('transitionDuration');

export default {
  name: 'player',
  data() {
    return {
      songReady: false,
      currentTime: 0,
      radius: 32,
      currentLyric: {},
      currentLineNum: 0,
      currentShow: 'cd',
      playingLyric: '',
      notLyric: false
    };
  },
  created() {
    this.touch = {}; // middle部分触控记录
  },
  computed: {
    iconPlay() {
      return this.playing ? 'icon-pause' : 'icon-play';
    },
    mIconPlay() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini';
    },
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random';
    },
    rotate() {
      return this.playing ? 'play' : 'play pause';
    },
    percent() {
      return this.currentTime / this.currentSong.duration;
    },
    ...mapGetters([
      'fullScreen',
      'playlist',
      'sequenceList',
      'currentSong',
      'playing',
      'currentIndex',
      'mode'
    ])
  },
  watch: {
    songReady(newReady) {
      if (!newReady) return;
      let audio = this.$refs.audio;
      this.playing ? audio.play() : audio.pause();
      if (this.songReady) {
        this.songReady = false;
      };
    },
    currentSong(newSong) {
      this.playingLyric = '';
      this.currentLineNum = 0;
      this.currentLyric.stop && this.currentLyric.stop();
      if (newSong.lyric) { // 已经请求过歌词
        this.notLyric = false;
        this.currentLyric = new LyricParse(newSong.lyric, this.lyHandler);
        if (this.playing) {
          this.currentLyric.play();
        };
        return;
      };
      getLyric(newSong.mid).then((res) => { // 请求歌词并解码
        this.notLyric = false;
        let strLyric = Base64.decode(res);
        newSong.lyric = strLyric;
        this.currentLyric = new LyricParse(strLyric, this.lyHandler);
        if (this.playing) {
          this.currentLyric.play();
        };
      }).catch(() => {
        this.notLyric = true;
      });
    },
    currentLineNum(newNum) {
      if (newNum > 5) {
        this.$refs.lyricList.scrollToElement(this.$refs.lyricLine[newNum - 5], 1000);
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000);
      }
    }
  },
  methods: {
    lyHandler({lineNum, txt}) { // LyricParse回调
      this.currentLineNum = lineNum;
      this.playingLyric = txt;
    },
    // 歌词左右切换部分：middle-r 左右移动 middle-l 透明度变化
    middleTouchStart(e) {
      this.touch.startX = e.touches[0].pageX;
      this.touch.startY = e.touches[0].pageY;
      this.touch.initiated = true;
      this.touch.startOffset = this.currentShow === 'cd' ? 0 : -window.innerWidth;
      this.$refs.lyricList.$el.style[transitionDuration] = '';
      this.$refs.middleL.style[transitionDuration] = '';
    },
    middleTouchMove(e) {
      let disX = e.touches[0].pageX - this.touch.startX;
      let disY = e.touches[0].pageY - this.touch.startY;
      if (Math.abs(disY) > Math.abs(disX)) {
        return;
      };
      let targetOffset = disX + this.touch.startOffset;
      let opacity = targetOffset > 0 ? 1 : (window.innerWidth + targetOffset) / window.innerWidth * 1;
      this.touch.percent = disX / window.innerWidth;
      this.$refs.lyricList.$el.style[transform] = `translate3d(${targetOffset}px,0,0)`;
      this.$refs.middleL.style.opacity = opacity;
    },
    middleTouchEnd() {
      const time = 300;
      this.touch.initiated = false;
      let targetOffset;
      if (this.currentShow === 'cd') {
        targetOffset = this.touch.percent < -0.1 ? -window.innerWidth : 0;
      } else {
        targetOffset = this.touch.percent > 0.1 ? 0 : -window.innerWidth;
      }
      this.currentShow = targetOffset === 0 ? 'cd' : 'lyric';
      let opacity = this.currentShow === 'cd' ? '1' : '0';
      this.$refs.lyricList.$el.style[transform] = `translate3d(${targetOffset}px,0,0)`;
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`;
      this.$refs.middleL.style[transitionDuration] = `${time}ms`;
      this.$refs.middleL.style.opacity = opacity;
    },
    back() { // 后退
      this.setFullScreen(false);
    },
    open() { // 从mini-player呼出normal-player
      this.setFullScreen(true);
    },
    enter(el, done) {
      let cdWrapper = this.$refs.cdWrapper;
      let {x, y, scale} = this._getPosAndScale();
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      };
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      });
      animations.runAnimation(cdWrapper, 'move', done);
    },
    afterEnter() {
      animations.unregisterAnimation('move');
      this.$refs.cdWrapper.style.animation = '';
    },
    leave(el, done) {
      let {x, y, scale} = this._getPosAndScale();
      let cdWrapper = this.$refs.cdWrapper;
      cdWrapper.style.transition = 'all 0.4s';
      cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      cdWrapper.addEventListener('transitionend', done);
    },
    afterLeave() {
      let cdWrapper = this.$refs.cdWrapper;
      cdWrapper.style.transition = '';
      cdWrapper.style[transform] = '';
    },
    togglePlay() {
      this.songReady = true;
      this.setPlayingState(!this.playing);
      this.currentLyric && this.currentLyric.togglePlay();
    },
    next() {
      if (this.playlist.length === 1) {
        this.loop();
        return;
      };
      let index = this.currentIndex + 1;
      if (index === this.playlist.length) {
        index = 0;
      };
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.setPlayingState(true);
      };
    },
    changeMode() {
      let mode = (this.mode + 1) % 3;
      let list = this.sequenceList;
      if (mode === playMode.random) {
        list = shuffle(list);
      };
      let index = this.findIndex(list);
      this.setPlaylist(list);
      this.setCurrentIndex(index);
      this.setPlayMode(mode);
    },
    prev() {
      let index = this.currentIndex - 1;
      if (index === -1) {
        index = this.playlist.length - 1;
      };
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.setPlayingState(true);
      };
    },
    end() { // 播放结束后
      if (this.mode === playMode.loop) { 
        this.loop();
      } else {
        this.next();
      }
    },
    loop() { // 单曲循环
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      this.currentLyric && this.currentLyric.seek(0);
    },
    ready() {
      this.songReady = true;
    },
    error() {
      this.next();
    },
    updateTime(e) {
      this.currentTime = e.srcElement.currentTime;
    },
    percentChange(percent) {
      let audio = this.$refs.audio;
      let currentTime = this.currentSong.duration * percent;
      audio.currentTime = currentTime;
      if (!this.playing) {
        this.setPlayingState(true);
      };
      this.currentLyric && this.currentLyric.seek(currentTime * 1000);
    },
    formatTime(time) {
      time = time | 0;
      let min = time / 60 | 0;
      let sec = this._pad(time % 60);
      return `${min}:${sec}`;
    },
    findIndex(list) {
      let index = list.findIndex((item) => {
        return this.currentSong.id === item.id;
      });
      return index;
    },
    _pad(num, n = 2) {
      let len = num.toString().length;
      while (len < n) {
        num = '0' + num;
        len++;
      };
      return num;
    },
    _getPosAndScale() { // 获取cd 到 小cd 的距离和缩放比例
      let paddingLeft = 40;
      let paddingBottom = 30;
      let cdTop = 80;
      let tarWidth = 40;
      let cdWidth = window.innerWidth * 0.8;
      let x = -(window.innerWidth / 2 - paddingLeft);
      let y = window.innerHeight - cdTop - cdWidth / 2 - paddingBottom;
      let scale = tarWidth / cdWidth;
      return {x, y, scale};
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST'
    })
  },
  components: {
    Scroll,
    ProgressBar,
    ProgressCircle
  }
};
</script>
<style lang="less" scoped>
@import "~common/less/variable";
@import "~common/less/mixin";

.player{
  .normal-player{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: @color-background;
    .background{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }
    .top{
      position: relative;
      margin-bottom: 25px;
      .back{
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
        .icon-back{
          display: block;
          padding: 9px;
          font-size: @font-size-large-x;
          color: @color-theme;
          transform: rotate(-90deg);
        }
      }
      .title{
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        .no-wrap();
        font-size: @font-size-large;
        color: @color-text;
      }
      .subtitle{
        line-height: 20px;
        text-align: center;
        font-size: @font-size-medium;
        color: @color-text;
      }
    }
    .middle{
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l{
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper{
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;
          .cd{
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 10px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            &.play{
              animation: rotate 20s linear infinite;
            }
            &.pause{
              animation-play-state: paused;
            }
            .image{
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }
        .playing-lyric-wrapper{
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric{
            height: 20px;
            line-height: 20px;
            font-size: @font-size-medium;
            color: @color-text-l;
          }
        }
      }
      .middle-r{
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper{
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text{
            line-height: 32px;
            color: @color-text-l;
            font-size: @font-size-medium;
            &.current{
              color: @color-text;
            }
          }
        }
      }
    }
    .bottom{
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper{
        text-align: center;
        font-size: 0;
        .dot{
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: @color-text-l;
          &.active{
            width: 20px;
            border-radius: 5px;
            background: @color-text-ll;
          }
        }
      }
      .progress-wrapper{
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time{
          color: @color-text;
          font-size: @font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;
          &.time-l{
            text-align: left;
          }
          &.time-r{
            text-align: right;
          }
        }
        .progress-bar-wrapper{
          flex: 1;
        }
      }
      .operators{
        display: flex;
        align-items: center;
        .icon{
          flex: 1;
          color: @color-theme;
          &.disable{
            color: @color-theme-d;
          }
          i{
            font-size: 30px;
          }
        }
        .i-left{
          text-align: right;
        }
        .i-center{
          padding: 0 20px;
          text-align: center;
          i{
            font-size: 40px;
          }
        }
        .i-right{
          text-align: left;
        }
        .icon-favorite{
          color: @color-sub-theme;
        }
      }
    }  
    &.normal-enter-active, &.normal-leave-active{
      transition: all 0.4s;
      .top, .bottom{
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }
    &.normal-enter, &.normal-leave-to{
      opacity: 0;
      .top{
        transform: translate3d(0, -100px, 0);
      }
      .bottom{
        transform: translate3d(0, 100px, 0);
      }
    }
  }
  .mini-player{
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: @color-highlight-background;
    &.mini-enter-active, &.mini-leave-active{
      transition: all 0.4s;
    }
    &.mini-enter, &.mini-leave-to{
      opacity: 0;
    }
    .icon{
      flex: 0 0 40px;
      width: 40px;
      padding: 0 10px 0 20px;
      img{
        border-radius: 50%;
        &.play{
          animation: rotate 10s linear infinite;
        }
        &.pause{
          animation-play-state: paused;
        }
      }
    }
    .text{
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name{
        margin-bottom: 2px;
        .no-wrap();
        font-size: @font-size-medium;
        color: @color-text;
      }
      .desc{
        .no-wrap();
        font-size: @font-size-small;
        color: @color-text-d;
      }
    }
    .control{
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;
      .icon-play-mini, .icon-pause-mini, .icon-playlist{
        font-size: 30px;
        color: @color-theme-d;
      }
      .icon-mini{
        font-size: 32px;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}
@keyframes rotate{
  0%{
    transform: rotate(0);
  }
  100%{
    transform: rotate(360deg);
  }
}
</style>