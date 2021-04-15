<template>
  <div class="body">
    <div class="body-content">
      <tips v-if="!compBrowseShow" :tipName="['综合', '浏览']" @clickHandle="clickHandle"></tips>

      <el-table
        :data="list"
        border
        fit
        v-loading="loading"
        style="width: 100%"
        :row-class-name="getRowClass"
        stripe
        highlight-current-row
        header-row-class-name="headerclass"
        :header-cell-style="getCellClass"
        @row-click="rowClick"
      >
        <el-table-column type="index" label="序号" :index="indexMethod" width="70" align="center"></el-table-column>
        <el-table-column label="当事人" min-width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.subject }}
            <!-- <a href="#" style="color:#1273EB;font-size:14px;"></a> -->
          </template>
        </el-table-column>
        <el-table-column label="案件名称" show-overflow-tooltip min-width="130">
          <template slot-scope="scope">
            <span v-if="scope.row.penaltyUndEntity.caseName">{{ scope.row.penaltyUndEntity.caseName }}</span>
            <span v-if="scope.row.penaltyUndEntity.caseName == null">-</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="65" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.penaltyUndEntity.caseEndTime">已结案</span>
            <span v-else-if="scope.row.penaltyUndEntity.caseCrimeTime">已立案</span>
            <span v-else>待立案</span>
          </template>
        </el-table-column>
        <el-table-column label="立案日期" show-overflow-tooltip min-width="80" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.penaltyUndEntity.caseCrimeTime">{{
              scope.row.penaltyUndEntity.caseCrimeTime ? scope.row.penaltyUndEntity.caseCrimeTime.split(' ')[0] : ''
            }}</span>
            <span v-if="!scope.row.penaltyUndEntity.caseCrimeTime">-</span>
          </template>
        </el-table-column>
        <el-table-column label="结案日期" show-overflow-tooltip min-width="80" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.penaltyUndEntity.caseEndTime">{{
              scope.row.penaltyUndEntity.caseEndTime ? scope.row.penaltyUndEntity.caseEndTime.split(' ')[0] : ''
            }}</span>
            <span v-if="!scope.row.penaltyUndEntity.caseEndTime">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="udtNames" label="承办人" align="center" show-overflow-tooltip min-width="100"></el-table-column>

        <el-table-column label="操作" min-width="280">
          <template slot-scope="scope">
            <el-button type="primary" class="fourBtn shortBtn" @click="checkEnter(scope.row, 'handle')">案件办理</el-button>
            <el-button type="primary" v-if="!scope.row.caseAuditStatus || scope.row.caseAuditStatus === 't01'" class="shortBtn" @click="enterPush(scope.row)"
              >转办</el-button
            >
            <el-button
              type="primary"
              v-if="
                scope.row.caseAuditStatus == null ||
                  scope.row.caseAuditStatus === '' ||
                  scope.row.caseAuditStatus === 'a003' ||
                  scope.row.caseAuditStatus === 'a001' ||
                  scope.row.caseAuditStatus === 't01'
              "
              class="shortBtn"
              @click="checkEnter(scope.row, 'modify')"
              >修改</el-button
            >
            <el-button
              type="danger"
              plain
              class="shortBtn"
              @click="delFilingRegister(scope.row.penaltyUndEntity.penaltyId)"
              v-if="!scope.row.caseAuditStatus"
              >删除</el-button
            >
            <el-button type="primary" class="shortBtn" @click="registration(scope.row, 'detail')">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-button class="selectButton" type="primary" style="margin-bottom: 10px" @click="registration">新增立案</el-button>
        <el-pagination
          :total="totalCount"
          :current-page.sync="currPage"
          :page-size="10"
          @current-change="getNewList"
          @size-change="handleSizeChange"
          layout="total, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
    <el-dialog title="选择转办人员" width="900px" height="600px" :visible.sync="showEnterPush">
      <select-people @getPeople="getSelectedPeople" :minNum="2" v-if="showEnterPush" :peopleCache="peopleCache"></select-people>
    </el-dialog>
    <comprehensive-browse v-if="compBrowseShow" @closeFrame="compBrowseShow = false" :nowMenu="currRow.penaltyUndEntity.sourceId?'300102':null"></comprehensive-browse>
  </div>
</template>

