<template>
  <div class="search-list" v-show="searches.length">
    <transition-group name="list" tag="ul">
      <li @click="select(item)" class="search-item" v-for="item in searches" :key="item">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      searches: {
        type: Array,
        default: () => []
      }
    },
    methods: {
      deleteOne(item) {
        this.$emit('delete', item);
      },
      select(item) {
        this.$emit('select', item);
      }
    }
  };
</script>

<style scoped lang="less" rel="stylesheet/less">
  @import "~common/less/variable";
  @import "~common/less/mixin";

  .search-list{
    .search-item{
      &.list-enter-active, &.list-leave-active{
        transition: 0.1s all linear;
      }
      &.list-enter, &.list-leave-to{
        height: 0;
      }
      display: flex;
      align-items: center;
      height: 40px;
      .text{
        flex: 1;
        color: @color-text-l;
      }
      .icon{
        .extend-click();
        .icon-delete{
          font-size: @font-size-small;
          color: @color-text-d;
        }
      }
    }
  }
</style>