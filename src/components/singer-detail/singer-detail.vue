<template>
  <transition name="slide">
    <music-list :title="singer.name" :bg-image="singer.avatar" :songs="songs"></music-list>
  </transition>
</template>
<script>
import {mapGetters} from 'vuex';
import {getSingerDetail} from 'api/singer';
import {createSong} from 'common/js/songFactory';
import {processSongsUrl} from 'api/handlesongurl';
import {ERR_OK} from 'api/config';
import musicList from 'components/music-list/music-list';
export default {
  name: 'singer-detail',
  data() {
    return {
      songs: []
    };
  },
  components: {
    musicList
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
.slide-enter-active,.slide-leave-active{
  transition: all .4s;
}
.slide-enter,.slide-leave-to{
  transform: translate3d(100%,0,0);
}
</style>