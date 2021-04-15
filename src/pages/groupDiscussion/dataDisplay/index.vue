<template>
  <div class="legal-todo-list">
    <search-bar :searchList="searchList" @searchTrigger="searchTrigger"></search-bar>

    <div class="list-container">
      <tips v-if="isFinish==='0'" :tipName="['发送', '通知']" @clickHandle="clickHandle"></tips>
      <div class="list">
        <el-row class="table-bar">
          <el-table
            v-loading="loading"
            :data="tableData"
            header-row-class-name="table_header"
            :header-cell-style="getCellClass"
            :row-class-name="getRowClass"
            @selection-change="handleSelectionChange"
            border
            style="width: 100%"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="序号" width="70" align="center">
              <template slot-scope="scope">{{ scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column prop="caseName" label="案件名称" min-width="200" show-overflow-tooltip></el-table-column>
            <el-table-column prop="caseReasonName" label="案由" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="caseCrimeTime" label="立案时间" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column label="类别" min-width="120" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>
                  {{ scope.row.flag === 1 ? '集体讨论（法核后）' : '集体讨论（听证后）' }}
                </span>
              </template>
            </el-table-column>

            <!-- <el-table-column label="签字文书" min-width="90" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="status">
                  <i v-if="scope.row.file!=='none'" class="el-icon-paperclip" :class="scope.row.file"></i>
                  <span v-if="scope.row.file==='none'">--</span>
                </span>
              </template>
            </el-table-column>-->

            <el-table-column v-if="isFinish === '1'" label="讨论结果" width="100" show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="status" :class="checkType(scope.row.isFinish, scope.row.isPass).color">{{
                  checkType(scope.row.isFinish, scope.row.isPass).value
                }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="executorName" label="执法人员" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column min-width="220" label="操作" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button class="shortBtn fourBtn" type="primary" size="mini" v-if="scope.row.isFinish === '0'" @click="toTheRecord(scope.row, 'record')"
                  >讨论记录</el-button
                >
                <el-button
                  class="shortBtn"
                  type="primary"
                  size="mini"
                  v-if="scope.row.isFinish === '0' && scope.row.writNum !== 0 && !scope.row.canStop"
                  @click="finishDiscussion(scope.row)"
                  >结束</el-button
                >
                <el-button type="primary" class="shortBtn" size="mini" @click="toTheRecord(scope.row, 'preview')">详情</el-button>
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
      <el-dialog :title="`请选择${selectTitle}`" :visible.sync="peopleVisiable" width="1000px" height="570px" :close-on-click-modal="false">
        <select-people
          @getPeople="getSelectedPeople"
          :selectByRole="selectTitle==='通知人员'"
          :peopleCache="cachePeople"
          :minNum="selectPeopleType === 'notice' ? 2 : null"
          :selectNum="selectPeopleType === 'notice' ? null : 1"
        ></select-people>
      </el-dialog>
    </div>
    <!--选择执法人员弹窗 end-->

    <el-dialog title="结束集体讨论" class="finishDialog" :visible.sync="finishVisiable" width="380px" :close-on-click-modal="false">
      <select-type :currentId="currentRow.id" @hasFinish="hasFinish"></select-type>
    </el-dialog>

    <!-- 发起集体讨论通知 -->
    <el-dialog title="集体讨论通知" :visible.sync="groupNoticeVisiable">
      <el-form ref="groupNotice" :model="groupNotice" :rules="rules" label-position="left" label-width="100px" class="groupNotice">
        <el-row :gutter="20" style="padding: 0 25px">
          <el-col :span="24">
            <el-form-item prop="caseName">
              <div slot="label" class="slot_label">案件名称</div>
              <el-input type="textarea" v-model="groupNotice.caseName" autosize></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="discussName">
              <div slot="label" class="slot_label">会议名称</div>
              <el-input type="textarea" v-model="groupNotice.discussName" autosize></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="time">
              <div slot="label" class="slot_label">讨论时间</div>
              <el-date-picker v-model="groupNotice.time" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="讨论时间"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="address">
              <div slot="label" class="slot_label">地点</div>
              <el-input type="textarea" v-model="groupNotice.address" autosize></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="peoples">
              <div slot="label" class="slot_label">通知人员</div>
              <el-input type="text" v-model="groupNotice.peoples" @focus="selectPeople('notice')"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24">
            <el-form-item label="讨论内容：" prop="groupInfo">
              <el-input type="textarea" v-model="groupNotice.groupInfo" autosize></el-input>
            </el-form-item>
          </el-col>-->
        </el-row>

        <!-- groupInfo -->
        <div class="dialog-footer" style="text-align: right">
          <el-button @click="closeGroupNotice">取 消</el-button>
          <el-button type="primary" @click="sendGroupNotice" :loading="sendLoading">发送通知</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import selectType from '../components/selectType'
import searchBar from '@/components/searchBar'
import tips from '@/components/writGroup/tips'
import { getPenaltydiscList, getNoticeInfo, submitNotice } from '@/api/groupDiscussion'
import selectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople'
import { dateFormat, stringToDate, debounce } from '@/utils/util'
export default {
  name: 'list',
  components: {
    searchBar,
    selectPeople,
    selectType,
    tips
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
          name: '案由',
          codeName: 'ay',
          type: 'select',
          url: '/aj/sys/sysdict/list',
          value: '',
          data: {
            type: 'reson_case'
          }
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
        }
      ],
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
      userInfo: {},
      finishVisiable: false,
      currentRow: {},
      groupNotice: {
        caseName: '案件名称',
        discussName: '会议名称',
        time: null,
        address: '',
        peoples: '',
        peopleIds: ''
        // groupInfo: ""
      },
      loading: false,
      groupNoticeVisiable: false,
      selectPeopleType: '',
      rules: {
        caseName: [{ required: true, message: ' ', trigger: 'blur' }],
        discussName: [{ required: true, message: ' ', trigger: 'blur' }],
        time: [{ required: true, message: ' ', trigger: 'blur' }],
        address: [{ required: true, message: ' ', trigger: 'blur' }],
        peoples: [{ required: true, message: ' ', trigger: 'blur' }]
        // groupInfo: [{ required: true, message: " ", trigger: "blur" }]
      },
      cachePeople: [],
      selectTitle: '通知人员',
      isFinish: '0',
      sendLoading: false,
      caseIds: '',
      discIds: ''
    }
  },
  created() {
    if (this.$route.path === '/doneDiscussion') {
      this.isFinish = '1'
    } else {
      this.isFinish = '0'
    }

    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (sessionStorage.getItem('groupDiscussionCurrPage')) {
      this.currentPage = Number(sessionStorage.getItem('groupDiscussionCurrPage'))
    }
    this.getList()
  },
  mounted() {
    this.sendGroupNotice = debounce(this.sendGroupNotice, 1000)
  },
  methods: {
    // 给表头设置单独样式
    getCellClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0 && columnIndex === 8) {
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
      // console.log(this.listType);
    },
    toTheRecord(data, compType) {
      data.compType = compType
      this.$emit('commitItemInfo', data)
      this.$store.commit('setCurrDiscussionComp', 'record')
    },
    searchTrigger(val) {
      // 搜索栏 回调
      this.searchInfo = val
      this.getList()
    },
    getList() {
      this.loading = true
      // 搜索列表数据
      getPenaltydiscList({
        isFinish: this.isFinish,
        caseReasonCode: this.searchInfo.ay,
        auditStatus: this.searchInfo.yxzt,
        caseName: this.searchInfo.ajmc,
        endTime: this.searchInfo.sj ? this.searchInfo.sj[1] : '',
        executorId: this.searchInfo.zfry ? this.searchInfo.zfry.id : '',
        limit: '10',
        page: this.currentPage + '',
        partyName: this.searchInfo.dsr,
        startTime: this.searchInfo.sj ? this.searchInfo.sj[0] : ''
      }).then(res => {
        if (res.code === '0') {
          this.tableData = res.page.list
          this.currentPage = res.page.currPage
          this.totalNum = res.page.totalCount
          this.loading = false
        }
      })
    },
    hasFinish() {
      this.finishVisiable = false
      this.getList()
    },
    handleCurrentChange(val) {
      // 翻页事件
      this.loading = true
      this.currentPage = val
      sessionStorage.setItem('groupDiscussionCurrPage', this.currentPage)
      this.getList()
    },
    // hearing(val) {
    //   // 列表-组织听证
    // },
    // 给间隔行设置样式
    getRowClass({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'strip_row'
      }
    },
    selectPeople(type) {
      if (type === 'notice') {
        this.selectPeopleType = type
        this.selectTitle = '通知人员'
      } else {
        this.cachePeople = []
        this.selectPeopleType = 'audit'
        this.selectTitle = '执法人员'
      }
      this.peopleVisiable = true
    },
    // 获取执法人员弹框返回数据
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
        if (this.selectPeopleType === 'notice') {
          let _psArr = [],
            _pisArr = []
          auditor.map(item => {
            _psArr.push(item.nickName)
            _pisArr.push(item.id)
          })
          this.groupNotice.peoples = _psArr.join(',')
          this.groupNotice.peopleIds = _pisArr.join(',')
          this.cachePeople = auditor
        } else {
          this.cachePeople = []
          this.searchList[2].value = auditor[0]
        }
      }
    },
    finishDiscussion(row) {
      this.currentRow = row
      this.finishVisiable = true
    },
    checkType(isFinish, isPass) {
      let status = {
        color: '',
        value: '未知'
      }
      if (isFinish === '0') {
        status.color = 'green'
        status.value = '进行中'
      }
      if (isFinish === '1') {
        if (isPass === '0') {
          status.value = '已通过'
          status.color = 'blue'
        }
        if (isPass === '1') {
          status.value = '不通过'
          status.color = 'red'
        }
      }
      return status
    },

    closeGroupNotice() {
      this.groupNoticeVisiable = false
    },
    sendGroupNotice() {
      this.$refs.groupNotice.validate(valid => {
        if (valid) {
          this.sendLoading = true
          let req = {
            acceptIds: this.groupNotice.peopleIds,
            caseName: this.groupNotice.caseName,
            discussName: this.groupNotice.discussName,
            // createTime: '编制时间',
            // createUser: this.userInfo.userEntity.id,
            discussAddress: this.groupNotice.address,
            // discussContent: this.groupNotice.groupInfo,
            discussTime: dateFormat(this.groupNotice.time, 'yyyy-mm-dd HH:MM:ss'),
            id: this.currentRow.noticeId, // 这条通知自己的id
            penaltyId: this.currentRow.caseId,
            sourceId: this.currentRow.id
            // updateTime: "更新时间",
            // updateUser: this.userInfo.userEntity.id
          }
          submitNotice({ caseIds: this.caseIds, discIds: this.discIds }, req).then(res => {
            this.sendLoading = false
            if (res.code === '0') {
              this.$message({
                type: 'success',
                message: '发送成功！'
              })
              this.groupNoticeVisiable = false // 有内容可发送
              this.getList()
            } else {
              this.$message({
                type: 'error',
                message: '发送失败！'
              })
            }
          })
        }
      })
    },
    handleSelectionChange(val) {
      this.currentRow = val
    },
    clickHandle() {
      let row = this.currentRow
      if (row && row.length) {
        let _caseName,
          _discussName,
          _caseIds,
          _discIds,
          _returnMsg = ''
        row.map((item, index) => {
          if (!index) {
            _caseName = item.caseName
            _discussName = `讨论${item.caseName}`
            ;(_caseIds = item.caseId), (_discIds = item.id)
            if (item.isAudit === 1) {
              _returnMsg = item.caseName
            }
          } else {
            _caseName += `、${item.caseName}`
            _discussName += `、${item.caseName}`
            _caseIds += `,${item.caseId}`
            _discIds += `,${item.id}`
            if (item.isAudit === 1) {
              _returnMsg += !_returnMsg ? `${item.caseName}` : `、${item.caseName}`
            }
          }
        })
        if (_returnMsg) {
          this.$message({
            type: 'warning',
            message: `案件“${_returnMsg}”已发送过通知，请不要重复发送！`
          })
          return
        }

        this.caseIds = _caseIds
        this.discIds = _discIds
        this.groupNotice = {
          caseName: _caseName,
          discussName: _discussName,
          time: null,
          address: this.userInfo.sysDeptEntity.deptAddress,
          peoples: '',
          peopleIds: ''
          // groupInfo: ""
        }
        this.groupNoticeVisiable = true
      } else {
        this.$message({
          type: 'warning',
          message: '请先选中一个案件'
        })
      }
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
      if (to.path === '/doneDiscussion') {
        this.isFinish = '1'
      } else {
        this.isFinish = '0'
      }
      this.getList()
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-icon-loading {
  line-height: 0;
}
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
      & th:first-child {
        text-align: left;
        padding-left: 8px;
      }
    }
    /deep/.el-table__body-wrapper {
      .el-table-column--selection {
        .cell {
          text-align: center;
        }
      }
    }
    /deep/ .strip_row {
      background: #f4f8fa;
    }
    /deep/ .el-button + .el-button {
      margin-left: 0;
    }
    .blue {
      color: #0099ff;
    }
    .status {
      &::before {
        content: '•';
        margin-right: 8px;
      }
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

    .el-table__body .cell .shortBtn {
      width: 40px;
      height: 24px;
      font-size: 14px;
      padding: 7px 2px !important;
    }
    .el-table__body .cell .fourBtn {
      width: 66px;
      height: 24px;
      font-size: 14px;
      padding: 7px 2px;
    }
    .el-table__body .cell .eightBtn {
      width: 121px;
      height: 24px;
      font-size: 14px;
      padding: 7px 2px;
    }
  }
  .groupNotice {
    .el-form-item {
      margin-bottom: 0;
    }
    .el-input__icon .el-icon-time {
      line-height: 30px !important;
      border: 1px solid red;
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    padding-right: 16px;
    border-top: 1px solid #e0e0e0;
    padding: 10px 25px;
  }
}
.finishDialog {
  margin-top: 120px;
  .el-form-item {
    margin-bottom: 0;
    &:last-child {
      margin-bottom: 2px;
    }
  }
}
</style>
