<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="input" v-model="query" class="box" :placeholder="placeholder">
    <i @click="clear" class="icon-dismiss" v-show="query"></i>
  </div>
</template>
<script>
import {debounce} from 'common/js/utils';
export default {
  name: 'search-box',
  data() {
    return {
      query: ''
    };
  },
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  methods: {
    fillInput(key) { // 修改搜索框内容
      this.query = key;
    },
    clear() {
      this.query = '';
    },
    blur() {
      this.$refs.input.blur();
    }
  },
  created() {
    this.$watch('query', debounce((newQuery) => { // query变化 派发query事件 
      this.$emit('query', newQuery);
    }, 200));
  }
};
</script>
<style lang="less" scoped>
@import "~common/less/variable";

.search-box{
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 40px;
  background: @color-highlight-background;
  border-radius: 6px;
  .icon-search{
    font-size: 24px;
    color: @color-background;
  }
  .box{
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: @color-highlight-background;
    color: @color-text;
    font-size: @font-size-medium;
    outline-color: gold;
    &::placeholder{
      color: @color-text-d;
    }
  }
  .icon-dismiss{
    font-size: 16px;
    color: @color-background;
  }
}
</style>