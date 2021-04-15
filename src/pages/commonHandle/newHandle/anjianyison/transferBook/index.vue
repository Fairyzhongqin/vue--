<template>
  <div>
    <div class="create-tab-title" :class="{'small': componentId === 'finishBox'}">案件移送书</div>
    <div v-if="!isDetailAvailable && !componentId && !forBrowse" style="margin-top: 16px;">
      <el-button
        class="penalty-small_button"
        type="primary"
        size="mini"
        @click="createTransWrit"
      >制作案件移送书</el-button>
    </div>
    <snEmptyData v-if="!isDetailAvailable && !componentId" text="暂无案件移送书" type="type1"></snEmptyData>
    <component :is="componentId" :forBrowse="forBrowse" :source="source" :writInfo="writInfo"></component>
    <penalty-upload :sourceType="'AJYSS'" :btnText="'案件移送材料'" :forBrowse="forBrowse"></penalty-upload>
  </div>
</template>
<script>
import snEmptyData from "@/components/snEmptyData";
import editBox from "./editBox";
import finishBox from "./finishBox";
import { getWritInfo } from "@api/fileRelated";
import penaltyUpload from '@/pages/commonHandle/components/penaltyUpload.vue'

export default {
  name: 'transferBookIndex',
  components: {
    editBox,
    finishBox,
    snEmptyData,
    penaltyUpload
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
      source: false, // 是否新增成功后跳转
      isDetailAvailable: false // 是否已制作过案件移送书
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
        type: "AJYSS"
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
    createTransWrit() {
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
</style>
