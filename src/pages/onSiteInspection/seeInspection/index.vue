<template>
  <div class="new-inspection" :class="forBrowse?'for_browse':''">
    <div>
      <sn-page-bar v-if="!isShow">
        <template slot="button">
          <el-button type="text" icon="el-icon-arrow-left" @click="backPage">返回</el-button>
        </template>
        <!-- <div class="header-title">检查结果处理详情页面</div> -->
        <div v-show="!isInspectionDetail">
          <div class="tabStyle">
            <el-tabs type="card" v-model="tabName">
              <el-tab-pane label="检查结果处理" name="first">
                <el-row>
                  <el-col :span="12">
                    <span>企业名称：{{ detailInfo.companyName }}</span>
                  </el-col>
                  <el-col :span="12">
                    <span
                      v-if=" detailInfo.examineStartTime !== null"
                    >检查时间：{{ `${detailInfo.examineStartTime} - ${detailInfo.examineEndTime}` }}</span>
                    <span v-else>检查时间：</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <span>检查场所：{{ detailInfo.examineSite }}</span>
                  </el-col>
                  <el-col :span="12">
                    <span>检查形式：{{ detailInfo.examineSourceName ? detailInfo.examineSourceName :detailInfo.examineSource}}</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <span>执法人员：{{ detailInfo.executorName }}</span>
                  </el-col>
                  <el-col :span="12">
                    <span>执法部门：{{ detailInfo.executorDeptName }}</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <span>检查方式：{{ detailInfo.examineTypeName }}</span>
                  </el-col>
                </el-row>
                <div class="header-status_seeInspection">
                  <div style="min-width: 70px">检查情况：</div>
                  <div>{{ detailInfo.examineSituation }}</div>
                </div>
                <detail-data :checkList="detailInfo.probList"></detail-data>
                <div
                  class="proof-list_seeInspection"
                  :style="forBrowse?'padding-bottom:50px':''"
                  v-if="proofList && proofList.length > 0"
                >
                  <div v-for="(item, index) in proofList" :key="index" class="proof">
                    <down-proof :proof="item" :canDel="false" @removeProof="delProof"></down-proof>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="检查结果处理文书汇总" name="second" :lazy="false">
                <!-- 文书 -->
                <div class="docStyle" v-if="docDatalist && docDatalist.length > 0">
                  <make-document
                    v-for="(item,index) in docDatalist"
                    :key="index"
                    :docData="item"
                    :auditInfo="auditInfo"
                    @afterDelete="afterDelete"
                    @previewWrit="previewWrit"
                    @toSeal="toSeal"
                    @modifyWrit="chooseWrit"
                    @afterUpload="initDocuList"
                    @userSign="userSign"
                    :readOnly="true"
                  ></make-document>
                </div>
                <sn-empty-data text="暂无检查结果处理文书汇总" v-if="!docDatalist || docDatalist.length === 0"></sn-empty-data>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <!-- 现场检查记录详情页面 -->
        <div v-show="isInspectionDetail">
          <el-row>
            <el-col :span="12">
              <span>企业名称：{{ detailInfo.companyName }}</span>
            </el-col>
            <el-col :span="12">
              <span
                v-if=" detailInfo.examineStartTime !== null"
              >检查时间：{{ `${detailInfo.examineStartTime} - ${detailInfo.examineEndTime}` }}</span>
              <span v-else>检查时间：</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <span>检查场所：{{ detailInfo.examineSite }}</span>
            </el-col>
            <el-col :span="12">
              <span>检查形式：{{ detailInfo.examineSourceName ? detailInfo.examineSourceName :detailInfo.examineSource}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <span>执法人员：{{ detailInfo.executorName }}</span>
            </el-col>
            <el-col :span="12">
              <span>执法部门：{{ detailInfo.executorDeptName }}</span>
            </el-col>
          </el-row>
          <el-row>
            <span>检查方式：{{detailInfo.examineTypeName ? detailInfo.examineTypeName :detailInfo.examineType}}</span>
          </el-row>
          <div class="header-status_seeInspection">
            <div style="min-width: 70px">检查情况：</div>
            <div>{{ detailInfo.examineSituation }}</div>
          </div>
          <detail-data :checkList="detailInfo.probList"></detail-data>
          <div
            class="proof-list_seeInspection"
            :style="forBrowse?'padding-bottom:50px':''"
            v-if="proofList && proofList.length > 0"
          >
            <div v-for="(item, index) in proofList" :key="index" class="proof">
              <down-proof :proof="item" :canDel="false" @removeProof="delProof"></down-proof>
            </div>
          </div>
        </div>
      </sn-page-bar>
      <!-- 历次检查记录需要的详情 -->
      <div class="tabStyle_detail" v-if="isShow">
        <el-tabs type="card" v-model="tabName">
          <el-tab-pane label="检查结果处理" name="first">
            <el-row>
              <el-col :span="12">
                <span>企业名称：{{ detailInfo.companyName }}</span>
              </el-col>
              <el-col :span="12">
                <span>检查时间：{{ `${detailInfo.examineStartTime} - ${detailInfo.examineEndTime}` }}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <span>检查场所：{{ detailInfo.examineSite }}</span>
              </el-col>
              <el-col :span="12">
                <span>检查形式：{{ detailInfo.examineSourceName ? detailInfo.examineSourceName :detailInfo.examineSource}}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <span>执法人员：{{ detailInfo.executorName }}</span>
              </el-col>
              <el-col :span="12">
                <span>执法部门：{{ detailInfo.executorDeptName }}</span>
              </el-col>
            </el-row>
            <div class="header-status_seeInspection">
              <div style="min-width: 70px">检查情况：</div>
              <div>{{ detailInfo.examineSituation }}</div>
            </div>
            <detail-data :checkList="detailInfo.probList"></detail-data>
            <div
              class="proof-list_seeInspection"
              :style="forBrowse?'padding-bottom:50px':''"
              v-if="proofList && proofList.length > 0"
            >
              <div v-for="(item, index) in proofList" :key="index" class="proof">
                <down-proof :proof="item" :canDel="false" @removeProof="delProof"></down-proof>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="检查结果处理文书汇总" name="second" :lazy="false">
            <!-- 文书 -->
            <div class="docStyle" v-if="docDatalist && docDatalist.length > 0">
              <make-document
                v-for="(item,index) in docDatalist"
                :key="index"
                :docData="item"
                :auditInfo="auditInfo"
                @afterDelete="afterDelete"
                @previewWrit="previewWrit"
                @toSeal="toSeal"
                @modifyWrit="chooseWrit"
                @afterUpload="initDocuList"
                @userSign="userSign"
                @toLawSeal="toLawSeal"
                :readOnly="true"
              ></make-document>
            </div>
            <sn-empty-data text="暂无检查结果处理文书汇总" v-if="!docDatalist || docDatalist.length === 0"></sn-empty-data>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- pdf -->
      
      <show-pdf
        :pdfId="visibleWritId"
        v-if="showPdfDialog"
        @closePdf="closePdf"
        :writName="writName"
        :buttonList="writButton"
        @updatePdf="updatePdf"
        @auditPdf="auditPdf"
        @sealPdf="sealPdf"
      ></show-pdf>
      <!-- 现场处理措施 -->
      <el-dialog title="现场处理措施" :visible.sync="onSiteTreatmentMeasuresVisible" class="limitDate">
        <div v-if="onSiteTreatmentMeasuresVisible" class="dialog-content">
          <onSiteTreatment-measures
            :selectedList="item"
            v-for="(item ,index) in updateTipsList"
            :key="`index${index}`"
            :indexKey="index"
            ref="siteOperation"
          ></onSiteTreatment-measures>
        </div>
        <span slot="footer">
          <el-button @click="cancelOnSiteTreatment">取 消</el-button>
          <el-button @click="updateInspectionWrit" type="primary">保存并生成现场处理措施决定书</el-button>
          <!-- <el-button @click="showAddSealVisible" type="primary">加盖执法专用章</el-button> -->
        </span>
      </el-dialog>
      <!-- 责令限期整改 -->
      <el-dialog :visible.sync="modifyTimeVisible" class="limitDate" title="责令限期整改">
        <div v-if="modifyTimeVisible" class="dialog-content">
          <modify-time
            :selectedList="item"
            v-for="(item ,index) in updateTipsList"
            :key="index"
            :indexKey="index"
            ref="modifyTime"
          ></modify-time>
        </div>
        <span slot="footer">
          <el-button @click="cancelLimitModify">取 消</el-button>
          <el-button @click="updateLimitWrit" type="primary">保存并生成责令限期整改指令书4</el-button>
          <!-- <el-button @click="showAddSealVisible" type="primary">加盖执法专用章</el-button> -->
        </span>
      </el-dialog>
      <!-- common writ such as 先行登记审批表 询问通知书 -->
      <el-dialog
        :class="dialogClass"
        :title="showTitle"
        :before-close="closeDialog"
        :visible.sync="writDialogVisible"
        class="common-dialog"
      >
        <!-- <show-pdf :pdfId="visibleWritId" v-if="dialogContent === 'showPdf'"></show-pdf> -->
        <common-writ
          v-if="writDialogVisible && dialogContent === 'commonWrit'"
          :info="info"
          :writType="writType"
          @createWrit="createOtherWrit"
          @toSeal="toSeal"
          @toApproval="toApproval"
          @close="close"
          :ableToZhifa="ableToZhifa"
        ></common-writ>
        <select-people
          v-if="dialogContent === 'selectPeople'"
          :selectNum="1"
          @getPeople="submitToAudition"
        ></select-people>
      </el-dialog>
    </div>
    <div v-if="!isShow&&buttonList.length">
      <button-group :buttonList="buttonList"></button-group>
    </div>
  </div>
</template>

<script>
import snPageBar from '@components/snPageBar/index'
import detailData from './component/detail'
import downProof from '@components/downProof/index'
import buttonGroup from '@components/buttonGroup/index'
import showPdf from '@/components/showPdf/index'
import makeDocument from '@components/docCard/index'
import commonWrit from '@components/commonWrit'
import onSiteTreatmentMeasures from '../../inspectionResultHandle/componments/onSiteTreatmentMeasures'
import modifyTime from '../../inspectionResultHandle/componments/modifyTime'
import selectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople'
import { queryDocument, getExamineInfo } from '@api/ProcessingofInspectionResult/index.js'
import snEmptyData from '@/components/snEmptyData'
import { mapState } from 'vuex'
import { createWrit, getWritInfo, updateWrit, getWritDataByWritId, sealWrit } from '@api/fileRelated'
import { rectificationDetail, inspectionDetail, toInspectionHandle, toRectification, getInspectionWritList } from '@/api/onSiteInspection/index'
export default {
  name: 'seeInspection',
  components: {
    snPageBar,
    detailData,
    downProof,
    buttonGroup,
    showPdf,
    makeDocument,
    snEmptyData,
    onSiteTreatmentMeasures,
    modifyTime,
    commonWrit,
    selectPeople
  },
  props: {
    detailInfo: {
      type: Object,
      required: true
    },
    forBrowse: {
      type: Boolean,
      default: false
    },
    isInspectionDetail: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showProof: false,
      proofList: [],
      buttonList: [
        {
          name: '返回',
          type: '',
          disable: false,
          fun: this.backPage,
          hideBackBtn: this.forBrowse
        },
        {
          name: '浏览现场检查记录文书',
          type: 'primary',
          disable: false,
          fun: this.seePdf
        }
      ],
      showTitle: '',
      showPdfDialog: false,
      docDatalist: [], //文书列表
      tabName: 'first',
      // 文书 related
      auditInfo: {}, // 传给文书卡片的审核数据
      audiReq: {}, // 文书提交审核的参数
      writButton: {},
      updateWritInfo: null,
      inspectionDetail: null,
      // 现场和责令的弹出框
      onSiteTreatmentMeasuresVisible: false,
      modifyTimeVisible: false,
      updateTipsList: [],
      // common writ
      writType: '',
      writDialogVisible: false,
      dialogClass: 'big-dialog',
      dialogContent: '', // dialog 类型
      info: {},
      // 执法专用章是否可用
      ableToZhifa: false,
      isShow: false,
      visibleWritId: null,
      writName: null
    }
  },
  methods: {
    toLawSeal(info) {
      this.visibleWritId = info.id
      this.showPdfDialog = true
      this.writName = info.title
      this.writButton = {
        closePdf: true
      }
    },
    backPage() {
      this.$emit('backPage')
    },
    // 处理显示证据详情的参数
    handlerProof() {
      if (this.detailInfo.evidenceList && this.detailInfo.evidenceList.length > 0) {
        this.detailInfo.evidenceList.forEach(item => {
          item.id = this.detailInfo.id
          item.type = '0'
        })
        this.proofList = [...this.detailInfo.evidenceList, ...this.proofList]
      }
      let tipsList = this.detailInfo.probList ? this.detailInfo.probList : [],
        arr = []
      tipsList.forEach(item => {
        if (item.children && item.children.length > 0) {
          item.children.forEach(i => {
            if (i.accessoryList && i.accessoryList.length > 0) {
              i.accessoryList.forEach(j => {
                j.id = i.id
                j.type = '1'
              })
              this.proofList = [...i.accessoryList, ...this.proofList]
            }
          })
        } else {
          if (item.accessoryList && item.accessoryList.length > 0) {
            item.accessoryList.forEach(i => {
              i.id = item.id
              i.type = '1'
            })
            this.proofList = [...item.accessoryList, ...this.proofList]
          }
        }
      })
    },
    // 删除证据
    delProof(id) {
      let index = -1
      this.proofList.some((item, i) => {
        index = i
        return (item.accessoryId = id)
      })
      this.proofList.splice(index, 1)
    },
    seePdf() {
      if (this.detailInfo.writId && this.detailInfo.writId !== '') {
        this.showPdfDialog = true
        this.visibleWritId = this.detailInfo.writId
        this.writName = '现场检查记录'
        this.writButton = {
          closePdf: true
        }
      } else {
        this.$alert('该条记录没有生成文书', null, {
          confirmButtonText: '确定',
          callback: action => {}
        })
      }
    },
    // 初始化文书
    initDocuList() {
      queryDocument({
        id: this.detailInfo.id
      }).then(
        res => {
          this.docDatalist = res.data
        },
        err => {
          console.info(err)
        }
      )
    },
    // 删除成功的回调
    afterDelete() {
      this.initDocuList()
    },
    // 文书浏览
    previewWrit(id, name, button) {
      console.log(id, name, button)
      if (id) {
        // 从文书卡片传来的id
        this.visibleWritId = id
        this.writBtnList = button
        this.writName = name
        this.writButton = button
        this.writTypeCode = null
      }
      this.showPdfDialog = true
    },
    closePdf() {
      this.showPdfDialog = false
      this.writDialogVisible = false
    },
    updatePdf() {
      console.info('update')
    },
    auditPdf() {
      console.info('audit')
    },
    sealPdf() {
      console.info('seal')
    },
    // ===========================卡片列表上的按钮=============================
    toSeal(audiReq) {
      console.info('toSeal')
    },
    chooseWrit(title, type, id, bussinessId, button) {
      // 修改
      console.log(title, type, id, bussinessId, button)
      this.writButton = button
      this.visibleWritId = id
      if (title.indexOf('现场处理') !== -1) {
        // console.log("确定已进入现场处理");
        inspectionDetail({ id: bussinessId }).then(res => {
          console.log('现场处理文书详情', res)
          this.inspectionDetail = res.data
          let list = res.data.probList.reduce((total, item) => {
            let tempList = []
            if (item.children && item.children.length > 0) {
              tempList = item.children.reduce((t, i) => {
                t.push(i)
                return t
              }, [])
            } else {
              tempList.push(item)
            }
            total = [...total, ...tempList]
            return total
          }, [])
          this.updateTipsList = list
          this.onSiteTreatmentMeasuresVisible = true
        })
      } else if (title.indexOf('责令限期整改') !== -1) {
        rectificationDetail({ id: bussinessId }).then(res => {
          this.rectificationDetail = res.data
          let list = res.data.probList.reduce((total, item) => {
            let tempList = []
            if (item.children && item.children.length > 0) {
              tempList = item.children.reduce((t, i) => {
                i.rectifyTime = i.rectifyTime.replace(/(\/)/g, '-') + ':00'
                t.push(i)
                return t
              }, [])
            } else {
              item.rectifyTime = item.rectifyTime.replace(/(\/)/g, '-') + ':00'
              tempList.push(item)
            }
            total = [...total, ...tempList]
            return total
          }, [])
          this.updateTipsList = list
          this.modifyTimeVisible = true
        })
      } else if (title === '现场检查记录') {
        this.$message.error('请到现场检查记录页面修改')
      } else {
        this.writType = title
        this.writDialogVisible = true
        this.dialogContent = 'commonWrit'
        this.showTitle = this.writType
        // writDialogVisible && dialogContent === 'commonWrit'
        // this.currWritId = id;
        getWritDataByWritId({ writId: id }).then(res => {
          // console.log("commonWrit的文书数据", res);
          // this.updateWritInfo = res.data;
          // this.showDiag(title, type);
        })
      }
    },
    userSign(id, title, button) {
      // console.log("userSign===>", id, title, button);
      this.writButton = button
      this.visibleWritId = id
      this.writName = title
      this.showPdfDialog = true
    },
    // ==================现场处理措施按钮=============
    // 修改文书卡片内容
    updateInspectionWrit() {
      let user = JSON.parse(localStorage.getItem('res'))
      let list = [],
        suggestion = [],
        hadleInfo = [],
        legalInfoContent = []
      let arrayList = JSON.parse(JSON.stringify(this.updateTipsList))
      let num = 0
      arrayList.forEach((item, index) => {
        if (item.children && item.children.length > 0) {
          item.children.forEach((i, j) => {
            i.disposeOpinion = this.$refs.siteOperation[num].measureForm.suggestion
            i.lawCode = this.$refs.siteOperation[num].measureForm.legalvalue.join(',')
            i.measuresCode = this.$refs.siteOperation[num].measureForm.valuehandle.join(',')
            this.$refs.siteOperation[num].selectedMeasure.forEach(measure => {
              suggestion.push({
                tagName: 'tag6Item',
                tagContent: measure.label
              })
            })
            this.$refs.siteOperation[num].selectedLegal.forEach(law => {
              legalInfoContent.push(law.label)
            })
            list.push({
              tagName: 'tag4Item',
              tagContent: i.negativeDesc
            })
            num += 1
          })
        } else {
          item.disposeOpinion = this.$refs.siteOperation[num].measureForm.suggestion
          item.lawCode = this.$refs.siteOperation[num].measureForm.legalvalue.join(',')
          item.measuresCode = this.$refs.siteOperation[num].measureForm.valuehandle.join(',')
          list.push({
            tagName: 'tag4Item',
            tagContent: item.negativeDesc
          })
          this.$refs.siteOperation[num].selectedMeasure.forEach(measure => {
            suggestion.push({
              tagName: 'tag6Item',
              tagContent: measure.label
            })
          })
          this.$refs.siteOperation[num].selectedLegal.forEach(law => {
            legalInfoContent.push(law.label)
          })
          num += 1
        }
      })
      let startTimeList = this.inspectionDetail.examineInfo.examineStartTime.split(' ')[0].split('/')
      let startTime = startTimeList[0] + '年' + startTimeList[1] + '月' + startTimeList[2] + '日'
      let otherParams = getWritParams({
        tag2: this.inspectionDetail.examineInfo.companyName,
        tag3: startTime,
        tag5: legalInfoContent.join('、'),
        tag7: user.sysDeptEntity.government,
        tag8: user.sysDeptEntity.fullDeptName,
        tag9: user.sysDeptEntity.court
      })
      let params = [...list, ...suggestion, ...otherParams]
      toInspectionHandle({
        companyId: this.inspectionDetail.examineInfo.companyId,
        examineId: this.inspectionDetail.examineId,
        probList: arrayList,
        executorId: this.inspectionDetail.examineInfo.executorId,
        id: this.inspectionDetail.id
      }).then(res => {
        this.onSiteTreatmentMeasuresVisible = false
        updateWrit({ writId: this.visibleWritId }, params).then(
          res => {
            this.showPdfDialog = true
            this.initDocuList()
          },
          err => {
            console.log(err)
          }
        )
      })
    },
    showAddSealVisible() {
      console.info('加盖执法章')
    },
    // 取消现场检查措施
    cancelOnSiteTreatment() {
      this.onSiteTreatmentMeasuresVisible = false
      // this.selectedList = [];
    },
    // =======================责令限期整改按钮==========================
    cancelLimitModify() {
      this.modifyTimeVisible = false
    },
    updateLimitWrit() {
      // 保存责令限期表单
      let user = JSON.parse(localStorage.getItem('res'))
      let list = []
      let numList = []
      let arrayList = JSON.parse(JSON.stringify(this.rectificationDetail.probList))
      let num = 0
      arrayList.forEach((item, index) => {
        if (item.children && item.children.length > 0) {
          item.children.forEach((i, j) => {
            i.rectifyDemand = this.$refs.modifyTime[num].request
            i.rectifyTime = this.$refs.modifyTime[num].time
            list.push({
              tagName: 'tag3Item',
              tagContent: i.negativeDesc
            })
            numList.push({
              currIndex: num + 1,
              currTime:
                this.$refs.modifyTime[num].time
                  .split(' ')[0]
                  .replace('-', '年')
                  .replace('-', '月') + '日'
            })
            num += 1
          })
        } else {
          item.rectifyDemand = this.$refs.modifyTime[num].request
          item.rectifyTime = this.$refs.modifyTime[num].time
          list.push({
            tagName: 'tag3Item',
            tagContent: item.negativeDesc
          })
          numList.push({
            currIndex: num + 1,
            currTime:
              this.$refs.modifyTime[num].time
                .split(' ')[0]
                .replace('-', '年')
                .replace('-', '月') + '日'
          })
          num += 1
        }
      })
      let timeMap = new Map()
      let timeArr = []
      numList.forEach(item => {
        if (timeMap.get(item.currTime)) {
          timeMap.set(item.currTime, timeMap.get(item.currTime) + `、${item.currIndex}`)
        } else {
          timeMap.set(item.currTime, item.currIndex)
        }
      })
      timeArr = Array.from(timeMap)
      let timeList = timeArr.reduce((total, item, index) => {
        let num = {
          tagName: `entity${index + 1}-col1`,
          tagContent: item[1].toString()
        }
        let time = {
          tagName: `entity${index + 1}-col2`,
          tagContent: item[0]
        }
        total.push(num)
        total.push(time)
        return total
      }, [])
      let otherParams = getWritParams({
        tag2: this.rectificationDetail.examineInfo.companyName,
        tag6: user.sysDeptEntity.government,
        tag7: user.sysDeptEntity.fullDeptName,
        tag8: user.sysDeptEntity.court
      })
      let params = [...list, ...otherParams, ...timeList]
      toRectification({
        companyId: this.rectificationDetail.examineInfo.companyId,
        examineId: this.rectificationDetail.examineId,
        probList: arrayList,
        executorId: this.rectificationDetail.examineInfo.executorId,
        id: this.rectificationDetail.id
      }).then(res => {
        this.modifyTimeVisible = false
        updateWrit({ writId: this.visibleWritId }, params).then(
          res => {
            this.showPdfDialog = true
            this.initDocuList()
          },
          err => {
            console.log(err)
          }
        )
      })
    },
    showAddSealVisible() {
      console.info('加盖执法章')
    },
    // ================================common writ btn========================
    closeDialog() {
      this.writDialogVisible = false
      this.dialogContent = ''
      this.showTitle = ''
      this.currWritId = null
      this.updateWritInfo = null
      this.showPdfDialog = false
    }
  },
  mounted() {
    console.log('处理详情==》', this.detailInfo)
    if (this.detailVal == '') {
      this.isShow = false
      this.handlerProof()
    }
    if (this.detailVal === 'detailFlag') {
      this.isShow = true
      this.handlerProof()
    }
  },
  computed: {
    ...mapState(['detailVal'])
  },
  watch: {
    tabName: function(val, oldval) {
      if (val == 'second') {
        this.initDocuList()
        this.buttonList = []
      } else {
        this.buttonList = [
          {
            name: '返回',
            type: '',
            disable: false,
            fun: this.backPage,
            hideBackBtn: this.forBrowse
          },
          {
            name: '浏览现场检查记录文书',
            type: 'primary',
            disable: false,
            fun: this.seePdf
          }
        ]
      }
    }
  }
}
</script>

