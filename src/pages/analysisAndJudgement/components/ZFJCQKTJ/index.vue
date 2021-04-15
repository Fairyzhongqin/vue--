<template>
  <div class="table-wrapper">
    <penalty-insp-table v-loading="loading" :startTime="startTime" :endTime="endTime" :tableData="tableData" :module="'depart'" @load="load"></penalty-insp-table>
  </div>
</template>
<script>
import { getZFJCQKData } from '@/api/manageSystem/index.js'
import penaltyInspTable from '../../analysisCommon/penaltyInspTable'
export default {
  name: 'penaltyInspByDept',
  components: {
    penaltyInspTable
  },
  data() {
    return {
      // table data
      tableData: [],
      startTime: '',
      endTime: '',
      loading: false,
      modalVisiable: false,
      modalTitle: '',
      inspectType: '',
      selectDeptCode: '',
      modalCom: '',
      cacheTreeCodes: [],
      cacheResolves: []
    }
  },
  methods: {
    getList(deptCode, startTime, endTime) {
      this.startTime = startTime
      this.endTime = endTime
      this.loading = true
      if(this.cacheTreeCodes.length) {
        this.cacheTreeCodes.map((item, index) => {
          this.load({deptCode: item}, null, this.cacheResolves[index], true)
        })
      }
      getZFJCQKData({
        deptCode: deptCode,
        endTime: this.endTime || '',
        startTime: this.startTime || ''
      }).then(res => {
        this.loading = false
        if (res.code === '0') {
          this.tableData = res.data
        }
      })
    },
    // active 主动请求懒加载节点
    load(tree, treeNode, resolve, active) {
      if(!active) {
        this.cacheTreeCodes.push(tree.deptCode)
        this.cacheResolves.push(resolve)
      }
      getZFJCQKData({
        deptCode: tree.deptCode,
        endTime: this.endTime || '',
        startTime: this.startTime || ''
      }).then(res => {
        if (res.code === '0') {
          resolve(res.data)
        }
      })
    }
  },
  created() {
    this.getList('')
  }
}
</script>

<style lang="less" scoped>
  .table-wrapper {
    background: rgba(46, 67, 106, 1);
    border-radius: 8px;
    box-sizing: border-box;
    padding: 10px;
    max-height: 76vh;
    width: 100%;
    padding-right: 0;
    /deep/ .el-loading-mask {
      background-color: transparent;
    }
  }
</style>
