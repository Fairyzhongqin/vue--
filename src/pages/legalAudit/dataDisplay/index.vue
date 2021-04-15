<template>
  <div class="legal-todo-list">
    <search-bar :searchList="searchList" @searchTrigger="searchTrigger"></search-bar>

    <div class="list-container">
      <tips v-if="!compBrowseShow" :tipName="['综合', '浏览']" @clickHandle="clickHandle"></tips>
      <div class="list">
        <el-row class="table-bar">
          <el-table
            :data="tableData"
            header-row-class-name="table_header"
            :header-cell-style="getCellClass"
            :row-class-name="getRowClass"
            border
            v-loading="loading"
            style="width: 100%"
            highlight-current-row
            @row-click="rowClick"
          >
            <el-table-column label="序号" width="70" align="center">
              <template slot-scope="scope">{{ scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column prop="partyName" label="当事人" min-width="130" show-overflow-tooltip></el-table-column>
            <el-table-column prop="caseName" label="案件名称" min-width="150" show-overflow-tooltip></el-table-column>

            <el-table-column prop="caseCrimeTime" label="立案时间" min-width="100" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="运行状态" width="140" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                <span class="status" :class="checkAudCode(scope.row.auditStatusCode).color">{{ checkAudCode(scope.row.auditStatusCode).about }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="executorName" label="执法人员" min-width="150" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column width="200" label="操作" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button class="shortBtn fourBtn" @click="post(scope.row)" type="primary" size="mini" v-if="checkBtnShow(scope.row, 'pfsh')"
                  >派发预审</el-button
                >
                <el-button class="shortBtn threeBtn" @click="preExamine(scope.row)" type="primary" size="mini" v-if="checkBtnShow(scope.row, 'ysh')"
                  >预审核</el-button
                >
                <el-button class="shortBtn" @click="examine(scope.row)" type="primary" size="mini" v-if="checkBtnShow(scope.row, 'zzsh')">审核</el-button>
                <el-button class="shortBtn" @click="goToDetail(scope.row)" type="primary" size="mini">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row class="pagination">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="totalNum"
          ></el-pagination>
        </el-row>
      </div>
    </div>

    <!--选择执法人员弹窗 start-->
    <div v-if="peopleVisiable">
      <el-dialog :title="`选择${selectTitle}人员`" :visible.sync="peopleVisiable" width="900px" height="570px" :close-on-click-modal="false">
        <select-people @getPeople="getSelectedPeople" :selectNum="1"></select-people>
      </el-dialog>
    </div>
    <!--选择执法人员弹窗 end-->

    <comprehensive-browse v-if="compBrowseShow" @closeFrame="compBrowseShow = false"></comprehensive-browse>
  </div>
</template>

<script>
import searchBar from '@/components/searchBar'
import { getExamineList, handlePenalty } from '@/api/lawExamine'
import selectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople'
import { getNowFormatDate } from '@/utils/util'
import tips from '@/components/writGroup/tips'
import comprehensiveBrowse from '@/pages/comprehensiveBrowse'
import { getFilingRegister } from '@/api/filingRegister/index'
export default {
  name: 'list',
  components: {
    searchBar,
    selectPeople,
    tips,
    comprehensiveBrowse
  },
  data() {
    return {
      searchList: [
        {
          name: '当事人',
          codeName: 'dsr',
          type: 'text',
          value: ''
        },
        {
          name: '案件名称',
          codeName: 'ajmc',
          type: 'text',
          value: ''
        },
        {
          name: '执法人员',
          codeName: 'zfry',
          type: 'dialog',
          value: '',
          event: this.selectPeople
        },
        {
          name: '立案时间',
          codeName: 'sj',
          type: 'date',
          value: ''
        },
        {
          name: '运行状态',
          codeName: 'yxzt',
          type: 'selectFixedValue',
          default: [
            {
              value: 'b01',
              label: '待审核'
            },
            {
              value: 'b03',
              label: '派发预审中'
            },
            {
              value: 'b031,b032',
              label: '预审后待审核'
            }
          ],
          value: ''
        }
      ],
      todoOption: [
        {
          value: 'b01',
          label: '待审核'
        },
        {
          value: 'b03',
          label: '派发预审中'
        },
        {
          value: 'b031,b032',
          label: '预审后待审核'
        }
      ],
      doneOption: [
        {
          value: 'b041,b051',
          label: '审核通过'
        },
        {
          value: 'b042,b052',
          label: '审核不通过'
        },
        {
          value: 'a01,b02,ts002,ts001',
          label: '已退回'
        }
      ],
      loading: false,
      tableData: [], // 列表数据
      currentPage: 1, // 翻页 当前页
      totalNum: 0, // 翻页 总页数
      searchInfo: {
        dsr: '',
        ajmc: '',
        ay: '',
        zfry: '',
        sj: '',
        yxzt: ''
      },
      peopleVisiable: false,
      selectPeopleType: '',
      auditInfo: null, // 目前点击的审核流程信息，供转预审核使用
      userInfo: {},
      selectTitle: '执法',
      isFinish: '0', // 1 已听证，0 待
      compBrowseShow: false,
      currRow: null
    }
  },
  created() {
    if (this.$route.path === '/doneAudit') {
      this.isFinish = '1'
    } else {
      this.isFinish = '0'
    }
    if (sessionStorage.getItem('legalAuditCurrPage')) {
      this.currentPage = Number(sessionStorage.getItem('legalAuditCurrPage'))
    }
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.getList()
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
    getRoute() {
      if (this.$route.path === 'legalTodo') {
        this.listType = '待处理'
      } else {
        this.listType = '已处理'
      }
      console.log(this.listType)
    },
    searchTrigger(val) {
      // 搜索栏 回调
      this.searchInfo = val
      this.getList()
    },
    getList() {
      this.loading = true
      // 搜索列表数据
      getExamineList({
        isFinish: this.isFinish,
        auditStatus: this.searchInfo.yxzt,
        caseName: this.searchInfo.ajmc,
        endTime: this.searchInfo.sj ? this.searchInfo.sj[1] : '',
        executorId: this.searchInfo.zfry ? this.searchInfo.zfry.id : '',
        limit: '10',
        page: this.currentPage + '',
        partyName: this.searchInfo.dsr,
        startTime: this.searchInfo.sj ? this.searchInfo.sj[0] : '',
        fromType: '2'
      }).then(res => {
        if (res.code === '0') {
          this.currentPage = res.page.currPage
          this.tableData = res.page.list
          this.totalNum = res.page.totalCount
          this.loading = false
        }
      })
    },
    handleCurrentChange(val) {
      // 翻页事件
      this.loading = true
      this.currentPage = val
      this.getList()
      sessionStorage.setItem('legalAuditCurrPage', this.currentPage)
    },
    goToDetail(val) {
      // 列表-查看详情
      // 添加compType字段以区分
      val.compType = 'review'
      this.$emit('commitItemInfo', val)
      this.$store.commit('setCurrentAuditComponent', 'audit')
    },
    post(val) {
      // 列表-派发预审
      this.selectTitle = '预审'
      this.peopleVisiable = true
      this.selectPeopleType = 'audit'
      this.auditInfo = val
    },
    examine(val) {
      // 列表-审核
      val.compType = 'audit'
      this.$emit('commitItemInfo', val)
      this.$store.commit('setCurrentAuditComponent', 'audit')
    },
    preExamine(val) {
      // 列表-预审核
      val.compType = 'preAudit'
      this.$emit('commitItemInfo', val)
      this.$store.commit('setCurrentAuditComponent', 'audit')
    },
    // 给间隔行设置样式
    getRowClass({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'strip_row'
      }
    },
    selectPeople() {
      this.selectTitle = '执法'
      this.peopleVisiable = true
      this.selectPeopleType = 'search'
    },
    getSelectedPeople(bool, auditor) {
      this.peopleVisiable = false
      if (!bool) return
      if (auditor.length === 0) {
        this.$message({
          showClose: true,
          message: '请选择审核人员',
          type: 'error'
        })
      } else {
        if (this.selectPeopleType === 'search') {
          this.searchList[2].value = auditor[0]
        }
        if (this.selectPeopleType === 'audit') {
          this.submitPreAudit(auditor)
        }
      }
    },
    submitPreAudit(auditor) {
      // 派发法规员审核
      handlePenalty({
        auditResultCode: 'b03',
        auditResultOption: '',
        auditTypeCode: 'ta80016',
        auditStatus: '',
        executorId: this.auditInfo.executorId,
        caseId: this.auditInfo.caseId,
        caseName: this.auditInfo.caseName,
        handlerDeptId: auditor[0].deptId,
        handlerUserId: auditor[0].id,
        parentTaskId: this.auditInfo.parentTaskId, // 缺字段
        partyName: this.auditInfo.partyName,
        partyId: this.auditInfo.partyId ? this.auditInfo.partyId : '',
        requestDeptName: this.auditInfo.requestDeptName, // 实例未传
        requestId: this.auditInfo.requestId,
        requestTime: getNowFormatDate(true),
        requestUsersName: this.auditInfo.requestUserName,
        submitterCause: this.auditInfo.caseName,
        requestUsersIds: this.auditInfo.executorId
      }).then(res => {
        if (res.code === '0') {
          this.getList()
          this.$message({
            type: 'success',
            message: '派发成功！'
          })
        } else {
          this.$message({
            type: 'error',
            message: '派发失败！'
          })
        }
      })
    },
    checkAudCode(code) {
      let flowName = {
        about: '',
        exact: '',
        color: ''
      }
      switch (code) {
        case 'a01':
          // 第二次提交审核

          flowName.about = '法制审核中'
          flowName.exact = '法制审核中'
          flowName.color = 'blue'
          if (this.isFinish === '1') {
            flowName.about = '已退回'
            flowName.exact = '已退回'
            flowName.color = 'red'
          }
          break
        case 'b02':
          // 第二次提交审核
          if (this.isFinish === '1') {
            flowName.about = '已退回'
            flowName.exact = '已退回'
            flowName.color = 'red'
          } else {
            flowName.about = '法制审核不通过'
            flowName.exact = '法制审核不通过'
            flowName.color = 'red'
          }
          break
        case 'b01':
          // 可派发 可直接审核（先走b04）

          flowName.about = '待审核'
          flowName.exact = '法制审核通过'
          flowName.color = 'green'
          break
        case 'b03':
          // 可预审
          flowName.about = '派发预审中'
          flowName.exact = '派发法律审核'
          flowName.color = 'green'
          if (this.isFinish === '1') {
            flowName.about = '派发预审中'
            flowName.exact = '派发预审中'
            flowName.color = 'green'
          }

          break
        case 'b04':
          // 虚拟节点
          if (this.isFinish === '1') {
            flowName.about = '已退回'
            flowName.exact = '已退回'
            flowName.color = 'red'
          }
          break
        case 'b031':
          // 可最终审核(法规员同意)
          flowName.about = '预审后待审核'
          flowName.exact = '派发法规员同意'
          flowName.color = 'green'
          break
        case 'b032':
          // 可最终审核(法规员不同意)
          flowName.about = '预审后待审核'
          flowName.exact = '派发法规员不同意'
          flowName.color = 'green'
          break
        case 'b041':
          flowName.about = '审核通过'
          flowName.exact = '直接审核同意'
          flowName.color = 'green'
          break
        case 'b042':
          flowName.about = '审核不通过'
          flowName.exact = '直接审核不同意'
          flowName.color = 'red'
          break
        case 'b051':
          flowName.about = '审核通过'
          flowName.exact = '派发后审核同意'
          flowName.color = 'green'
          break
        case 'b052':
          flowName.about = '审核不通过'
          flowName.exact = '派发后审核不同意'
          flowName.color = 'red'
          break
        case 'tfs01':
          flowName.about = '已退回'
          flowName.exact = '已退回'
          flowName.color = 'red'
          break
        case 'tfs02':
          flowName.about = '已退回'
          flowName.exact = '已退回'
          flowName.color = 'red'
          break
        default:
          break
      }
      return flowName
    },
    checkBtnShow(row, type) {
      let show = false
      switch (type) {
        case 'ysh':
          if ('b03' === row.auditStatusCode && this.userInfo.userEntity.id === row.staffId) {
            show = true
          }
          break
        case 'zzsh':
          if (
            ('b01' === row.auditStatusCode || 'b031' === row.auditStatusCode || 'b032' === row.auditStatusCode) &&
            this.userInfo.userEntity.id === row.leaderId
          ) {
            show = true
          }
          break
        case 'pfsh':
          if ('b01' === row.auditStatusCode && this.userInfo.userEntity.id === row.leaderId) {
            show = true
          }
          break
      }
      return show
    },
    clickHandle() {
      if (this.currRow && this.currRow.penaltyUndEntity.penaltyId) {
        this.compBrowseShow = true
      } else {
        this.$message({
          type: 'warning',
          message: '请先选中一个案件'
        })
      }
    },
    rowClick(row) {
      getFilingRegister({
        penalty: row.caseId
      }).then(res => {
        this.currRow = res.data
        this.$store.commit('setPenalty', res.data)
      })
    }
  },
  watch: {
    $route(to, from) {
      this.currRow = null
      this.tableData = []
      this.totalNum = 0
      this.currentPage = 1
      this.searchList.forEach(item => {
        item.value = item.value instanceof Array ? [] : item.value instanceof Object ? {} : ''
      })

      
      if (to.path === '/doneAudit') {
        this.isFinish = '1'
        this.searchList[this.searchList.length-1].default = this.doneOption
      } else {
        this.isFinish = '0'
        this.searchList[this.searchList.length-1].default = this.todoOption
      }
      this.getList()
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-table--border th {
  border-color: #e0e0e0;
}
.legal-todo-list {
  position: relative;
  .list-container {
    padding: 8px;
    position: relative;
    .list {
      border-radius: 8px;
      background-color: #fff;
      border: 1px solid rgba(221, 221, 221, 1);
      box-shadow: 0px 2px 4px 0px rgba(220, 229, 230, 1);
      padding: 16px;
      .pagination {
        display: flex;
        flex-direction: row-reverse;
      }
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
    }
    /deep/ .el-table__header {
      table-layout: auto;
    }
    /deep/ .el-button + .el-button {
      margin-left: 0;
    }
    /deep/ .strip_row {
      background: #f4f8fa;
    }
    .status::before {
      content: '•';
      margin-right: 8px;
    }
    .blue {
      color: #0099ff;
    }
    .red {
      color: #ff2525;
    }
    .green {
      color: #1cc09b;
    }
    .black::before {
      content: '';
    }
    .el-table__body .cell .shortBtn {
      width: 40px;
      height: 24px;
      font-size: 14px;
      padding: 7px 2px !important;
    }
    .el-table__body .cell .threeBtn {
      width: 58px;
      height: 24px;
      font-size: 14px;
      padding: 7px 2px;
    }
    .el-table__body .cell .fourBtn {
      // width: 66px;
      width: 70px;
      height: 24px;
      font-size: 14px;
      padding: 7px 2px;
    }
  }
}
</style>
