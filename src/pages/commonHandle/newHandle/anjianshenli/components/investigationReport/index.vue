<template>
  <div v-loading="loading">
    <div class="create-tab-title">案件调查报告</div>
    <div v-if="!isDetailAvailable && !reportComponent" style="margin-top: 16px;">
      <el-button
            class="penalty-small_button"
            type="primary"
            size="mini"
            v-if="!forBrowse"
            @click="createCaseReport"
          >制作案件调查报告</el-button>
      <sn-empty-data text="暂无案件调查报告"></sn-empty-data>

    </div>
    <component :critInfo="critInfo" :source="source" :report="invesReportInfo" :forBrowse="forBrowse" v-on="$listeners" :is="reportComponent"></component>
    
    <penalty-upload :sourceType="'XZCFAJDCBG'" :btnText="'案件附件'" :forBrowse="forBrowse"></penalty-upload>
  </div>
</template>
<script>
import penaltyUpload from "@/pages/commonHandle/components/penaltyUpload.vue";
import editBox from './edit'; // 制作调查报告书
import lookBox from './lookDetail'; // 浏览案件
import snEmptyData from "@/components/snEmptyData";
import {getWritInfo} from '@api/fileRelated'
import { getCriteria } from "@api/anjianshenli";

export default {
  name: 'investigationReportIndex',
  components: {
    editBox,
    lookBox,
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
      isDetailAvailable: false,
      reportComponent: '',
      critInfo: {
        processView: "" // 裁量说明
      }, // 处罚裁量信息
      invesReportInfo: {}, // 案件调查报告文书
      loading: true,
      source: false
    }
  },
  created() {
    this.getReport()
    this.initPuniCritInfo()
  },
  methods: {
    // 获取处罚裁量中的当事人意见及处理意见
    initPuniCritInfo() {
      let req = {
        laDiscretionId: "",
        penaltyId: this.$store.state.penalty.penaltyUndEntity.penaltyId
      };
      getCriteria(req)
        .then(res => {
          this.critInfo.processView = res.data.laDiscretionEntity.processView
        })
        .catch(err => console.info(err));
    },
    getReport(type) {
      let req = {
        sourceId: this.$store.state.penalty.penaltyUndEntity.penaltyId,
        type: 'XZCFAJDCBG'
      }
      getWritInfo(req).then(res => {
        this.invesReportInfo = res.data[0]
        if (this.invesReportInfo && this.invesReportInfo !== {}) {
          if (type === 'afterCreated') {
            this.source = true
          } else {
            this.source = false
          }
          this.isDetailAvailable = true
          this.reportComponent = "lookBox"
        } else {
          this.reportComponent = ""
          this.isDetailAvailable = false
        }
        this.loading = false
      }).catch(err => console.info(err))
    },
    createCaseReport() {
      this.reportComponent = 'editBox'
    },
    setComponentId(val) {
      this.reportComponent = val;
    }
  }
}
</script>
<style lang="less" scope>
</style>
