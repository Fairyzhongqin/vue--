<template>
  <!-- 检查方案列表 -->
  <div class="list-page">
    <search-bar :searchList="search" @searchTrigger="searchTrigger"></search-bar>
    <div class="list-container">
      <tips v-if="!compBrowseShow" :tipName="['综合', '浏览']" @clickHandle="clickHandle"></tips>
      <div class="list">
        <el-row>
          <el-button type="primary" size="mini" @click="createPlan()" class="create-button">新建检查方案</el-button>
          <!-- <el-button type="primary"
                     size="mini"
          @click="patchDoc()">补录签字文书</el-button>-->
        </el-row>

        <!--列表 start-->
        <el-table
          :data="tableData"
          border
          fit
          v-loading="loading"
          style="width: 100%"
          row-class-name="lineheight"
          stripe
          highlight-current-row
          header-row-class-name="headerclass"
          :header-cell-style="getCellClass"
          @current-change="handleCurrentChange"
          @row-click="rowClick"
        >
          <!-- <el-table-column type="index"
                           min-width="48"
                           label=' '>
          </el-table-column>-->
          <el-table-column label="序号" width="70" :index="indexMethod" align="center">
            <template slot-scope="scope">{{ (currentPage - 1) * pageSize + scope.$index + 1 }}</template>
          </el-table-column>
          <el-table-column min-width="220" show-overflow-tooltip label="企业名称">
            <template slot-scope="scope">
              <span
                style="cursor: pointer; text-decoration: underline;color: dodgerblue;"
                @click="viewEnterpriseInformation(scope.row, 'modify', 'isDisabled')"
              >{{ scope.row.companyName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="examineTime"
            show-overflow-tooltip
            min-width="120"
            label="计划检查时间"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="examSocCodeName"
            show-overflow-tooltip
            min-width="90"
            label="检查形式"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="examineTypeName"
            show-overflow-tooltip
            min-width="90"
            label="检查方式"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="executorName"
            show-overflow-tooltip
            min-width="100"
            label="执法人员"
            align="center"
          ></el-table-column>
          <el-table-column prop="auditStatusName" min-width="120" label="运行状态" align="center">
            <template slot-scope="scope">
              <div
                class="status"
                :class="{
                  'text-blue': scope.row.auditStatusName === '待提交',
                  'text-green': scope.row.auditStatusName === '待审核',
                  'text-red': scope.row.auditStatusName === '审核不通过'
                }"
              >
                <div style="height: 7px;display: inline-block;">
                  <div
                    class="point"
                    :class="{
                      'point-blue': scope.row.auditStatusName === '待提交',
                      'point-green': scope.row.auditStatusName === '待审核',
                      'point-red': scope.row.auditStatusName === '审核不通过'
                    }"
                  ></div>
                </div>
                {{ scope.row.auditStatusName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            fixed="right"
            min-width="230"
            min-height="87"
            label="操作"
            class="caozuo"
          >
            <template slot-scope="scope">
              <el-button
                @click="isEdit(scope.row)"
                type="primary"
                v-if="
                  scope.row.auditStatusName === '待提交' ||
                    scope.row.auditStatusName === '审核不通过' ||
                    scope.row.auditStatusName === '审批不通过' ||
                    scope.row.auditStatusCode === 't01'
                "
              >修改</el-button>
              <el-button
                type="primary"
                v-if="scope.row.auditStatusName === '待审核' || scope.row.auditStatusName === '待审批' || scope.row.auditStatusCode === 't03'"
                @click="isRemind(scope.row)"
              >催办</el-button>
              <el-button
                type="primary"
                v-if="scope.row.auditStatusName === '审批通过' && scope.row.isFinish == 0"
                @click="isCheck(scope.row, 'checkFlag')"
              >检查</el-button>
              <el-button
                type="danger"
                plain
                class="delete"
                v-if="scope.row.auditStatusName === '待提交'"
                @click="isDel(scope.row)"
              >删除</el-button>
              <el-button
                type="primary"
                v-if="
                  scope.row.writId &&
                    (scope.row.auditStatusName === '待提交' ||
                      scope.row.auditStatusName === '审核不通过' ||
                      scope.row.auditStatusName === '审批不通过' ||
                      scope.row.auditStatusCode === 't01')
                "
                class="test"
                @click="isSubmit(scope.row)"
              >提交审核</el-button>
              <el-button @click="isView(scope.row)" type="primary">详情</el-button>
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
            :current-page.sync="currentPage"
            :page-size="10"
            @current-change="getNewList"
            @size-change="handleSizeChange"
            layout="total, prev, pager, next, jumper"
          ></el-pagination>
        </div>
        <!--列表 end-->
      </div>
    </div>

    <!--选择执法人员弹窗 start-->
    <div v-if="peopleVisiable">
      <el-dialog
        title="选择执法人员"
        :visible.sync="peopleVisiable"
        width="900px"
        height="600px"
        :close-on-click-modal="false"
      >
        <select-people @getPeople="getSelectedPeople" :selectNum="1"></select-people>
      </el-dialog>
    </div>
    <!--选择执法人员弹窗 end-->

    <!--选择审核人员弹窗 start-->
    <div v-if="peopleReviewVisiable">
      <el-dialog
        title="选择审核人员"
        :visible.sync="peopleReviewVisiable"
        width="900px"
        height="600px"
        :close-on-click-modal="false"
      >
        <select-people @getPeople="getSelectedReviewer" :selectNum="1"></select-people>
      </el-dialog>
    </div>
    <!--选择审核人员弹窗 end-->
    <comprehensive-browse
      nowMenu="400101"
      v-if="compBrowseShow"
      :inspectId="inspectId"
      :planExamineId="planExamineId"
      @closeFrame="compBrowseShow = false"
    ></comprehensive-browse>
  </div>
</template>

<script>
import { submitReview, planexamine, delexamine, urge } from '@/api/inspectionScheme'
import { getNowFormatDate } from '@/utils/util'
import searchBar from '@/components/searchBar'
import selectPeople from '../../onSiteInspection/newInspection/component/selectPeople'
import companyForm from '@/pages/enterpriseInfo/components/companyForm'
import tips from '@/components/writGroup/tips'
import comprehensiveBrowse from '@/pages/comprehensiveBrowse'

export default {
  components: {
    searchBar,
    selectPeople,
    companyForm,
    tips,
    comprehensiveBrowse
  },
  data() {
    return {
      search: [
        {
          name: '企业名称',
          codeName: 'companyName',
          type: 'text',
          value: ''
        },
        {
          name: '计划检查时间',
          codeName: 'examineTime',
          type: 'date',
          value: ''
        },
        {
          name: '运行状态',
          codeName: 'auditStatusCode',
          type: 'selectFixedValue',
          default: [
            {
              value: 'a00',
              label: '待提交'
            },
            {
              value: 'a01',
              label: '待审核'
            },
            {
              value: 'a002',
              label: '待审批'
            },
            {
              value: 'a001',
              label: '审核不通过'
            },
            {
              value: 'a004',
              label: '审批通过'
            },
            {
              value: 'a003',
              label: '审批不通过'
            },
            {
              value: 'fhsyj',
              label: '返回上一级'
            }
          ],
          value: ''
        },
        {
          name: '检查形式',
          codeName: 'examSocCode',
          type: 'select',
          url: '/aj/sys/sysdict/list',
          data: { type: 'source_examine' },
          value: ''
        },
        {
          name: '检查方式',
          codeName: 'examineType',
          type: 'select',
          url: '/aj/sys/sysdict/list',
          data: { type: 'type_examine' },
          value: ''
        },
        {
          name: '执法人员',
          codeName: 'executorId',
          type: 'dialog',
          value: '',
          event: this.selectPeople
        }
      ],
      searchData: {},
      loading: false,
      tableData: [],
      currentPage: 1,
      currPageCache: 1,
      pageSize: 10,
      totalCount: 0,
      peopleVisiable: false, // 选择执法人员弹框状态
      peopleReviewVisiable: false, // 选择审核人员弹框状态
      checkedRow: '', // 当前选择的提交审核的行
      currentRow: '',
      dialogVisible: false,
      compFormType: '', // 选择企业弹框的类型
      currentEnterpriseId: '',
      isDisabled: false,
      compBrowseShow: false,
      inspectId: '',
      planExamineId: ''
    }
  },
  created() {
    if (sessionStorage.getItem('inspectionSchemeCurrPage')) {
      this.currentPage = Number(sessionStorage.getItem('inspectionSchemeCurrPage'))
    }
    this.searchList()
  },
  activated() {
    this.loading = true
    this.searchList()
    this.inspectId = ''
  },
  methods: {
    // 给表头设置单独样式
    getCellClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0 && columnIndex === 7) {
        return 'background-image: linear-gradient(-225deg,#d0d6dc 0%, #B8DCFF 48%, #b0b8bf 100%);text-align:center;font-size:20px;font-weight:bolder;letter-spacing:1em'
      } else {
        return ''
      }
    },
    handleCurrentChange(val) {
      this.currentRow = val
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
        this.currentEnterpriseId = data.companyId
      }
      this.dialogVisible = true
    },
    selectPeople() {
      // 打开选择人员弹框
      this.peopleVisiable = true
    },
    searchTrigger(data) {
      this.searchData = data
      this.searchList()
    },
    createPlan() {
      // 新建方案
      this.$emit('changeView', 'isCreate')
    },
    patchDoc() {
      // 补录文书
      this.$emit('changeView', 'patchDoc')
    },
    getSelectedPeople(state, val) {
      // 选择执法人员
      if (state) {
        this.search[5].value = val[0]
      }
      this.peopleVisiable = false
    },
    getSelectedReviewer(state, val) {
      // 选择审核人员
      if (state) {
        this.submit(val[0].deptId, val[0].id)
      } else {
        this.peopleReviewVisiable = false
      }
    },
    submit(deptId, id) {
      // 提交审核
      this.peopleReviewVisiable = false
      submitReview({
        auditTypeCode: 'ta80003',
        handlerDeptId: deptId,
        handlerUserId: id,
        requestDeptName: this.checkedRow.executorDeptName,
        requestId: this.checkedRow.writId,
        requestTime: getNowFormatDate(),
        requestUsersName: this.checkedRow.executorName,
        submitterCause: this.checkedRow.companyName,
        requestUsersIds: this.checkedRow.executorId,
        partyId: this.checkedRow.companyId,
        partyName: this.checkedRow.companyName
      }).then(
        res => {
          if (res.code === '0') {
            this.$message({
              showClose: true,
              message: '提交成功',
              type: 'success'
            })

            this.searchList()
          } else {
            this.$message({
              showClose: true,
              message: '提交失败',
              type: 'error'
            })
          }
        },
        // eslint-disable-next-line handle-callback-err
        err => {
          this.$message({
            showClose: true,
            message: '接口出错',
            type: 'error'
          })
        }
      )
    },

    searchList() {
      this.loading = true
      planexamine({
        companyName: this.searchData.companyName, // 企业名称
        startTime: this.searchData.examineTime && typeof this.searchData.examineTime === 'object' ? this.searchData.examineTime[0] : undefined, // 开始时间
        endTime: this.searchData.examineTime && typeof this.searchData.examineTime === 'object' ? this.searchData.examineTime[1] : undefined, // 结束时间
        auditCode: this.searchData.auditStatusCode, // 运行状态
        examSocCode: this.searchData.examSocCode, // 检查形式
        examineType: this.searchData.examineType, // 检查方式
        executorId: this.searchData.executorId ? this.searchData.executorId.id : '', // 检查人员id
        page: this.currentPage.toString()
      }).then(res => {
        this.loading = false
        if (res.data.list.length === 0 && this.currentPage > 1) {
          this.currentPage = this.currentPage - 1
          this.searchList()
        } else {
          this.totalCount = res.data.totalCount
          this.currPageCache = res.data.currPage
          this.tableData = res.data.list
          this.tableData.map(res => {
            if (res.examineTime) {
              res.examineTime = res.examineTime.toString().substring(0, 10)
            }
          })
        }
      })
    },
    isView(val) {
      // 查看
      // console.log("现在的页码", this.currentPage);
      this.$store.commit('keepCurrentPage', this.currentPage)
      this.$emit('changeView', 'isView', val.id)
      // console.log("state里存的页码", this.$store.state.keepCurrentPage);
    },
    isEdit(val) {
      // 修改
      this.$emit('changeView', 'isCreate', val.id)
    },
    isCheck(val, flag) {
      // 检查
      console.log(val)

      let userName = JSON.parse(sessionStorage.getItem('userInfo')).userEntity.nickName
      if (val.executorName.indexOf(userName) !== -1) {
        this.$store.commit('setInspectionCurrentComponent', 'newInspection')
        this.$store.commit('setRouteInspectionId', val.examineId)
        this.$store.commit('setRouteSchemeId', val.id)
        this.valFlag = flag
        this.$store.commit('setCheckFlag', this.valFlag)
        this.$router.push({
          path: '/onSiteInspection',
          params: {
            id: val.examineId,
            schemeId: val.id
          }
        })
      } else {
        this.$message({
          message: '非当前检查方案执法人员，不可进行执法检查。',
          type: 'warning'
        })
      }
    },
    isRemind(val) {
      // 提醒
      let date
      if (!val.messageTime) {
        date = new Date()
      } else {
        date = new Date(val.messageTime)
      }
      const dateZh =
        date.getFullYear() +
        '年' +
        (date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1) +
        '月' +
        (date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()) +
        '日' +
        (date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()) +
        '时' +
        (date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()) +
        '分'
      this.$confirm('上一次提醒时间是：' + dateZh + '，确定提醒吗？', '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      })
        .then(() => {
          urge({
            sourceId: val.writId
          })
            .then(res => {
              if (res.code === '0') {
                this.$message({
                  type: 'success',
                  message: '提醒已发送!'
                })
                this.searchList()
              } else {
                this.$message({
                  type: 'error',
                  message: '提醒失败!'
                })
              }
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '提醒失败!'
              })
            })
        })
        .catch(() => {})
    },
    getNewList(val) {
      this.searchList()
      sessionStorage.setItem('inspectionSchemeCurrPage', this.currentPage)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.searchList()
    },
    indexMethod(index) {
      return (this.currPageCache - 1) * this.pageSize + index + 1
    },
    isSubmit(val) {
      // 提交审核
      console.log(val)
      this.checkedRow = val
      this.peopleReviewVisiable = true
    },
    isDel(val) {
      // 删除
      this.$confirm('此操作将永久删除该检查方案, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        delexamine({
          id: val.id
        })
          .then(res => {
            if (res.code === '0') {
              this.$message.success('删除成功')
              this.searchList()
            } else {
              this.$message.error('删除失败')
            }
          }) // eslint-disable-next-line handle-callback-err
          .catch(error => {
            this.$message.error('网络错误')
          })
      })
    },
    clickHandle() {
      if (this.inspectId) {
        this.compBrowseShow = true
      } else {
        this.$message({
          type: 'warning',
          message: '请选择一个已审批通过的方案'
        })
        // if(this.planExamineId) {
        //   this.$message({
        //     type: 'warning',
        //     message: '该方案暂无检查记录'
        //   })
        // } else {
        //   this.$message({
        //     type: 'warning',
        //     message: '请先选中一个案件'
        //   })
        // }
      }
    },
    rowClick(row) {
      console.info(row.examineId)
      this.inspectId = row.examineId
      this.planExamineId = row.id
    }
  }
}
</script>

