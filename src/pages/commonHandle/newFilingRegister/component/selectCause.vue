<template>
  <div>
    <div>
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" height="250" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="案由名称">
          <template slot-scope="scope">{{ scope.row.value }}</template>
        </el-table-column>
      </el-table>
    </div>
    <div class="oper-button">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="sure">确定</el-button>
    </div>
  </div>
</template>

<script>
import { showCaseStatus } from '@/api/filingRegister'

export default {
  data() {
    return {
      tableData: [
        {
          value: ''
        }
      ],
      multipleSelection: [],
      dataList: {
        type: 'reson_case'
      }
    }
  },
  props: {
    closeOrgDialog: {
      type: Function
    }
  },
  created() {
    this.getCauseAction()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 案由接口
    getCauseAction() {
      showCaseStatus(this.dataList)
        .then(res => {
          this.tableData = res.page.list
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 确定取消
    sure() {
      this.$emit('getCause', this.multipleSelection)
      this.closeOrgDialog()
    },
    close() {
      this.closeOrgDialog()
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.el-dialog__wrapper .el-dialog__header {
  border-bottom: none;
}
.oper-button {
  display: flex;
  justify-content: flex-end;
  padding: 8px 20px 8px 0px;
}
/deep/ .el-table th > .cell {
  text-align: left;
  margin-left: 4px;
}
</style>
