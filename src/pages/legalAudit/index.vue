<template>
  <div>
    <component :is="currentAuditComponent" :info="info" @commitItemInfo="commitItemInfo"></component>
  </div>
</template>

<script>
import { mapState } from "vuex";
import dataDisplay from './dataDisplay'
import audit from './audit';

export default {
  name:"legalAudit",
  components: {
    dataDisplay,
    audit
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
    ...mapState(['currentAuditComponent'])
  },
  watch: {
    $route(to, from) {
      
      if (to.path === "/doneAudit" || to.path === "/todoAudit") {
        this.$store.commit("setCurrentAuditComponent", "dataDisplay");
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>
