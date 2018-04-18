<template>
  <div ref="scrollWrap">
    <slot></slot>
  </div>
</template>
<script>
import BScroll from 'better-scroll';
export default {
  props: {
    probeType: { // 滚动监听的阈值
      type: Number,
      default: 1
    },
    click: { // 是否能点击
      type: Boolean,
      default: true
    },
    data: { // 外面用到的数据 用于监听变化 refresh better-scroll
      type: [Array, Object],
      default: null
    },
    listenScroll: { // 是否监听滚动
      type: Boolean,
      default: false
    },
    pullup: { // 是否上滑加载
      type: Boolean,
      default: false
    },
    scrollBefore: { // 监听滚动开始前
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  mounted() {
    setTimeout(() => {
      this._initScroll();
    }, 20);
  },
  methods: {
    _initScroll() {
      let scrollWrap = this.$refs.scrollWrap;
      if (!scrollWrap) return;
      this.scroll = new BScroll(scrollWrap, {
        probeType: this.probeType,
        click: this.click
      });
      if (this.listenScroll) {
        let _this = this;
        this.scroll.on('scroll', (pos) => {
          _this.$emit('scroll', pos);
        });
      };
      if (this.pullup) {
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            this.$emit('scrollToEnd');
          };
        });
      };
      if (this.scrollBefore) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('scrollBefore');
        });
      }
    },
    enable() {
      this.scroll && this.scroll.enable();
    },
    disable() {
      this.scroll && this.scroll.disable();
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh();
      }, 20);
    }
  }
};
</script>
<style lang="less" scoped>
</style>