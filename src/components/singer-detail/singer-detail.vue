<template>
  <transition name="slide">
    <div class="singer-detail">
      我是singerDetail
    </div>
  </transition>
</template>
<script>
import {mapGetters} from 'vuex';
import {getSingerDetail} from 'api/singer';
import {createSong, processSongsUrl} from 'common/js/songFactory';
import {ERR_OK} from 'api/config';
export default {
  name: 'singer-detail',
  data() {
    return {
      songs: []
    };
  },
  created() {
    this._getDetail();
  },
  computed: {
    ...mapGetters(['singer'])
  },
  methods: {
    _getDetail() { // 获取歌手详情
      if (!this.singer.id) { // 在当前页面刷新
        this.$router.push('/singer');
      };
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.data.list)).then((songs) => {
            this.songs = songs;
            console.log(this.songs);
          });
        };
      });
    },
    _normalizeSongs(lists) { // 格式化歌曲数据
      let ret = [];
      lists.forEach((item) => {
        ret.push(createSong(item.musicData));
      });
      return ret;
    }
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