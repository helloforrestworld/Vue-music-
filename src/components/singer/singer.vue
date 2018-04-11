<template>
  <div class="singer">
    我是singer
  </div>
</template>
<script>
import {getSingerList} from 'api/singer';
import {ERR_OK} from 'api/config';
export default {
  name: 'singer',
  data() {
    return {
      singers: []
    };
  },
  created() {
    this._getSingerList();
  },
  methods: {
    _getSingerList() {
      getSingerList().then((res) => {
        if (ERR_OK === res.code) {
          this.singers = res.data.list;
          console.log(this.singers);
        };
      });
    }
  }
};
</script>
<style lang="less" scoped>
</style>