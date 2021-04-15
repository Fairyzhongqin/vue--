<template>
  <div class="legal-todo-list">
    <search-bar :searchList="searchList" @searchTrigger="searchTrigger"></search-bar>

    <div class="list-container">
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
          >
            <el-table-column label="序号" width="70" align="center">
              <template slot-scope="scope">{{ scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column prop="caseName" label="案件名称" min-width="150" show-overflow-tooltip></el-table-column>

            <el-table-column prop="caseCrimeTime" label="立案时间" min-width="100" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="discTime" label="讨论时间" min-width="100" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="executorName" label="执法人员" min-width="150" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column width="160" label="操作" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button
                  class="shortBtn fourBtn"
                  @click="handleClick(scope.row, 'confirm')"
                  type="primary"
                  size="mini"
                  v-if="checkBtnShow(scope.row, 'confirm')"
                  >确认意见</el-button
                >
                <el-button class="shortBtn" @click="handleClick(scope.row, 'sign')" type="primary" size="mini" v-if="checkBtnShow(scope.row, 'sign')"
                  >签字</el-button
                >
                <el-button class="shortBtn" @click="handleClick(scope.row, 'review')" type="primary" size="mini">详情</el-button>
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
    <show-pdf
      v-if="showPdf"
      writName="集体讨论签字"
      :pdfId="signPdfId"
      :isGroupSign="true"
      :buttonList="buttonList"
      @closePdf="closePdf"
      @signSuccess="signSuccess"
    ></show-pdf>
    <!--选择执法人员弹窗 start-->
    <div v-if="peopleVisiable">
      <el-dialog :title="`选择${selectTitle}人员`" :visible.sync="peopleVisiable" width="900px" height="570px" :close-on-click-modal="false">
        <select-people @getPeople="getSelectedPeople" :selectNum="1"></select-people>
      </el-dialog>
    </div>
    <!--选择执法人员弹窗 end-->
  </div>
</template>

<script>
import searchBar from '@/components/searchBar'
import { getGroupSignList } from '@/api/groupDiscussion'
import selectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople'
import { getNowFormatDate } from '@/utils/util'
import showPdf from '@/components/showPdf'
import { getGroupSignUpdate } from "@/api/groupDiscussion"
export default {
  name: 'list',
  components: {
    searchBar,
    selectPeople,
    showPdf
  },
  data() {
    return {
      searchList: [
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
          name: '类型',
          codeName: 'type',
          type: 'selectFixedValue',
          default: [
            {
              value: '0',
              label: '确认意见'
            },
            {
              value: '1',
              label: '签名'
            }
          ],
          value: ''
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
      showPdf: false,
      signPdfId: '',
      currentId: '',
      buttonList: {
        updatePdf: false, // 回退编辑
        signPdf: true, // 签名
        auditPdf: false, // 提交审核
        sealPdf: false, // 加盖公章
        finishPdf: true, // 完成
        lawSealPdf: false, // 加盖执法专用章
        closePdf: true // 退出
      }
      // isFinish: '0' // 1 已听证，0 待
    }
  },
  created() {
    // if (this.$route.path === '/doneAudit') {
    //   this.isFinish = '1'
    // } else {
    //   this.isFinish = '0'
    // }
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
    closePdf() {
      this.showPdf = false
      this.getList()
    },
    getList() {
      this.loading = true
      // 搜索列表数据
      getGroupSignList({
        // isFinish: this.isFinish,
        type: this.searchInfo.type,
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

    handleClick(val, type) {
      this.currentId = val.id
      if (type === 'sign' || val.type === '1') {
        this.showSignPdf(val,type)
      } else {
        val.compType = type
        this.$emit('commitItemInfo', val)
        this.$store.commit('setCurrGroupComp', 'sign')
      }
    },

    showSignPdf(val, type) {
      if(type === 'review') {
        this.buttonList.signPdf = false
      } else {
        this.buttonList.signPdf = true
      }
      this.signPdfId = val.writId
      this.showPdf = true
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
          this.searchList[1].value = auditor[0]
        }
        if (this.selectPeopleType === 'audit') {
          this.submitPreAudit(auditor)
        }
      }
    },
    checkBtnShow(row, type) {
      let show = false
      switch (type) {
        case 'confirm':
          if (row.type === '0' && row.isFinish === '1') {
            show = true
          }
          break
        case 'sign':
          if (row.type === '1' && row.isFinish === '1') {
            show = true
          }
          break
      }
      return show
    },
    signSuccess() {
      getGroupSignUpdate({
        id: this.currentId
      })
      this.getList()
    }
  },
  watch: {
    $route(to, from) {
      this.tableData = []
      this.totalNum = 0
      this.currentPage = 1
      this.searchList.forEach(item => {
        item.value = item.value instanceof Array ? [] : item.value instanceof Object ? {} : ''
      })
      // if (to.path === '/doneAudit') {
      //   this.isFinish = '1'
      // } else {
      //   this.isFinish = '0'
      // }
      this.getList()
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.el-table--border th {
  border-color: #e0e0e0;
}
.legal-todo-list {
  position: relative;
  .list-container {
    padding: 8px;
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
      width: 75px;
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
