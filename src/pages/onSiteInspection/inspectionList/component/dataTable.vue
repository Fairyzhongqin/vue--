<template>
  <!-- 现场检查记录列表 -->
  <div class="body xcjcjl_body">
    <div class="body-content">
      <tips v-if="!compBrowseShow" :tipName="['综合','浏览']" @clickHandle="clickHandle"></tips>
      <el-table
        :data="tableData"
        border
        fit
        style="width: 100%"
        row-class-name="lineheight"
        stripe
        highlight-current-row
        header-row-class-name="headerclass"
        :header-cell-style="getCellClass"
        v-loading="loading"
        @row-click="rowClick"
      >
        <el-table-column type="index" width="70" label="序号" :index="dataIndex" align="center"></el-table-column>
        <el-table-column prop="companyName" label="企业名称" min-width="220" show-overflow-tooltip>
          <template slot-scope="scope">
            <span
              style="cursor: pointer; text-decoration: underline;color: dodgerblue;"
              @click="viewEnterpriseInformation(scope.row,'modify','isDisabled')"
            >{{scope.row.companyName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="examineStartTime"
          label="实际检查时间"
          min-width="120"
          align="center"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="examineSourceName"
          label="检查形式"
          min-width="88"
          align="center"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="examineTypeName"
          label="检查方式"
          min-width="88"
          align="center"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="problemCount"
          align="center"
          label="一般/重大隐患"
          min-width="125"
        >
          <template slot-scope="scope">
            <span>{{scope.row.problemNum }}/{{ scope.row.greatProblemNum}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          show-overflow-tooltip
          prop="greatProblemNum"
          align="center"
          label="重大隐患"
          min-width="86"
        ></el-table-column>-->
        <el-table-column prop="book" label="签字文书" align="center" min-width="90">
          <template slot-scope="scope">
            <el-popover trigger="hover" placement="top">
              <div
                v-if="scope.row.writAccId && scope.row.writAccId !== '' && scope.row.examineStartTime"
                class="writ-list"
              >
                <span
                  v-for="(item, index) in scope.row.writAccList"
                  :key="index"
                  class="writ-list-data"
                >
                  <i class="el-icon-paperclip"></i>
                  <span class="writ-name" @click="seeSignWrit(item)">{{ item.accessoryName }}</span>
                  <i class="el-icon-error" @click="delSignWrit(item, scope.row)"></i>
                </span>
              </div>
              <div
                v-if="!scope.row.writAccId || scope.row.writAccId === '' && scope.row.examineStartTime"
                class="no-writ"
              >暂无签字文书</div>
              <div slot="reference" class="name-wrapper">
                <i
                  class="el-icon-paperclip"
                  v-if="scope.row.writAccId && scope.row.writAccId !== '' && scope.row.examineStartTime"
                  style="color: #0099FF; width: 18px; height: 16px"
                ></i>
                <span v-if="!scope.row.examineStartTime && scope.row.planExamineId">--</span>
                <i
                  class="el-icon-paperclip"
                  v-if="(!scope.row.writAccId || scope.row.writAccId === '') && scope.row.examineStartTime"
                  style="width: 18px; height: 16px"
                ></i>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="executorName"
          label="实际检查人员"
          min-width="120"
          align="center"
        ></el-table-column>

        <el-table-column label="操作" min-width="310" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="primary"
              v-show="!scope.row.examineStartTime && scope.row.planExamineId"
              @click="check(scope.row,'checkFlag')"
            >检查</el-button>
            <el-button
              type="primary"
              v-show="!scope.row.examineStartTime && scope.row.planExamineId"
              @click="giveCheck(scope.row)"
            >转办</el-button>
            <el-button
              type="primary"
              v-show="scope.row.examineStartTime"
              @click="updateInfo(scope.row.id, scope.row.planExamineId)"
            >修改</el-button>
            <el-button
              type="danger"
              plain
              v-show="!scope.row.planExamineId && !scope.row.writAccId"
              @click="deleteData(scope.row.id)"
            >删除</el-button>
            <el-button
              type="primary"
              v-show="scope.row.examineStartTime && scope.row.writId && scope.row.writId !== ''"
              @click="seePdf(scope.row)"
            >签名</el-button>

            <div style="display: inline-block">
              <el-upload
                action="#"
                multiple
                ref="upload"
                :show-file-list="false"
                :auto-upload="false"
                :on-change="getChangeInfo"
                v-show="scope.row.examineStartTime && scope.row.writId && scope.row.writId !== ''"
                :before-upload="beforeAvatarUpload"
              >
                <el-button type="primary" @click="handleEvent(scope.row)">上传签字文书</el-button>
              </el-upload>
            </div>
            <el-button
              type="primary"
              v-show="scope.row.examineStartTime"
              @click="showDetail(scope.row.id)"
            >详情</el-button>
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
        <el-button type="primary" class="check-button" @click="enterAddCheck">
          <span>特殊情形新增现场检查记录</span>
        </el-button>
        <el-pagination
          :total="totalCount"
          :current-page.sync="currPage"
          :page-size="10"
          @current-change="getNewList"
          layout="total, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
    <!-- 查看现场检查记录文书 -->
    <el-dialog
      :visible.sync="showPdfDialog"
      :title="dialogTitle"
      :class="getDialogClass"
      :before-close="setDialog"
    >
      <!-- <show-pdf :pdfId="pdfId" v-if="showPdfDialog && dialogContent === 'pdf'" :pdfType="pdfType" :isUserSign="1"></show-pdf> -->
      <!-- <other-writ v-if="showPdfDialog && dialogContent === 'otherWrit'" @showDiag="chooseWrit"></other-writ>
      <common-writ
        v-if="showPdfDialog && dialogContent === 'writDialog'"
        :info="info"
        :writType="writType"
        @createWrit="makeInspectionWrit"
        @toSeal="toSeal"
        @close="close"
      ></common-writ>-->
      <select-people
        v-if="showPdfDialog && dialogContent === 'selectPeople'"
        @getPeople="submitToAudition"
        :selectNum="selectOne"
        :minNum="selectMore"
      ></select-people>
      <img :src="imgUrl" alt v-if="dialogContent === 'img' && showPdfDialog" class="show-img" />
    </el-dialog>
    <show-pdf
      :pdfId="pdfId"
      v-if="dialogContent === 'pdf'"
      :pdfType="pdfType"
      :buttonList="writButton"
      @closePdf="closePdf"
      :writName="writName"
    ></show-pdf>
    <!-- <writ-group v-if="!compBrowseShow" :allWritInfo="allWritInfo"></writ-group> -->
    <comprehensive-browse
      v-if="compBrowseShow"
      nowMenu="400102"
      :inspectId="inspectId"
      @closeFrame="compBrowseShow=false"
    ></comprehensive-browse>
  </div>
</template>

<script>
import { getInspectionData, delInspection, getInspectionDetail, updateInspectionDetail } from '@api/onSiteInspection/index'
import baseUrl from '@/utils/webIp'
import { saveUpdate } from '@/api/inspectionScheme'
import selectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople'
import showPdf from '@/components/showPdf/index'
import otherWrit from '@/pages/inspectionResultHandle/componments/chooseOtherDocuDialog'
import commonWrit from '@/components/commonWrit'
import { createWrit, getWritInfo, updateWrit, deleteFile, uploadOther } from '@/api/fileRelated'
import { dateFormat, stringToDate, getWritParams, debounce } from '@/utils/util'
import writGroup from '@/components/writGroup'
import companyForm from '@/pages/enterpriseInfo/components/companyForm'
import { mapState } from 'vuex'
import tips from '@/components/writGroup/tips'
import comprehensiveBrowse from '@/pages/comprehensiveBrowse'
import { sealAudit } from '@api/common'
export default {
  name: 'dataTable',
  data() {
    return {
      caseId: '', //案件id
      tableData: [],
      currPage: 1,
      totalCount: 0,
      dialogContent: null,
      dialogTitle: '查看现场检查记录文书',
      dialogClass: 'big-dialog',
      pdfId: null,
      showPdfDialog: false,
      info: null,
      selectedItem: null,
      writType: null,
      audiReq: {}, // 文书 提交审核 或 盖章流程 参数
      currPageCache: 1,
      pageSize: 10,
      pdfType: null,
      imgUrl: null,
      selectOne: -1,
      selectMore: -1,
      uploadFileUrl: null,
      headers: {},
      params: {
        writId: '',
        type: '0' // 0 签字附件 1 其他附件
      },
      writButton: {},
      writName: null,
      allWritInfo: {},
      dialogVisible: false,
      compFormType: '', // 选择企业弹框的类型
      currentEnterpriseId: '',
      isDisabled: false,
      uploadTimer: null,
      uploadMyFiles: [],
      compBrowseShow: false,
      inspectId: '',
      loading: true
    }
  },
  components: {
    showPdf,
    otherWrit,
    commonWrit,
    selectPeople,
    writGroup,
    companyForm,
    tips,
    comprehensiveBrowse
  },
  props: {
    searchData: {
      type: Object
    }
  },
  activated() {
    this.inspectId = ''
    this.getInspectinList(this.searchData)
  },
  created() {
    this.uploadFileUrl = baseUrl + '/aj/writ/uploadWritAccessory'
    this.headers.Authorization = localStorage.getItem('token')
    this.getInspectinList(this.searchData)
  },
  methods: {
    rowClick(row, column, event) {
      this.inspectId = row.id
      this.allWritInfo = {
        sourceId: row.id,
        type: 'XCJCJL'
      }
    },
    // 给表头设置单独样式
    getCellClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0 && columnIndex === 8) {
        return 'background-image: linear-gradient(-225deg,#d0d6dc 0%, #B8DCFF 48%, #b0b8bf 100%);text-align:center;font-size:20px;font-weight:bolder;letter-spacing:1em'
      } else {
        return ''
      }
    },
    // 设置表格数据序号
    dataIndex(index) {
      return (this.currPageCache - 1) * this.pageSize + index + 1
    },
    //查看企业信息
    viewEnterpriseInformation(company, type, isDisabled) {
      if (isDisabled) {
        this.isDisabled = true
      } else {
        this.isDisabled = false
      }
      this.$store.commit('setNewRectificationShow')
      this.compFormType = type
      if (this.compFormType === 'modify') {
        this.currentEnterpriseId = company.companyId
      }
      this.dialogVisible = true
    },
    // 进入新增现场检查页面
    enterAddCheck() {
      this.$store.commit('setInspectionCurrentComponent', 'newInspection')
    },
    // 修改现场检查记录
    updateInfo(id, planExamineId) {
      this.$emit('updateInfo', id)
      if (planExamineId) {
        this.$store.commit('setCheckSource', true)
      }
    },
    // 初始化现场检查记录列表数据
    getInspectinList(val) {
      this.loading = true
      getInspectionData({
        companyName: val ? (val.companyName ? val.companyName : '') : '',
        executorId: val ? (typeof val.executor === 'object' ? val.executor.id : '') : '', // 检查人员id
        examineSourceCode: val ? (val.examineSourceCode ? val.examineSourceCode : '') : '',
        examineType: val ? (val.examineType ? val.examineType : '') : '',
        startTime: val ? (typeof val.checkTime === 'object' ? val.checkTime[0] : undefined) : '', // 开始时间
        endTime: val ? (typeof val.checkTime === 'object' ? val.checkTime[1] : undefined) : '', // 结束时间
        limit: '10',
        page: this.currPage.toString()
      }).then(
        res => {
          this.loading = false
          this.tableData = res.data.list
          this.currPageCache = res.data.currPage
          this.totalCount = res.data.totalCount
          this.pageSize = res.data.pageSize
        },
        err => {}
      )
    },
    // 删除现场检查记录
    deleteData(id) {
      this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delInspection({
          id: id
        }).then(
          () => {
            this.getInspectinList(this.searchData)
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
            // hack 本页恰好无数据且显示暂无数据问题 强制跳到首页
            if (this.totalCount === this.currPage * this.pageSize - 9) {
              this.currPage = 1
              this.getInspectinList()
            }
          },
          err => {
            this.$alert(err, null, {
              confirmButtonText: '确定'
            })
          }
        )
      })
    },
    // 请求对应页数的数据list
    getNewList(val) {
      console.info('getNewList')
      this.getInspectinList(this.searchData)
    },
    // 现场检查
    check(item, val) {
      this.valFlag = val
      this.$store.commit('setCheckFlag', this.valFlag)
      this.$emit('updateInfo', item.id, item.planExamineId)
    },

    // 转办
    giveCheck(row) {
      this.audiReq.partyId = row.companyId ? row.companyId : ''
      this.audiReq.partyName = row.companyName ? row.companyName : ''
      this.caseId = row.id
      this.showPdfDialog = true
      this.dialogContent = 'selectPeople'
      this.dialogTitle = '选择转办对象'
      this.dialogClass = 'select-people'
      this.selectMore = 2
      this.selectOne = -1
    },
    // 查看签字文书
    seeSignWrit(val) {
      if (val.accessoryType.indexOf('.pdf') !== -1) {
        this.pdfType = 'accessory'
        this.dialogContent = 'pdf'
        this.pdfId = val.accessoryId
        this.writName = '浏览签字文书'
      } else {
        this.dialogContent = 'img'
        let token = localStorage.getItem('token')
        this.imgUrl = val.accessoryUrl + '&token=' + token
        this.showPdfDialog = true
        this.dialogTitle = '查看签字文书'
        this.dialogClass = 'big-dialog'
      }
    },
    // 浏览文书
    seePdf(val) {
      if (val.writId && val.writId !== '') {
        this.pdfId = val.writId
        this.pdfType = null
        this.dialogContent = 'pdf'
        this.writName = '现场检查记录文书'
        this.writButton = {
          signPdf: true,
          closePdf: true,
          finishPdf: true
        }
      } else {
        this.$message({
          message: '该条数据没有文书',
          type: 'error'
        })
      }
    },
    setDialog() {
      this.dialogContent = null
      this.pdfId = null
      this.showPdfDialog = false
    },
    // 查看记录详情
    showDetail(id) {
      this.$emit('showDetail', id)
      this.$store.commit('setDetailFromRecords', true)
    },
    // 选择生成文书
    chooseWrit(key, type) {
      let question = ''
      if (key === '非职责范围安全问题移交单') {
        this.$confirm('检查项不能为空！', null, {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定'
        }).then(() => {
          this.showPdfDialog = false
          this.dialogContent = null
          this.dialogClass = null
        })
      } else {
        this.queryWrit(type)
        this.dialogTitle = key
        this.writType = key
        this.info = {
          writId: '',
          subject: this.selectedItem.companyName,
          sourceId: this.selectedItem.id,
          udtIds: this.selectedItem.executorId,
          companyName: this.selectedItem.companyName,
          checkTime: this.selectedItem.examineStartTime, //承办时间
          responsiblePerson: this.selectedItem.executorName //承办人
        }
      }
    },
    makeOtherWrit(item) {
      this.selectedItem = item
      this.showPdfDialog = true
      this.dialogClass = 'small-dialog'
      this.dialogContent = 'otherWrit'
    },
    // 生成文书
    makeInspectionWrit(params) {
      if (this.currWritId && this.currWritId !== '') {
        updateWrit({ writId: this.currWritId }, params.data).then(
          res => {
            this.showPdfDialog = true
            this.dialogContent = 'pdf'
            this.dialogClass = 'pdf-Dialog'

            this.pdfId = this.currWritId
          },
          err => {}
        )
      } else {
        createWrit(params).then(
          res => {
            this.pdfId = res.writId
            this.showPdfDialog = true
            this.dialogContent = 'pdf'
            this.dialogClass = 'pdf-Dialog'
          },
          err => {}
        )
      }
    },
    // 查询当前的文书
    queryWrit(type) {
      getWritInfo({
        sourceId: this.selectedItem.id,
        type: type
      }).then(res => {
        // 制作其他文书 及 行政强制措施文书
        this.currWritId = res.data[0] ? res.data[0].writId : ''
        this.info.writId = this.currWritId
        this.dialogContent = 'writDialog'
        this.dialogClass = 'big-dialog'
        this.showPdfDialog = true
      })
    },
    // 生成文书弹框点击取消按钮事件
    // close() {
    //   this.showPdfDialog = false;
    //   this.dialogContent = "";
    // },
    // 选择审批审核
    toSeal(audiReq) {
      this.audiReq = audiReq
      this.showPdfDialog = true
      this.dialogContent = 'selectPeople'
      this.dialogTitle = '选择审核人员'
      this.selectOne = 1
    },
    // 提交审批审核
    submitToAudition(bool, auditor) {
      this.showPdfDialog = false
      this.dialogContent = ''
      // this.selectOne = -1;
      // this.selectMore = -1;
      if (!bool) return
      if (this.selectOne !== -1 && this.selectMore === -1) {
        this.audiReq.handlerDeptId = auditor[0].deptId
        this.audiReq.handlerUserId = auditor[0].id
        this.audiReq.requestTime = dateFormat(new Date(), 'yyyy年mm月dd日')
        sealAudit(this.audiReq)
          .then(res => {
            this.selectOne = -1
            this.selectMore = -1
            this.$message({
              type: 'success',
              message: '提交审核成功！'
            })
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: '提交审核失败'
            })
          })
      }
      if (this.selectMore !== -1 && this.selectOne === -1) {
        let arr = auditor.reduce((total, item) => {
          total.push(item.id)
          return total
        }, [])
        let params = {
          id: this.caseId,
          executorId: arr.join(',')
        }
        console.info('转办成功呀', params)
        // 调用接口向下走流程
        updateInspectionDetail(params).then(res => {
          if (res.code === '0') {
            this.getInspectinList()
            this.$message({
              message: '转办成功',
              type: 'success'
            })
            this.sourceId = res.id
            this.selectMore = -1
            this.selectOne = -1
            // this.$emit('changeView', 'isList')
          } else {
            this.$message({
              showClose: true,
              message: '转办失败',
              type: 'error'
            })
          }
        })
      }
    },
    // 关闭浏览pdf
    closePdf() {
      this.dialogContent = null
      this.writButton = {}
    },
    getChangeInfo(file, fileList) {
      let typeList = 'image/jpeg/image/jpg/image/png/application/pdf/JPEG/JPG/PNG/PDF'
      if (typeList.indexOf(file.name.substring(file.name.lastIndexOf('.') + 1)) < 0) {
        // this.$refs.upload.uploadFiles = [];
        this.uploadMyFiles = []
        this.$message({
          type: 'error',
          message: '请上传正确的附件格式：图片或PDF文件！'
        })
      } else {
        this.uploadMyFiles.push(file)
        this.uploadFiles()
      }
    },
    beforeAvatarUpload(file) {
      let fileNameReg = /[#$@&%',;=?$/]/gi
      if (fileNameReg.test(file.name)) {
        this.$alert('文件名不能包含特殊字符，请修改后再试', null, {
          confirmButtonText: '确定',
          callback: action => {}
        })
        return false
      }
      return true
    },
    uploadFiles() {
      if (this.uploadTimer) {
        clearTimeout(this.uploadTimer)
      }
      let that = this
      this.uploadTimer = setTimeout(function() {
        let fileData = new FormData()
        // let files = that.$refs.upload.uploadFiles;
        let files = that.uploadMyFiles
        files.forEach(item => {
          fileData.append('file', item.raw)
        })
        fileData.append('writId', that.params.writId)
        fileData.append('type', that.params.type)
        // that.$refs.upload.uploadFiles = [];
        that.uploadMyFiles = []
        uploadOther(fileData).then(
          res => {
            if (res.code === '0') {
              that.$message({
                type: 'success',
                message: '文件上传成功！'
              })
              that.getInspectinList(that.searchData)
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              })
            }
          },
          err => {
            that.$message({
              type: 'error',
              message: err
            })
          }
        )
      }, 3000)
    },
    handleEvent(item) {
      if (item.writId && item.writId !== '') {
        this.params.writId = item.writId
      } else {
        this.$alert('该条数据没有文书', null, {
          confirmButtonText: '确定'
        })
      }
    },
    delSignWrit(item, scope) {
      deleteFile({
        accessoryId: item.accessoryId,
        writId: scope.writId,
        type: '0'
      }).then(
        res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getInspectinList(this.searchData)
        },
        err => {
          this.$message({
            showClose: true,
            message: '转办失败',
            type: 'error'
          })
        }
      )
    },
    // 关闭浏览pdf
    closePdf() {
      this.dialogContent = null
      this.writButton = {}
    },
    getChangeInfo(file, fileList) {
      let typeList = 'image/jpeg/image/jpg/image/png/application/pdf/JPEG/JPG/PNG/PDF'
      if (typeList.indexOf(file.name.substring(file.name.lastIndexOf('.') + 1)) < 0) {
        // this.$refs.upload.uploadFiles = [];
        this.uploadMyFiles = []
        this.$message({
          type: 'error',
          message: '请上传正确的附件格式：图片或PDF文件！'
        })
      } else {
        this.uploadMyFiles.push(file)
        this.uploadFiles()
      }
    },
    beforeAvatarUpload(file) {
      let fileNameReg = /[#$@&%',;=?$/]/gi
      if (fileNameReg.test(file.name)) {
        this.$alert('文件名不能包含特殊字符，请修改后再试', null, {
          confirmButtonText: '确定',
          callback: action => {}
        })
        return false
      }
      return true
    },
    uploadFiles() {
      if (this.uploadTimer) {
        clearTimeout(this.uploadTimer)
      }
      let that = this
      this.uploadTimer = setTimeout(function() {
        let fileData = new FormData()
        // let files = that.$refs.upload.uploadFiles;
        let files = that.uploadMyFiles
        files.forEach(item => {
          fileData.append('file', item.raw)
        })
        fileData.append('writId', that.params.writId)
        fileData.append('type', that.params.type)
        // that.$refs.upload.uploadFiles = [];
        that.uploadMyFiles = []
        uploadOther(fileData).then(
          res => {
            if (res.code === '0') {
              that.$message({
                type: 'success',
                message: '文件上传成功！'
              })
              that.getInspectinList(that.searchData)
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              })
            }
          },
          err => {
            that.$message({
              type: 'error',
              message: err
            })
          }
        )
      }, 3000)
    },
    handleEvent(item) {
      if (item.writId && item.writId !== '') {
        this.params.writId = item.writId
      } else {
        this.$alert('该条数据没有文书', null, {
          confirmButtonText: '确定'
        })
      }
    },
    delSignWrit(item, scope) {
      deleteFile({
        accessoryId: item.accessoryId,
        writId: scope.writId,
        type: '0'
      }).then(
        res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getInspectinList(this.searchData)
        },
        err => {
          this.$message({
            message: '删除失败',
            type: 'error'
          })
        }
      )
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
    }
  },
  computed: {
    getDialogClass() {
      return this.dialogClass
    }
  },
  watch: {
    // 监控搜索条件，调用查询接口
    searchData: {
      handler: function(val, oldVal) {
        if (val) {
          // 非空判断
          this.getInspectinList(val)
        }
      },
      deep: true,
      immediate: false
    }
  }
}
</script>

