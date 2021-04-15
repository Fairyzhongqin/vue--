<template>
  <div class="mutilechoose" v-loading="loading">
    <div :class="searchBarFixed === true ? 'is_fixed' :''" id="fixBtn">
      <div class="title">
        <div class="tips" v-show="checkData && checkData.length > 0">
          <div>
            <!-- btn start -->
            <el-checkbox
              v-model="checkedAllStatus"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            >全选</el-checkbox>
            <!-- btn end -->
            共选中
            <span
              style="color:rgba(0,153,255,1); margin-right: 4px; font-size:15px; font-weight:bolder"
            >{{selectedNum}}</span>项
            <el-button :disabled="canOper" type="primary" @click="handleTips('toOperation')">现场处理措施</el-button>
            <el-button :disabled="canOper" type="primary" @click="handleTips('toLimit')">责令限期整改</el-button>
            <el-button :disabled="canOper" type="primary" @click="handleTips('toPunish')">行政处罚</el-button>
            <el-button style="color: #ff6000;border-color: #ff6000" @click="showAdminMeasure">行政强制</el-button>
            <el-button style="color: #ff6000;border-color: #ff6000" @click="showOtherDocum">制作其他文书</el-button>
          </div>
        </div>
      </div>
    </div>
    <div v-show="checkData && checkData.length > 0">
      <div v-for="(tips, index) in checkData" :key="tips.id" class="first">
        <span class="first-index-handle">{{index+1}}</span>
        <div class="first-content">
          <div class="marginLeft">
            <h5>检查项目类别：{{tips.discretionTypeName}}</h5>
            <div class="second">
              <div class="second-content">
                <div style="position: absolute; top: 2px;left: -31px;">
                  <el-checkbox
                    :disabled="tips.isGreat === '2'"
                    v-model="tips.checked"
                    @change="selectTips(true, index)"
                    v-show="tips.children.length == 0"
                  ></el-checkbox>
                </div>
                <!-- I'm dead ! -->
                <h3>检查内容：{{tips.checkItem !== null ? tips.checkItem : tips.checkContent}}</h3>
              </div>
            </div>
            <!-- ========================================================有子项======================================================== -->
            <div v-show="tips.children && tips.children.length > 0">
              <div v-for="(item, sonIndex) in tips.children" :key="item.id">
                <div class="second">
                  <div class="second-content">
                    <div class="second-check">
                      <el-checkbox
                        :disabled="item.isGreat === '2'"
                        v-model="item.checked"
                        @change="selectTips(false, index, sonIndex)"
                      ></el-checkbox>
                    </div>
                    <!-- <p class="numCirle" style="display:inline-block;color: #333333 ">{{sonIndex+1}}</p>、 -->
                    <h3 style="display:inline-block; margin-top: 10px">
                      <span class="numCirle">{{ sonIndex + 1 }}</span>
                      {{item.checkItem !== null ? item.checkItem : item.checkContent}}
                    </h3>
                  </div>
                </div>
                <!-- 检查描述的css -->
                <div class="input-des">
                  <p>检查描述：{{item.content}}</p>
                  <!-- <span>检查描述：</span>
                  <div style="display:inline-block">{{item.content}}</div>-->
                  <!-- <el-input
                    type="textarea"
                    :autosize="{minRows:1}"
                    v-model="item.content"
                    disabled
                    placeholder="请输入检查描述"
                  ></el-input>-->
                </div>
                <div
                  style="display:flex; flex-direction:row;justify-content:space-between;height:40px;padding-bottom:10px;position:relative"
                >
                  <div v-show="item.examineContent && item.examineContent != ''">
                    <span>处理方式:</span>
                    <span style="color:#0099FF">{{item. examineContent}}</span>
                  </div>
                  <!-- 有children -->
                  <div class="state-check">
                    <div>
                      <span style="color: #FF4B3D" v-if="item.isGreat === '0'">
                        <span class="flag">
                          <span class="right"></span>
                        </span>重大隐患
                      </span>
                      <span style="color: #FF4B3D" v-if="item.isGreat === '1'">
                        <span class="flag">
                          <span class="right"></span>
                        </span>一般隐患
                      </span>
                      <span
                        class="label"
                        style="color: #1cc19c"
                        @click="seeProof(false, index, sonIndex)"
                      >查看证据</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- ========================================================没有children======================================================== -->
            <div v-show="tips.children.length == 0">
              <div class="input-des">
                <p>检查描述：{{tips.content}}</p>
                <!-- <span>检查描述：</span> -->
                <!--  <el-input
                  type="textarea"
                  autosize
                  placeholder="输入检查描述"
                  disabled
                  v-model="tips.content"
                ></el-input>-->
                <!-- <div>{{ tips.content}}</div> -->
              </div>
              <div
                style="display:flex; flex-direction:row;justify-content:space-between;height:40px;padding-bottom:10px;position:relative"
              >
                <div v-show="tips.examineContent && tips.examineContent != ''">
                  <span>处理方式:</span>
                  <span style="color:#0099FF">{{tips.examineContent}}</span>
                </div>
                <div class="state-check">
                  <div>
                    <span style="color: #FF4B3D" v-if="tips.isGreat === '0'">
                      <span class="flag">
                        <span class="right"></span>
                      </span>重大隐患
                    </span>
                    <span style="color: #FF4B3D" v-if="tips.isGreat === '1'">
                      <span class="flag">
                        <span class="right"></span>
                      </span>一般隐患
                    </span>
                    <span class="label" style="color: #1cc19c" @click="seeProof(true, index)">查看证据</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 证据展示 在底部-->
    <div v-if="proofList && proofList.length > 0">
      <div v-for="(item, index) in proofList" :key="index" class="proofs">
        <down-proof :proof="item" :canDel="false"></down-proof>
      </div>
    </div>
    <!-- 选择制作的文书 制作行政强制措施的弹框-->
    <el-dialog
      title="制作行政强制"
      :visible.sync="choosedialogVisible"
      width="300px"
      class="diagxingzheng"
    >
      <chooseMakeDocument-dialog v-on="$listeners" v-bind="$attrs"></chooseMakeDocument-dialog>
    </el-dialog>
    <!-- 选择制作其他文书 -->
    <el-dialog
      title="制作其他文书"
      :visible.sync="chooseOtherDocuVisible"
      width="300px"
      class="chooseMakeDiag"
    >
      <chooseOtherDocu-dialog v-on="$listeners"></chooseOtherDocu-dialog>
    </el-dialog>
    <!-- 现场处理措施弹框 -->
    <el-dialog
      title="现场处理措施"
      :visible.sync="onSiteTreatmentMeasuresVisible"
      class="limitDate"
      :close-on-click-modal="false"
      :before-close="chearRewritStatus"
    >
      <div v-if="onSiteTreatmentMeasuresVisible" class="dialog-content">
        <onSiteTreatment-measures
          :selectedList="item"
          v-for="(item ,index) in MeasAndRecSelectedTips"
          :key="`index${index}`"
          :indexKey="index"
          ref="siteOperation"
        ></onSiteTreatment-measures>
      </div>
      <span slot="footer">
        <el-button @click="cancleonSiteTreatment">取 消</el-button>
        <el-button @click="createTransOperation" type="primary">保存并生成现场处理措施决定书</el-button>
        <!--   :disabled="!createInspectionAllowed" -->
        <!-- <el-button @click="toSeal" :disabled="audireqAllowed" type="primary">加盖执法专用章</el-button> -->
      </span>
    </el-dialog>
    <el-dialog title="选择审批审核人员" :visible.sync="selectPeople" width="1000px">
      <select-people :selectNum="1" @getPeople="submitToAudition"></select-people>
    </el-dialog>
    <!-- 责令期限整改-->
    <el-dialog
      title="责令限期整改"
      :visible.sync="modifyTimeVisible"
      class="limitDate"
      :close-on-click-modal="false"
      :before-close="chearRewritStatus"
    >
      <div v-if="modifyTimeVisible" class="dialog-content">
        <!-- <div class="modifyTime">
          <i class="iconfont icondaojishi"></i>
          <span>整改时限：</span>
          <el-date-picker v-model="time" type="date" placeholder="选择整改期限"></el-date-picker>
        </div>
        <span class="dashLine"></span>-->
        <modify-time
          :selectedList="item"
          v-for="(item ,index) in MeasAndRecSelectedTips"
          :key="index"
          :indexKey="index"
          @changeTime="setTime"
          ref="modifyTime"
        ></modify-time>
      </div>
      <span slot="footer">
        <el-button @click="cancleLimitModify">取 消</el-button>
        <el-button @click="createTransTimeLimit" type="primary">保存并生成责令限期整改指令书</el-button>
        <!--   :disabled="!createLimitAllowed" -->
        <!-- <el-button @click="toSeal" :disabled="audireqAllowed" type="primary">加盖执法专用章</el-button> -->
      </span>
    </el-dialog>
    <!-- <el-dialog :visible.sync="showPdfDialog" class="limitDate limit-show-pdf"> -->
    <show-pdf
      :pdfId="pdfId"
      :buttonList="writButton"
      v-if="showPdfDialog"
      @closePdf="closePdf"
      @sealPdf="submitAudition"
      @updatePdf="updatePdf"
      :writName="writName"
    ></show-pdf>
    <!-- </el-dialog> -->
    <!-- 行政处罚 -->
    <el-dialog
      title="行政处罚"
      :visible.sync="showAdminPenalityVisible"
      width="300px"
      class="xingzhengchufa"
    >
      <admin-penality :selectedList="flatSelectedTips" @successHandle="closePunishDialog"></admin-penality>
    </el-dialog>
    <!-- 查看证据的证据列表 -->
    <el-dialog
      title="关联的证据列表"
      :visible.sync="showProof"
      :modal-append-to-body="false"
      width="70%"
      :close-on-click-modal="false"
    >
      <div class="proofListWrap">
        <down-proof
          :proof="item"
          :canDel="false"
          v-for="(item, index) in seeProofList"
          :key="index"
          style="width:220px;height:146px;margin:2px 0;"
        ></down-proof>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import chooseMakeDocumentDialog from '../../componments/chooseMakeDocumentdialog'