<style lang="less" scoped>
// 综合浏览样式
.new-inspection {
  &.for_browse {
    /deep/.create-container {
      padding: 0;
      .create-bar {
        .flex_box {
          padding: 0;
          border: none;
          box-shadow: none;
          .bar-left {
            display: none;
            .is-view-content {
              margin-top: 0;
            }
          }
          .bar-middle {
            padding-top: 10px;
          }
        }
        p.copyright_main {
          display: none;
        }
      }
    }
  }
}

.tabStyle {
  margin-top: -10px;
  .docStyle {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: start;
  }
  /deep/ .el-tabs .el-tabs__header .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav {
    border: none;
    .el-tabs__item {
      border: 1px solid #e4e7ed;
      color: #0099ff;
      border-radius: 5%;
      background-color: rgba(18, 115, 235, 0.1);
      &:first-child {
        margin-right: 8px;
      }
    }
    .is-active {
      border-bottom-color: #ffffff;
      background-color: #ffffff;
    }
  }
}
.header-status_seeInspection {
  margin-bottom: 25px;
  display: flex;
  flex-direction: row;
  // white-space: pre-wrap;
  word-break: break-all;
}
/deep/.create-container .create-bar .bar-middle {
  padding-top: 40px;
}
.el-row {
  margin-bottom: 10px;
}
/deep/.proof-list_seeInspection {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 21px;
  .proof {
    margin-right: 5px;
    margin-bottom: 5px;
  }
}
.tabStyle_detail {
  margin: 20px 50px;
  .docStyle {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: start;
  }
  /deep/ .el-tabs .el-tabs__header .el-tabs__nav-wrap .el-tabs__nav-scroll .el-tabs__nav {
    border: none;
    .el-tabs__item {
      border: 1px solid #e4e7ed;
      color: #0099ff;
      border-radius: 5%;
      background-color: rgba(18, 115, 235, 0.1);
      &:first-child {
        margin-right: 8px;
      }
    }
    .is-active {
      border-bottom-color: #ffffff;
      background-color: #ffffff;
    }
  }
}
</style>