<style lang="less" scoped>
.el-table /deep/ tr.headerclass {
  height: 50px !important;
}

/deep/.el-table .cell.el-tooltip {
  text-overflow: clip;
}

.lineheight {
  height: 37px;
}

.el-table /deep/ thead {
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: bold;
  color: rgba(34, 34, 34, 1);
}

.el-table .cell,
.el-table th {
  display: table-cell !important;
  padding-left: 16px !important;
}

.list-page {
  position: relative;
  width: 100%;
  // overflow-y: auto !important;
}

.list-container {
  position: relative;
  padding: 8px;
  width: 98.5%;
  height: 540px;

  .list {
    background-color: #fff;
    border: 1px solid rgba(221, 221, 221, 1);
    box-shadow: 0px 2px 4px 0px rgba(220, 229, 230, 1);
    padding: 16px;
    border-radius: 8px;

    .create-button {
      font-size: 14px;
    }

    .el-table {
      margin-top: 16px;

      /deep/ .el-table__fixed-right {
        height: 100% !important;
      }

      /deep/ .el-table__fixed {
        height: 100% !important;
      }

      /deep/ .el-button + .el-button {
        margin-left: 0;
      }
    }

    .el-table--border {
      border-radius: 0px;
      border-left: 1px solid transparent;
      border-right: 1px solid transparent;
    }

    /deep/ .is-leaf {
      background: #e3eef6;
    }

    /deep/ .el-table--border th {
      border-color: #e0e0e0;

      &:last-child {
        border-color: #ebeef5;
      }
    }

    .isenabled {
      display: inline-block;
      line-height: 23px;

      span {
        display: inline-block;
      }
    }

    .pagination {
      display: flex;
      flex-direction: row-reverse;
      padding: 10px 0 0 0;
    }

    .point {
      width: 4px;
      height: 4px;
      background: #222222;
      border-radius: 50%;
      // position: absolute;
      // top: calc(50% - 2px);
      // left: calc(33% - 18px);
      // display: inline-block;
    }

    .status {
      width: 100%;
      // text-align: center;
      // padding-left: 20px;
    }

    .point-blue {
      background: #0099ff;
    }

    .point-green {
      background: #1cc09b;
    }

    .point-red {
      background: #ff2525;
    }

    .text-blue {
      color: #0099ff;
    }

    .text-green {
      color: #1cc09b;
    }

    .text-red {
      color: #ff2525;
    }
  }
}

.el-table .cell .el-button {
  height: 24px;
  padding: 7px 4px;
  width: 40px;
  height: 24px;
  background: rgba(0, 153, 255, 1);
  border-radius: 5px;
}

.test {
  width: 66px !important;
  padding: 7px 2px !important;
}

.delete {
  background: rgba(255, 48, 48, 0.1) !important;

  /deep/ span {
    color: rgba(255, 48, 48, 1) !important;
  }
}

.dialog_container {
  height: 500px;
  overflow-y: scroll;
}
</style>
