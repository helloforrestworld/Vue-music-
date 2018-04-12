<template>
  <scroll
      :data="data"
      class="listview"
      ref="listview"
      :probe-type="probeType"
      :listen-scroll="listenScroll"
      @scroll="scroll"
  >
    <ul>
      <li class="list-group" v-for="(group, index) in data" :key="index" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li
            class="list-group-item"
            v-for="(item, index) in group.items"
            :key="index"
            @click="selected(item)"
          >
            <img v-lazy="item.avatar" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <ul class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.prevent="onShortcutTouchMove">
      <li class="item" v-for="(item, index) in shortcutList" :data-index="index" :key="index" :class="{'current': index === currentIndex}">{{item}}</li>
    </ul>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>
<script>
import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';
import {getData} from 'common/js/dom';
const SHORTCUT_HEIGHT = 18; // 右导航子元素高度
const FIX_HEIGHT = 30; // 列表头不高度
export default {
  name: 'list',
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  created() {
    this.touch = {}; // 记录touchstart move坐标
    this.probeType = 3;
    this.listenScroll = true;
    this.listHeight = [];
  },
  data() {
    return {
      currentIndex: 0,
      scrollY: -1,
      diff: -1
    };
  },
  computed: {
    shortcutList() {
      let ret = [];
      ret = this.data.map((item) => {
        return item.title.substr(0, 1);
      });
      return ret;
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return '';
      };
      return this.data.length && this.data[this.currentIndex].title;
    }
  },
  components: {
    Scroll,
    Loading
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight();
      }, 20);
    },
    scrollY(newY) {
      let listHeight = this.listHeight;
      // 在顶部往上拉
      if (newY > 0) {
        this.currentIndex = 0;
        return;
      };
      // 中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];
        if (height2 && (-newY >= height1 && -newY < height2)) {
          this.currentIndex = i;
          this.diff = height2 + newY;
          return;
        }
      };
      // 在底部往上提
      this.currentIndex = listHeight.length - 2;
    },
    diff(newVal) {
      let fixedTop = newVal > 0 && newVal < FIX_HEIGHT ? newVal - FIX_HEIGHT : 0;
      if (this.fixedTop === fixedTop) { // 优化: 减少DOM操作
        return;
      };
      this.fixedTop = fixedTop;
      this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`;
    }
  },
  methods: {
    onShortcutTouchStart(e) {
      let index = getData(e.target, 'index') | 0;
      let firstTouch = e.changedTouches[0];
      this.touch.startY = firstTouch.pageY;
      this.touch.index = index;
      this._scrollTo(this.touch.index);
    },
    onShortcutTouchMove(e) {
      let thisTouch = e.changedTouches[0];
      let moveY = thisTouch.pageY;
      let disIndex = (moveY - this.touch.startY) / SHORTCUT_HEIGHT | 0;
      let anchorIndex = parseInt(this.touch.index) + disIndex;
      this._scrollTo(anchorIndex);
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    selected(item) {
      this.$emit('selected', item);
    },
    _scrollTo(index) {
      if (!index && index !== 0) return;
      if (index < 0) index = 0;
      this.scrollY = -this.listHeight[index];
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
    },
    _calculateHeight() {
      let height = 0;
      let listGroup = this.$refs.listGroup;
      this.listHeight.push(height);
      for (let i = 0; i < listGroup.length; i++) {
        let clientHeight = listGroup[i].clientHeight;
        height += clientHeight;
        this.listHeight.push(height);
      };
    }
  }
};
</script>
<style lang="less" scoped>
@import "~common/less/variable";
.listview{
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: @color-background;
  .list-group{
    padding-bottom: 30px;
    .list-group-title{
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: @font-size-small;
      color: @color-text-l;
      background: @color-highlight-background;
    }
    .list-group-item{
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;
      .avatar{
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .name{
        margin-left: 20px;
        color: @color-text-l;
        font-size: @font-size-medium;
      }
    }
  }
  .list-shortcut{
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: @color-background-d;
    font-family: Helvetica;
    .item{
      padding: 3px;
      line-height: 1;
      color: @color-text-l;
      font-size: @font-size-small;
      &.current{
        color: @color-theme;
      }
    }
  }
  .list-fixed{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    .fixed-title{
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: @font-size-small;
      color: @color-text-l;
      background: @color-highlight-background;
    }
  }
  .loading-container{
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>