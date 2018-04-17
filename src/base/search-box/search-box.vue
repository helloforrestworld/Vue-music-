<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box">
    <i class="icon-dismiss"></i>
  </div>
</template>
<script>
export default {
  name: 'search-box',
  data() {
    return {};
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
    background: $color-highlight-background;
    color: @color-text;
    font-size: @font-size-medium;
    &::placeholder
      color: @color-text-d;
  }
  .icon-dismiss{
    font-size: 16px
    color: @color-background
  }
}
</style>