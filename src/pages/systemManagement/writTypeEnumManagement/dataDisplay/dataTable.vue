<template>
  <div class="body">
    <div class="body-content">
      <el-button type="primary" class="check-button"  @click="enterAddWritTypeEnum">
        <span>新增文书类型</span>
      </el-button>

      <el-button type="primary" class="check-button"  @click="enterBackupManagement">
        <span>方案管理</span>
      </el-button>

      <el-table
        :data="tableData"
        border
        fit
        header-row-class-name="table_header"
        :header-cell-style="getCellClass"
        :row-class-name="getRowClass"
        v-loading="loading"
      >
        <el-table-column type="selection" align="center" width="55" :index="indexMethod"/>
        <el-table-column prop="type" label="文书类型名字" min-width="60" show-overflow-tooltip/>
        <el-table-column
          prop="typeCode"
          label="文书类型编码"
          min-width="60"
          show-overflow-tooltip
        />
        <el-table-column prop="typeName" label="文书名字" min-width="90" show-overflow-tooltip/>

        <el-table-column prop="userType" label="用户签名" min-width="40" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.userType === 0">否</el-tag>
            <el-tag v-if="scope.row.userType === 1" type = "success">是</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="isSign" label="加盖类型" min-width="40" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isSign === 0">无</el-tag>
            <el-tag v-if="scope.row.isSign === 1" type="success">公章</el-tag>
            <el-tag v-if="scope.row.isSign === 2" type="info">执法章</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="isAudit" label="是否审核" min-width="40" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isAudit === 0">否</el-tag>
            <el-tag v-if="scope.row.isAudit === 1" type="success">是</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="isUpload" label="上传签字文书" min-width="60" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isUpload === 0">否</el-tag>
            <el-tag v-if="scope.row.isUpload === 1" type="success">是</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="isPenalty" label="行政处罚" min-width="50" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isPenalty === '0'">否</el-tag>
            <el-tag v-if="scope.row.isPenalty === '1'" type="success">是</el-tag>
            <el-tag v-if="scope.row.isPenalty === 'init'" type="info">基本线</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <div>
              <el-button
                class="shortBtn"
                type="primary"
                @click="updateWritTypeEnum(scope.row.id)"
              >修改</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          :total="totalCount"
          :current-page.sync="currPage"
          :page-size="10"
          @current-change="pagiChange"
          layout="total, prev, pager, next, jumper"
          @size-change="handleSizeChange"
        />
      </div>
    </div>

    <el-dialog
      title="方案列表"
      width="800px"
      height="500px"
      class="dialog-type"
      :visible.sync="buDialog"
      :close-on-click-modal="false"
    >
      <el-form :model="backupEntity" class="save-backup-form" :inline="true" ref="ruleForm">
        <el-form-item label="名字">
          <el-input v-model="backupEntity.name" placeholder="请输入方案的名字" clearable/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="backupEntity.remark" placeholder="请输入方案的备注" clearable/>
        </el-form-item>
        <el-form-item>
          <el-button @click="saveBU" type="primary" class="shortBut" > + 新建方案</el-button>
        </el-form-item>
      </el-form>

      <div class="bu-table-body">
        <el-table
          :data="buList"
          border
          fit
          row-class-name="lineheight"
          :default-sort="{prop: 'date', order: 'descending'}"
          header-row-class-name="headerclass"
          v-if="buDialog"
        >
          <el-table-column type="index" width="70" label="序号" :index="dataIndex"/>
          <el-table-column prop="name" min-width="100" label="方案名字">
            <template slot-scope="scope">{{ scope.row.name}}</template>
          </el-table-column>

          <el-table-column prop="remark" min-width="100" label="备注">
            <template slot-scope="scope">{{ scope.row.remark}}</template>
          </el-table-column>

          <el-table-column prop="createTime" min-width="150" label="上次更新时间">
            <template slot-scope="scope">{{ scope.row.createTime}}</template>
          </el-table-column>

          <el-table-column label="操作" min-width="200">
            <template slot-scope="scope">
              <el-button type="primary" class="shortBut" @click="saveOrUpBu(scope.row)">更新</el-button>
              <el-button type="success" class="shortBut" @click="activeBu(scope.row)">使用</el-button>
              <el-button type="danger" class="shortBut" @click="deleteBu(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="bu-table-page-number">
        <el-pagination
          :page-size="10"
          :pager-count="5"
          layout="prev, pager, next"
          :total="buTotalCount"
          @current-change="queryBuForPage"
        />
      </div>
    </el-dialog>

  </div>
