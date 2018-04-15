import {mapGetters} from 'vuex';
export const playlistMixin = {
  computed: {
    ...mapGetters(['playlist'])
  },
  mounted() {
    this.playlistHandler(this.playlist);
  },
  activated() {
    this.playlistHandler(this.playlist);
  },
  watch: {
    playlist(newPlaylist) {
      this.playlistHandler(newPlaylist);
    }
  },
  methods: {
    playlistHandler(playlist) {
      throw new Error('a playlistHandler must be implyed [mixin.js]');
    }
  }
};