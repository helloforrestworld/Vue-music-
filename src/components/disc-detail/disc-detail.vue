<template>
  <transition name="slide">
    <music-list :title="disc.dissname" :bg-image="disc.imgurl" :songs="songs"></music-list>
  </transition>
</template>
<script>
import MusicList from 'components/music-list/music-list';
import {getSongList} from 'api/recommend';
import {ERR_OK} from 'api/config';
import {createSong} from 'common/js/songFactory';
import {mapGetters} from 'vuex';
import {processSongsUrl} from 'api/handlesongurl';
export default {
  name: 'disc-detail',
  data() {
    return {
      songs: []
    };
  },
  created() {
    this._getDiscDetail();
    if (!this.disc.dissid) {
      this.$router.push('/recommend');
    }
  },
  components: {
    MusicList
  },
  computed: {
    ...mapGetters(['disc'])
  },
  methods: {
    _getDiscDetail() {
      getSongList(this.disc.dissid).then((res) => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.cdlist[0].songlist)).then((songs) => {
            this.songs = songs;
          });
        };
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach((item) => {
        if (item.songmid) {
          ret.push(createSong(item));
        };
      });
      return ret;
    }
  }
};
</script>
<style lang="less" scoped>
.slide-enter-active, .slide-leave-active{
  transition: all 0.3s;
}
.slide-enter, .slide-leave-to{
  transform: translate3d(100%, 0, 0);
}
</style>