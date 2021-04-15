<template>
  <div class="body">
    <div class="body-content">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        fit
        stripe
        highlight-current-row
        :default-sort="{prop: 'date', order: 'descending'}"
        header-row-class-name="header"
        :header-cell-style="getCellClass"
        v-loading="loading"
      >
        <el-table-column type="index" label="序号" :index="indexMethod" width="70" align="center"></el-table-column>
        <el-table-column prop="companyName" show-overflow-tooltip label="当事人" min-width="120">
          <template slot-scope="scope">
            <span
              style="cursor: pointer; text-decoration: underline;color: dodgerblue;"
              @click="viewEnterpriseInformation(scope.row,'modify','isDisabled')"
            >{{scope.row.companyName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="examineTime"
          show-overflow-tooltip
          label="检查日期"
          min-width="120"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="executorName"
          show-overflow-tooltip
          label="执法人员"
          min-width="180"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" min-width="100" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button type="primary" @click="changeEnter(scope.row)">处置</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="企业信息" :visible.sync="dialogVisible" width="1200px" top="8vh">
        <div class="dialog_container" v-if="dialogVisible">
          <companyForm
            :isDialog="true"
            :enterpriseId="currentEnterpriseId"
            :type="compFormType"
            :isDisabled="isDisabled"
          ></companyForm>
        </div>
      </el-dialog>
      <div class="pagination">
        <el-pagination
          :total="totalCount"
          :current-page.sync="currPage"
          :page-size="10"
          @current-change="getNewPageList"
          layout="total, prev, pager, next, jumper"
          @size-change="handleSizeChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script scoped>
import { showSimpleHandleList, simpleHandleInfo } from '@api/simpleHandle/index'
import Bus from '../../../bus'
import companyForm from '@/pages/enterpriseInfo/components/companyForm'
import { mapState } from 'vuex'
export default {
  name: 'dataTable',
  components: {
    companyForm
  },
  data() {
    return {
      tableData: [],
      currPage: 1,
      totalCount: 0,
      pageSize: 10,
      currPageCache: 1,
      simpleHandleDetailId: '', //简易行政处罚详情id
      loading: true,
      dialogVisible: false,
      compFormType: '', // 选择企业弹框的类型
      currentEnterpriseId: '',
      isDisabled: false
    }
  },
  props: {
    searchData: {
      type: [Object, Array]
    }
  },
  activated() {
    this.getshowSimpleHandleList(this.searchData)
  },
  methods: {
    // 给表头设置单独样式
    getCellClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0 && columnIndex === 4) {
        return 'background-image: linear-gradient(-225deg,#d0d6dc 0%, #B8DCFF 48%, #b0b8bf 100%);text-align:center;font-size:20px;font-weight:bolder;letter-spacing:1em'
      } else {
        return ''
      }
    },
    //查看企业信息
    viewEnterpriseInformation(data, type, isDisabled) {
      console.log(data)
      if (isDisabled) {
        this.isDisabled = true
      } else {
        this.isDisabled = false
      }
      this.$store.commit('setNewRectificationShow')
      this.compFormType = type
      if (this.compFormType === 'modify') {
        this.currentEnterpriseId = data.companyTargetId
      }
      this.dialogVisible = true
    },
    changeEnter(data) {
      this.simpleHandleDetailId = data.id
      this.getSimpleHandleDetail(data)
    },
    // changeEnterDetail (id) {
    //   this.$emit("getSourceId", id);
    // },

    // 初始化现场检查列表数据封装
    getshowSimpleHandleList(val) {
      this.loading = true
      showSimpleHandleList({
        companyName: val.companyName ? val.companyName : '',
        startTime: typeof val.checkTime === 'object' && val.checkTime[0] ? val.checkTime[0] + ' 00:00:00' : undefined,
        endTime: typeof val.checkTime === 'object' && val.checkTime[1] ? val.checkTime[1] + ' 23:59:59' : undefined,
        executorId: typeof val.udtNames === 'object' && val.udtNames ? val.udtNames.id : undefined,
        limit: '10',
        page: this.currPage.toString()
      }).then(
        res => {
          this.loading = false
          this.tableData = res.data.list
          this.totalCount = res.data.totalCount
          this.currPageCache = res.data.currPage
        },
        err => {
          console.log('请求失败：', err)
        }
      )
    },
    // 请求对应页数的数据list
    getNewPageList(val) {
      this.currPage = val
      this.getshowSimpleHandleList(this.searchData)
    },
    handleSizeChange(val) {
      this.pageSize = val
      // console.log(this.pageSize);
      this.getshowSimpleHandleList(this.searchData)
    },
    indexMethod(index) {
      return (this.currPageCache - 1) * this.pageSize + index + 1
    },
    getSimpleHandleDetail(data) {
      simpleHandleInfo({
        id: this.simpleHandleDetailId
      })
        .then(res => {
          this.$store.commit('SET_ACTS_FROM_CHECK_AGAIN', res.data.probList)
          this.$emit('handleData', {
            id: data.id,
            time: data.examineTime,
            peopleId: data.executorId,
            people: data.executorName,
            company: {
              companyName: data.companyName,
              id: data.companyTargetId
            },
            dept: {
              name: data.executorDeptName
            }
          })
        })
        .catch(err => {
          throw new Error(err)
        })
    }
  },
  created() {
    this.currPage = this.searchcurrPagechange
    // 初始化现场数据列表
    this.getshowSimpleHandleList(this.searchData)
  },
  destroyed() {
    this.$store.commit('setcurrPage', this.currPage)
  },
  computed: {
    ...mapState(['searchcurrPagechange'])
  },
  watch: {
    // 监控搜素条件，调用查询接口
    searchData: {
      handler(val, oldVal) {
        this.currPage = 1
        this.getshowSimpleHandleList(val)
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.el-table .cell.el-tooltip {
  text-overflow: clip;
}
.body {
  width: 98.5%;
  padding: 8px 8px 0;
  .body-content {
    background: #ffffff;
    padding: 15px 15px 0;
    border-radius: 8px;
    .el-table {
      border-radius: 0px;
    }
    /deep/ .el-table_1_column_6 {
      border-right: 1px solid transparent;
    }
    .el-table--border {
      border: 0px;
    }
    /deep/ .is-leaf {
      background: #e3eef6;
    }
    .pagination {
      margin-top: 10px;
      display: flex;
      flex-direction: row-reverse;
      margin-bottom: 10px;
    }
    .check-button {
      padding: 9px 15px;
      height: 30px;
      line-height: 12px;
      width: 111px;
      margin-bottom: 16px;
    }
  }
  /deep/ .router-link-active {
    color: #1273eb;
  }
  .button-color {
    color: #0099ff;
    &:hover {
      text-decoration: underline;
      cursor: pointer;
    }
    &::after {
      content: '';
      width: 8px;
      display: inline-block;
    }
  }
  .button-del-color {
    color: #ff3030;
    &:hover {
      text-decoration: underline;
      cursor: pointer;
    }
    &::after {
      content: '';
      width: 8px;
      display: inline-block;
    }
  }
  /deep/.el-table--border {
    border: 1px solid transparent !important;
  }
}
.el-table /deep/ thead {
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: bold;
  color: rgba(34, 34, 34, 1);
}
.el-table {
  /deep/ .header {
    height: 50px;
    th {
      border-right: 1px solid #e0e0e0;
    }
  }
  /deep/ .tbody {
    .el-table__row {
      height: 37px;
    }
  }
}
.el-button {
  height: 24px;
  width: 40px;
  background: rgba(0, 153, 255, 1);
  border-radius: 5px;
  padding: 7px 4px !important;
  display: inline-block;
}

body .el-table th.gutter {
  display: table-cell !important;
}

.widthCenter {
  text-align: center;
}
.dialog_container {
  height: 500px;
  overflow-y: scroll;
}
</style>
