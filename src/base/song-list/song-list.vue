<template>
  <div class="song-list">
    <ul>
      <li @click="selectItem(song, index)" class="item" v-for="(song, index) in songs" :key="index">
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{song.singer}}·{{song.album}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'song-list',
  props: {
    songs: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },
  methods: {
    selectItem(song, index) {
      this.$emit('select', song, index);
    }
  }
};
</script>
<style lang="less" scoped>
@import "~common/less/variable";
@import "~common/less/mixin";

.song-list{
  .item{
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: @font-size-medium;
    .content{
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name{
        .no-wrap();
        color: @color-text;
      }
      .desc{
        .no-wrap();
        margin-top: 4px;
        color: @color-text-d;
      }
    }
  }
}
</style>