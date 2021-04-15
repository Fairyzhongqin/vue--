<template>
  <div class="body">
    <div class="body-content">
      <div class="upload-buttons">
        <el-button type="primary" class="check-button" @click="initSignData">
          <span>初始化签章数据到数据库</span>
        </el-button>
        <el-upload
          :action="url"
          :headers="header"
          :on-success="successMulUpload"
          :on-error="error"
          name="file"
          :multiple="false"
          :show-file-list="false"
          :data="{ type: 0, signId: signIds }"
          :before-upload="checkFileStyleSeal"
          accept=".svg"
        >
          <el-button size="small" type="primary">上传签章</el-button>
        </el-upload>
        <el-upload
          :action="url"
          :headers="header"
          :on-success="successMulUpload"
          :on-error="error"
          name="file"
          :multiple="false"
          :show-file-list="false"
          :data="{ type: 1, signId: signIds }"
          :before-upload="checkFileStyleCert"
          accept=".pfx"
        >
          <el-button size="small" type="primary">上传证书</el-button>
        </el-upload>
      </div>
      <div class="upload-buttons">
        <el-input class="el-input-dept" v-model="deptCode" placeholder="部门编码" clearable></el-input>
        <el-button type="primary" class="check-button-dept" @click="addSign">
          <span>初始化部门</span>
        </el-button>
      </div>

      <el-table
        :data="tableData"
        border
        fit
        @selection-change="handleSelectionChange"
        header-row-class-name="table_header"
        :header-cell-style="getCellClass"
        :row-class-name="getRowClass"
        v-loading="loading"
      >
        <el-table-column type="selection" width="55" align="center" :index="indexMethod" />
        <el-table-column prop="signId" label="标识" min-width="60" show-overflow-tooltip />

        <el-table-column prop="deptName" label="部门名称" min-width="60" show-overflow-tooltip />

        <el-table-column prop="sealName" label="签章名称" min-width="60" show-overflow-tooltip />
        <el-table-column prop="sealName" label="签章状态" min-width="60" show-overflow-tooltip>
          <template slot-scope="scope"
            ><span class="upload-status" :class="{ uploaded: scope.row.isUpload === '1' }">{{
              scope.row.isUpload === '0' ? '未上传' : '已上传'
            }}</span></template
          >
        </el-table-column>

        <el-table-column prop="certName" label="证书名称" min-width="60" show-overflow-tooltip />
        <el-table-column prop="isPfxUpload" label="证书状态" min-width="60" show-overflow-tooltip>
          <template slot-scope="scope"
            ><span class="upload-status" :class="{ uploaded: scope.row.isPfxUpload === '1' }">{{
              scope.row.isPfxUpload === '0' ? '未上传' : '已上传'
            }}</span></template
          >
        </el-table-column>

        <el-table-column label="操作" width="240">
          <template slot-scope="scope">
            <el-upload
              :action="url"
              :headers="header"
              :on-success="successUpload"
              :on-error="error"
              name="file"
              :multiple="false"
              :show-file-list="false"
              :data="{ type: 0, signId: scope.row.signId }"
              :limit="1"
              :before-upload="checkFileStyleSeal"
              accept=".svg"
            >
              <el-button size="small" type="primary">上传签章</el-button>
            </el-upload>
            <el-upload
              :action="url"
              :headers="header"
              :on-success="successUpload"
              :on-error="error"
              name="file"
              :multiple="false"
              :show-file-list="false"
              :data="{ type: 1, signId: scope.row.signId }"
              :limit="1"
              :before-upload="checkFileStyleCert"
              accept=".pfx"
            >
              <el-button size="small" type="primary">上传证书</el-button>
            </el-upload>
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
  </div>
</template>

<script>
import { listSignDataTable, initSignDataToTable,addSignData } from '@api/systemManagement/autoSignManagement'
import baseUrl from '@/utils/webIp'

