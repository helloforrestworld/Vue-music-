<template>
  <div id="app">
    <mHeader></mHeader>
    <tab></tab>
    <keep-alive>
      <router-view/>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import mHeader from 'components/m-header/m-header';
import Tab from 'components/tab/tab';
import Player from 'components/player/player';
export default {
  name: 'App',
  components: {
    mHeader,
    Tab,
    Player
  }
};
</script>

<style lang="less" rel="stylesheet/less">
@import '~common/less/variable';
</style>
