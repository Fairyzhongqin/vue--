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
              <handler-page
                :option="option"
                :originProbList="originProbList"
                :proofList="proofList"
                :alreadySave="alreadySave"
                @needUpdate="updateProofList"
                ref="detail"
              ></handler-page>
            </el-tab-pane>
            <el-tab-pane label="整改复查文书">
              <writ-list
                :writList="writList"
                @afterDelete="afterDelete"
                @previewWrit="previewWrit"
                @updateWrit="updateWrit"
                @initWritList="initDocuList"
                :option="option"
                v-loading="writListLoading"
              ></writ-list>
            </el-tab-pane>
          </el-tabs>
          <span class="line"></span>
          <span class="lineSecond"></span>
        </div>
        <easy-punish :sourceId="easyPunishId" :headerInfo="headerInfo" :auditInfo="auditInfo" v-if="!isHandlePage"></easy-punish>
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
    <el-dialog title="整改复查意见书" :visible.sync="rectificationWritVisible" width="1100px" class="retification-dialog" append-to-body>
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
    <!-- 责令期限整改-->
    <el-dialog title="责令限期整改" :visible.sync="timeLimitVis" class="limitDate" :close-on-click-modal="false">
      <div v-if="timeLimitVis" class="dialog-content">
        <modify-time
          :from="'rectify'"
          :selectedList="item"
          v-for="(item, index) in flattenTips"
          :key="index"
          :indexKey="index"
          @changeTime="setTime"
          ref="modifyTime"
        ></modify-time>
      </div>
      <span slot="footer">
        <el-button @click="createTimeLimit(false)">取 消</el-button>
        <el-button @click="createTimeLimit(true)" type="primary">保存并生成责令限期整改指令书</el-button>
        <!--   :disabled="!createLimitAllowed" -->
        <!-- <el-button @click="toSeal" :disabled="audireqAllowed" type="primary">加盖执法专用章</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import modifyTime from '@/pages/inspectionResultHandle/componments/modifyTime'