export default {
  name: 'dataTable',
  data() {
    return {
      url: `${baseUrl}/aj/af/autoSign/coverSignFile`,
      header: {},
      tableData: [],
      signIds: '', // 选中人员的ids
      currPage: 1,
      totalCount: 0,
      currPageCache: 1,
      pageSize: 10,
      loading: true,
        deptCode:"" //部门code
    }
  },
  props: {
    searchBarInfo: {
      type: [Object, Array]
    }
  },
  created() {
    let token = localStorage.getItem('token')
    this.header = { Authorization: token }
    console.log(this.fileInfo)
    this.getList(this.searchBarInfo)
  },
  methods: {
      addSign(){
          addSignData({
              signId: this.deptCode
          })
            .then(res => {
                console.info(res);
                if (res.code === "0") {
                    this.getList(this.searchBarInfo)
                    this.$message({
                        message: "保存成功！",
                        type: "success"
                    });

                }
            })
              .catch(err => {
                  this.$message({
                      message: err,
                      type: 'warning'
                  })
              })
      },
    checkFileStyleCert(file) {
      let name = file.name.substring(file.name.lastIndexOf('.') + 1)
      let result = '.pfx'.indexOf(name)
      if (result === -1) {
        this.$alert('请选择正确的文件格式', null, {
          confirmButtonText: '确定',
          callback: action => {}
        })
      }
      return result !== -1
    },
    checkFileStyleSeal(file) {
      let name = file.name.substring(file.name.lastIndexOf('.') + 1)
      let result = '.svg'.indexOf(name)
      if (result === -1) {
        this.$alert('请选择正确的文件格式', null, {
          confirmButtonText: '确定',
          callback: action => {}
        })
      }
      return result !== -1
    },
    initSignData() {
      initSignDataToTable()
        .then(res => {
          if (res.code === '0') {
            this.$message({
              message: '初始化成功',
              type: 'success'
            })
          }
        })
        .catch(err => {
          this.$message({
            message: err,
            type: 'warning'
          })
        })
    },

    // 给表头设置单独样式
    getCellClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0 && columnIndex === 9) {
        return 'background-image: linear-gradient(-225deg,#d0d6dc 0%, #B8DCFF 48%, #b0b8bf 100%);text-align:center;font-size:20px;font-weight:bolder;letter-spacing:1em'
      } else {
        return ''
      }
    },
    // 获取签章数据
    getList(val) {
      listSignDataTable({
        code: val.code ? val.code : '',
        limit: '10',
        page: this.currPage.toString()
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
    indexMethod(index) {
      return (this.currPageCache - 1) * this.pageSize + index + 1
    },
    // 给间隔行设置样式
    getRowClass({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'strip_row'
      }
    },
    // 分页器事件回调
    pagiChange(val) {
      this.loading = true
      sessionStorage.setItem('discretionaryContent', this.currPage)
      this.getList(this.searchBarInfo)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList(this.searchBarInfo)
    },
    // 表格checkbox回调
    handleSelectionChange(selection) {
      console.info('handleSelection', selection)
      let ids = []
      this.signIds = ''
      selection.forEach(val => {
        ids.push(val.signId)
      })
      this.signIds = ids.join(',')
      console.info(this.signIds)
    },
    error() {
      console.log('error')
      this.$alert('上传失败，请重试', null, {
        confirmButtonText: '确定',
        callback: action => {}
      })
    },
    // 成功上传多人
    successMulUpload(res) {
      if (res.code == 0) {
        this.$message({
          message: '上传成功',
          type: 'success'
        })
      } else {
        this.$message({
          message: '上传成功',
          type: 'success'
        })
      }
      this.signIds = ''
      this.getList(this.searchBarInfo)
    },
    successUpload(res) {
      this.$emit('getUploadMsg', res)
      if (this.uploadType === 'applyInfo') {
        return
      }
      this.$message({
        message: '上传成功',
        type: 'success'
      })
    }
  },
  watch: {
    // 监控查询条件，调用接口
    searchBarInfo: {
      handler: function(val, oldVal) {
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
    .upload-buttons {
      display: flex;
      .el-button {
        margin-left: 10px;
      }
      .el-input-dept{
        width: 24%;
      }
    }
    .upload-status {
      color: #0099ff;
      &::before {
        content: '•';
        margin-right: 7px;
      }
      &.uploaded {
        color: #1cc09b;
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
    .check-button-dept{
      padding: 9px 15px;
      width: 111px;
      margin-bottom: 16px;
    }
    .check-button[data-v-6d351e54] {
      /*padding: 9px 15px;*/
      width: 194px;
      /*margin-bottom: 16px;*/
    }
    td {
      button[data-v-6d351e54] {
        margin: 3px;
      }
      div[data-v-6d351e54] {
        float: left;
      }
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
        content: '•';
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
