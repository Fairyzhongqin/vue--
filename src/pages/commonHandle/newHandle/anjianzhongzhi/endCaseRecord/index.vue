<template>
  <div class="delay_layout">
    <div class="main_lay">
      <div class="create-tab-title" :class="{'small': componentId === 'finishPage'}">案件终止记录单</div>
      <div class="lay" v-if="!componentId">
        <el-button
          v-if="!forBrowse"
          type="primary"
          class="penalty-small_button"
          size="mini"
          @click="pageChange('makePage')"
        >制作案件终止记录单</el-button>
        <snEmptyData text="暂无案件终止记录单" v-if="!componentId" type="type1"></snEmptyData>
      </div>
    </div>
    <component
      :is="componentId"
      :source="source"
      :forBrowse="forBrowse"
      @pageChange="pageChange"
      :writInfo="writInfo"
      :currWritId="currWritId"
    ></component>
  </div>
</template>
<script>
import mainPage from "./components/mainPage";
import makePage from "./components/makePage";
import finishPage from "./components/finishPage";
import snEmptyData from "@/components/snEmptyData";
import { getWritInfo } from "@api/fileRelated";

export default {
  name: "anjianzhongzhi",
  components: {
    mainPage,
    makePage,
    finishPage,
    snEmptyData
  },
  props: {
    forBrowse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      componentId: "",
      source: false,
      currWritId: "",
      writInfo: {},
      penalty: {}
    };
  },
  created() {
    this.initStatus();
    //当案件结案之后  按钮不能操作
    this.initButton();
  },
  methods: {
    initButton(){
      //如果已经结案了  结案时间不为空
      if(this.$store.state.penalty.penaltyUndEntity.caseEndTime){
        this.forBrowse = true;
      }
    },
    initStatus(type) {
      this.penalty = this.$store.state.penalty;
      let req = {
        sourceId: this.penalty.penaltyUndEntity.penaltyId,
        type: "AJCXJLD"
      };
      getWritInfo(req).then(res => {
        this.currWritId = res.data[0] ? res.data[0].writId : "";
        this.writInfo = res.data[0];

        if (this.currWritId) {
          if (type === "afterCreated") {
            this.source = true;
          } else {
            this.source = false;
          }
          this.componentId = "finishPage";
        } else {
          this.componentId = "";
        }
      });
    },
    pageChange(val) {
      this.componentId = val;
    },
    getWritId(req, type) {}
  }
};
</script>

<style lang="less" scoped>
.small {
  width: calc(66.5%);
}
.lay {
  margin-top: 16px;
}
</style>
