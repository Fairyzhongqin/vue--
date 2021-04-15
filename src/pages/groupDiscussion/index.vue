<template>
  <div>
    <component :is="currDiscussionComp" @commitItemInfo="commitItemInfo" :itemInfo="itemInfo"></component>
  </div>
</template>

<script>
import { mapState } from "vuex";
import dataDisplay from './dataDisplay'
import record from './record';

export default {
  components: {
    dataDisplay,
    record
  },
  data() {
    return {
      itemInfo: {}
    };
  },
  methods: {
    commitItemInfo(val){
      this.itemInfo = val
    }
  },
  computed: {
    ...mapState(['currDiscussionComp'])
  },
  watch: {
    '$route': {
      handler: function(n, o) {
        this.$store.commit('setCurrDiscussionComp', 'dataDisplay')
      },
      immediate: true
    }
  }
};
</script>

<style lang="less" scoped>
</style>