<script>
import { showFilingRegister, delFilingRegister, kindleCaseProcess, getCurrentProcess, getFilingRegister } from '@/api/filingRegister/index'
import selectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople' //选择转办人员
import { getKindled } from '@/utils/audit'
import { updateFilingRegister } from '@/api/filingRegister'
import tips from '@/components/writGroup/tips'
import comprehensiveBrowse from '@/pages/comprehensiveBrowse'
export default {
  name: 'dataTable',
  components: {
    selectPeople,
    tips,
    comprehensiveBrowse
  },
  props: {
    searchBarInfo: {
      type: [Object, Array]
    }
  },
  data() {
    return {
      list: [],
      totalCount: 0,
      currPage: 1,
      currPageCache: 1,
      pageSize: 10,
      content: '',
      showEnterPush: false,
      loading: true,
      penalty: {}, // 要进行转办的案件信息
      peopleCache: [], // 转办人员回显值
      currRow: {},
      compBrowseShow: false
    }
  },
  created() {
    if (sessionStorage.getItem('commonHandleCurrPage')) {
      this.currPage = Number(sessionStorage.getItem('commonHandleCurrPage'))
    }
    this.getShowFilingRegister({
      limit: '10',
      page: this.currPage.toString()
    })
    if (this.$route.query.penaltyId) {
      getFilingRegister({
        penalty: this.$route.query.penaltyId
      }).then(res => {
        this.currRow = res.data
        this.$store.commit('setPenalty', res.data)
        this.clickHandle()
      })
    }
  },
  activated() {
    this.getShowFilingRegister(this.searchBarInfo)
    this.currRow = {}
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
    //转办
    enterPush(data) {
      if (data) {
        this.penalty = data
        // let ids = data.penaltyUndEntity.udtIds.split(","),
        //   names = data.udtNames.split("，");
        // ids.forEach((id, ind) => {
        //   this.peopleCache.push({
        //     id: id,
        //     nickName: names[ind]
        //   });
        // });
      }
      this.showEnterPush = true
    },
    registration(penaltyData, type) {
      if (type === 'detail') {
        getFilingRegister({ penalty: penaltyData.penaltyUndEntity.penaltyId })
          .then(res => {
            const entity = res.data
            entity.isDetail = true
            this.$store.commit('setPenalty', entity)
            this.$store.commit('setCurrentComponent', 'newFilingRegister')
          })
          .catch(err => {
            console.log(err)
            this.$message({
              type: 'error',
              message: '调取详情失败'
            })
          })
      } else {
        if (penaltyData.isDetail) penaltyData.isDetail = false
        this.$store.commit('setPenalty', null)
        this.$store.commit('setCurrentComponent', 'newFilingRegister')
      }
    },
    rowClick(row, column, event) {
      getFilingRegister({
        penalty: row.penaltyUndEntity.penaltyId
      }).then(res => {
        this.currRow = res.data
        this.$store.commit('setPenalty', res.data)
      })
    },
    clickHandle() {
      if (this.currRow.penaltyUndEntity ? this.currRow.penaltyUndEntity.penaltyId : false) {
        if (!this.currRow.penaltyUndEntity.writNo && !this.currRow.penaltyUndEntity.sourceId) {
          this.$message({
            type: 'warning',
            message: '该案件暂无预览信息'
          })
        } else {
          this.compBrowseShow = true
        }
        
      } else {
        this.$message({
          type: 'warning',
          message: '请先选中一个案件'
        })
      }
    },
    checkEnter(penaltyData, type) {
      //重新调取详情接口把立案详情放在store中
      getFilingRegister({ penalty: penaltyData.penaltyUndEntity.penaltyId })
        .then(res => {
          const entity = res.data
          this.$store.commit('setPenalty', entity)
          // 获取当前流程及我的待办
          getKindled(entity.penaltyUndEntity, entity.penaltyUndEntity.penaltyId, type)
        })
        .catch(err => {
          console.log(err)
          this.$message({
            type: 'error',
            message: '调取详情失败'
          })
        })
    },
    // 获取转办人员
    getSelectedPeople(state, val) {
      if (state) {
        let idArr = [],
          updPen = {
            penaltyUndEntity: {
              udtIds: '',
              penaltyId: this.penalty.penaltyUndEntity.penaltyId
            }
          }
        val.forEach(item => {
          idArr.push(item.id)
        })
        updPen.penaltyUndEntity.udtIds = idArr.join(',')
        // 修改
        updateFilingRegister(updPen)
          .then(res => {
            this.$message({
              type: 'success',
              message: '转办成功'
            })
            this.getShowFilingRegister(this.searchBarInfo)
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '转办失败'
            })
          })
      }
      this.showEnterPush = !this.showEnterPush
    },
    // 展示立案登记记录
    getShowFilingRegister(val) {
      this.loading = true
      showFilingRegister({
        partyName: val.partyName ? val.partyName : '',
        caseName: val.caseName ? val.caseName : '',
        caseStatus: val.caseStatus ? val.caseStatus : '',
        udtIds: val.udtNames ? val.udtNames.id : '', // 检查人员id
        startTime: typeof val.caseCrimeTime === 'object' && val.caseCrimeTime[0] ? val.caseCrimeTime[0] + ' 00:00:00' : '', // 开始时间
        endTime: typeof val.caseCrimeTime === 'object' && val.caseCrimeTime[1] ? val.caseCrimeTime[1] + ' 23:59:59' : '', // 结束时间
        caseStartTime: typeof val.caseEndTime === 'object' && val.caseEndTime[0] ? val.caseEndTime[0] + ' 00:00:00' : '', // 开始时间
        caseEndTime: typeof val.caseEndTime === 'object' && val.caseEndTime[1] ? val.caseEndTime[1] + ' 23:59:59' : '', // 结束时间
        limit: '10',
        page: this.currPage.toString()
      })
        .then(res => {
          this.totalCount = res.page.totalCount
          this.currPageCache = res.page.currPage
          this.list = res.page.list
          if (this.list) {
            this.loading = false
          }
          // console.log(this.list, "////**---");
          this.list.forEach(val => {
            val.subject = val.penaltyUndEntity.objectType == '0' ? val.punishCompanyName : val.penaltyUndEntity.punishPersonName
          })
        })
        .catch(err => console.info(err))
    },
    // 删除单个立案登记记录
    delFilingRegister(penaltyId) {
      this.deleteData(penaltyId)
    },
    deleteData(penaltyId) {
      this.$confirm('确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(_ => {
          delFilingRegister({ penaltyId: penaltyId })
            .then(res => {
              if ((this.totalCount - 1) % (this.currPage - 1) === 0) {
                // 所删数据是当前页的最后一条数据时
                this.currPage = this.currPage - 1
              }
              this.getShowFilingRegister(this.searchBarInfo)
              // console.log(res);
              this.$message({
                type: 'success',
                message: '刪除成功！'
              })
              document.activeElement.blur()
            })
            .catch(err => {
              console.log(err)
              this.$message({
                type: 'error',
                message: '删除失败'
              })
            })
        })
        .catch(() => {
          document.activeElement.blur()
        })
    },
    // 请求对应页数的数据list
    getNewList(val) {
      sessionStorage.setItem('commonHandleCurrPage', this.currPage)
      this.getShowFilingRegister(this.searchBarInfo)
    },
    handleSizeChange(val) {
      this.pageSize = val
      console.log(this.pageSize)
      this.getShowFilingRegister(this.searchBarInfo)
    },
    indexMethod(index) {
      return (this.currPageCache - 1) * this.pageSize + index + 1
    },
    // 设置表格行的样式
    getRowClass({ row, rowIndex }) {
      let className = 'lineheight'
      if (row.penaltyUndEntity.caseStateId === '3') {
        // 逾期未下达决定书（红色）
        className = 'red-row'
      } else if (row.penaltyUndEntity.caseStateId === '4') {
        // 逾期后下达决定书（黄色）
        className = 'yellow-row'
      }
      return className
    }
  },
  watch: {
    searchBarInfo: {
      handler: function(val, oldVal) {
        this.currPage = 1
        this.getShowFilingRegister(val)
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-table .cell.el-tooltip {
  text-overflow: clip;
}

.body {
  width: 98.5%;
  padding: 8px 8px 0;
  .body-content {
    background: #ffffff;
    padding: 8px 11px 0;
    border-radius: 8px;
    position: relative;
    .el-table /deep/ thead {
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: bold;
      color: rgba(34, 34, 34, 1);
    }
    /deep/ .el-table--border th {
      border-color: #e0e0e0;
    }

    .el-table {
      padding: 8px;
    }
    .lineheight {
      height: 37px;
    }
    .el-table /deep/ tr.headerclass {
      height: 50px !important;
    }
    .el-table--border {
      border: 0px;
    }
    /deep/ .is-leaf {
      background: #e3eef6;
    }
    .pagination {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 10px 5px;
    }
    .check-button {
      padding: 9px 15px;
      height: 30px;
      line-height: 12px;
      width: 111px;
      margin-bottom: 16px;
    }
    .el-button--danger:active,
    .el-button--danger:focus {
      background: #fef0f0;
      color: #dd6161;
      border-color: #fbc4c4;
    }
  }
  .el-button + .el-button {
    margin-left: 0px;
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
  /deep/ .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    background: none;
  }
  /deep/ .el-pagination__jump {
    margin-left: 0px;
  }
  /deep/ .el-table th {
    padding: 12px 0px;
  }
  .el-table thead {
    color: #222222;
    font-size: 16px;
    font-family: PingFang SC;
  }
}
</style>
