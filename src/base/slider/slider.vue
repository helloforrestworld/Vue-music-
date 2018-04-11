<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(dot, index) in dots" :key="index" :class="{'active': currentPageIndex === index}"></span>
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll';
import {addClass} from 'common/js/dom';
export default {
  name: 'slider',
  props: {
    loop: { // 是否循环无缝
      type: Boolean,
      default: true
    },
    autoPlay: { // 是否自动播放
      type: Boolean,
      default: true
    },
    interval: { // 自动播放间隔
      type: Number,
      default: 4000
    }
  },
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    };
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth();
      this._initDots();
      this._initSlider();
      if (this.autoPlay) {
        this._autoPlay();
      };
    }, 20);
    window.addEventListener('resize', () => {
      if (!this.slider) return;
      this._setSliderWidth(true);
      this.slider.refresh();
    }, false);
  },
  activated() {
    // 缓存后再次进入
    if (this.autoPlay) {
      this._autoPlay();
    };
  },
  deactivated() {
    clearTimeout(this.timer);
  },
  methods: {
    _setSliderWidth(isResize) { // 初始化幻灯片和容器宽度
      this.children = this.$refs.sliderGroup.children;
      let slideWidth = this.$refs.slider.clientWidth;
      let width = 0;
      for (let i = 0; i < this.children.length; i++) {
        this.children[i].style.width = slideWidth + 'px';
        addClass(this.children[i], 'slider-item');
        width += slideWidth;
      };
      if (this.loop && !isResize) {
       width += slideWidth * 2;
      };
      this.$refs.sliderGroup.style.width = width + 'px';
    },
    _initDots() { // 初始化导航点
      this.dots = new Array(this.children.length);
    },
    _initSlider() { // better-scroll 初始化
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        }
      });
      this.slider.on('scrollEnd', () => {
        this.currentPageIndex = this.slider.getCurrentPage().pageX;
        this._autoPlay();
      });
      this.slider.on('beforeScrollStart', () => {
        clearTimeout(this.timer);
      });
    },
    _autoPlay() { // 自动播放
      if (this.autoPlay) {
        this.timer = setTimeout(() => {
          this.slider.next();
        }, this.interval);
      };
    }
  }
};
</script>
<style lang="less" scoped>
@import '~common/less/variable';
.slider{
  min-height: 1px;
  width: 100%;
  .slider-group{
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    .slider-item{
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;
      a{
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
        img{
          display: block;
          width: 100%;
        }
      }
    }
  }
  .dots{
    position: absolute;
    right: 0;
    left: 0;
    bottom: 12px;
    text-align: center;
    font-size: 0;
    .dot{
      display: inline-block;
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
}
</style>