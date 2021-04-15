<template>
  <!-- 检查结果处理 -->
  <div class="body">
    <div class="body-content">
      <tips v-if="!compBrowseShow" :tipName="['综合','浏览']" @clickHandle="clickHandle"></tips>
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
        @row-click="rowClick"
        v-loading="loading"
      >
        <el-table-column type="index" :index="indexMethod" width="70" label="序号" align="center"></el-table-column>
        <el-table-column prop="companyName" show-overflow-tooltip label="企业名称" min-width="220">
          <template slot-scope="scope">
            <span
              style="cursor: pointer; text-decoration: underline;color: dodgerblue;"
              @click="viewEnterpriseInformation(scope.row.companyId,'modify','isDisabled')"
            >{{scope.row.companyName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="examineStartTime"
          label="检查时间"
          min-width="120"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          prop="examineSourceName"
          show-overflow-tooltip
          label="检查形式"
          min-width="120"
          align="center"
        >
          <template
            slot-scope="scope"
          >{{ scope.row.examineSourceName ? scope.row.examineSourceName : scope.row.examineSource }}</template>
        </el-table-column>
        <el-table-column prop="examineTypeName" label="检查方式" min-width="120" align="center">
          <template slot-scope="scope">{{ scope.row.examineTypeName }}</template>
        </el-table-column>
        <el-table-column
          prop="examineNum"
          show-overflow-tooltip
          label="历史检查记录"
          align="center"
          min-width="120"
        >
          <template slot-scope="scope">
            <span
              style="cursor: pointer; text-decoration: underline;color: dodgerblue"
              @click="previousRecords(scope.row)"
            >{{scope.row.examineNum}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="yinhuan" label="重大隐患"></el-table-column> -->
        <!-- <el-table-column prop="username" label="检查人员" width="120"></el-table-column> -->
        <el-table-column label="操作" fixed="right" min-width="152">
          <template slot-scope="scope">
            <el-button type="primary" class="handleClass" @click="changeEnter(scope.row)">处置</el-button>
            <el-button type="primary" @click="changeEnterDetail(scope.row.id)">详情</el-button>
            <!-- <span class="button-color" v-show="!scope.row.canLook" @click="changeEnterDetail()">详情</span> -->
            <!-- <span class="button-color" v-show="!scope.row.canLook" @click="changeEnter()">处置</span> -->
          </template>
        </el-table-column>
      </el-table>

      <div>
        <el-drawer
          v-loading="loading"
          :title="title"
          :visible.sync="drawer"
          :direction="direction"
          size="100%"
        >
          <check-information @back="back" :recordInfo="recordInfo"></check-information>
        </el-drawer>
      </div>
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
    <comprehensive-browse
      v-if="compBrowseShow"
      nowMenu="400101"
      :inspectId="inspectId"
      @closeFrame="compBrowseShow=false"
    ></comprehensive-browse>
  </div>
</template>

<script scoped>
import { getlistOfsiteinspectionRecord, getExamineCheckRecord } from '@api/ProcessingofInspectionResult/index.js'
import checkInformation from '../../inspectionResult/previousRecords/components/checkInformation'
import companyForm from '@/pages/enterpriseInfo/components/companyForm'
import { mapState } from 'vuex'
import { getWritTypeInfo } from '@api/login/login'
import tips from '@/components/writGroup/tips'
import comprehensiveBrowse from '@/pages/comprehensiveBrowse'
import { debounce } from '@/utils/util'
export default {
  name: 'dataTable',
  components: {
    checkInformation,
    companyForm,
    tips,
    comprehensiveBrowse
  },
  data() {
    return {
      title: '',
      tableData: [],
      companyInfo: {},
      recordInfo: [],
      currPage: 1,
      totalCount: 0,
      pageSize: 10,
      currPageCache: 1,
      loading: true,
      direction: 'btt',
      drawer: false,
      dialogVisible: false,
      compFormType: '', // 选择企业弹框的类型
      currentEnterpriseId: '',
      isDisabled: false,
      compBrowseShow: false,
      inspectId: ''
    }
  },
  props: {
    searchData: {
      type: Object
    }
  },
  created() {
    // 初始化现场数据列表
    if (sessionStorage.getItem('inspectionResultHandle')) {
      this.currPage = Number(sessionStorage.getItem('inspectionResultHandle'))
    }
    this.getlistOfsiteinspection(this.searchData)
  },
  activated() {
    this.inspectId = ''
    this.getlistOfsiteinspection(this.searchData)
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
    changeEnter(data) {
      this.$store.commit('setInspectionResultComponent', 'inspectionResult')
      //  this.$emit("listenId",id)
      // tableId是现场检查记录id
      this.$store.commit('setTableId', data.id)
    },
    changeEnterDetail(id) {
      this.$emit('getSourceId', id)
      // 传到现场处理详情查询文书
      this.$store.commit('setSimpleId', id)
      this.$store.commit('setDetailFromRecords', false)
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
    //进入历史检查记录页面
    previousRecords(data) {
      this.drawer = true
      this.title = data.companyName
      this.InfoId = data.companyId
      this.showGetExamineCheckRecord()
    },
    // 退出历史检查记录页面
    back() {
      this.drawer = false
    },
    //历史检查记录展示
    showGetExamineCheckRecord() {
      this.loading = true
      getExamineCheckRecord({ companyId: this.InfoId })
        .then(res => {
          this.companyInfo = res.data.companyDto
          this.recordInfo = res.data.examineDtoList
          if (this.recordInfo.length > 0) {
            this.loading = false
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 初始化现场检查处理列表数据封装
    getlistOfsiteinspection(val) {
      this.loading = true
      getlistOfsiteinspectionRecord({
        // ...val,
        companyName: val ? (val.companyName ? val.companyName : '') : '',
        examineSourceCode: val.examineSourceCode ? val.examineSourceCode : '',
        examineType: val.examineType ? val.examineType : '',
        startTime: typeof val.checkTime === 'object' ? val.checkTime[0] : undefined, // 开始时间
        endTime: typeof val.checkTime === 'object' ? val.checkTime[1] : undefined, // 结束时间
        limit: '10',
        page: this.currPage.toString(),
        isMeas: '1'
      }).then(
        res => {
          console.log('检查结果处理', res)
          this.tableData = res.data.list
          this.totalCount = res.data.totalCount
          this.currPageCache = res.data.currPage
          this.loading = false
        },
        err => {
          console.log('请求失败：', err)
        }
      )
    },
    // 请求对应页数的数据list
    getNewPageList(val) {
      this.getlistOfsiteinspection(this.searchData)
      sessionStorage.setItem('inspectionResultHandle', this.currPage)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getlistOfsiteinspection(this.searchData)
    },
    indexMethod(index) {
      return (this.currPageCache - 1) * this.pageSize + index + 1
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
      this.inspectId = row.id
      console.info(this.inspectId)
    }
  },

  watch: {
    // 监控搜素条件，调用查询接口
    searchData: {
      handler(val) {
        // this.getlistOfsiteinspection(val);
        if (val) {
          this.getlistOfsiteinspection(val)
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapState(['writTypeInfo'])
  }
}
</script>

<style lang="less" scoped>
/deep/.el-table .cell.el-tooltip {
  text-overflow: clip;
}
/deep/.el-table .cell,
.el-table th div,
.el-table--border td:first-child .cell {
  padding-left: 20px;
}
.body {
  width: 98.5%;
  padding: 8px 8px 0;
  position: relative;
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
/deep/.el-button + .el-button {
  margin-left: 0px;
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
.handleClass {
  margin-left: 0px;
}
.el-button--danger:active,
.el-button--danger:focus {
  background: #fef0f0;
  color: #dd6161;
  border-color: #fbc4c4;
}
/deep/.el-drawer__header {
  border-bottom: 1px solid #ccc;
  padding: 10px 15px;
  margin: 0px !important;
}
/deep/.el-drawer__body {
  overflow-y: auto;
  padding-top: 35px;
  padding-left: 15px;
}
.dialog_container {
  height: 500px;
  overflow-y: scroll;
}
</style>
