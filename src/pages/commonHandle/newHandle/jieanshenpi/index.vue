<template>
  <div class="delay_layout">
    <component
      :is="componentId"
      ref="isModify"
      v-bind="$attrs"
      @pageChange="pageChange"
      @sourceFalse="source=false"
      :writInfo="writInfo"
      :currWritId="currWritId"
      :source="source"
    ></component>
  </div>
</template>
<script>
import mainPage from "./components/mainPage";
import makePage from "./components/makePage";
import finishPage from "./components/finishPage";
import { getWritInfo } from "@api/fileRelated";

export default {
  name: 'jieanshenpi',
  components: {
    mainPage,
    makePage,
    finishPage
  },
  data() {
    return {
      componentId: "",
      currWritId: "",
      writInfo: {},
      showWrit: false,
      source: false
    };
  },
  created() {
    this.initStatus();
  },
  methods: {
    initStatus(type) {
      let _penalty = this.$store.state.penalty;
      let req = {
        sourceId: _penalty.penaltyUndEntity.penaltyId,
        type: "JASPB"
      };
      getWritInfo(req).then(res => {
        this.currWritId = res.data[0] ? res.data[0].writId : "";
        this.writInfo = res.data[0];
        if (this.currWritId) {
          if (type === 'afterCreated') {
            this.source = true
          } else {
            this.source = false
          }
          this.componentId = "finishPage";
        } else {
          this.componentId = "mainPage";
        }
      });
    },
    pageChange(val, showWrit, type) {
      this.componentId = val;
      if (showWrit) {
        this.showWrit = true;
      }
      if (type === "modify") {
        this.$nextTick(() => {
          this.$refs.isModify.echo();
        });
      }
    },
    getWritId(req) {}
  }
};
</script>

<style lang="less" scoped>
</style>