<style lang="less" scoped>
.xcjcjl_body {
  .body-content {
    /*  /deep/ .all-writ-group {
      right: 85px;
    } */
  }
}

/* 修改element表头错位的问题 */

/deep/ .el-table th.gutter {
  display: table-cell !important;
}

.el-table {
  /deep/ .el-table__fixed-right {
    height: 100% !important;
  }

  /deep/ .el-table__fixed {
    height: 100% !important;
  }
}

/deep/ .el-table colgroup.gutter {
  display: table-cell !important;
}

.delete {
  background: rgba(255, 48, 48, 0.1) !important;
  border-color: rgba(255, 48, 48, 0.1) !important;

  /deep/ span {
    color: rgba(255, 48, 48, 1) !important;
  }
}

/deep/.el-table .cell.el-tooltip {
  text-overflow: clip;
}

.el-table /deep/ tr.headerclass {
  height: 50px !important;
}

.writ-list {
  display: flex;
  flex-direction: column;

  .writ-name {
    display: inline-block;
    padding-left: 5px;
    color: #0099ff;
    margin-right: 20px;
  }

  .writ-list-data {
    &:hover {
      cursor: pointer;
      // text-decoration: underline;
    }
  }
}

.select-people {
  /deep/ .el-dialog {
    width: 900px;
  }
}