import snPageBar from '@components/snPageBar/index'
import buttonGroup from '@components/buttonGroup/index'
import { debounce, getWritParams, stringToDate } from '@/utils/util'
import {
  showRectificationReviewDetail,
  saveRectificationReview,
  saveRectificationDelayDetail,
  rectificationPdfDetail,
  savePublicProofInfo
} from '@/api/rectification/index'
import { toRectification, rectificationDetail } from '@/api/onSiteInspection/index'
import handlerPage from './components/handlerPage'
import writList from './components/writList'
import modifyRetification from './components/modifyRetification'
import { getInspectionWritList } from '@/api/onSiteInspection/index'
import { createWrit, updateWrit, getWritInfo } from '@/api/fileRelated'
import showPdf from '@/components/showPdf/index'
import { addFilingRegister } from '@/api/filingRegister/index'
import { saveSimpleAdministration } from '@/api/ProcessingofInspectionResult/index'
import { mapState } from 'vuex'
import easyPunish from '@/pages/onSiteInspection/newInspection/component/easyPunish'
import { sealAudit } from '@api/common'
import { simpleHandleInfo } from '@/api/simpleHandle'
import Bus from '@/bus'
export default {
  data() {
    return {
      writType: '', // ws开头
      backToEditStatus: false, // 是否是责令限期整改回退编辑状态
      timeLimitId: '', // 责令限期整改的id
      flattenTips: [], // 责令限期整改弹框所需的一维数据
      preparedTips: [], // 制作责令限期整改时传给接口的二维数据
      changedTimes: 0, //让责令限期整改的时间数据 刚开始时全部统一
      timeLimitVis: false, // 是否展示责令限期整改弹窗
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
        {
          name: '制作复查意见书',
          type: 'primary',
          disable: false,
          fun: debounce(this.saveAndMake, 1000, true)
        },
        {
          name: '制作责令限期整改',
          type: 'primary',
          disable: false,
          fun: debounce(this.showTimeLimit, 1000, true)
        },
        {
          name: '转行政处罚',
          type: 'primary',
          disable: false, //是不是已经复查过的选项 是的话 为true
          fun: this.choosePunish
        }
      ],
      showPdfDialog: false, // 浏览文书
      writName: '',
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
      noData: false,
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
    modifyTime,
    buttonGroup,
    handlerPage,
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
    if (this.flag !== 'flagSee') {
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
        id: id ? id : this.$store.state.detailId
      }
      // 查询整改复查详情
      showRectificationReviewDetail(req)
        .then(res => {
          if (res.data.probList[0].id === null) {
            this.noData = true
          }
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
          console.log(err)
        })
    },
    // 单纯刷新附件
    updateProofList() {
      // 查询整改复查详情
      showRectificationReviewDetail({
        id: this.$store.state.detailId
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
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    //返回
    backPage() {
      if (this.isHandlePage) {
        this.$store.commit('resetReloadList', true)
        this.$store.commit('setRectificationCurrentComponent', 'rectificationList')
      } else {
        this.isHandlePage = true
      }
    },
    // 删除文书后
    afterDelete() {
      this.initDocuList()
      // 为了状态回滚
      this.initData()
    },
    // 初始化文书卡片列表
    initDocuList() {
      this.writListLoading = true
      getWritInfo({
        sourceId: this.detailId,
        type: 'ZGFCYJS,ZLXQZGZLS'
      }).then(res => {
        if (res.data !== null) {
          this.writList = res.data
          if (this.writList) {
            this.writListLoading = false
          }
        }
      })
    },
    saveAndMake() {
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
          if (flag == true && flagNoReview == false) {
            this.$message.error('已复查过的检查项不可以再制作文书')
          } else if (flag == false && flagNoReview == true) {
            this.$message({
              message: '请完善检查项的复查信息',
              type: 'error'
            })
          }
        }
      } else {
        this.$message({
          message: '请选择要处理的检查项',
          type: 'error'
        })
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
      this.selectProbIds = '' //清空
      this.selectCheckIds = '' //清空
      dataInfo.probList.forEach(item => {
        this.selectProbIds += item.id + ',' //拼接检查项的id
        this.selectCheckIds += item.checkId + ',' //拼接检查项的checkid
        //遍历整改复查的检查项
        if (item.children && item.children.length > 0) {
          //有子项的情况
          item.expireTime = item.expireTime ? item.expireTime.replace(/\//g, '-') + ' 00:00:00' : '' //整改时限格式化  因为时间格式不匹配 后台无法识别
          item.reviewTime = item.reviewTime ? item.reviewTime.replace(/\//g, '-').substring(0, 10) + ' 00:00:00' : '' //复查时间格式化  因为时间格式不匹配 后台无法识别

          // item.recordList = []
          item.children.forEach(i => {
            this.selectProbIds += i.id + ',' //拼接检查项的id
            this.selectCheckIds += i.checkId + ',' //拼接检查项的checkid
            i.expireTime = i.expireTime ? i.expireTime.replace(/\//g, '-') + ' 00:00:00' : '' //整改时限格式化  因为时间格式不匹配 后台无法识别

            /* i.recordList.push({
              reviewOpinion: i.reviewOpinion,
              reviewTime: i.reviewTime + ' 00:00:00',
              isQualified: i.isQualified
            }) */
            i.reviewTime = i.reviewTime ? i.reviewTime.replace(/\//g, '-').substring(0, 10) + ' 00:00:00' : '' //复查时间格式化  因为时间格式不匹配 后台无法识别
          })
        } else {
          //没有子项的情况
          item.expireTime = item.expireTime ? item.expireTime.replace(/\//g, '-') + ' 00:00:00' : '' //整改时限格式化  因为时间格式不匹配 后台无法识别
          /*  item.recordList = []
          item.recordList.push({
            reviewOpinion: item.reviewOpinion,
            reviewTime: item.reviewTime + ' 00:00:00',
            isQualified: item.isQualified
          }) */
          item.reviewTime = item.reviewTime ? item.reviewTime.replace(/\//g, '-').substring(0, 10) + ' 00:00:00' : '' //复查时间格式化  因为时间格式不匹配 后台无法识别
        }
      })
      saveRectificationReview(dataInfo).then(res => {
        this.alreadySave = new Date()
        this.makeWrit()
        this.initData()
      })
    },
    // 检查是否可进行责令限期整改
    checkItems() {
      let detailInfo = this.$refs.detail
      let flag = true // 是否有未复查的检查项 true 没有 false 有
      let pointer = true // 是否有已制作责令限期整改的检查项 true 没有 false 有
      if (detailInfo.selectedList.length > 0) {
        detailInfo.selectedList.forEach(item => {
          if (item.children && item.children.length > 0) {
            item.children.forEach(i => {
              if (i.isReview === '1') {
                flag = false
              }
              if (i.isRectify === '1') {
                pointer = false
              }
            })
          } else {
            if (item.isReview === '1') {
              flag = false
            }
            if (item.isRectify === '1') {
              pointer = false
            }
          }
        })
        if (!flag) {
          this.$message({
            message: '请选择已复查的检查项',
            type: 'warning'
          })
          return flag
        }
        if (!pointer) {
          this.$message({
            message: '请不要重复操作',
            type: 'warning'
          })
        }
      } else {
        this.$message({
          message: '请选择要处理的检查项',
          type: 'warning'
        })
        flag = false
      }
      return flag && pointer
    },
    // 责令限期整改提示弹框
    showTimeLimit() {
      if (!this.checkItems()) {
        return
      }
      this.$confirm('请确认是否还有需要责令限期整改的检查项！', '温馨提示', {
        confirmButtonText: '已经选好了，直接制作',
        cancelButtonText: '需要再想想',
        type: 'warning'
      })
        .then(() => {
          // 准备传给 modifyTime 组件的一维数组 flattenTips
          this.flattenTips = []
          let selected = this.$refs.detail.selectedList
          selected.forEach(res => {
            if (res.children && res.children.length > 0) {
              this.flattenTips = this.flattenTips.concat(res.children)
            } else {
              this.flattenTips = this.flattenTips.concat(res)
            }
          })
          this.changedTimes = 0
          this.timeLimitVis = true
        })
        .catch(err => console.info(err))
    },
    // 处理制作责令限期整改的参数
    handleParams(bool) {
      // 处理tag3检查描述数据
      let list = []
      let numList = []
      let num = 0
      if (!bool) {
        this.preparedTips = JSON.parse(JSON.stringify(this.$refs.detail.selectedList))
      }
      let arrayList = this.preparedTips
      this.preparedTips.forEach((item, index) => {
        if (item.children && item.children.length > 0) {
          item.id = bool ? item.id : '' //新增状态 不传id
          item.children.forEach((i, j) => {
            i.rectifyDemand = this.$refs.modifyTime[num].modifyTimeForm.request
            i.rectifyTime = this.$refs.modifyTime[num].modifyTimeForm.time + ' 00:00:00'
            i.id = bool ? i.id : '' //新增状态 不传id
            list.push({
              tagName: 'tag3Item',
              tagContent: i.negativeDesc
            })
            numList.push({
              currIndex: num + 1,
              currTime: this.$refs.modifyTime[num].modifyTimeForm.time
                ? this.$refs.modifyTime[num].modifyTimeForm.time
                    .split(' ')[0]
                    .replace('-', '年')
                    .replace('-', '月') + '日'
                : null
            })
            num += 1
          })
        } else {
          item.rectifyDemand = this.$refs.modifyTime[num].modifyTimeForm.request
          item.rectifyTime = this.$refs.modifyTime[num].modifyTimeForm.time + ' 00:00:00'
          item.id = bool ? item.id : '' //新增状态 不传id
          list.push({
            tagName: 'tag3Item',
            tagContent: item.negativeDesc
          })
          numList.push({
            currIndex: num + 1,
            currTime: this.$refs.modifyTime[num].modifyTimeForm.time
              ? this.$refs.modifyTime[num].modifyTimeForm.time
                  .split(' ')[0]
                  .replace('-', '年')
                  .replace('-', '月') + '日'
              : null
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
      return {
        list: list,
        timeList: timeList,
        arrayList: arrayList
      }
    },
    // 保存并制作责令限期整改
    createTimeLimit(bool) {
      if (!bool) {
        this.timeLimitVis = false
        if (this.backToEditStatus) {
          // 回退编辑状态下取消 清空 ref = 'detail' 里的 selectedList
          this.alreadySave = new Date()
        }
        return
      }
      let _flag = true
      this.$nextTick(() => {
        for (let i = 0; i < this.flattenTips.length; i++) {
          if (this.$refs.modifyTime[i].validateForm()) {
            this.$message.error(this.$refs.modifyTime[i].validateForm())
            _flag = false
            break
          }
        }
        if (_flag) {
          // submit
          let user = JSON.parse(localStorage.getItem('res'))
          let otherParams = getWritParams({
            tag2: this.option.examineInfo.companyName,
            tag6: user.sysDeptEntity.government,
            tag7: user.sysDeptEntity.bureau,
            tag8: user.sysDeptEntity.court
          })
          let params
          let result = this.handleParams(this.backToEditStatus)
          if (this.backToEditStatus) {
            params = [...result.list, ...otherParams, ...result.timeList]
          } else {
            // 新增状态
            params = {
              companyId: this.option.examineInfo.companyId, //执法检查模块制作文书传company_id
              contractorIds: this.option.examineInfo.executorId,
              data: [...result.list, ...otherParams, ...result.timeList],
              sourceId: this.option.id,
              writType: 'ZLXQZGZLS'
            }
          }
          toRectification({
            companyId: this.option.examineInfo.companyId,
            examineId: this.option.examineInfo.id,
            probList: result.arrayList,
            reviewAdd: true,
            executorId: this.option.examineInfo.executorId,
            id: this.backToEditStatus ? this.timeLimitId : ''
          }).then(res => {
            params.businessId = res.id
            this.timeLimitId = res.id
            if (this.backToEditStatus) {
              updateWrit({ writId: this.writId }, params).then(res => {
                if (res.code === '0') {
                  this.afterTimeLimit(res)
                }
              })
            } else {
              createWrit(params).then(res => {
                this.afterTimeLimit(res)
              })
            }
          })
        }
      })
    },
    // 制作责令限期整改后
    afterTimeLimit(res) {
      this.setWritBtn(res.writType)
      this.writType = res.writType
      this.writId = res.writId
      this.showPdfDialog = true
      this.timeLimitVis = false
      this.backToEditStatus = false
      this.alreadySave = new Date()
      this.initData()
    },
    // 首次选择责令限期整改 整改时限 统一
    setTime(val) {
      this.$nextTick(() => {
        for (let i = 0; i < this.flattenTips.length; i++) {
          if (this.changedTimes == 0) {
            this.$refs.modifyTime.forEach(item => {
              item.modifyTimeForm.time = val
            })
            this.changedTimes += 1
          }
        }
      })
    },
    updatePdf() {
      if (this.writType === 'ws10005') {
        // 责令限期整改文书的回退编辑
        this.timeLimitUpdate()
      }
      this.showPdfDialog = false
      this.updateId = this.writId
    },
    // 责令限期整改回退编辑及点击卡片修改时
    timeLimitUpdate() {
      this.backToEditStatus = true
      // 调责令限期整改详情
      rectificationDetail({
        id: this.timeLimitId
      })
        .then(res => {
          res.data.probList.forEach(res => {
            // notQuaExpireTime 传给 modifyTime 组件
            if (res.children && res.children.length > 0) {
              res.children.forEach(r => {
                r.notQuaExpireTime = r.rectifyTime ? r.rectifyTime.replace(/(\/)/g, '-') + ':00' : void 0
              })
            } else {
              res.notQuaExpireTime = res.rectifyTime ? res.rectifyTime.replace(/(\/)/g, '-') + ':00' : void 0
            }
          })
          this.preparedTips = res.data.probList // 准备责令限期整改中的检查项的id
          this.flattenTips = []
          // 中间数据 start
          res.data.probList.forEach(res => {
            if (res.children && res.children.length > 0) {
              this.flattenTips = this.flattenTips.concat(res.children)
            } else {
              this.flattenTips = this.flattenTips.concat(res)
            }
            this.timeLimitVis = true
          })
          // 中间数据 end
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    // 生成文书
    makeWrit() {
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
        probIds: this.selectProbIds ? this.selectProbIds.substring(0, this.selectProbIds.length - 1) : '', //选中检查项的id
        checkIds: this.selectCheckIds ? this.selectCheckIds.substring(0, this.selectCheckIds.length - 1) : '' //选中检查项的checkid
      })
      if (this.option.reviewNameId.charAt(0) == ',') {
        this.option.reviewNameId = this.option.reviewNameId.substr(1, 1)
      }
      let params = {
        companyId: this.option.examineInfo.companyId, //执法检查模块制作文书传company_id
        contractorIds: this.option.reviewNameId,
        sourceId: this.option.id,
        writType: 'ZGFCYJS',
        data
      }
      // 新制作文书
      createWrit(params).then(
        res => {
          this.setWritBtn(res.writType)
          this.writId = res.writId
          this.writType = res.writType
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
      updateWrit({ writId: this.updateWritId }, params.data).then(res => {
        this.writId = this.updateWritId
        this.writType = res.writType
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
      this.writButton = {
        closePdf: true, //退出
        updatePdf: true, //回退编辑
        auditPdf: item.isAudit == 1, // 提交审核
        sealPdf: item.isSign == 1, // 加盖公章
        signPdf: item.userType == 1, // 签名
        lawSealPdf: item.isSign == 2, // 加盖执法专用章
        finishPdf: true //完成
      }
      this.writName = item.typeName
    },
    // 浏览文书
    previewWrit(id, name, button) {
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
      this.timeLimitVis = false
      this.flattenTips = []
      this.preparedTips = []
      this.rectificationWritVisible = false
      this.showPdfDialog = false
      this.initDocuList()
    },
    // 关闭整改复查意见书修改弹窗
    cancelRemake() {
      this.rectificationWritVisible = false
    },
    // 转行政处罚
    choosePunish() {
      // 如果是不合格的检查项 都是可以转行政处罚的
      let detailInfo = this.$refs.detail
      if (detailInfo.selectedList.length > 0) {
        // console.info('choose punish selectedList', detailInfo.selectedList)
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
      this.$confirm(`是否转入${val}行政处罚?`, '提示', {
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
            if (res.code === '0') {
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
          console.log(err)
        }
      )
    },
    // 修改文书
    updateWrit(title, type, id, businessId) {
      if (type === 'ZLXQZGZLS') {
        this.timeLimitId = businessId
        this.timeLimitUpdate()
        return
      }
      this.updateWritId = id
      rectificationPdfDetail({ writId: id })
        .then(res => {
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
            if (this.updateInfo) {
              // console.info('updateInfo', this.updateInfo)
              this.rectificationWritVisible = true
            }
          }
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    // 提交公章
    sealPdf(value) {
      let _audiReq = {
        auditTypeCode: 'ta80040', // 盖章审核
        handlerDeptId: value.deptId, // 审核人部门 id
        handlerUserId: value.peopleId, // 审核人 只能有一个
        requestDeptName: this.option.examineInfo.executorDeptName, // 承办人部门，现在先不填
        requestId: value.pdfId, // 文书 writId
        requestTime: void 0,
        requestUsersName: this.option.examineInfo.executorName, // 承办人名称
        submitterCause: this.option.examineInfo.companyName, // 案件名称 或 企业名称
        requestUsersIds: this.option.examineInfo.executorId,
        partyName: this.option.examineInfo.companyName,
        partyId: this.option.examineInfo.companyId
      }
      // 调用接口向下走流程
      sealAudit(_audiReq).then(
        res => {
          this.$message({
            type: 'success',
            message: '提交成功！'
          })
          this.showPdfDialog = false
          this.initDocuList()
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
    },
    noData: function(val, oldval) {
      if (val === true) {
        this.buttonList[1].disable = true
        this.buttonList[2].disable = true
      }
    }
  },
  computed: {
    ...mapState(['flag', 'detailId', 'isRectificationWrit']),
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
.limitDate {
  /deep/.el-dialog {
    width: 70%;
    // max-height: 70%;
    /deep/ .el-dialog__header {
      height: 3%;
    }
    /deep/ .el-dialog__body {
      padding-left: 16px;
      max-height: 390px;
      overflow-y: auto;
      // height: 450px;
      // /deep/.dialog-content {
      //  height: 300px;
      // }
    }
    /deep/ .el-dialog__footer {
      margin: 0;
    }
  }
}
</style>
