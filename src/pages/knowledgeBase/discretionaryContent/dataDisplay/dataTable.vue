<template>
  <div class="body">
    <div class="body-content">
      <el-button type="primary" class="check-button" @click="enterAddDiscretion">
        <span>新增自由裁量</span>
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
        <el-table-column type="index" width="70" :index="indexMethod" label="序号" align="center"></el-table-column>
        <el-table-column prop="discretionCode" label="自由裁量编号" min-width="90" show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="discretionTypeName"
          label="自由裁量分类"
          min-width="90"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="lawName" label="法律条例" min-width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="unlawfulAct" label="违法行为描述" min-width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="orderNum" align="center" label="排序号" min-width="60"></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <div>
              <el-button
                class="shortBtn"
                type="primary"
                @click="updateDiscretion(scope.row.discretionId)"
              >修改</el-button>
              <el-button
                type="danger"
                class="shortBtn"
                plain
                @click="delDiscretion(scope.row.discretionId)"
              >删除</el-button>
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
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapState } from "vuex";
import { getDiscretionList, deleteDisc } from '@api/systemManagement/discretionManagement'

export default {
  name: 'dataTable',
  data() {
    return {
      tableData: [],
      currPage: 1,
      totalCount: 0,
      currPageCache: 1,
      pageSize: 10,
      loading: true
    }
  },
  props: {
    searchBarInfo: {
      type: [Object, Array]
    }
  },
  created() {
    if (sessionStorage.getItem('discretionaryContent')) {
      this.currPage = Number(sessionStorage.getItem('discretionaryContent'))
    }
    
    // this.getList(this.searchBarInfo);
  },
  methods: {
    // 给表头设置单独样式
    getCellClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0 && columnIndex === 6) {
        return 'background-image: linear-gradient(-225deg,#d0d6dc 0%, #B8DCFF 48%, #b0b8bf 100%);text-align:center;font-size:20px;font-weight:bolder;letter-spacing:1em'
      } else {
        return ''
      }
    },
    // 获取自由裁量内容列表
    getList(val) {
      getDiscretionList({
        unlawfulAct: val.unlawfulAct ? val.unlawfulAct : '',
        discretionTypeCode: val.discretionTypeCode ? val.discretionTypeCode : '',
        lawCode: val.lawCode ? val.lawCode : '',
        tradeCode: val.tradeCode ? val.tradeCode : '',
        specialCode: val.specialCode ? val.specialCode : '',
        discretionCode: val.discretionCode ? val.discretionCode : '',
        limit: '10',
        page: this.currPage?this.currPage+'':'1'
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
    // 进入新增自由裁量内容页面
    enterAddDiscretion(id) {
      this.$emit('enterAddDiscretion', '', this.currPage)
    },
    //删除自由裁量
    delDiscretion(discId) {
      console.log('要删除的id', discId)
      this.$confirm('此操作将永久删除该自由裁量, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        deleteDisc({
          discretionId: discId
        })
          .then(res => {
            if ((this.totalCount - 1) % (this.currPage - 1) === 0) {
              // 所删数据是当前页的最后一条数据时
              this.currPage = this.currPage - 1
            }
            this.$message.success('删除成功')
            this.getList(this.searchBarInfo)
          })
          .catch(error => {
            this.$message.error('删除失败')
          })
      })
    },
    // 修改自由裁量
    updateDiscretion(id) {
      
      this.$emit('enterAddDiscretion', id, this.currPage)

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
      // sessionStorage.setItem('discretionaryContent', this.currPage)
      this.getList(this.searchBarInfo)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList(this.searchBarInfo)
    }
  },
  watch: {
    // 监控查询条件，调用接口
    searchBarInfo: {
      handler: function(val, oldVal) {
        // this.currPage = 1
        this.currPage = val.page;
        console.info('val!!!', val)
        this.getList(val)
      },
      deep: true,
      immediate: true
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
</style>