</template>

<script>
// import { mapState } from "vuex";
import {
  getWritTypeEnumLst, listBackup, saveOrUptBU, activeBackup, deleteBackup
} from '@api/systemManagement/writTypeEnumManagement'

export default {
  name: 'dataTable',
  data () {
    return {
      tableData: [],
      currPage: 1,
      totalCount: 0,
      currPageCache: 1,
      pageSize: 10,
      loading: true,
      buCurrPage: '1',
      buTotalCount: '0',
      buList: [],
      buDialog: false,
      backupEntity: {
        name: '',
        remark: ''
      }
    }
  },
  props: {
    searchBarInfo: {
      type: [Object, Array]
    }
  },
  created () {
    // if (sessionStorage.getItem('writTypeContent')) {
    //   this.currPage = Number(sessionStorage.getItem('writTypeContent'))
    // }
    if(this.$store.state.writTypeEnumPageNo){
      this.currPage = Number (this.$store.state.writTypeEnumPageNo);
    }
    this.getList(this.searchBarInfo)
  },
  methods: {

    saveBU () {
      console.log(this.backupEntity)
      this.saveOrUpBu(this.backupEntity)
    },
    // 保存或者修改某个方案
    saveOrUpBu (obj) {
      let info = '修改'
      if (!obj.id) {
        info = '保存'
      }
      saveOrUptBU(obj).then(
        res => {
          this.$message.success(info + '成功')
          this.enterBackupManagement()
        }
      ).catch(res => {
        this.$message.error(info + '失败')
      })
    },
    // 激活该方案
    activeBu (obj) {
      activeBackup({
        backUpId: obj.id
      }).then(res => {
        const rst = res.data
        if (rst === true) {
          this.$message.success('激活成功')
        }
      }).catch(res => {
        this.$message.error('激活失败')
      })
    },

    deleteBu (obj) {
      deleteBackup({
        backUpId: obj.id
      }).then(res => {
        const rst = res.data
        if (rst === true) {
          this.$message.success('删除成功')
          this.enterBackupManagement()
        }
      }).catch(res => {
        this.$message.error('删除失败')
      })
    },
    dataIndex (val) {
      return (this.currPage - 1) * 10 + val + 1
    },
    // 进入方案管理
    enterBackupManagement () {
      listBackup({
        limit: '10',
        page: this.buCurrPage.toString()
      }).then(res => {
        if (res.page.list) {
          this.buCurrPage = res.page.currPage
          this.buTotalCount = res.page.totalCount
          this.buList = res.page.list
          this.buDialog = true
        }
      })
    },
    queryBuForPage (val) {
      this.buCurrPage = val
      this.enterBackupManagement()
    },
    // 给表头设置单独样式
    getCellClass ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0 && columnIndex === 9) {
        return 'background-image: linear-gradient(-225deg,#d0d6dc 0%, #B8DCFF 48%, #b0b8bf 100%);text-align:center;font-size:20px;font-weight:bolder;letter-spacing:1em'
      } else {
        return ''
      }
    },
    getList (val) {
      getWritTypeEnumLst({
        name: val.name ? val.name : '',
        userType: val.userType ? val.userType : '',
        isSign: val.isSign ? val.isSign : '',
        isAudit: val.isAudit ? val.isAudit : '',
        isUpload: val.isUpload ? val.isUpload : '',
        isPenalty: val.isPenalty ? val.isPenalty : '',
        limit: '10',
        page: this.currPage.toString(),
        isPaging: 'true'
      }).then(
        res => {
          this.loading = false
          this.tableData = res.page.list
          this.totalCount = res.page.totalCount
          this.currPageCache = res.page.currPage
        },
        err => console.info(err)
      )
    },
    indexMethod (index) {
      return (this.currPageCache - 1) * this.pageSize + index + 1
    },
    // 进入新增自由裁量内容页面
    enterAddWritTypeEnum () {
      this.$store.commit('setCurrWritTypeEnumComp', {
        component: 'addWritTypeEnum'
      })
      this.$store.commit('setWritTypeEnumId', {
        writTypeEnumId: ''
      })
    },
    // 修改文书枚举类
    updateWritTypeEnum (id) {
      console.log('修改文书枚举类id', id)
      this.$store.commit('setCurrWritTypeEnumComp', {
        component: 'addWritTypeEnum'
      })
      this.$store.commit('setWritTypeEnumId', {
        writTypeEnumId: id
      })

      console.log(this.currPage);
      this.$store.commit('setWritTypeEnumPageNo', {
        writTypeEnumPageNo: this.currPage
      })
    },
    // 给间隔行设置样式
    getRowClass ({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'strip_row'
      }
    },
    // 分页器事件回调
    pagiChange (val) {
      this.loading = true
      sessionStorage.setItem('discretionaryContent', this.currPage)
      this.getList(this.searchBarInfo)
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getList(this.searchBarInfo)
    }
  },
  watch: {
    // 监控查询条件，调用接口
    searchBarInfo: {
      handler: function (val, oldVal) {
        this.currPage = 1
        this.getList(val)
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.body {
  padding: 8px 8px 0;
  .body-content {
    background: #ffffff;
    padding: 16px 16px 0;
    border-radius: 8px;
    /deep/ .is-leaf {
      background: #e3eef6;
    }
    /deep/ .table_header th:first-child {
      .cell {
        text-align: left;
        margin-left: 8px;
      }
    }
    .pagination {
      padding: 15px 0px 20px 0px;
      text-align: right;
    }
    .check-button {
      padding: 9px 15px;
      width: 111px;
      margin-bottom: 16px;
    }
    .el-table {
      border-radius: 0;
      /deep/ .table_header {
        height: 50px;
        background: rgba(227, 238, 246, 1);
        font-size: 16px;
        font-weight: bold;
        color: #222222;
        th {
          border-right: 1px solid #e0e0e0;
        }
      }
      /deep/ .el-table__header {
        table-layout: auto;
      }
      /deep/ .el-table__body {
        width: auto !important;
      }
      /deep/ .el-button + .el-button {
        margin-left: 0;
      }
      // /deep/ .el-button {
      //   height: 28px;
      //   padding: 7px 8px;
      //   font-size: 12px;
      // }
      /deep/ .strip_row {
        background: #f4f8fa;
      }
      .status::before {
        content: "•";
        margin-right: 8px;
      }
      .green {
        color: #1cc09b;
      }
      &.red {
        color: #ff2525;
      }
    }
  }
}
.big-dialog {
  /deep/ .el-dialog {
    width: 800px;
    overflow: hidden;
  }
}
/deep/.el-table--scrollable-x .el-table__body-wrapper {
  overflow: hidden;
}
.el-table__body .cell .shortBtn {
  width: 40px;
  height: 24px;
  font-size: 14px;
  padding: 7px 2px !important;
}

.dialog-type {
  overflow: auto;
  /deep/ .el-dialog {
    height: 600px;
    margin-top: 5vh !important;
    .el-dialog__body {
      padding-left: 10px;
      padding-right: 10px;
      height: 87%;
      overflow: auto;
      position: relative;
      .bu-table-body {
        height: 94%;
        width: 100%;
        overflow: auto;
      }
      .bu-table-page-number {
        border-top: 1px solid #e0e0e0;
        height: 5%;
        text-align: right;
        padding-top: 2px;
      }
      .save-backup-form {
        /*position: absolute;*/
        /*bottom: 0;*/
        /*left: 10px;*/
        /*z-index: 100;*/
      }
    }
  }
}

</style>