import chooseOtherDocuDialog from '../../componments/chooseOtherDocuDialog'
import adminPenality from '../../componments/adminPenality'
import {
  getExamineInfo,
  deleteExamineItem,
  legislativeAuthority,
  saveExamine,
  makeDisposalDocument,
  addSeal,
  saveLimitedModify,
  enterPriseInquireByid
} from '@api/ProcessingofInspectionResult/index.js'
import { mapState } from 'vuex'
import addCheck from '@/pages/inspectionScheme/components/addCheck/index'
import SelectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople'
import { dateFormat, getWritParams, debounce, Throttle } from '@/utils/util'
import downProof from '@components/downProof/index'
import onSiteTreatmentMeasures from '../../componments/onSiteTreatmentMeasures'
import modifyTime from '../../componments/modifyTime'
import showPdf from '@/components/showPdf/index'
import { sealAudit } from '@api/common'
import { getWritInfo, updateWrit } from '@api/fileRelated'
import { handleWritStatus } from '@/utils/audit'
import {
  inspectionSave,
  getInspectionDetail,
  updateInspectionDetail,
  getComInfo,
  toRectification,
  toInspectionHandle,
  rectificationDetail,
  inspectionDetail
} from '@/api/onSiteInspection/index'
import radioCheck from '@components/radioCheck/index'
import Bus from '@/bus'
import { previewWrit, sealWrit } from '@/api/fileRelated'
import writTypeMap from '@/utils/writType'
export default {
  name: 'mutilechoose',
  data() {
    return {
      suggestionDataFromMeasure: null, // 从现场处理措施传来的数据
      proofList: [],
      seeProofList: [],
      accessoryUrl: '', //证据路径
      addSeaiVisible: false, //显示加盖公章弹框
      pdfId: '',
      showPdfDialog: false,
      writName: '',
      time: '',
      // stopProalue: "",
      addCheckProof: true,
      writButton: {
        updatePdf: true, // 回退编辑
        signPdf: true, // 签名
        auditPdf: false, // 提交审核
        sealPdf: true, // 加盖公章
        finishPdf: false, // 完成
        lawSealPdf: false, // 加盖执法专用章
        closePdf: true // 退出
      },
      loginUserInfo: '',
      selectPeople: false,
      sourceMeasureId: '', // 处理措施id
      loading: true, //
      resData: {}, // 现场检查详情数据
      checkData: [], // 接口获取的详情数据probList里的检查项
      selectedList: [], // 选中的检查项
      flatSelectedTips: [], // 传递给现场处理措施和责令限期整改的数据
      MeasAndRecSelectedTips: [], // 传递给现场处理措施和责令限期整改的中间数据
      choosedialogVisible: false, // 控制选择制作行政强制措施类文书

      chooseOtherDocuVisible: false, // 选择制作其他文书

      onSiteTreatmentMeasuresVisible: false, // 现场处理措施
      statusFromMeasureForm: false, // 现场处理措施 验证必填
      showProof: false, //是否展示证据

      modifyTimeVisible: false, // 责令期限整改
      // isUserSign: 0,

      showAdminPenalityVisible: false, // 控制行政处罚是否显示

      LimitMOdifyId: '', // 责令期限整改id
      // createLimitAllowed: true,
      // createInspectionAllowed: true,
      currWritId: '', // 当前正在处理的文书 id
      isCreateAllowed: true, // 是否允许保存与制作
      isAuditAllowed: true, // 是否允许加盖公章
      currTransType: '',
      audireqAllowed: true, // 当前是 责令限期整改，还是 现场处理措施
      // 控制选择内容弹出框
      // showinspectionContentdialog:false,
      // 选择的检查项的缓存
      // 进入现场检查措施的文书列表
      backToEditId: '', //回退编辑拿到的文书id
      backToEditStatus: false, //回退编辑狀態
      searchBarFixed: false, //吸顶
      offsetTop: null,
      measureDom: null,
      turnToModifyId: null, //转现场处理措施的id
      turnToMeasureId: null, //转责令限期整改的id
      changeModifyTimeCount: 0, //让责令限期整改的时间数据 刚开始时全部统一
      rectificationDetailId: '', //责令限期整改的id 取详情
      inspectionDetailId: '', //责令限期整改的id 取详情
      rectificationData: [], //责令限期整改详情数据
      inspectionData: [], //现场处理详情数据
      backToEditType: '', //回退编辑的类型 是现场处理措施还是责令限期整改
      checkedAllStatus: false, //全选还是反选
      isIndeterminate: false, //indeterminate 属性用以表示 checkbox 的不确定状态，一般用于实现全选的效果
      canTurnToPunish: '', //是不是满足转行政处罚前必须有责令限期整改或者是现场处理措施
      canTurnToRecheck: '', // site 检查项已有现场处理措施的处理 schedule 转责令限期整改的检查项里有已转过责令的
      // all for form validate
      measureForm: {
        suggestion: '',
        legalvalue: '', // 法律依据
        valuehandle: [] // 处理措施
      }
    }
  },
  components: {
    downProof,
    chooseMakeDocumentDialog,
    chooseOtherDocuDialog,
    addCheck,
    SelectPeople,
    onSiteTreatmentMeasures,
    modifyTime,
    showPdf,
    adminPenality,
    radioCheck
  },
  mounted() {
    this.loginUserInfo = JSON.parse(localStorage.getItem('res'))
    this.createTransOperation = debounce(this.createTransOperation)
    // this.createTransTimeLimit = debounce(this.createTransTimeLimit);
    // handleScroll为页面滚动的监听回调
    this.$nextTick(() => {
      this.measureDom = document.querySelector('.main-container')
      this.measureDom.addEventListener('scroll', this.handleScroll)
      this.offsetTop = document.querySelector('.main-container').offsetTop
    })
  },
  created() {
    this.getExamineInfoInit()
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  props: {
    needUpdate: {
      type: Date,
      required: true
    }
  },
  methods: {
    chearRewritStatus(done) {
      this.pdfId = ''
      this.showPdfDialog = false
      this.backToEditStatus = false
      this.backToEditId = ''
      done()
    },
    handleCheckAllChange(val) {
      if (val) {
        this.isIndeterminate = false
        this.selectedList = JSON.parse(JSON.stringify(this.checkData))
        this.selectedList.forEach(item => {
          if (item.children && item.children.length > 0) {
            item.children.forEach(son => {
              if (!son.children) {
                if (son.isGreat !== '2') {
                  son.checked = true
                }
              }
            })
          } else {
            if (item.isGreat !== '2') {
              item.checked = true
            }
          }
        })
        this.checkData = JSON.parse(JSON.stringify(this.selectedList))
        // isGreat == 2 时 没有隐患 没有隐患项不可以进行操作
        this.flatSelectedTips = this.selectedList.reduce((total, father) => {
          if (father.children && father.children.length > 0) {
            let hasChild = 0
            let list = father.children.reduce((sum, son) => {
              if (son.isGreat !== '2') {
                son.discretionTypeCode = father.discretionTypeCode
                son.discretionTypeName = father.discretionTypeName
                son.checkContent = son.checkItem ? son.checkItem : son.checkContent
                sum.push(son)
                hasChild++
              }
              return sum
            }, [])

            // if (list) {
            //   total = [...total, ...list]
            // }
            if (hasChild > 0) {
              father.children = list
              total.push(father)
            }
          } else {
            if (father.isGreat !== '2') {
              total.push(father)
            }
          }
          return total
        }, [])
      } else {
        this.checkedAllStatus = false
        this.isIndeterminate = false
        this.clearChooseStatus()
      }
    },
    clearChooseStatus() {
      // 清空选中状态
      this.selectedList = []
      this.checkData.forEach(item => {
        if (item.children && item.children.length > 0) {
          item.children.forEach(son => {
            if (!son.children) {
              son.checked = false
            }
          })
        } else {
          item.checked = false
        }
      })
      console.info('mutilechoose 2')
      // flat处理
      this.flatSelectedTips = []
      this.checkedAllStatus = false
      this.isIndeterminate = false
    },
    // 吸顶
    handleScroll() {
      // 得到页面滚动的距离
      let scrollTop = this.measureDom.scrollTop
      // 判断页面滚动的距离是否大于吸顶元素的位置
      this.searchBarFixed = scrollTop > this.offsetTop ? true : false
    },
    closePdf() {
      this.clearChooseStatus()
      this.showPdfDialog = false
      this.modifyTimeVisible = false
      this.onSiteTreatmentMeasuresVisible = false
      this.backToEditStatus = false
      this.backToEditId = null
    },
    closePunishDialog() {
      this.showAdminPenalityVisible = false
      this.getExamineInfoInit()
    },
    handleTips(val) {
      let flag = false
      this.canTurnToRecheck = ''
      this.canTurnToPunish = ''
      this.MeasAndRecSelectedTips = []
      for (var item in this.flatSelectedTips) {
        if (this.flatSelectedTips[item].children && this.flatSelectedTips[item].children.length > 0) {
          this.MeasAndRecSelectedTips = this.MeasAndRecSelectedTips.concat(this.flatSelectedTips[item].children)
        } else {
          this.MeasAndRecSelectedTips = this.MeasAndRecSelectedTips.concat(this.flatSelectedTips[item])
        }
      }
      switch (val) {
        case 'toOperation':
          flag = this.isRepeat('现场')
          if (!flag) {
            this.onSiteTreatmentMeasuresVisible = flag
            this.$message({
              message: '请不要重复处理',
              type: 'warning'
            })
          } else if (flag === '责令限期整改') {
            this.$message({
              message: '您的检查项已选择责令限期整改，无法进行现场处理措施！',
              type: 'warning'
            })
          } else {
            this.$confirm('请确认是否还有需要现场处理措施的检查项！', '温馨提示', {
              confirmButtonText: '已经选好了，直接制作',
              cancelButtonText: '需要再想想',
              type: 'warning'
            })
              .then(() => {
                // 解决闪烁
                setTimeout(() => {
                  this.onSiteTreatmentMeasuresVisible = flag
                }, 300)
              })
              .catch(() => {
                done()
              })
          }
          clearTimeout() //为了避免内存泄漏 需要在用过之后清除定时器
          break
        case 'toLimit':
          flag = this.isRepeat('责令')
          this.changeModifyTimeCount = 0
          if (!flag) {
            this.modifyTimeVisible = flag
            this.$message({
              message: '请不要重复处理',
              type: 'warning'
            })
          } else if (flag === '现场处理措施') {
            this.$message({
              message: '您的检查项已选择现场处理措施，无法进行责令限期整改！',
              type: 'warning'
            })
          } else {
            this.$confirm('请确认是否还有需要责令限期整改的检查项！', '温馨提示', {
              confirmButtonText: '已经选好了，直接制作',
              cancelButtonText: '需要再想想',
              type: 'warning'
            })
              .then(() => {
                // 解决闪烁
                setTimeout(() => {
                  this.modifyTimeVisible = flag
                }, 300)
              })
              .catch(() => {
                done()
              })
          }
          clearTimeout() //为了避免内存泄漏 需要在用过之后清除定时器
          break
        case 'toPunish':
          flag = this.isRepeat('处罚')

          if (!flag) {
            if (this.canTurnToPunish === '转行政处罚前必须有责令限期整改或者是现场处理措施') {
              this.$alert('该检查项尚未开具现场处理措施或责令限期整改，不符合行政处罚条件，请确认！', '温馨提示', {
                confirmButtonText: '确定',
                callback: action => {},
                type: 'warning'
              })
            }
            if (!this.canTurnToPunish && flag === false) {
              this.$message({
                message: '请不要重复处理',
                type: 'warning'
              })
            }
          } else {
            this.showAdminPenalityVisible = flag
          }
          break
      }
    },
    // 进行转之前的重复判断
    isRepeat(type) {
      let result = true
      this.selectedList.forEach(item => {
        this.checkData.forEach(i => {
          if (i.discId === item.discId) {
            if (item.children && item.children.length > 0) {
              item.children.forEach(child => {
                if (child.isGreat !== '2') {
                  i.children.forEach(c => {
                    if (c.discRulesId === child.discRulesId) {
                      // 如果是点击处罚
                      if (type === '处罚') {
                        if (c.examineContent) {
                          // 只有处罚字段
                          if (c.examineContent.includes(type) && c.examineContent.includes('现场') === false && c.examineContent.includes('责令') === false) {
                            result = false
                          }
                          // 有处罚字段 和 现场责令二选一的时候
                          if (c.examineContent.includes(type) && (c.examineContent.includes('现场') === true || c.examineContent.includes('责令') === true)) {
                            result = false
                          }
                        } else {
                          if (!c.examineContent || c.examineContent === null || c.examineContent === '') {
                            // 转行政处罚前必须有责令限期整改或者是现场处理措施
                            this.canTurnToPunish = '转行政处罚前必须有责令限期整改或者是现场处理措施'
                            result = false
                          }
                        }
                      }
                      // 如果是点击责令限期整改
                      if (type === '责令') {
                        if (c.examineContent) {
                          // 已经有责令了 无论有没有其他的 都是单纯的不能重复
                          if (c.examineContent.includes('责令') === true) {
                            result = false
                          }
                          if (c.examineContent.includes('现场') === true) {
                            result = '现场处理措施'
                          }
                        }
                      }
                      // 如果是点击现场处理措施
                      if (type === '现场') {
                        if (c.examineContent) {
                          // 已经有现场了 单纯的不能重复
                          if (c.examineContent.includes('现场') === true) {
                            result = false
                          }
                          if (c.examineContent.includes('责令') === true) {
                            result = '责令限期整改'
                          }
                        }
                      }
                    }
                  })
                }
              })
            } else {
              // 没有子项
              if (item.isGreat !== '2') {
                // 如果是点击处罚
                if (type === '处罚') {
                  if (i.examineContent) {
                    // 只有处罚字段
                    if (i.examineContent.includes(type) && i.examineContent.includes('现场') === false && i.examineContent.includes('责令') === false) {
                      result = false
                    }
                    // 有处罚字段 和 现场责令二选一的时候
                    if (i.examineContent.includes(type) && (i.examineContent.includes('现场') === true || i.examineContent.includes('责令') === true)) {
                      result = false
                    }
                  } else {
                    if (!i.examineContent || i.examineContent === null || i.examineContent === '') {
                      // 转行政处罚前必须有责令限期整改或者是现场处理措施
                      this.canTurnToPunish = '转行政处罚前必须有责令限期整改或者是现场处理措施'
                      result = false
                    }
                  }i
                }
                // 如果是点击责令限期整改
                if (type === '责令') {
                  if (i.examineContent) {
                    // 已经有责令了 单纯的不能重复
                    if (i.examineContent.includes('责令') === true) {
                      result = false
                    }
                    if (i.examineContent.includes('现场') === true) {
                      result = '现场处理措施'
                    }
                  }
                }
                // 如果是点击现场处理措施
                if (type === '现场') {
                  if (i.examineContent) {
                    // 已经有现场了 单纯的不能重复
                    if (i.examineContent.includes('现场') === true) {
                      result = false
                    }
                    if (i.examineContent.includes('责令') === true) {
                      result = '责令限期整改'
                    }
                  }
                }
              }
            }
          }
        })
      })
      return result
    },
    // 查看证据
    seeProof(state, index, sonIndex) {
      let item = state ? this.checkData[index] : this.checkData[index].children[sonIndex]
      if (item.accessoryList && item.accessoryList.length !== 0) {
        this.showProof = true
        this.seeProofList = item.accessoryList
      } else {
        this.$message({
          message: '该检查项没有关联证据',
          type: 'error'
        })
      }
    },
    submitAudition(value) {
      let _audiReq = {
        auditTypeCode: 'ta80040', // 盖章审核
        handlerDeptId: value.deptId, // 审核人部门 id
        handlerUserId: value.peopleId, // 审核人 只能有一个
        requestDeptName: this.resData.executorDeptName, // 承办人部门，现在先不填
        requestId: value.pdfId, // 文书 writId
        requestTime:
          this.resData.examineStartTime
            .split(' ')[0]
            .replace('/', '年')
            .replace('/', '月') + '日',
        requestUsersName: this.resData.executorName, // 承办人名称
        submitterCause: this.resData.companyName, // 案件名称 或 企业名称
        requestUsersIds: this.resData.executorId,
        partyName: this.resData.companyName,
        partyId: this.resData.companyId
      }
      this.audireqAllowed = true

      if (value.writName === '责令限期整改指令书') {
        _audiReq.auditTypeCode = 'ta80053'
      }
      if (value.writName === '现场处理措施决定书') {
        _audiReq.auditTypeCode = 'ta80052'
      }
      // 调用接口向下走流程
      sealAudit(_audiReq).then(
        res => {
          this.modifyTimeVisible = false
          this.onSiteTreatmentMeasuresVisible = false
          this.$message({
            type: 'success',
            message: '提交成功！'
          })
          // 提交成功后应该清楚文书相关数据和状态
          this.pdfId = null
          this.backToEditStatus = false
          this.backToEditId = null
          // this.currTransType === "operation"
          //   ? (this.onSiteTreatmentMeasuresVisible = false)
          //   : (this.modifyTimeVisible = false);
        },
        () => {
          this.$message({
            type: 'error',
            message: '提交失败！'
          })
        }
      )
    },
    // 盖公章
    submitToAudition(bool, auditor) {
      this.selectPeople = false
      if (!bool) return
      let _audiReq = {
        auditTypeCode: 'ta80040', // 盖章审核
        handlerDeptId: auditor[0].deptId, // 审核人部门 id
        handlerUserId: auditor[0].id, // 审核人 只能有一个
        requestDeptName: this.resData.executorDeptName, // 承办人部门，现在先不填
        requestId: this.pdfId, // 文书 writId
        requestTime:
          this.resData.examineStartTime
            .split(' ')[0]
            .replace('/', '年')
            .replace('/', '月') + '日',
        requestUsersName: this.resData.executorName, // 承办人名称
        submitterCause: this.resData.companyName, // 案件名称 或 企业名称
        requestUsersIds: this.resData.executorId,
        partyName: this.resData.companyName,
        partyId: this.resData.companyId
      }
      this.audireqAllowed = true
      // 调用接口向下走流程
      sealAudit(_audiReq).then(
        res => {
          this.modifyTimeVisible = false
          this.onSiteTreatmentMeasuresVisible = false

          this.$message({
            type: 'success',
            message: '提交成功！'
          })
        },
        () => {
          this.$message({
            type: 'error',
            message: '提交失败！'
          })
        }
      )
    },
    // 格式化时间
    formatTime(cellvalue) {
      var currentdate = ''
      if (cellvalue) {
        cellvalue = cellvalue.replace(new RegExp(/-/gm), '/')
        var date = new Date(cellvalue)
        var month = date.getMonth() + 1

        var strDate = date.getDate()
        if (month >= 1 && month <= 9) {
          month = '0' + month
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = '0' + strDate
        }

        currentdate = date.getFullYear() + '年' + month + '月' + strDate + '日'
      }

      return currentdate
    },
    // 处理tag4检查描述数据
    handleData(data = []) {
      let temp = []
      data.forEach(item => {
        temp.push({
          id: '',
          tagName: 'tag4Item',
          tagContent: item.negativeDesc,
          WritId: ''
        })
      })
      return temp
    },
    // 处理tag3检查描述数据
    handleDatalimit(data = []) {
      let temp = []
      data.forEach(item => {
        temp.push({
          id: '',
          tagName: 'tag3Item',
          tagContent: item.negativeDesc,
          WritId: ''
        })
      })
      return temp
    },
    // 处理tag6数据
    handleSuggest(data = []) {
      let temp = []
      data.forEach(item => {
        temp.push({
          id: '',
          tagName: 'tag6Item',
          tagContent: item,
          WritId: ''
        })
      })
      return temp
    },
    //处理tag10数据
    handleExaminId(data = []) {
      let temp = []
      data.forEach(item => {
        temp.push({
          id: '',
          tagName: 'tag10Item',
          tagContent: item,
          WritId: ''
        })
      })
      return temp
    },
    // 处理显示证据详情的参数
    handlerProof() {
      // 先看是不是有公共证据
      if (this.resData && this.resData.evidenceList && this.resData.evidenceList.length > 0) {
        this.resData.evidenceList.forEach(item => {
          item.id = this.resData.id
          item.type = '0'
        })
        this.proofList = [...this.resData.evidenceList]
        // this.proofList = [...this.resData.evidenceList, ...this.proofList];
      }
      // 子项的证据
      let tipsList = this.resData.probList ? this.resData.probList : [],
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
    // 初始化现场检查详情数据封装
    getExamineInfoInit(val) {
      getExamineInfo({
        ...val,
        id: this.tableId
      }).then(
        res => {
          this.resData = res.data
          this.handlerProof()
          if (res.data.probList && res.data.probList.length > 0) {
            res.data.probList.forEach(item => {
              if (item.children && item.children.length > 0) {
                item.children.forEach(i => {
                  i.content = i.isGreat === '2' ? i.checkDesc : i.negativeDesc
                })
              } else {
                item.content = item.isGreat === '2' ? item.checkDesc : item.negativeDesc
              }
            })
          }
          this.checkData = res.data.probList
          this.clearChooseStatus()
          if (this.checkData) {
            this.loading = false
          }
        },
        err => {
          console.info('请求失败：', err)
        }
      )
    },
    // 取消现场检查措施
    cancleonSiteTreatment() {
      this.onSiteTreatmentMeasuresVisible = false
      this.backToEditStatus = false
      // this.selectedList = [];
    },
    // 取消责令期限整改
    cancleLimitModify() {
      this.modifyTimeVisible = false
      this.backToEditStatus = false
    },
    // 选择制作其他文书
    showOtherDocum() {
      this.chooseOtherDocuVisible = true
    },
    // 控制选择生成文书 行政强制措施
    showAdminMeasure() {
      this.choosedialogVisible = true
    },
    //保存校验现场处理措施
    createTransOperation() {
      let _flag = true
      this.$nextTick(() => {
        for (let i = 0; i < this.flatSelectedTips.length; i++) {
          if (this.$refs.siteOperation[i].validateForm()) {
            this.$message.error(this.$refs.siteOperation[i].validateForm())
            _flag = false
            break
          }
        }
        if (_flag) {
          // submit
          if (this.backToEditStatus === true) {
            let user = JSON.parse(localStorage.getItem('res'))
            let list = [],
              suggestion = [],
              hadleInfo = [],
              legalInfoContent = []
            let arrayList = JSON.parse(JSON.stringify(this.flatSelectedTips))
            let num = 0
            let legalvalue = ''
            arrayList.forEach((item, index) => {
              if (item.children && item.children.length > 0) {
                item.children.forEach((i, j) => {
                  i.disposeOpinion = this.$refs.siteOperation[num].measureForm.suggestion
                  i.lawCode = this.$refs.siteOperation[num].lawCode.join(',')
                  i.legalvalue = this.$refs.siteOperation[num].measureForm.legalvalue
                  i.measuresCode = this.$refs.siteOperation[num].measureForm.valuehandle.join(',')
                   // 整改承诺时限
                  if (this.$refs.siteOperation[num].measureForm.rectifyTime) {
                    i.rectifyTime = dateFormat(this.$refs.siteOperation[num].measureForm.rectifyTime, 'yyyy-mm-dd') + ' 00:00:00'
                  } else {
                    let date = new Date()
                    let newDate = date.setMonth(date.getMonth() + 6)
                    i.rectifyTime = dateFormat(new Date(newDate), 'yyyy-mm-dd') + ' 00:00:00'
                  }
                  let s = this.$refs.siteOperation[num].measureForm.suggestion
                  if (s && s !== '') {
                    suggestion.push({
                      tagName: 'tag6Item',
                      tagContent: this.$refs.siteOperation[num].measureForm.suggestion
                    })
                  }
                  // this.$refs.siteOperation[num].selectedMeasure.forEach(measure => {
                  //   suggestion.push({
                  //     tagName: "tag6Item",
                  //     tagContent: measure.label
                  //   });
                  // });
                  /* this.$refs.siteOperation[num].selectedLegal.forEach(law => {
                legalInfoContent.push(law.label)
              }) */
                  this.$refs.siteOperation[num].lawWritInfo.forEach(law => {
                    legalInfoContent.push(law.value)
                  })
                  list.push({
                    tagName: 'tag4Item',
                    tagContent: i.negativeDesc
                  })
                  num += 1
                })
              } else {
                item.disposeOpinion = this.$refs.siteOperation[num].measureForm.suggestion
                item.lawCode = this.$refs.siteOperation[num].lawCode.join(',')
                item.legalvalue = this.$refs.siteOperation[num].measureForm.legalvalue
                item.measuresCode = this.$refs.siteOperation[num].measureForm.valuehandle.join(',')
                 // 整改承诺时限
                  if (this.$refs.siteOperation[num].measureForm.rectifyTime) {
                    item.rectifyTime = dateFormat(this.$refs.siteOperation[num].measureForm.rectifyTime, 'yyyy-mm-dd') + ' 00:00:00'
                  } else {
                    let date = new Date()
                    let newDate = date.setMonth(date.getMonth() + 6)
                    item.rectifyTime = dateFormat(new Date(newDate), 'yyyy-mm-dd') + ' 00:00:00'
                  }
                list.push({
                  tagName: 'tag4Item',
                  tagContent: item.negativeDesc
                })
                let s = this.$refs.siteOperation[num].measureForm.suggestion
                if (s && s !== '') {
                  suggestion.push({
                    tagName: 'tag6Item',
                    tagContent: this.$refs.siteOperation[num].measureForm.suggestion
                  })
                }
                // this.$refs.siteOperation[num].selectedMeasure.forEach(measure => {
                //   suggestion.push({
                //     tagName: "tag6Item",
                //     tagContent: measure.label
                //   });
                // });
                // hack 点击修改 不改内容直接点击保存 法律规定为空的问题
                /*  this.$refs.siteOperation[num].selectedLegal.forEach(law => {
            legalInfoContent.push(law.label);
          }); */
                /*  this.$refs.siteOperation[num].selectedLegal.forEach(law => {
              legalInfoContent.push(law.label)
            }) */
                this.$refs.siteOperation[num].lawWritInfo.forEach(law => {
                  legalInfoContent.push(law.value)
                })
                //
                num += 1
              }
            })
            legalInfoContent = Array.from(new Set(legalInfoContent))
            let startTimeList = this.inspectionData.examineInfo.examineStartTime.split(' ')[0].split('/')
            let startTime = startTimeList[0] + '年' + startTimeList[1] + '月' + startTimeList[2] + '日'
            let otherParams = getWritParams({
              tag2: this.inspectionData.examineInfo.companyName,
              tag3: startTime,
              tag5: legalInfoContent.join('、'),
              tag7: user.sysDeptEntity.government,
              tag8: user.sysDeptEntity.bureau,
              tag9: user.sysDeptEntity.court
            })
            let params = [...list, ...suggestion, ...otherParams]
            toInspectionHandle({
              companyId: this.inspectionData.examineInfo.companyId,
              examineId: this.inspectionData.examineId,
              probList: arrayList,
              executorId: this.inspectionData.examineInfo.executorId,
              id: this.inspectionDetailId
            }).then(res => {
              if (this.backToEditStatus) {
                params.businessId = res.id
                updateWrit({ writId: this.backToEditId }, params)
                  .then(res => {
                    if (res.code === '0') {
                      this.setWritButton(res.writType)
                      this.pdfId = res.writId
                      this.showPdfDialog = true
                      this.clearChooseStatus()
                    }
                  })
                  .catch(err => {
                    console.info(err + '修改文书失败')
                  })
              }
            })
          } else {
            // 新增
            let user = JSON.parse(localStorage.getItem('res'))
            let list = [],
              suggestion = [],
              hadleInfo = [],
              legalInfoContent = []
            let arrayList = JSON.parse(JSON.stringify(this.flatSelectedTips))
            let num = 0
            arrayList.forEach((item, index) => {
              if (item.children && item.children.length > 0) {
                item.children.forEach((i, j) => {
                  i.checkId = i.id
                  i.id = ''
                  // 整改承诺时限
                  if (this.$refs.siteOperation[num].measureForm.rectifyTime) {
                    i.rectifyTime = dateFormat(this.$refs.siteOperation[num].measureForm.rectifyTime, 'yyyy-mm-dd') + ' 00:00:00'
                  } else {
                    let date = new Date()
                    let newDate = date.setMonth(date.getMonth() + 6)
                    i.rectifyTime = dateFormat(new Date(newDate), 'yyyy-mm-dd') + ' 00:00:00'
                  }
                  i.disposeOpinion = this.$refs.siteOperation[num].measureForm.suggestion
                  i.lawCode = this.$refs.siteOperation[num].lawCode.join(',')
                  i.measuresCode = this.$refs.siteOperation[num].measureForm.valuehandle.join(',')
                  let s = this.$refs.siteOperation[num].measureForm.suggestion
                  if (s && s !== '') {
                    suggestion.push({
                      tagName: 'tag6Item',
                      tagContent: this.$refs.siteOperation[num].measureForm.suggestion
                    })
                  }
                  this.$refs.siteOperation[num].lawWritInfo.forEach(law => {
                    legalInfoContent.push(law.value)
                  })
                  list.push({
                    tagName: 'tag4Item',
                    tagContent: i.negativeDesc
                  })

                  num += 1
                })
                item.checkId = item.id
                item.id = ''
              } else {
                item.disposeOpinion = this.$refs.siteOperation[num].measureForm.suggestion
                item.lawCode = this.$refs.siteOperation[num].lawCode.join(',')
                item.measuresCode = this.$refs.siteOperation[num].measureForm.valuehandle.join(',')
                item.checkId = item.id
                // 整改承诺时限
                if (this.$refs.siteOperation[num].measureForm.rectifyTime) {
                  item.rectifyTime = dateFormat(this.$refs.siteOperation[num].measureForm.rectifyTime, 'yyyy-mm-dd') + ' 00:00:00'
                } else {
                  let date = new Date()
                  let newDate = date.setMonth(date.getMonth() + 6)
                  item.rectifyTime = dateFormat(new Date(newDate), 'yyyy-mm-dd') + ' 00:00:00'
                }
                item.id = ''
                list.push({
                  tagName: 'tag4Item',
                  tagContent: item.negativeDesc
                })
                let s = this.$refs.siteOperation[num].measureForm.suggestion
                if (s && s !== '') {
                  suggestion.push({
                    tagName: 'tag6Item',
                    tagContent: this.$refs.siteOperation[num].measureForm.suggestion
                  })
                }
                this.$refs.siteOperation[num].lawWritInfo.forEach(law => {
                  legalInfoContent.push(law.value)
                })
                num += 1
              }
            })
            legalInfoContent = Array.from(new Set(legalInfoContent))
            let otherParams = getWritParams({
              tag2: this.resData.companyName,
              tag3:
                this.resData.examineStartTime
                  .split(' ')[0]
                  .replace('/', '年')
                  .replace('/', '月') + '日',
              tag5: legalInfoContent.join('、'),
              tag7: user.sysDeptEntity.government,
              tag8: user.sysDeptEntity.bureau,
              tag9: user.sysDeptEntity.court
            })
            let params = {
              companyId: this.resData.companyId, //执法检查模块制作文书传company_id
              contractorIds: this.resData.executorId,
              data: [...list, ...suggestion, ...otherParams],
              sourceId: this.resData.id,
              writType: 'XCCLCS'
            }
            toInspectionHandle({
              companyId: this.resData.companyId,
              examineId: this.resData.id,
              probList: arrayList,
              executorId: this.resData.executorId
            }).then(res => {
              this.inspectionDetailId = res.id
              // 正常生成文书
              params.businessId = res.id
              this.turnToMeasureId = res.id
              this.createInspectionAllowed = false
              this.getExamineInfoInit()
              makeDisposalDocument(params).then(
                res => {
                  this.pdfId = res.writId
                  this.backToEditId = res.writId
                  this.audireqAllowed = false
                  this.setWritButton(res.writType)
                  this.showPdfDialog = true
                  // 清除选中状态
                  this.clearChooseStatus()
                },
                err => {
                  console.info(err)
                }
              )
            })
          }
        }
      })
    },
    // 预览文书
    previewWrit(id, name, button) {
      if (id) {
        // 从文书卡片传来的id
        this.pdfId = id
        this.writButton = button
        this.writName = name
        this.writTypeCode = null
      }
      this.showPdfDialog = true
    },
    // 文书按钮
    setWritButton(code) {
      let writTypeInfo = JSON.parse(sessionStorage.writTypeInfo)
      let item = writTypeInfo.find(i => {
        return i.id === code
      })
      this.writButton = {
        closePdf: true,
        updatePdf: true,
        auditPdf: item.isAudit == 1,
        sealPdf: item.isSign == 1,
        signPdf: item.userType == 1,
        lawSealPdf: item.isSign == 2,
        finishPdf: true
      }
      this.writTypeCode = item.auditTypeCode //提交审核 传的 auditTypeCode
      this.writName = item.typeName
      this.backToEditType = item.typeName
    },
    setTime(val) {
      this.$nextTick(() => {
        for (let i = 0; i < this.flatSelectedTips.length; i++) {
          if (this.changeModifyTimeCount == 0) {
            this.$refs.modifyTime.forEach(item => {
              item.modifyTimeForm.time = val
            })
            this.changeModifyTimeCount += 1
          }
        }
      })
    },
    // 制作责令限期整改
    createTransTimeLimit() {
      let _flag = true
      this.$nextTick(() => {
        for (let i = 0; i < this.flatSelectedTips.length; i++) {
          if (this.$refs.modifyTime[i].validateForm()) {
            this.$message.error(this.$refs.modifyTime[i].validateForm())
            _flag = false
            break
          }
        }
        if (_flag) {
          // submit
          if (this.backToEditStatus === true) {
            // 修改  需要存probList每一个检查项的id  包括子项
            let user = JSON.parse(localStorage.getItem('res'))
            let list = []
            let numList = []
            let arrayList = JSON.parse(JSON.stringify(this.flatSelectedTips))
            let num = 0
            arrayList.forEach((item, index) => {
              if (item.children && item.children.length > 0) {
                item.children.forEach((i, j) => {
                  i.rectifyDemand = this.$refs.modifyTime[num].modifyTimeForm.request
                  i.rectifyTime = this.$refs.modifyTime[num].modifyTimeForm.time
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
                item.rectifyTime = this.$refs.modifyTime[num].modifyTimeForm.time
                list.push({
                  tagName: 'tag3Item',
                  tagContent: item.negativeDesc
                })
                numList.push({
                  currIndex: num + 1,
                  currTime:
                    this.$refs.modifyTime[num].modifyTimeForm.time
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
              tag2: this.rectificationData.examineInfo.companyName,
              tag6: user.sysDeptEntity.government,
              tag7: user.sysDeptEntity.bureau,
              tag8: user.sysDeptEntity.court
            })
            let params = [...list, ...otherParams, ...timeList]
            toRectification({
              companyId: this.rectificationData.examineInfo.companyId,
              examineId: this.rectificationData.examineId,
              probList: arrayList,
              executorId: this.rectificationData.examineInfo.executorId,
              id: this.rectificationData.id
            }).then(res => {
              params.businessId = res.id
              updateWrit({ writId: this.backToEditId }, params).then(res => {
                if (res.code === '0') {
                  this.pdfId = res.writId
                  this.setWritButton(res.writType)
                  this.showPdfDialog = true
                  this.backToEditStatus = false
                  // 清除选中状态
                  this.clearChooseStatus()
                }
              })
            })
          } else {
            // 新增状态 不存probList每一个检查项的id 包括父项子项
            let user = JSON.parse(localStorage.getItem('res'))
            // 处理tag3检查描述数据
            let list = []
            let numList = []
            let arrayList = JSON.parse(JSON.stringify(this.flatSelectedTips))
            let num = 0
            arrayList.forEach((item, index) => {
              if (item.children && item.children.length > 0) {
                item.checkId = item.id
                item.id = '' //新增状态 不传id
                item.children.forEach((i, j) => {
                  i.rectifyDemand = this.$refs.modifyTime[num].modifyTimeForm.request
                  i.rectifyTime = this.$refs.modifyTime[num].modifyTimeForm.time
                  i.checkId = i.id
                  i.id = '' //新增状态 不传id
                  list.push({
                    tagName: 'tag3Item',
                    tagContent: i.negativeDesc
                  })
                  // numList.push(num + 1);
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
                item.rectifyTime = this.$refs.modifyTime[num].modifyTimeForm.time
                item.checkId = item.id
                item.id = '' //新增状态 不传id
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
            let otherParams = getWritParams({
              tag2: this.resData.companyName,
              tag6: user.sysDeptEntity.government,
              tag7: user.sysDeptEntity.bureau,
              tag8: user.sysDeptEntity.court
            })

            let params = {
              companyId: this.resData.companyId, //执法检查模块制作文书传company_id
              contractorIds: this.resData.executorId,
              data: [...list, ...otherParams, ...timeList],
              sourceId: this.resData.id,
              writType: 'ZLXQZGZLS'
            }

            toRectification({
              companyId: this.resData.companyId,
              examineId: this.resData.id,
              probList: arrayList,
              executorId: this.resData.executorId
              // rectifyTime: dateFormat(this.time, "yyyy-mm-dd HH:MM:ss")
            })
              .then(res => {
                this.rectificationDetailId = res.id
                //正常生成文书
                params.businessId = res.id
                // 作为修改的唯一id
                this.turnToModifyId = res.id
                // this.createLimitAllowed = false;
                this.getExamineInfoInit()
                makeDisposalDocument(params).then(
                  res => {
                    this.pdfId = res.writId
                    this.backToEditId = this.pdfId
                    this.showPdfDialog = true
                    this.audireqAllowed = false
                    this.modifyTimeVisible = false
                    this.setWritButton(res.writType)
                  },
                  err => {
                    console.log(err)
                  }
                )
              })
              .catch(err => {
                console.info(err)
              })
          }
        }
      })
    },
    // 选择有隐患的检查项
    selectTips(state, index, secondIndex) {
      let id = state ? this.checkData[index].discId : this.checkData[index].children[secondIndex].discRulesId
      let father = this.checkData[index]
      let son = state ? null : this.checkData[index].children[secondIndex]
      let fatherIndex = -1
      let sonIndex = -1
      // 应该要去除 没有隐患的检查项 也就是isGreat !== '2'
      this.selectedList.forEach((item, i) => {
        if (item.children && item.children.length > 0) {
          item.children.forEach((tips, j) => {
            if (tips.discRulesId === id) {
              fatherIndex = i
              sonIndex = j
            }
          })
        }

        if (item.discId === father.discId) {
          fatherIndex = i
        }
      })

      if (state) {
        if (fatherIndex !== -1) {
          this.selectedList.splice(fatherIndex, 1)
        } else {
          this.selectedList.push(this.checkData[index])
        }
      } else {
        if (fatherIndex === -1) {
          let obj = JSON.parse(JSON.stringify(father))
          obj.children = [son]
          this.selectedList.push(obj)
        } else {
          if (sonIndex === -1) {
            this.selectedList[fatherIndex].children.push(son)
          } else {
            this.selectedList[fatherIndex].children.splice(sonIndex, 1)
            if (this.selectedList[fatherIndex].children.length === 0) {
              this.selectedList.splice(fatherIndex, 1)
            }
          }
        }
      }
      this.isIndeterminate = true

      this.flatSelectedTips = this.selectedList.reduce((total, father) => {
        let hasChild = 0
        if (father.children && father.children.length > 0) {
          let list = father.children.reduce((sum, son) => {
            if (son.isGreat !== '2') {
              son.discretionTypeCode = father.discretionTypeCode
              son.discretionTypeName = father.discretionTypeName
              son.checkContent = son.checkItem ? son.checkItem : son.checkContent
              sum.push(son)
              hasChild++
            }
            return sum
          }, [])
          // if (list) {
          //   total = [...total, ...list]
          // }
          if (hasChild > 0) {
            father.children = list
            total.push(father)
          }
        } else {
          if (father.isGreat !== '2') {
            total.push(father)
          }
        }
        return total
      }, [])
    },
    updatePdf() {
      this.backToEditStatus = true
      this.clearChooseStatus()
      if (this.backToEditType.includes('现场处理')) {
        // 现场处理措施的详情
        inspectionDetail({ id: this.inspectionDetailId }).then(res => {
          this.inspectionData = res.data
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
          this.flatSelectedTips = list
          // 中间数据 start
          this.MeasAndRecSelectedTips = []
          for (var item in this.flatSelectedTips) {
            if (this.flatSelectedTips[item].children && this.flatSelectedTips[item].children.length > 0) {
              this.MeasAndRecSelectedTips = this.MeasAndRecSelectedTips.concat(this.flatSelectedTips[item].children)
            } else {
              this.MeasAndRecSelectedTips = this.MeasAndRecSelectedTips.concat(this.flatSelectedTips[item])
            }
          }
          // 中间数据 end
          this.onSiteTreatmentMeasuresVisible = true
          this.showPdfDialog = false
        })
      } else if (this.backToEditType.includes('责令限期整改')) {
        // 调责令限期整改详情
        rectificationDetail({
          id: this.rectificationDetailId
        })
          .then(res => {
            this.rectificationData = res.data
            // 取id
            let list = res.data.probList.reduce((total, item) => {
              let tempList = []
              if (item.children && item.children.length > 0) {
                item.children.forEach(t => {
                  t.rectifyTime = t.rectifyTime ? t.rectifyTime.replace(/(\/)/g, '-') + ':00' : null
                })
                tempList.push(item)
              } else {
                item.rectifyTime = item.rectifyTime ? item.rectifyTime.replace(/(\/)/g, '-') + ':00' : null
                tempList.push(item)
              }
              total = [...total, ...tempList]
              return total
            }, [])
            this.modifyTimeVisible = true
            this.flatSelectedTips = list
            // 中间数据 start
            this.MeasAndRecSelectedTips = []
            for (var item in this.flatSelectedTips) {
              if (this.flatSelectedTips[item].children && this.flatSelectedTips[item].children.length > 0) {
                this.MeasAndRecSelectedTips = this.MeasAndRecSelectedTips.concat(this.flatSelectedTips[item].children)
              } else {
                this.MeasAndRecSelectedTips = this.MeasAndRecSelectedTips.concat(this.flatSelectedTips[item])
              }
            }
            // 中间数据 end
            this.showPdfDialog = false
          })
          .catch(err => {
            throw new Error(err)
          })
      } else {
        this.showPdfDialog = false
      }
    }
  },
  computed: {
    selectedNum: function() {
      let arr = []
      this.selectedList.forEach(item => {
        if (item.children && item.children.length > 0) {
          item.children.forEach(i => {
            if (i.checked === true) {
              arr.push(i)
            }
          })
        }

        if (item.checked === true) {
          arr.push(item)
        }
      })
      return arr.length
    },

    canOper: function() {
      if(this.flatSelectedTips.length === 0) {
        this.checkedAllStatus = false
      }
       
      return this.flatSelectedTips.length <= 0
    },

    ...mapState(['tableId', 'tableHeadInfo', 'legalInfoMap', 'chanSuggestion'])
  },
  watch: {
    needUpdate: function() {
      this.getExamineInfoInit()
    },
    selectedList: function() {
      if (this.selectedList.length === 0) {
        this.isIndeterminate = false
        this.checkedAllStatus = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.chooseMakeDiag {
  /deep/ .el-dialog {
    min-height: 200px;
    padding-bottom: 1px;
  }
}
.diagxingzheng {
  /deep/ .el-dialog {
    height: 420px;
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
.limit-show-pdf {
  /deep/ .el-dialog .el-dialog__body {
    padding-left: 0;
  }
}
.dashLine {
  display: inline-block;
  width: 98%;
  // height: 1px;
  border: 1px dashed #e0e0e0;
}
.icondaojishi {
  color: #0099ff;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 383px;
}
.marLeft {
  margin-left: 50px;
}
.modifyTime {
  margin-top: 10px;
  // padding: 0 16px;
  // border-bottom: 1px solid rgba(224, 224, 224, 1);
  // padding-bottom: 10px;
}
.numCirle {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid rgba(51, 51, 51, 1);
  text-align: center;
  line-height: 20px;
  margin-right: 3px;
}
.title {
  margin-top: 20px;
  background: #eef5f9;
  height: 46px;
  line-height: 46px;
  display: flex;
  flex-direction: row;
  .tips {
    display: flex;
    flex: row;
    padding-left: 16px;
    white-space: nowrap;
    overflow: auto;
    width: 100%;
    justify-content: space-between;
    .el-button {
      height: 30px;
      padding: 7px 5px;
      width: 133px;
    }
    span {
      display: inline-block;
      margin-right: 24px;
      &:last-child {
        margin-right: 0;
        color: #0099ff;
      }
    }
  }
}
.is_fixed {
  position: fixed;
  top: 90px;
  z-index: 2;
  // left: 300px;
  width: 100%;
  box-shadow: 5px 5px 5px #ccc;
}

.first {
  display: flex;
  flex-direction: row;
  padding-left: 14px;
  border-bottom: 1px solid #e0e0e0;
  .first-index-handle {
    // border: 1px solid red;
    // width 是为了解决处理的处置页面的index对不齐的问题 20px只是两位数的最大值
    width: 20px;
    display: inline-block;
    margin-top: 14px;
  }
  .first-check,
  .second-check {
    position: absolute;
    // padding-top: 13px;
    // top: 40px;
    // left: 10px;
    top: 13px;
    left: -31px;
  }
  .first-content {
    position: relative;
    border-left: 1px solid #e0e0e0;

    padding-left: 10px;
    margin-left: 11px;
    width: 100%;
    h5 {
      color: #666666;
      margin: 14px 0 7px;
      font-size: 14px;
      white-space: normal;
    }
    h3 {
      font-size: 16px;
      margin: 0 0 8px;
      white-space: normal;
    }
    .marginLeft {
      margin-left: 33px;
      h5 {
        margin-bottom: 15px;
      }
    }
  }
}

.state-check {
  display: flex;
  flex-direction: row-reverse;
  // padding-top: 12px;
  position: absolute;
  top: 0;
  right: 10px;
  span {
    display: inline-block;
    // margin-right: 24px;
    cursor: pointer;
    &:first-child {
      margin-right: 0;
      cursor: default;
    }
  }
}
// 状态管理
.handle-oper {
  overflow-x: auto;
  white-space: nowrap;
  display: flex;
  justify-content: flex-end;
  span {
    display: inline-block;
    margin-right: 24px;
    min-width: 100px;
    text-align: right;
    &:last-child {
      margin-right: 0;
    }
  }
  .label {
    display: inline;
    color: #1cc19c;
    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }
}

div {
  white-space: normal;
}

.input-des {
  margin-bottom: 14px;
  display: flex;
  // justify-content: space-between;
  span {
    width: 80px;
    line-height: 33px;
    vertical-align: middle;
  }
  div {
    line-height: 33px;
    vertical-align: middle;
  }
}

.second {
  display: flex;
  flex-direction: row;
  margin-top: -10px;
}
.second-content {
  position: relative;
  // padding-top:3px;
}
.second-check[data-v-62e00757] {
  position: absolute;
  top: 12px;
  left: -29px;
}
.el-checkbox {
  /deep/ .el-checkbox__inner {
    width: 20px;
    height: 20px;
    &::after {
      left: 6px;
      top: 3px;
      height: 9px;
    }
  }
}

.el-input {
  width: 94%;
}
/deep/ .el-radio__input {
  padding-top: 2px;
}
.proofs {
  display: inline-block;
  margin-top: 20px;
  margin-left: 5px;
}
.xingzhengchufa {
  /deep/.el-dialog {
    height: 160px;
  }
}
.flag {
  display: inline-block;
  position: relative;
  top: 4px;
  left: -10px;
  min-width: 0 !important;
  line-height: 20px;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background: rgba(255, 75, 61, 1);
  .right {
    display: inline-block;
    position: absolute;
    min-width: 0 !important;
    top: 4px;
    left: 3px;
    width: 11px;
    height: 6px;
    border-style: solid;
    border-width: 0 0 1px 1px;
    border-color: rgba(255, 255, 255, 1);
    transform: rotate(-45deg);
  }
}
.proofListWrap {
  width: 100%;
  display: grid;
  padding: 15px 0;
  grid-template-columns: 25% 25% 25% 25%;
}
/deep/.el-dialog__wrapper .el-dialog__header .el-dialog__headerbtn {
  top: 4px;
}
/deep/.el-dialog__wrapper .el-dialog__header {
  padding: 15px 20px 15px 20px;
}
</style>