.show-img {
  width: 100%;
  height: 100%;
}

.no-writ {
  text-align: center;
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

/deep/ .el-table--border th {
  border-color: #e0e0e0;
}

.el-table--border {
  border-radius: 0px;
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
}

.body {
  padding: 8px 8px 0;
  width: 98.5;
  position: relative;

  .body-content {
    background: #ffffff;
    padding: 16px 16px 0;
    border-radius: 8px;

    // .el-table--border {
    //   // border-radius: 8px;
    // }
    /deep/ .is-leaf {
      background: #e3eef6;
    }

    .pagination {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 14px 0 15px 0;

      .check-button {
        padding: 9px 15px;
        height: 30px;
        line-height: 12px;
        width: 195px;
      }
    }
  }

  .button-color {
    color: #fefefe;

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

  // .el-button {
  //   padding: 0;
  //   margin-left: 0;
  //   line-height: 23px;
  //   padding-left: 3px;
  // }
  /deep/.el-button + .el-button {
    margin: 0px;
  }

  .small {
    width: 40px;
  }

  .middle {
    width: 66px;
  }

  .big {
    width: 96px;
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
}

.pdf-Dialog {
  /deep/ .el-dialog {
    width: 50%;
  }
}

.big-dialog {
  /deep/ .el-dialog {
    width: 990px;
    // height: 70%;
    // overflow: hidden;
  }

  /deep/.el-dialog__header {
    height: 6%;
  }

  /deep/ .el-dialog__body {
    height: 94%;
  }
}

.small-dialog {
  /deep/ .el-dialog {
    width: 30%;
    height: 70%;
  }
}

.el-table .cell .el-button {
  height: 24px;
  padding: 7px 4px;
  min-width: 40px;
  height: 24px;
  // background: rgba(0, 153, 255, 1);
  border-radius: 5px;
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
</style>