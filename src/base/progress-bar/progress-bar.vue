<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div 
        class="progress-btn-wrapper" 
        ref="progressBtn"
        @touchstart="startHandler"
        @touchmove="moveHandler"
        @touchend="endHandler"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {prefixStyle} from 'common/js/dom';
let transform = prefixStyle('transform');
  const BALL_WIDTH = 16;
  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.touch = {};
    },
    data() {
      return {};
    },
    watch: {
      percent(newPer) {
        if (this.touch.initiated) return; // 正在拖动进度条
        let barWidth = this.$refs.progressBar.clientWidth - BALL_WIDTH;
        let offsetWidth = barWidth * this.percent;
        this._setOffset(offsetWidth);
      }
    },
    methods: {
      startHandler(e) {
        this.touch.initiated = true;
        this.touch.startX = e.touches[0].pageX;
        this.touch.StartLeft = this.$refs.progress.clientWidth;
      },
      moveHandler(e) {
        if (!this.touch.initiated) return;
        let disX = e.touches[0].pageX - this.touch.startX;
        let barWidth = this.$refs.progressBar.clientWidth - BALL_WIDTH;
        let offsetLeft = Math.min(Math.max(disX + this.touch.StartLeft, 0), barWidth);
        this._setOffset(offsetLeft);
      },
      endHandler() {
        this.touch.initiated = false;
        this._trrigerPercent();
      },
      progressClick(e) {
        let rectLeft = this.$refs.progressBar.getBoundingClientRect().left;
        let offsetWidth = e.pageX - rectLeft;
        this._setOffset(offsetWidth);
        this._trrigerPercent();
      },
      _setOffset(offsetWidth) {
        this.$refs.progress.style.width = offsetWidth + 'px';
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
      },
      _trrigerPercent() { // 进度条变化 派发事件
        let barWidth = this.$refs.progressBar.clientWidth - BALL_WIDTH;
        let percent = this.$refs.progress.clientWidth / barWidth;
        this.$emit('percent-change', percent);
      }
    }
  };
</script>

<style scoped lang="less">
  @import "~common/less/variable";

  .progress-bar{
    height: 30px;
    .bar-inner{
      position: relative;
      top: 13px;
      height: 4px;
      background: rgba(0, 0, 0, 0.3);
      .progress{
        position: absolute;
        height: 100%;
        background: @color-theme;
      }
      .progress-btn-wrapper{
        position: absolute;
        left: -8px;
        top: -13px;
        width: 30px;
        height: 30px;
        .progress-btn{
          position: relative;
          top: 7px;
          left: 7px;
          box-sizing: border-box;
          width: 16px;
          height: 16px;
          border: 3px solid @color-text;
          border-radius: 50%;
          background: @color-theme;
        }
      }
    }
  }
</style>