<template>
  <div ref="scrollWrap">
    <slot></slot>
  </div>
</template>
<script>
import BScroll from 'better-scroll';
export default {
  props:{
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
    },
    enable() {
      this.scroll && this.scroll.enable();
    },
    disable() {
      this.scroll && this.scroll.disable();
    },
    refresh() {
      this.scroll && this.scroll.refresh();
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