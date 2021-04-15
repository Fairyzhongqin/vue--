<template>
  <div>
    <component :is="currTempComp"></component>
  </div>
</template>

<script>
import dataTable from "./dataTable/index"
import templateDetail from "./templateDetail/index"
import { mapState } from "vuex";

export default {
  name:"inspectionTemplate",
  components: {
    dataTable,
    templateDetail
  },
  data() {
    return {
    };
  },
  activated() {
    this.$store.commit("switchInspTemplate", "dataTable");
  },
  methods: {
  },
  computed: {
  ...mapState(["currTempComp"])
  }
};
</script>

<style lang="less" scoped>
</style>
