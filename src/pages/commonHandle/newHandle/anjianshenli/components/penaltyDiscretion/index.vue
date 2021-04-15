<template>
  <div class="penalty_discretion" v-loading="loading">
    <div class="create-tab-title">处罚裁量</div>
    <div v-if="!isDetailAvailable && !critComponent" style="margin-top: 16px;">
      <el-button
        type="primary"
        size="mini"
        class="penalty_button"
        v-if="!forBrowse"
        @click="setCritComponent('editBox')"
      >制作处罚裁量</el-button>
      <sn-empty-data text="暂无处罚裁量"></sn-empty-data>
    </div>
    <component
      :crit="crit"
      v-on="$listeners"
      :forBrowse="forBrowse"
      @getCrit="initPuniCritInfo"
      @afterDelete="initPuniCritInfo"
      v-if="!!critComponent"
      :is="critComponent"
    ></component>
  </div>
</template>
<script>
import snEmptyData from "@/components/snEmptyData";
import editBox from "./edit"; // 编辑
import { mapState } from "vuex";
import saveBox from "./saveTrue"; // 保存
import { getCriteria } from "@api/anjianshenli";
export default {
  name: "penaltyDiscretionIndex",
  components: {
    editBox,
    snEmptyData,
    saveBox
  },
  props: {
    forBrowse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isDetailAvailable: false, // 是否已制造处罚裁量
      task: [], // 案件审理的待办事项
      crit: {}, // 处罚裁量记录
      critComponent: "",
      loading: true
    };
  },
  created() {
    this.initPuniCritInfo();
  },
  methods: {
    initPuniCritInfo() {
      let req = {
        laDiscretionId: "",
        penaltyId: this.$store.state.penalty.penaltyUndEntity.penaltyId
      };
      getCriteria(req)
        .then(res => {
          this.crit = res.data;
          console.info('index', this.crit)
          if (this.crit.laDiscretionEntity.laDiscretionId) {
            this.critComponent = "saveBox";
            this.isDetailAvailable = true;
          } else {
            this.critComponent = "";
            this.isDetailAvailable = false;
          }
          this.loading = false;
        })
        .catch(err => console.info(err));
    },
    setCritComponent(val) {
      this.critComponent = val;
    }
  }
};
</script>
<style lang="less" scope>
.penalty_button {
  height: 28px;
  padding: 7px 8px;
  margin-left: 0;
  background: rgba(0, 153, 255, 1);
}

</style>
