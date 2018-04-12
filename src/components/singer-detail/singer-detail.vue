<template>
  <transition name="slide">
    <div class="singer-detail">
      我是singerDetail
    </div>
  </transition>
</template>
<script>
import {mapGetters} from 'vuex';
export default {
  name: 'singer-detail',
  data() {
    return {};
  },
  created() {
    console.log(this.singer);
  },
  computed: {
    ...mapGetters(['singer'])
  }
};
</script>
<style lang="less" scoped>
@import '~common/less/variable';
  .singer-detail{
    position: fixed;
    z-index: 300;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: @color-background;
  }
  .slide-enter-active,.slide-leave-active{
    transition: all 0.3s;
  }
  .slide-enter,.slide-leave-to{
    transform: translate3d(100%,0,0);
  }
</style>