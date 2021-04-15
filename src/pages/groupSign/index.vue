<template>
  <div>
    <component :is="currGroupComp" :info="info" @commitItemInfo="commitItemInfo"></component>
  </div>
</template>

<script>
import { mapState } from "vuex";
import dataDisplay from './dataDisplay'
import sign from './sign';

export default {
  name:"groupSign",
  components: {
    dataDisplay,
    sign
  },
  data() {
    return {
      info: {}
    };
  },
  methods: {
    // 从列表组件传值
    commitItemInfo(info) {
      this.info = info
    }
  },
  computed: {
    ...mapState(['currGroupComp'])
  }
};
</script>

<style lang="less" scoped>
</style>
