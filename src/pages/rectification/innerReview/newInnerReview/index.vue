<template>
  <div>
    <div class="new-inspection">
      <sn-page-bar>
        <template slot="button">
          <el-button type="text" icon="el-icon-arrow-left" @click="backPage">返回</el-button>
        </template>

        <div class="tabStyle" v-if="isHandlePage">
          <el-tabs type="card" v-model="tabName">
            <el-tab-pane label="整改复查">
              <review-handle-page
                :option="option"
                :originProbList="originProbList"
                :proofList="proofList"
                :alreadySave="alreadySave"
                @needUpdate="updateProofList"
                ref="detail"
              ></review-handle-page>
            </el-tab-pane>
            <el-tab-pane label="整改复查文书">
              <writ-list
                :writList="writList"
                @initWritList="initDocuList"
                @previewWrit="previewWrit"
                @updateWrit="updateWrit"
                :option="option"
                :lawSealAlready="lawSealAlready"
                v-loading="writListLoading"
                @afterDelete="afterDelete"
              ></writ-list>
            </el-tab-pane>
          </el-tabs>
          <span class="line"></span>
          <span class="lineSecond"></span>
        </div>
        <easy-punish
          :sourceId="easyPunishId"
          :headerInfo="headerInfo"
          :auditInfo="auditInfo"
          v-if="!isHandlePage"
        ></easy-punish>
      </sn-page-bar>
    </div>
    <buttonGroup :buttonList="buttonList" v-if="isShowButtonList"></buttonGroup>
    <!-- <el-dialog class="pdf-dialog" :visible.sync="showPdfDialog"> -->
    <show-pdf
      :pdfId="writId"
      v-if="showPdfDialog"
      @closePdf="closePdf"
      @updatePdf="updatePdf"
      :buttonList="writButton"
      @sealPdf="sealPdf"
      :writName="writName"
    ></show-pdf>
    <!-- </el-dialog> -->
    <el-dialog title="行政处罚" :visible.sync="dialogVisible" width="300px" class="punish-dialog">
      <div class="punish-style">
        <el-button type="primary" @click="confirmToEasyPunish('一般')">转一般程序行政处罚</el-button>
        <el-button type="primary" @click="confirmToEasyPunish('简易')">转简易程序行政处罚</el-button>
      </div>
    </el-dialog>
    <!-- 整改复查文书修改 -->
    <el-dialog
      title="整改复查意见书"
      :visible.sync="rectificationWritVisible"
      width="1100px"
      class="retification-dialog"
      append-to-body
    >
      <div>
        <modify-retification
          :option="option"
          :originProbList="originProbList"
          :updateInfo="updateInfo"
          @cancelRemake="cancelRemake"
          @remakeWrit="remakeWrit"
        ></modify-retification>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import snPageBar from '@components/snPageBar/index'
