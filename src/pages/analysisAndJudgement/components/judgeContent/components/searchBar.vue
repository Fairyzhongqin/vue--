<template>
  <div class="manageSearchBar">
    <span class="title">搜索日期:</span>
    <el-date-picker
      v-model="value"
      type="datetimerange"
      clearable
      size="mini"
      align="right"
      format="yyyy-MM-dd"
    ></el-date-picker>
    <el-button type="primary" size="mini" @click="searchData">搜索</el-button>
    <el-button
      size="mini"
      @click="exportData"
      type="primary"
      v-if="tabType !== 'jrzf'"
      :loading="exportLoading"
    >导出Excel</el-button>
    <a id="a_id" style="visibility:hidden" download></a>
  </div>
</template>
<script>
import { exportCaseReasonData, exportExamineStatData, exportPenaltyWorkData, exportPenaltyInspByClass } from '@/api/manageSystem/index'
import { dateFormat, operateFile } from '@/utils/util.js'
export default {
  name: 'manageSearchBar',
  props: {
    tabType: {
      type: String
    }
  },
  data() {
    return {
      value: '', //时间双向绑定值
      endTime: '', //结束时间
      startTime: '', //开始时间
      exportLoading: false //导出的loading
    }
  },
  methods: {
    searchData() {
      this.startTime = this.value ? dateFormat(this.value[0], 'yyyy-mm-dd HH:MM:ss') : ''
      this.endTime = this.value ? dateFormat(this.value[1], 'yyyy-mm-dd HH:MM:ss') : ''
      this.$emit('searchTrigger', this.startTime, this.endTime)
    },
    exportData() {
      console.info('exportData', this.tabType, this.value)
      this.startTime = this.value ? dateFormat(this.value[0], 'yyyy-mm-dd HH:MM:ss') : ''
      this.endTime = this.value ? dateFormat(this.value[1], 'yyyy-mm-dd HH:MM:ss') : ''
      this.exportLoading = true
      switch (this.tabType) {
        case 'aytj':
          console.info('导出案由统计')
          exportCaseReasonData({
            startTime: this.startTime,
            endTime: this.endTime
          })
            .then(res => {
              operateFile(res, '案由统计')
              this.exportLoading = false
            })
            .catch(err => {
              throw new Error(err)
            })
          break
        case 'aqsc':
          console.info('导出安全生产')
          exportPenaltyWorkData({
            startTime: this.startTime,
            endTime: this.endTime
          })
            .then(res => {
              operateFile(res, '安全生产执法工作季度统计表')
              this.exportLoading = false
            })
            .catch(err => {
              throw new Error(err)
            })
          break
        case 'zfjcqktj':
          console.info('导出检查执法统计（部门）')
          exportExamineStatData({
            startTime: this.startTime,
            endTime: this.endTime
          })
            .then(res => {
              operateFile(res, '执法检查情况统计（部门）')
              this.exportLoading = false
            })
            .catch(err => {
              throw new Error(err)
            })
          break
        case 'penaltyInspByClass':
          console.info('导出检查执法统计（监管行业）')
          exportPenaltyInspByClass({
            startTime: this.startTime,
            endTime: this.endTime
          })
            .then(res => {
              operateFile(res, '执法检查情况统计（监管行业）')
              this.exportLoading = false
            })
            .catch(err => {
              throw new Error(err)
            })
          break
        default:
          break
      }
    }
  }
}
</script>
<style lang="less" scoped>
.manageSearchBar {
  .title {
    color: #fff;
  }

  /deep/.el-button + .el-button {
    margin-left: 0px;
  }

  /deep/.el-date-editor .el-range__icon {
    display: none;
  }

  /deep/.el-date-editor--datetimerange.el-input__inner {
    width: 220px;
  }

  /deep/.el-input__inner {
    background: #1e2d41;
    border: 1px solid rgba(204, 204, 204, 1);
  }

  /deep/.el-date-editor .el-range-input {
    background: transparent;
    color: #fff;
  }

  /deep/.el-range-editor--mini .el-range-separator {
    color: #fff;
  }
}
</style>