<template>
  <div class="approvalForm">
    <div class="create-tab-title" :class="{'small': componentId === 'finishBox'}">案件移送审批表</div>
    <div v-if="!isDetailAvailable && !componentId && !forBrowse" style="margin-top: 16px;">
      <el-button
        class="approvalForm_button"
        type="primary"
        size="mini"
        @click="createTransAuditWrit"
      >制作案件移送审批表</el-button>
    </div>
    <snEmptyData v-if="!isDetailAvailable && !componentId" text="暂无案件移送审批表" type="type1"></snEmptyData>

    <component :is="componentId" :forBrowse="forBrowse" :writInfo="writInfo" :source="source" v-if="!!componentId"></component>
  </div>
</template>
<script>
import snEmptyData from "@/components/snEmptyData";
import editBox from "./editBox";
import finishBox from "./finishBox";
import { getWritInfo } from "@api/fileRelated";

export default {
  name: "approvalFormIndex",
  components: {
    editBox,
    finishBox,
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
      writInfo: {},
      source: false,
      isDetailAvailable: false // 是否已制作过案件移送审批表
    };
  },
  created() {
    this.initInfo();
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
    initInfo(type) {
      let req = {
        sourceId: this.$store.state.penalty.penaltyUndEntity.penaltyId,
        type: "AJYSSPB"
      };
      getWritInfo(req).then(
        res => {
          this.writInfo = res.data[0];
          if (this.writInfo) {
            if (type === 'afterCreated') {
              this.source = true
            } else {
              this.source = false
            }
            this.componentId = "finishBox";
          } else {
            this.componentId = "";
          }
        },
        err => console.info(err)
      );
    },
    createTransAuditWrit() {
      this.componentId = "editBox";
    },
    setComponentId(val) {
      this.componentId = val;
    }
  }
};
</script>

<style lang="less" scope>
.small {
  width: calc(61.5%);
}
.approvalForm {
  .approvalForm_button {
    height: 28px;
    padding: 7px 8px;
    margin-left: 0;
    background: rgba(0, 153, 255, 1);
  }
}
</style>