import buttonGroup from '@components/buttonGroup/index'
import { debounce, getWritParams, stringToDate } from '@/utils/util'
import { showNewReviewDetail, saveRectificationReview, saveRectificationDelayDetail, rectificationPdfDetail } from '@/api/rectification/index'
// import handlerPage from "../../rectificationReview/newRectification/components/handlerPage";
import reviewHandlePage from './components/reviewHandlePage'
import writList from '../../rectificationReview/newRectification/components/writList'
import modifyRetification from '../../rectificationReview/newRectification/components/modifyRetification'
import { getWritInfo } from '@/api/fileRelated'
import { createWrit, updateWrit } from '@/api/fileRelated'
import showPdf from '@/components/showPdf/index'
import { addFilingRegister } from '@/api/filingRegister/index'
import { saveSimpleAdministration } from '@/api/ProcessingofInspectionResult/index'
import { mapState } from 'vuex'
import easyPunish from '@/pages/onSiteInspection/newInspection/component/easyPunish'
import { sealAudit } from '@api/common'
import { simpleHandleInfo } from '@/api/simpleHandle'
import Bus from '@/bus'
export default {
  props: {
    zgfcId: {
      type: String,
      default: ''
    },
    forBrowse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      lineData: [], // 整改复查流程信息
      originProbList: [], // 接口返回的原始的检查项列表
      selectedList: [], // 被选中的检查项
      writId: null, // 文书id
      option: {
        examineInfo: {}
      }, // 整改复查详情
      proofList: [], // 证据列表
      fileData: {}, // 上传证据返回的信息
      // 按钮列表
      buttonList: [
        {
          name: '取消',
          type: '',
          disable: false,
          fun: this.backPage
        },
        // {
        //   name: "延期",
        //   type: "",
        //   disable: false,
        //   fun: debounce(this.confirmDelay),
        //   className: "is-no"
        // },
        {
          name: '制作复查意见书',
          type: 'primary',
          disable: false,
          isLoading: false,
          fun: debounce(this.saveAndMake)
        },
        {
          name: '转行政处罚',
          type: 'primary',
          disable: false,
          fun: this.choosePunish
        }
      ],
      showPdfDialog: false, // 浏览文书
      writName: '整改复查意见书',
      writList: [], // 文书列表
      dialogVisible: false, // 转行政处罚显示框
      tabName: null,
      auditInfo: {},
      isHandlePage: true,
      headerInfo: {},
      easyPunishId: null,
      updateWritId: null,
      writButton: {
        closePdf: true,
        updatePdf: true,
        sealPdf: true,
        signPdf: true
      },
      alreadySave: new Date(),
      sealAuditList: null,
      WSErId: '', //查整改复查意见书文书列表用的sourceID
      lawSealAlready: false,
      loading: true, //
      selectProbIds: '', //选择的检查项的id
      selectCheckIds: '', //选择的检查项的checkId
      rectificationWritVisible: false, //修改整改复查文书的弹框
      updateInfo: null,
      writListLoading: false, //文书卡片列表的loading
      remakeCheckIds: '', //remakeCheckIds
      remakeProbIds: '' //remakeCheckIds
    }
  },
  components: {
    snPageBar,
    buttonGroup,
    reviewHandlePage,
    writList,
    showPdf,
    easyPunish,
    modifyRetification
  },
  created() {
    this.initData()
    if (this.isRectificationWrit) {
      this.tabName = '1'
    }
    if (this.newReviewflag === 'flagNewDetail') {
      this.buttonList = [
        {
          name: '返回',
          type: '',
          disable: false,
          fun: this.backPage
        }
      ]
    }
  },
  methods: {
    // 初始化整改复查信息
    initData(id) {
      let req = {
        id: id ? id : this.forBrowse ? this.zgfcId : this.newReviewId
      }
      // 查询整改复查详情
      showNewReviewDetail(req)
        .then(res => {
          console.log('new整改复查详情=》', res)
          this.WSErId = res.data ? res.data.id : ''
          this.originProbList = res.data.probList.map(item => {
            if (item.children && item.children.length > 0) {
              item.children.forEach(i => {
                i.checked = false
                // i.reviewTime = null
                // i.reviewOpinion = null
              })
            } else {
              item.checked = false
              // item.reviewOpinion = null
              // item.reviewTime = null
            }
            return item
          })
          console.info('调取详情的时候的problist', this.originProbList)
          this.option = res.data
          this.proofList = this.originProbList.reduce((total, item) => {
            let arr = []
            if (item.children && item.children.length > 0) {
              arr = item.children.reduce((sum, i) => {
                i.flag = i.isQualified === '0'
                /*  if (i.recordList && i.recordList.length > 0) {
                  i.recordList.forEach(handlerItem => {
                    handlerItem.reviewTime =
                      handlerItem.reviewTime &&
                      handlerItem.reviewTime
                        .replace('/', '-')
                        .replace('/', '-')
                        .split(' ')[0]
                  })
                } */
                if (i.accessoryList && i.accessoryList.length > 0) {
                  i.accessoryList.forEach(proof => {
                    proof.id = i.id
                    proof.type = '1'
                  })
                  // sum = [...i.accessoryList]
                  sum = sum.concat(i.accessoryList)
                }
                return sum
              }, [])
            } else {
              item.flag = item.isQualified === '0'
              /*  if (item.recordList && item.recordList.length > 0) {
                item.recordList.forEach(handlerItem => {
                  if (handlerItem.reviewTime) {
                    handlerItem.reviewTime = handlerItem.reviewTime
                      .replace('/', '-')
                      .replace('/', '-')
                      .split(' ')[0]
                  }
                })
              } */
              if (item.accessoryList && item.accessoryList.length > 0) {
                item.accessoryList.forEach(proof => {
                  proof.id = item.id
                  proof.type = '1'
                })
                // arr = [...item.accessoryList]
                arr = arr.concat(item.accessoryList)
              }
            }
            total = [...total, ...arr]
            return total
          }, [])
          if (res.data.accessoryList && res.data.accessoryList.length > 0) {
            res.data.accessoryList.forEach(item => {
              item.id = res.data.id
              item.type = '0'
            })
            this.proofList = [...this.proofList, ...res.data.accessoryList]
          }
        })
        .catch(err => {
          console.info(err)
        })
    },
    // 单纯刷新证据列表
    updateProofList() {
      // 查询整改复查详情
      showNewReviewDetail({
        id: this.newReviewId
      })
        .then(res => {
          this.proofList = res.data.probList.reduce((total, item) => {
            let arr = []
            if (item.children && item.children.length > 0) {
              arr = item.children.reduce((sum, i) => {
                i.flag = i.isQualified === '0'
                if (i.accessoryList && i.accessoryList.length > 0) {
                  i.accessoryList.forEach(proof => {
                    proof.id = i.id
                    proof.type = '1'
                  })
                  // sum = [...i.accessoryList]
                  sum = sum.concat(i.accessoryList)
                }
                return sum
              }, [])
            } else {
              item.flag = item.isQualified === '0'
              if (item.accessoryList && item.accessoryList.length > 0) {
                item.accessoryList.forEach(proof => {
                  proof.id = item.id
                  proof.type = '1'
                })
                // arr = [...item.accessoryList]
                arr = arr.concat(item.accessoryList)
              }
            }
            total = [...total, ...arr]
            return total
          }, [])
          if (res.data.accessoryList && res.data.accessoryList.length > 0) {
            res.data.accessoryList.forEach(item => {
              item.id = res.data.id
              item.type = '0'
            })
            this.proofList = [...this.proofList, ...res.data.accessoryList]
          }
          console.info('刷新的proo', this.proofList)
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    afterDelete() {
      this.initData()
      this.initDocuList()
    },
    //返回
    backPage() {
      if (this.isHandlePage) {
        this.$store.commit('setInnerReviewComponent', 'InnerReviewList')
      } else {
        this.isHandlePage = true
      }
    },
    // 整改复查文书列表 sourceId ER 和bussinessId Ed和type 传ZGFCYJS
    initDocuList() {
      this.writListLoading = true
      getWritInfo({
        sourceId: this.WSErId,
        businessId: this.detailId,
        type: 'ZGFCYJS'
      }).then(res => {
        // console.log(" 初始化文书卡片列表", res);
        if (res.data) {
          this.writList = res.data
          if (this.writList) {
            this.writListLoading = false
          }
        }
      })
    },
    // 关闭整改复查意见书修改弹窗
    cancelRemake() {
      this.rectificationWritVisible = false
    },
    saveAndMake() {
      console.info('saveAndMake')
      this.buttonList[1].isLoading = true
      let detailInfo = this.$refs.detail
      if (detailInfo.selectedList.length > 0) {
        let flag = true
        let flagNoReview = true
        detailInfo.selectedList.forEach(item => {
          if (item.children && item.children.length > 0) {
            item.children.forEach(i => {
              if (i.isReview === '0') {
                // this.$message.error('已复查过的项不可以再制作文书')
                // 已复查的话直接停止操作
                flagNoReview = false
                return
              }
              if (!i.reviewTime || !i.reviewOpinion || i.reviewOpinion === '') {
                flag = false
                return
              }
            })
          } else {
            if (item.isReview === '0') {
              // 已复查的话直接停止操作
              flagNoReview = false
              return
            }
            if (!item.reviewTime || !item.reviewOpinion || item.reviewOpinion === '') {
              flag = false
              return
            }
          }
        })
        if (flag && flagNoReview) {
          this.save()
        } else {
          // this.$message({
          //   message: '请完善检查项的复查信息',
          //   type: 'error'
          // })
          if (flag == true && flagNoReview == false) {
            this.$message.error('已复查过的检查项不可以再制作文书')
            this.buttonList[1].isLoading = false
          } else if (flag == false && flagNoReview == true) {
            this.$message({
              message: '请完善检查项的复查信息',
              type: 'error'
            })
            this.buttonList[1].isLoading = false
          }
        }
      } else {
        this.$message({
          message: '请选择要处理的检查项',
          type: 'error'
        })
        // this.buttonList[1].isLoading = false
      }
    },
    // 保存复查信息
    save() {
      let detailInfo = this.$refs.detail
      let dataInfo = { ...detailInfo.option.examineInfo }
      let { reviewName, reviewNameId, id } = detailInfo.option
      let publicProof = detailInfo.publicProof
      dataInfo.reviewName = reviewName
      dataInfo.reviewNameId = reviewNameId
      dataInfo.id = id
      if (detailInfo.publicProof && detailInfo.publicProof.length > 0) {
        if (detailInfo.option.accessoryId && detailInfo.option.accessoryId !== '') {
          dataInfo.accessoryId = detailInfo.option.accessoryId + ',' + publicProof.join(',')
        } else {
          dataInfo.accessoryId = publicProof.join(',')
        }
      }
      dataInfo.examineEndTime = null
      dataInfo.examineStartTime = null
      dataInfo.probList = JSON.parse(JSON.stringify(detailInfo.selectedList))
      this.selectProbIds = "" //清空
      this.selectCheckIds = "" //清空
      dataInfo.probList.forEach(item => {
        this.selectCheckIds += item.checkId + ',' //拼接检查项的checkId
        this.selectProbIds += item.id + ',' //拼接检查项的id
        if (item.children && item.children.length > 0) {
          item.expireTime = item.expireTime ? item.expireTime.replace(/\//g, '-') + ' 00:00:00' : '' //整改时限格式化  因为时间格式不匹配 后台无法识别
          item.reviewTime = item.reviewTime ? item.reviewTime.replace(/\//g, '-').substring(0, 10) + ' 00:00:00' : '' //复查时间格式化  因为时间格式不匹配 后台无法识别

          item.children.forEach(i => {
            this.selectCheckIds += i.checkId + ',' //拼接检查项的checkId
            this.selectProbIds += i.id + ',' //拼接检查项的id
            i.expireTime = i.expireTime ? i.expireTime.replace(/\//g, '-') + ' 00:00:00' : ''
            i.reviewTime = i.reviewTime ? i.reviewTime.replace(/\//g, '-').substring(0, 10) + ' 00:00:00' : ''
          })
        } else {
          //没有子项的情况
          item.expireTime = item.expireTime ? item.expireTime.replace(/\//g, '-') + ' 00:00:00' : '' //整改时限格式化  因为时间格式不匹配 后台无法识别
          item.reviewTime = item.reviewTime ? item.reviewTime.replace(/\//g, '-').substring(0, 10) + ' 00:00:00' : '' //复查时间格式化  因为时间格式不匹配 后台无法识别
        }
      })
      // console.log("保存数据传输的时候", dataInfo);
      saveRectificationReview(dataInfo).then(res => {
        this.alreadySave = new Date()
        this.makeWrit()
        this.initData()
      })
    },
    // 生成文书
    makeWrit() {
      console.log('生成文书的时候', this.option)
      this.sealAuditList = this.$refs.detail.selectedList
      let detailInfo = this.$refs.detail
      let arr = this.handleTreeList(detailInfo.selectedList)
      let list = arr.reduce((total, item) => {
        total.push(item.reviewOpinion)
        return total
      }, [])
      let data = getWritParams({
        tag2: this.option.examineInfo.companyName,
        tag3: this.option.descTime,
        tag4: this.option.sourceType === '1' ? '责令限期整改' : '现场处理措施',
        tag5: this.option.descNo,
        tag6Item: list,
        checkIds: this.selectCheckIds ? this.selectCheckIds.substring(0, this.selectCheckIds.length - 1) : '', //选中检查项的checkId
        probIds: this.selectProbIds ? this.selectProbIds.substring(0, this.selectProbIds.length - 1) : '' //选中检查项的id
      })
      let params = {
          companyId: this.option.examineInfo.companyId, //执法检查模块制作文书传company_id
        contractorIds: this.option.reviewNameId,
        sourceId: this.option.id,
        writType: 'ZGFCYJS',
        data,
        businessId: this.$store.state.detailId
      }
      // 新制作
      createWrit(params).then(
        res => {
          // console.log("生成意见书成功的res", res);
          this.setWritBtn(res.writType)
          this.writId = res.writId
          this.showPdfDialog = true
          this.$message({
            message: '制作成功',
            type: 'success'
          })
          this.buttonList[1].isLoading = false
        },
        err => {
          this.$message({
            message: '制作失败',
            type: 'error'
          })
        }
      )
      /* if (this.updateWritId && this.updateWritId !== '') {
        updateWrit({ writId: this.updateWritId }, params.data).then(res => {
          this.writId = this.updateWritId
          this.updateWritId = null
          this.showPdfDialog = true
          this.$message(
            {
              message: '制作成功',
              type: 'success'
            },
            () => {
              this.$message({
                message: '制作失败',
                type: 'error'
              })
            }
          )
        })
      } else {
        createWrit(params).then(
          res => {
            // console.log("生成意见书成功的res", res);
            this.setWritBtn(res.writType)
            this.writId = res.writId
            this.showPdfDialog = true
            this.$message({
              message: '制作成功',
              type: 'success'
            })
          },
          err => {
            this.$message({
              message: '制作失败',
              type: 'error'
            })
          }
        )
      } */
    },
    remakeWrit(value) {
      let arr = this.handleTreeList(value)
      let list = arr.reduce((total, item) => {
        total.push(item.reviewOpinion)
        return total
      }, [])
      let data = getWritParams({
        tag2: this.option.examineInfo.companyName,
        tag3: this.option.descTime,
        tag4: this.option.sourceType === '1' ? '责令限期整改' : '现场处理措施',
        tag5: this.option.descNo,
        tag6Item: list,
        checkIds: this.remakeCheckIds,
        probIds: this.remakeProbIds
      })
      let params = {
        data
      }
      // console.info('data', data)
      updateWrit({ writId: this.updateWritId }, params.data).then(res => {
        this.writId = this.updateWritId
        this.updateWritId = null
        this.setWritBtn(res.writType)
        this.showPdfDialog = true
        this.$message(
          {
            message: '制作成功',
            type: 'success'
          },
          () => {
            this.$message({
              message: '制作失败',
              type: 'error'
            })
          }
        )
      })
    },
    // 处理树状结构的数据
    handleTreeList(tree) {
      let arr = tree.reduce((total, item) => {
        let temp = []
        if (item.children && item.children.length > 0) {
          temp = item.children.reduce((sum, i) => {
            sum.push(i)
            return sum
          }, [])
        } else {
          temp.push(item)
        }

        total = [...total, ...temp]
        return total
      }, [])
      return arr
    },
    setWritBtn(code) {
      let writTypeInfo = JSON.parse(sessionStorage.writTypeInfo)
      let item = writTypeInfo.find(i => {
        return i.id === code
      })
      // console.info("item==>", item);
      this.writButton = {
        closePdf: true, //退出
        updatePdf: true, //回退编辑
        auditPdf: item.isAudit == 1, // 提交审核
        sealPdf: item.isSign == 1, // 加盖公章
        signPdf: item.userType == 1, // 签名
        lawSealPdf: item.isSign == 2, // 加盖执法专用章
        finishPdf: true //完成
      }
      // this.writTypeCode = item.auditTypeCode; //提交审核 传的 auditTypeCode
    },
    // 浏览文书
    previewWrit(id, name, button) {
      // console.log("延期整改复查文书浏览", id, name, button);
      if (id) {
        // 从文书卡片传来的id
        this.writId = id
        this.writName = name
        this.writButton = button
        this.writButton.updatePdf = false
      }
      this.showPdfDialog = true
    },
    // 关闭文书
    closePdf() {
      this.rectificationWritVisible = false
      this.initDocuList()
      this.showPdfDialog = false
      this.writButton = {
        closePdf: true,
        updatePdf: true,
        sealPdf: true,
        signPdf: true,
        finishPdf: true
      }
    },
    updatePdf() {
      this.showPdfDialog = false
      this.updateWritId = this.writId
    },
    // 转行政处罚
    choosePunish() {
      let detailInfo = this.$refs.detail
      if (detailInfo.selectedList.length > 0) {
        let flag = detailInfo.selectedList.some(item => {
          let result = false
          if (item.children && item.children.length > 0) {
            result = item.children.some(i => {
              return i.examineContent && i.examineContent.indexOf('处罚') !== -1
            })
          } else {
            result = item.examineContent && item.examineContent.indexOf('处罚') !== -1 ? true : false
          }
          return result
        })
        if (flag) {
          this.$message({
            message: '请不要重复转行政处罚',
            type: 'error'
          })
        } else {
          this.dialogVisible = true
        }
      } else {
        this.$message({
          message: '请选择要处理的检查项',
          type: 'error'
        })
      }
    },
    // 确认转入简易行政处罚
    confirmToEasyPunish(val) {
      this.$confirm(`是否转入${val}行政处罚?`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (val === '简易') {
            this.toEasyPunish()
          } else {
            this.toNormalPunish()
          }
        })
        .catch(e => {
          console.info(e)
        })
    },
    // 转简易行政处罚
    toEasyPunish() {
      this.auditInfo = {
        requestUsersName: this.option.examineInfo.executorName, // 承办人
        caseName: this.option.examineInfo.companyName // 企业名称
      }
      this.headerInfo = {
        people: this.option.examineInfo.executorName,
        peopleId: this.option.examineInfo.executorId,
        company: {
          companyName: this.option.examineInfo.companyName,
          id: this.option.examineInfo.companyId
        },
        dept: { name: this.option.examineInfo.executorDeptName },
        time: [stringToDate(this.option.examineInfo.examineStartTime.replace('/', '-').replace('/', '-') + ':00')]
      }
      let detail = this.$refs.detail
      let blcList = []
      if (detail.selectedList.length > 0) {
        detail.selectedList.forEach(item => {
          if (item.children && item.children.length > 0) {
            item.children.forEach(i => {
              blcList.push({
                checkId: i.id,
                isGreat: i.isGreat,
                checkSource: '0'
              })
            })
          } else {
            if (item.discretionId) {
              dataSource = '0'
            }
            blcList.push({
              checkId: item.id,
              isGreat: item.isGreat,
              checkSource: '0'
            })
          }
        })
      }
      saveSimpleAdministration({
        sourceType: '1', //0-检查结果处理 1-整改复查 不传默认为0
        examineId: detail.option.examineInfo.id,
        executorDeptId: detail.option.examineInfo.executorDeptId,
        executorDeptName: detail.option.examineInfo.executorDeptName,
        executorId: detail.option.examineInfo.executorId,
        executorName: detail.option.examineInfo.executorName,
        probList: blcList,
        caseCrimeTime: detail.option.examineInfo.examineStartTime.replace('/', '-').replace('/', '-') + ':00'
      }).then(res => {
        this.easyPunishId = res.id
        simpleHandleInfo({
          id: this.easyPunishId
        })
          .then(res => {
            console.log('整改复查转简易行政处罚的res', res)
            if (res.code === '0') {
              // Bus.$emit("actsFromCheckAgain", res.data.probList);
              this.$store.commit('SET_ACTS_FROM_CHECK_AGAIN', res.data.probList)
            }
            this.initData()
            this.isHandlePage = false
            this.dialogVisible = false
            this.alreadySave = new Date()
          })
          .catch(err => {
            console.info(err)
          })
      })
    },
    // 转一般行政处罚
    toNormalPunish() {
      let detail = this.$refs.detail

      let penaltyUndEntity = {
        objectType: '0',
        punishCompanyId: detail.option.examineInfo.companyId,
        udtIds: detail.option.reviewNameId,
        sourceId: detail.option.examineInfo.id,
        sourceType: 'examine',
        examineTime: detail.option.examineInfo.examineStartTime.replace(/(\/)/g, '-') + ':00',
        caseSourceId: 'co001',
        suggestion: ''
      }
      let unLawfulActsHere = ''
      let blcList = detail.selectedList.reduce((total, item) => {
        let arr = []
        if (item.children && item.children.length > 0) {
          arr = item.children.reduce((t, i) => {
            let dataSource = i.discretionId ? '0' : '1'
            t.push({
              discretionId: i.discId,
              dataSource,
              violateRules: i.negativeDesc,
              discretionRulesId: i.discRulesId,
              checkId: i.id
            })
            return t
          }, [])
          let source = item.discretionId ? '0' : '1'
          let info = {
            discretionId: item.discId,
            dataSource: source,
            actName: item.negativeDesc,
            checkId: item.id,
            children: arr
          }
          total.push(info)
        } else {
          let dataSource = item.discretionId ? '0' : '1'
          total.push({
            discretionId: item.discId,
            dataSource,
            actName: item.negativeDesc,
            checkId: item.id
          })
        }
        penaltyUndEntity.suggestion =
          penaltyUndEntity.suggestion !== ''
            ? item.lawProvisionRule
              ? penaltyUndEntity.suggestion + `、${item.lawProvisionRule}`
              : penaltyUndEntity.suggestion
            : item.lawProvisionRule
        return total
      }, [])
      // 取caseName
      blcList.forEach(item => {
        unLawfulActsHere += item.actName.trim()
      })
      penaltyUndEntity.suggestion =
        penaltyUndEntity.suggestion !== '' && penaltyUndEntity.suggestion
          ? `${detail.option.examineInfo.companyName}涉嫌违反${penaltyUndEntity.suggestion}，建议立案`
          : ''
      penaltyUndEntity.caseName = detail.option.examineInfo.companyName + unLawfulActsHere + '案'
      addFilingRegister({
        blcList,
        penaltyUndEntity
      }).then(
        res => {
          this.dialogVisible = false
          this.alreadySave = new Date()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.initData()
        },
        err => {
          console.info(err)
        }
      )
    },
    // 修改文书
    updateWrit(title, type, id, button) {
      this.updateWritId = id
      // 引入组件修改
      rectificationPdfDetail({ writId: id })
        .then(res => {
          console.info('修改整改复查文书详情', res)
          if (res.code === '0') {
            res.writInfo.forEach(item => {
              switch (item.tagName) {
                case 'checkIds':
                  this.remakeCheckIds = item.tagContent
                  break
                case 'probIds':
                  this.remakeProbIds = item.tagContent
                  break
              }
            })
            // 方便找同一条数据做数据处理和回显 修改接口返回的详情
            this.updateInfo = res.probList ? JSON.parse(JSON.stringify(res.probList)) : null
            this.initData(this.updateInfo.id)
            console.info('updateInfo', this.updateInfo)
            if (this.updateInfo.length > 0) {
              this.rectificationWritVisible = true
            }
          }
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    sealPdf(value) {
      let _audiReq = {
        auditTypeCode: 'ta80040', // 盖章审核
        handlerDeptId: value.deptId, // 审核人部门 id
        handlerUserId: value.peopleId, // 审核人 只能有一个
        requestDeptName: this.option.examineInfo.executorDeptName, // 承办人部门，现在先不填
        requestId: value.pdfId, // 文书 writId
        requestTime: void 0,
        requestUsersName: this.option.examineInfo.executorName, // 承办人名称
        requestUsersIds: this.option.examineInfo.executorId, // 承办人id
        submitterCause: this.option.examineInfo.companyName, // 案件名称 或 企业名称
        partyName: this.option.examineInfo.companyName,
        partyId: this.option.examineInfo.companyId
      }
      // console.log("加盖公章00000000", _audiReq);
      // 调用接口向下走流程
      sealAudit(_audiReq).then(
        res => {
          this.$message({
            type: 'success',
            message: '提交成功！'
          })
          this.initDocuList()
          this.showPdfDialog = false
        },
        () => {
          this.$message({
            type: 'error',
            message: '提交失败！'
          })
        }
      )
    }
  },
  watch: {
    tabName: function(val, oldval) {
      if (val == '1') {
        this.initDocuList()
      }
    }
  },
  computed: {
    ...mapState(['newReviewflag', 'newReviewId', 'isRectificationWrit']),
    isShowButtonList: function() {
      return this.isHandlePage && this.tabName == '0'
    }
  }
}
</script>

<style lang="less" scoped>
.tabStyle {
  margin-top: 30px;
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
.pdf-dialog {
  width: 100%;
  height: 100%;
}
.punish-dialog {
  /deep/ .el-dialog {
    margin-top: 37vh !important;
  }
  .punish-style {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 21px;
    .el-button {
      margin-left: 0;
      margin-bottom: 12px;
    }
  }
}
/deep/.el-button.is-loading {
  position: relative;
  pointer-events: none;
  top: 6px;
  left: 0px;
}
</style>
