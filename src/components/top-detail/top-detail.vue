<template>
  <transition name="slide">
    <music-list :rank="true" :title="top.topTitle" :bg-image="topImg" :songs="songs"></music-list>
  </transition>
</template>
<script>
import MusicList from 'components/music-list/music-list';
import {getMusicList} from 'api/rank';
import {createSong} from 'common/js/songFactory';
import {processSongsUrl} from 'api/handlesongurl';
import {ERR_OK} from 'api/config';
import {mapGetters} from 'vuex';
export default {
  name: 'top-detail',
  data() {
    return {
      songs: []
    };
  },
  created() {
    if (!this.top.id && this.top.id !== 0) {
      this.$router.push('/rank');
    };
    this._getMusicList();
  },
  components: {
    MusicList
  },
  computed: {
    topImg() { // 返回列表第一张图
      if (this.songs.length) {
        return this.songs[0].image;
      } else {
        return '';
      }
    },
    ...mapGetters([
      'top'
    ])
  },
  methods: {
    _getMusicList() {
      getMusicList(this.top.id).then((res) => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.songlist)).then((res) => {
            this.songs = res;
          });
        }
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach((item) => {
        if (item.data.albumid && item.data.songid) {
          ret.push(createSong(item.data));
        };
      });
      return ret;
    }
  }
};
</script>
<style lang="less" scoped>
.slide-enter-active, .slide-leave-active{
  transition: all 0.3s ease;
}
.slide-enter, .slide-leave-to{
  transform: translate3d(100%, 0, 0);
}
</style>