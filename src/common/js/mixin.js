import {mapGetters, mapMutations, mapActions} from 'vuex';
import {playMode} from 'common/js/config';
import {shuffle} from 'common/js/utils';

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

export const playerMixin = {
  computed: {
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random';
    },
    ...mapGetters([
      'mode',
      'sequenceList'
    ])
  },
  methods: {
    changeMode() {
      let mode = (this.mode + 1) % 3;
      let list = this.sequenceList;
      if (mode === playMode.random) {
        list = shuffle(list);
      };
      let index = this.findIndex(list);
      this.setPlaylist(list);
      this.setCurrentIndex(index);
      this.setPlayMode(mode);
    },
    findIndex(list) {
      let index = list.findIndex((item) => {
        return this.currentSong.id === item.id;
      });
      return index;
    },
    ...mapMutations({
      setPlaylist: 'SET_PLAYLIST',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE'
    })
  }
};

export const searchMixin = {
  data() {
    return {
      query: ''
    };
  },
  methods: {
    onQueryChange(query) { // 搜索框query变化
      this.query = query;
    },
    addKey(key) { // 填充 搜索框
      this.$refs.searchBox.fillInput(key);
    },
    blurInput() { // 滚动前搜索框失去焦点 收起键盘
      this.$refs.searchBox.blur();
    },
    deleteOneSearch(item) { // 删除某条搜索记录
      this.deleteSearchHistory(item);
    },
    saveSearch() { // 保存搜索历史
      this.saveSearchHistory(this.query);
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  },
  computed: {
    ...mapGetters(['searchHistory'])
  }
};
