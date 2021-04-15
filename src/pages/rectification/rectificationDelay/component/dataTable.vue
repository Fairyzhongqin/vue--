<template>
  <!-- 延期申请审批 -->
  <div>
    <search-bar :searchList="searchList" @searchTrigger="searchData"></search-bar>
    <div class="body" id="yqsqsp_body">
      <div>
        <tips v-if="!compBrowseShow" :tipName="['综合','浏览']" @clickHandle="clickHandle"></tips>
        <el-table
          :data="tableData"
          border
          fit
          v-loading="loading"
          row-class-name="lineheight"
          :default-sort="{prop: 'date', order: 'descending'}"
          header-row-class-name="headerclass"
          @row-click="rowClick"
          :header-cell-style="getCellClass"
        >
          <el-table-column width="70" label="序号" :index="dataIndex" type="index" align="center"></el-table-column>
          <el-table-column prop="companyName" min-width="160" label="企业名称" show-overflow-tooltip>
            <template slot-scope="scope">
              <span
                style="cursor: pointer; text-decoration: underline;color: dodgerblue;"
                @click="viewEnterpriseInformation(scope.row.companyId,'modify','isDisabled')"
              >{{scope.row.companyName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="原整改时限/整改项" prop="rectifyDisc" min-width="170" align="center">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" placement="top">
                <div v-html="splitToLine(scope.row.rectifyDisc)" slot="content"></div>
                <span
                  v-html="splitToLine(scope.row.rectifyDisc)"
                  class="oneLine"
                  v-if="scope.row.rectifyDisc"
                >{{scope.row.rectifyDisc}}</span>
                <span v-if="!scope.row.rectifyDisc">-</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="申请延期时间/延期项"
            prob="applyDelayDisc"
            min-width="180"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span v-if="scope.row.applyDelayDisc">{{scope.row.applyDelayDisc}}</span>
              <span v-if="!scope.row.applyDelayDisc">-</span>
            </template>
          </el-table-column>
          <el-table-column
            label="延期整改时限"
            prop="delayTimeDisc"
            min-width="120"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" placement="top">
                <div v-html="splitToLine(scope.row.delayTimeDisc)" slot="content"></div>
                <span
                  v-html="splitToLine(scope.row.delayTimeDisc)"
                  class="oneLine"
                  v-if="scope.row.delayTimeDisc"
                >{{scope.row.delayTimeDisc}}</span>
                <span v-if="!scope.row.delayTimeDisc">-</span>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column min-width="120" label="复查人员" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.reviewName">{{scope.row.reviewName}}</span>
              <span v-if="scope.row.reviewName == ''">-</span>
            </template>
          </el-table-column>
          <!--  <el-table-column
            prop="delayStatusDisc"
            min-width="120"
            label="延期状态"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span v-if="scope.row.delayStatusDisc">{{scope.row.delayStatusDisc}}</span>
              <span v-if="!scope.row.delayStatusDisc">-</span>
            </template>
          </el-table-column>-->

          <el-table-column label="操作" min-width="180" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="primary"
                v-if="!scope.row.applyWritId"
                class="fourBtn"
                @click="deplayApply(scope.row)"
              >延期申请</el-button>
              <!--  <el-button
                type="primary"
                v-if="!scope.row.replyWritId"
                class="fourBtn"
                @click="deplayApply(scope.row)"
              >复查延期答复书</el-button>-->
              <el-button type="primary" class="shortBut" @click="seeDetail(scope.row)">详情</el-button>
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
            @current-change="getNewList"
            layout="total, prev, pager, next, jumper"
          ></el-pagination>
        </div>
      </div>
    </div>
    <comprehensive-browse
      v-if="compBrowseShow"
      nowMenu="400101"
      :inspectId="inspectId"
      @closeFrame="compBrowseShow=false"
    ></comprehensive-browse>
  </div>
</template>

<script>
import { showRectificationDelayList } from '@/api/rectification/index'
import searchBar from '@components/searchBar'
import companyForm from '@/pages/enterpriseInfo/components/companyForm'
import { mapState } from 'vuex'
import { Throttle, splitToLine } from '@/utils/util'
import tips from '@/components/writGroup/tips'
import comprehensiveBrowse from '@/pages/comprehensiveBrowse'
export default {
  name: 'dataTable',
  components: {
    searchBar,
    companyForm,
    tips,
    comprehensiveBrowse
  },
  data() {
    return {
      totalCount: 0,
      currPage: 1,
      tableData: [],
      msg: '',
      loading: true,
      searchList: [
        {
          name: '企业名称',
          codeName: 'companyName',
          type: 'text',
          value: ''
        },
        //  {
        //   name: "延期时间",
        //   codeName: "delayTime",
        //   type: "date",
        //   value: ""
        // },
        {
          name: '复查人员',
          codeName: 'reviewPeople',
          type: 'choosePeople',
          value: {}
        }
      ],
      dialogVisible: false,
      compFormType: '', // 选择企业弹框的类型
      currentEnterpriseId: '',
      isDisabled: false,
      searchInfo: {},
      compBrowseShow: false,
      inspectId: ''
    }
  },
  created() {
    // 把当前页存入session
    if (sessionStorage.getItem('rectificationDelayCurrPage')) {
      this.currPage = Number(sessionStorage.getItem('rectificationDelayCurrPage'))
    }
    this.getShowRectificationDelayList(this.searchInfo)
    // 取到路由带过来的参数
    let routerParams = this.$route.query.reviewId
    // 将数据放在当前组件的数据内
    this.msg = routerParams
    console.log(this.msg, '-=-=-')
    if (this.msg) {
      this.$store.commit('setNewRectificationDelayShow', { flag: 'flagSee' })
    } else {
      return false
    }
  },
  methods: {
    splitToLine,
    // 给表头设置单独样式
    getCellClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0 && columnIndex === 6) {
        return 'background-image: linear-gradient(-225deg,#d0d6dc 0%, #B8DCFF 48%, #b0b8bf 100%);text-align:center;font-size:20px;font-weight:bolder;letter-spacing:1em'
      } else {
        return ''
      }
    },
    dataIndex(val) {
      return (this.pageCache - 1) * 10 + val + 1
    },
    //查看企业信息
    viewEnterpriseInformation(companyId, type, isDisabled) {
      if (isDisabled) {
        this.isDisabled = true
      } else {
        this.isDisabled = false
      }
      this.$store.commit('setNewRectificationShow')
      this.compFormType = type
      if (this.compFormType === 'modify') {
        this.currentEnterpriseId = companyId
      }
      this.dialogVisible = true
    },
    // 延期申请
    deplayApply: Throttle(function(data) {
      // 详情的
      this.$store.commit('setDetailIded', {
        executorId: data.executorId,
        flag: 'flagNewDelay',
        id: data.id,
        delayCompanyId: data.companyId,
        delayCompanyName: data.companyName,
        delayPerson: data.reviewName
      })
      this.$store.commit('setNewRectificationDelayShow')
    }, 3000),
    //延期详情
    seeDetail(data) {
      this.$store.commit('setDetailIded', { flag: 'flagDetail', id: data.id })
      this.$store.commit('setNewRectificationDelayShow')
    },
    getShowRectificationDelayList(val) {
      this.loading = true
      showRectificationDelayList({
        ...val,
        limit: '10',
        page: this.currPage.toString()
      })
        .then(res => {
          //  console.log("延期列表",res)
          this.tableData = res.data.list
          this.currPage = res.data.currPage
          this.totalCount = res.data.totalCount
          if (this.tableData) {
            this.loading = false
          }
          this.pageCache = res.data.currPage
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 请求对应页数的数据list
    getNewList(val) {
      this.currPage = val
      sessionStorage.setItem('rectificationDelayCurrPage', this.currPage)
      this.getShowRectificationDelayList(this.searchInfo)
    },
    searchData(val) {
      // console.log(val);
      this.searchInfo.companyName = val.companyName
      this.searchInfo.executorId = val.reviewPeople.id
      this.getShowRectificationDelayList(this.searchInfo)
    },
    clickHandle() {
      if (this.inspectId) {
        this.compBrowseShow = true
      } else {
        this.$message({
          type: 'warning',
          message: '请先选中一个案件'
        })
      }
    },
    rowClick(row) {
      this.inspectId = row.examineId
    }
  },
  watch: {
    $route(to, from) {
      console.info('router', to, from)
    }
  },
  computed: {
    ...mapState['setNewRectificationDelayShow']
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
  &#yqsqsp_body {
    position: relative;
    /deep/.all-writ-group {
      background: transparent;
      padding: 0;
      top: 19px;
    }
  }

  div:first-child {
    background: #ffffff;
    padding: 8px 8px 0;
    border-radius: 8px;
    .lineheight {
      height: 37px;
    }
    .el-table /deep/ thead {
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: bold;
      color: rgba(34, 34, 34, 1);
    }
    .el-table /deep/ tr.headerclass {
      height: 50px !important;
    }
    .el-table--border {
      border-radius: 0px;
      border: 0;
      border-left: 1px solid transparent;
      border-right: 1px solid transparent;
    }
    .shortBut {
      width: 40px;
      height: 24px;
      font-size: 14px;
      padding: 7px 5px;
      margin-left: none;
    }
    .fourBtn {
      min-width: 70px;
      height: 24px;
      font-size: 14px;
      padding: 7px 2px;
      margin-left: 0 !important;
    }
    .sevenBtn {
      width: 120px;
      height: 24px;
      font-size: 14px;
      padding: 7px 2px;
    }
    /deep/.el-table--border::after,
    .el-table--group::after {
      top: 0;
      right: 0;
      width: 0px;
      height: 100%;
    }
    /deep/ .el-table_1_column_9 {
      border-right: 1px solid transparent;
    }
    /deep/ .router-link-active {
      color: #1273eb;
    }
    /deep/ .is-leaf {
      background: #e3eef6;
    }

    .pagination {
      display: flex;
      flex-direction: row-reverse;
    }
    .check-button {
      padding: 9px 15px;
      height: 30px;
      line-height: 12px;
      width: 111px;
      margin-bottom: 16px;
    }
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
  // 若是溢出就省略号
  .oneLine {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
/deep/ .el-table--border th {
  border-color: #e0e0e0;
}
/deep/.name-wrapper {
  background: none !important;
}
/deep/.el-button + .el-button {
  margin: 0px;
}
.el-button--danger:active,
.el-button--danger:focus {
  background: #fef0f0;
  color: #dd6161;
  border-color: #fbc4c4;
}
.dialog_container {
  height: 500px;
  overflow-y: scroll;
}
/deep/.el-table__fixed-right {
  width: 220px;
  height: 348px;
}
</style>
