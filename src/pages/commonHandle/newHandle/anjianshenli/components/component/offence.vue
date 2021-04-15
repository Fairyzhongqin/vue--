<template>
  <div class="offence_wrapper">
    <div class="background-tit flex justify-content-space-between align-items-center">
      <div>违法行为({{ actions.length }})</div>
      <span class="fontBlue" v-if="unfold" @click="setUnfold">收起全部</span>
      <span class="fontBlue" v-else @click="setUnfold">展开全部</span>
    </div>

    <ul class="dataBox" v-if="unfold">
      <li v-for="(item, index) in actions" :key="index">
        <div class="font-16">{{ index + 1 }}、{{ item.actName }}</div>
        <div class="toggle_factors" style="padding: 0 25px;">
          <div>
            <span class="details" @click="expandDetail($event, item)">详情</span>
            <span
              class="showOrHide"
              v-if="item.showInfo && Number(item.isPenalty) && Number(item.hasLevel) && item.isPenaltyData"
              @click="item.showInfo = false"
            >
              收起处罚因子
              <i class="iconfont iconshouqi"></i>
            </span>
            <span
              class="showOrHide"
              v-if="!item.showInfo && Number(item.isPenalty) && Number(item.hasLevel) && item.isPenaltyData"
              @click="item.showInfo = true"
            >
              展开处罚因子
              <i class="iconfont iconzhankai"></i>
            </span>
            <span v-if="type !== 'look'">
              <span>处罚：</span>
              <el-switch
                v-model="item.isPenalty"
                @change="initActions($event, item, index)"
                active-color="#FF4B3D"
                inactive-color="#BBBBBB"
                active-value="1"
                inactive-value="0"
              ></el-switch>
            </span>
          </div>
        </div>

        <!-- 不处罚 -->
        <div v-if="!Number(item.isPenalty)" class="borderBox">
          <div class="ms-border">
            <div class="flex justify-content-space-between color-gury">
              <span class="labelno">不处罚理由：</span>
              <el-input v-model="item.reason" placeholder="输入不处罚理由" type="textarea" autosize v-if="type !== 'look'"></el-input>
              <div class="label-right-contentno" v-else>{{ item.reason ? item.reason : '暂无' }}</div>
            </div>
            <div
              v-if="!(type === 'look' && item.proofList && item.proofList.length === 0)"
              class="proof-list_offence"
              :class="{ no_proof: item.proofList && item.proofList.length <= 0 }"
            >
              <div v-for="(proof, proofIndex) in item.proofList" :key="proofIndex" class="proof">
                <down-proof
                  v-if="item.proofList && item.proofList.length > 0"
                  :type="'penaltyDiscretion'"
                  :proof="proof"
                  :canDel="type === 'look' ? false : true"
                  @afterDel="afterDelProof($event, index)"
                ></down-proof>
              </div>
              <div class="upload-proof" v-if="type !== 'look'">
                <upload-proof :uploadType="'penaltyDiscretion'" :fileDetail="uploadReq" @getUploadMsg="afterUpload($event, index)"></upload-proof>
              </div>
            </div>
          </div>
        </div>

        <div v-if="item.showInfo && Number(item.isPenalty) && Number(item.hasLevel)" class="borderBox">
          <div class="ms-border">
            <div class="flex justify-content-space-between color-gury">
              <span class="label">处罚档次：</span>
              <div class="label-right-content">
                <el-select
                  v-model="item.levelFlag"
                  popper-class="popperClass"
                  style="display: block;"
                  v-if="type !== 'look'"
                  @change="changeLevel($event, item)"
                  :popper-append-to-body="false"
                >
                  <el-option
                    v-for="(itms, ind) in item.discretionLevelList"
                    :key="ind"
                    :label="itms.discretionLevelEntity.levelContent"
                    :value="ind"
                  ></el-option>
                </el-select>
                <div v-else style="line-height: 40px;">
                  <div v-for="(itms, ind) in item.discretionLevelList" :key="ind" v-show="item.levelFlag == ind">
                    {{ itms.discretionLevelEntity.levelContent }}
                  </div>
                </div>
                <div class="punish-level_desc" v-for="(itms, ind) in item.discretionLevelList" :key="ind" v-show="item.levelFlag == ind">
                  {{ itms.discretionLevelEntity.discretionRangeContent }}
                </div>
              </div>
            </div>
            <div class="select_content">
              <div class="select" v-if="item.type">
                <label>{{ item.prepareAmount.desc }}：</label>
                <el-select :disabled="type === 'look' ? true : false" @change="changeType($event, item)" v-model="item.type" placeholder="请选择处罚层级">
                  <el-option v-for="(type, typeInd) in item.prepareAmount.delayTypes" :value="type.code" :label="type.value" :key="typeInd"></el-option>
                </el-select>
              </div>
              <div class="input" v-if="item.prepareAmount.paramTypeText">
                <label>{{ item.prepareAmount.paramTypeText }}：</label>
                <el-input class="money" v-model="item.paramValue" @change="changeInput($event, item)" :disabled="type === 'look' ? true : false"></el-input>
              </div>
              <!-- 档次中处理措施有没收违法所得时需要填写违法所得 -->
              <div class="input taken" v-if="item.hasOtherAmount">
                <label>没收违法所得：</label>
                <el-input class="money" v-model="item.otherAmount" type="number" @change="changeOtherAmount($event, item)" :disabled="type === 'look' ? true : false"></el-input>
              </div>
            </div>
            <div class="padding-tit" v-if="item.hasLevel === '1' && item.isPenaltyData">
              纠违态度措施：
              <span class="color-org">{{ item.attiFactNum }}</span>
            </div>
            <div v-if="item.hasLevel === '1' && item.isPenaltyData">
              <el-table
                header-row-class-name="table_header"
                :row-class-name="getRowClass"
                :data="item.attitudeArr"
                :ref="item.attiTable"
                border
                @selection-change="selectFactors($event, 'attitudeArr', index, item)"
              >
                <el-table-column type="selection" width="50" :selectable="() => type !== 'look'"></el-table-column>
                <el-table-column prop="remark" label="因子" show-overflow-tooltip></el-table-column>
                <!-- <el-table-column prop="effectNum" label="系数" width="77"></el-table-column> -->
              </el-table>
            </div>

            <div class="append-padding_tit" v-if="item.hasLevel === '1' && item.isPenaltyData">
              当事人有下列情形之一的，应当依法从重处罚：
              <span class="color-org">{{ item.appendFactNum }}</span>
            </div>
            <div v-if="item.hasLevel === '1' && item.isPenaltyData">
              <el-table
                header-row-class-name="table_header"
                :row-class-name="getRowClass"
                :data="item.appendArr"
                border
                :ref="item.appeTable"
                @selection-change="selectFactors($event, 'appendArr', index, item)"
              >
                <el-table-column type="selection" width="50" :selectable="() => type !== 'look'"></el-table-column>
                <el-table-column prop="remark" label="因子" show-overflow-tooltip></el-table-column>
                <!-- <el-table-column prop="effectNum" label="系数" width="77"></el-table-column> -->
              </el-table>
            </div>
          </div>
        </div>
        <div class="penalty_amount">
          <!-- 原应处罚金额 -->
          <div v-if="Number(item.isPenalty)">
            <span>实际处罚金额：</span>
            <span v-if="item.discretionId || type === 'look'" class="should_punish">￥{{ item.penaltyAmount }}</span>
            <span class="num_input should_punish" v-if="!item.discretionId && type !== 'look'">
              ￥
              <el-input size="mini" type="number" min="0" v-model="item.penaltyAmount" @change="changePenaltyAmount(index, item)"></el-input>
            </span>
          </div>

          <div v-if="Number(item.isPenalty)">
            <!-- <span v-if="item.punishmentBasis || type !== 'look'"></span> -->
            <span v-if="!item.discretionId && type === 'look' && item.punishmentBasis">裁量说明：{{ item.punishmentBasis }}</span>
            <el-form v-if="!item.discretionId && type !== 'look'">
              <el-form-item label="裁量说明" label-width="85px">
                <el-input type="textarea" autosize v-model="item.punishmentBasis"></el-input>
              </el-form-item>
            </el-form>

            <!-- <span class="basis_input should_punish" v-if="!item.discretionId && type !== 'look'">
              <span>裁量说昆明：</span>
                <el-input size="mini" type="textarea" autosize v-model="item.punishmentBasis"></el-input>

            </span> -->
          </div>
          <!-- <div
            class="flex juscify-content-space-between align-items-center"
            :class="type=='edit'?'input-box':''"
            v-if="Number(item.isPenalty)"
          >
            <span>实际处罚金额：</span>
            <el-input
              class="money"
              v-model="item.penaltyAmount"
              :readonly="type === 'look' ? true : false"
              v-if="type=='edit'"
              color-org
            >
            </el-input>
            <span class="color-org" v-else>￥{{item.penaltyAmount}}</span>
          </div>-->
        </div>
      </li>
    </ul>

    <div class="flex justify-content-space-between align-items-center summary">
      <!-- 原总应处罚金额 -->
      <div>
        总实际处罚金额：
        <span class="total">￥{{ totalPunishNum }}</span>
      </div>
      <!-- <div
        class="flex juscify-content-space-between align-items-center"
        :class="type=='edit'?'input-box':''"
      >
        <span>实际处罚金额：</span>
        <el-input readonly :value="totalActual()" v-if="type == 'edit'" class="money color-org">
        </el-input>
        <span class="color-org" v-else>￥{{totalActual()}}</span>
      </div>-->
      <div>
        <span class="showOrHide" v-if="unfold" @click="setUnfold">收起全部</span>
        <span class="showOrHide" v-else @click="setUnfold">展开全部</span>
      </div>
    </div>

    <el-dialog width="50%" title="详情" :visible.sync="showDetail" append-to-body class="detail-dialog">
      <div class="action_detail">
        <discretion-detail :detail="dialogAction"></discretion-detail>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import uploadProof from '@/components/uploadProof'
import discretionDetail from '@/components/discretionDetail'
import { getFactors } from '@api/anjianshenli'
import downProof from '@components/downProof/index'
import { judgeDivisor, toFixed } from '@/utils/util'
import baseUrl from '@/utils/webIp'
import { getDicData } from '@api/common'

export default {
  name: 'offence',
  components: {
    uploadProof,
    discretionDetail,
    downProof
  },
  props: {
    type: {
      // 类型， edit修改 look查看
      type: String,
      default: 'edit'
    },
    isfolded: {
      // yes or no 是否默认关闭详情
      type: String
    },
    actions: {
      type: Array,
      default: () => {
        return [
          {
            breakLawCaseId: 'BRL321000236883100804583426',
            penaltyId: 'LA321000236883100385153024',
            checkId: null,
            checkContent: '生产经营单位是否将事故隐患排查治理情况如实记录或者未向从业人员通报。',
            actName: '生产经营单位未将事故隐患排查治理情况如实记录或者未向从业人员通报。',
            checkDesc: null,
            violateRules: null,
            lawContent:
              '【法律规定】《安全生产法》第三十八条第一款：生产经营单位应当建立健全生产安全事故隐患排查治理制度，采取技术、管理措施，及时发现并消除事故隐患。事故隐患排查治理情况应当如实记录，并向从业人员通报。',
            penaltyAcdName:
              '【处罚依据】《安全生产法》第九十四条：生产经营单位有下列行为之一的，责令限期改正，可以处五万元以下的罚款；逾期未改正的，责令停产停业整顿，并处五万元以上十万元以下的罚款，对其直接负责的主管人员和其他直接责任人员处一万元以上二万元以下的罚款：\n㈤未将事故隐患排查治理情况如实记录或者未向从业人员通报的。\n【相关规定与处罚依据】《尾矿库安全监督管理规定》第二十三条及第三十九条第二款；\n《食品生产企业安全生产监督管理暂行规定》第十二条及第二十六条第㈢项。\n',
            dataSource: '0',
            discretionRulesId: '',
            discretionId: 'DIR321000236878101760446464',
            penaltyAmount: '13000.00',
            shouldAmount: null,
            type: 'zycl002',
            paramType: null,
            paramValue: '0',
            levelFlag: '0',
            divisorId: 'CFCT231468748974854144,CFCT231734885499277312',
            isPenalty: '1',
            reason: '',
            accessoryId: '',
            discretionLevelList: [
              {
                discretionLevelEntity: {
                  discretionLevelId: 'DISL321000236878102221819904',
                  discretionId: 'DIR321000236878101760446464',
                  levelCode: null,
                  levelContent: '一档：未将事故隐患排查治理情况如实记录，或者未向从业人员通报的；',
                  discretionRangeContent:
                    '一档：责令限期改正，对生产经营单位可以处2.5万元以下的罚款；逾期未改正的，责令停产停业整顿，对生产经营单位处5万元以上7.5万元以下的罚款，对其直接负责的主管人员和其他直接责任人员处1万元以上1.5万元以下的罚款；',
                  delFlag: '0',
                  type: ['zycl002']
                },
                discretionValueList: [
                  {
                    discretionValueId: 'DISV321000236878102221819906',
                    discretionLevelId: 'DISL321000236878102221819904',
                    objectType: '1',
                    type: 'zycl002',
                    rangeMin: 10000,
                    rangeMax: 15000,
                    fixSum: null,
                    resultCode: '',
                    paramType: '0',
                    moneyType: '0',
                    delFlag: '0',
                    uplimit: 0
                  }
                ]
              },
              {
                discretionLevelEntity: {
                  discretionLevelId: 'DISL321000236878102221819908',
                  discretionId: 'DIR321000236878101760446464',
                  levelCode: null,
                  levelContent: '二档：未将事故隐患排查治理情况如实记录且未向从业人员通报的。',
                  discretionRangeContent:
                    '二档：责令限期改正，对生产经营单位处2.5万元以上5万元以下的罚款；逾期未改正的，责令停产停业整顿，对生产经营单位处7.5万元以上10万元以下的罚款，对其直接负责的主管人员和其他直接责任人员处1.5万元以上2万元以下的罚款。',
                  delFlag: '0',
                  type: ['zycl002']
                },
                discretionValueList: [
                  {
                    discretionValueId: 'DISV321000236878102221819910',
                    discretionLevelId: 'DISL321000236878102221819908',
                    objectType: '1',
                    type: 'zycl002',
                    rangeMin: 15000,
                    rangeMax: 20000,
                    fixSum: null,
                    resultCode: '',
                    paramType: '0',
                    moneyType: '0',
                    delFlag: '0',
                    uplimit: 0
                  }
                ]
              }
            ],
            hasLevel: '1',
            children: []
          }
        ]
      }
    }
  },
  data() {
    return {
      showDetail: false, // 是否显示弹框
      dialogAction: {}, // 详情弹框的数据
      unfold: true,
      appendArr: [], // 从重处罚项
      attitudeArr: [], // 违纠态度
      actionsReq: [],
      uploadReq: {}, // 上传证据时需带的参数
      penaltyReferance: {}, // 计算裁量值的特定一条数据
      discretionTypeArr: [], // 裁量数据类型
      totalPunishNum: 0
    }
  },
  mounted() {
    if (this.isfolded) {
      this.unfold = false
    }
    this.$nextTick(() => {
      if (!(this.isfolded && this.type === 'look')) {
        // 法制审核默认关闭，不回显数据，只显示总处罚金额
        this.initFactor()
      }
      this.totalPunish()
    })
  },
  methods: {
    // 获取处罚因子
    initFactor() {
      this.appendArr = []
      this.attitudeArr = []
      let caseSource = this.$store.state.penalty.penaltyUndEntity.caseSourceId
      let factorReq = {
        isPaging: 'false',
        limit: '20',
        page: '1',
        type: ''
      }
      getFactors(factorReq)
        .then(res => {
          let factors = res.data.list
          factors.forEach(factor => {
            this.$set(factor, 'selected', false)
            if (factor.type === '1') {
              this.appendArr.push(factor)
            } else {
              if (caseSource === 'co002' && factor.type === '3') {
                this.attitudeArr.push(factor)
              } else if (caseSource !== 'co002' && factor.type === '2') {
                this.attitudeArr.push(factor)
              }
            }
          })
          return getDicData({ type: 'discretion_penalty' })
        })
        .then(res => {
          this.discretionTypeArr = res.page.list
          this.initActions()
        })
        .catch(err => console.info(err))
    },
    // 处理传入的 actions 以便页面渲染
    initActions(isPenalty, passedAction, passedInd) {
      // 切换处罚/不处罚时
      if (passedAction !== void 0) {
        if (isPenalty === '0') {
          // 不处罚
          this.processAccesory(passedAction)
          passedAction.shouldAmount = 0
          passedAction.penaltyAmount = passedAction.shouldAmount
          this.totalPunish()
        } else {
          this.processPre(passedAction, passedInd)
        }
        return
      }
      this.actions.forEach((action, actIndex) => {
        // 进入页面时
        action.isPenalty = action.isPenalty ? action.isPenalty : '1'
        // 不处罚：附件
        if (action.isPenalty === '0') {
          this.processAccesory(action)
          action.shouldAmount = 0 // 应处罚金额
          action.penaltyAmount = action.shouldAmount
        } else {
          this.processPre(action, actIndex)
        }
      })

      this.$nextTick(() => {
        // 查看详情时将因子全选框去掉
        if (this.type === 'look') {
          let headerCell = document.querySelectorAll('.table_header .el-checkbox .el-checkbox__inner')
          Array.prototype.forEach.call(headerCell, cell => {
            cell.style.display = 'none'
          })
        }
      })
    },
    // 初始化 处罚 裁量
    processPre(action, actIndex) {
      this.$set(action, 'showInfo', true) // 是否收起处罚因子
      this.$set(action, 'attiFactNum', 0) // 纠违态度措施因子值
      this.$set(action, 'attiTable', `attiTable${actIndex}`) // 以便回显
      this.$set(action, 'appendFactNum', 0) // 从重处罚因子值
      this.$set(action, 'appeTable', `appeTabel${actIndex}`)
      this.$set(action, 'isPenaltyData', true) // 目前处罚档次下是否有裁量数据
      this.$set(action, 'hasOtherAmount', false) // 目前处罚档次下是否有 没收违法所得

      this.$set(
        // 处罚因子数组
        action,
        'attitudeArr',
        JSON.parse(JSON.stringify(this.attitudeArr))
      )
      this.$set(
        // 处罚因子数组
        action,
        'appendArr',
        JSON.parse(JSON.stringify(this.appendArr))
      )
      // 处罚档次
      action.levelFlag = Number(action.levelFlag ? action.levelFlag : '0')
      // 总年收入 or 违法所得
      action.paramValue = Number(action.paramValue ? action.paramValue : '0')
      // 某一项的违法所得
      action.otherAmount = Number(action.otherAmount ? action.otherAmount : '0')
      // 初始化无因子的应处罚金额
      let amount = this.getAmount(action)
      // 应处罚金额与实际处罚金额
      if ((this.type === 'edit' || this.type === 'look') && this.unfold) {
        // 修改处罚裁量
        // 回显因子
        if (action.isPenaltyData) {
          this.reflectFactors(action)
        }
        action.shouldAmount = Number(action.shouldAmount)
        action.penaltyAmount = Number(action.penaltyAmount)
      } else {
        // 新增处罚裁量
        action.penaltyAmount = amount + Number(action.otherAmount)
        if (action.discretionId) {
          action.shouldAmount = amount
          action.penaltyAmount = amount
        } // 自定义的不需要计算
      }
      this.totalPunish()
    },
    // 选择处罚档次的回调
    changeLevel(e, action) {
      action.levelFlag = e
      action.type = void 0
      action.paramValue = 0
      this.getAmount(action) // 初始化 penaltyReference，罚款类型等
      if (action.isPenaltyData) {
        action.shouldAmount = this.computeAmount(action)
      }
      action.penaltyAmount = action.shouldAmount + Number(action.otherAmount)
      this.totalPunish() // 计算总金额
    },
    // 选择 处罚层级 的回调
    changeType(e, action) {
      let valueList = action.discretionLevelList[action.levelFlag].discretionValueList
      action.paramValue = 0
      this.getValueData(valueList, e) // 初始化 penaltyReference
      this.getLimitAmount(this.penaltyReferance, action) // 初始化 prepareAmount 以确定 paramType 渲染页面
      action.shouldAmount = this.computeAmount(action)
      action.penaltyAmount = action.shouldAmount + Number(action.otherAmount)
      this.totalPunish() // 计算总金额
    },
    // 改变 违法所得/年总收入 的回调
    changeInput(e, action) {
      action.shouldAmount = this.computeAmount(action)
      action.penaltyAmount = action.shouldAmount + Number(action.otherAmount)
      this.totalPunish() // 计算总金额
    },
    changeOtherAmount(e, action) {
      let dotInd = action.otherAmount.indexOf('.')
      if (Number(action.otherAmount) < 0) {
        action.otherAmount = 0
      } else if (Number(action.otherAmount) > 0 && dotInd >= 0) {
        action.otherAmount = toFixed(action.otherAmount, 2)
      }
      action.penaltyAmount = action.shouldAmount + Number(action.otherAmount)
      this.totalPunish()
    },
    // 改变处罚金额
    changePenaltyAmount(i, action) {
      let dotInd = action.shouldAmount.indexOf('.')
      if (action.shouldAmount < 0) {
        action.shouldAmount = 0
      } else if (action.shouldAmount > 0 && dotInd >= 0) {
        action.shouldAmount = toFixed(action.shouldAmount, 2)
      }
      action.penaltyAmount = action.shouldAmount + Number(action.otherAmount)

      this.totalPunish()
      this.$emit('changeAmount', i, action)
    },
    // 获得无因子影响的应处罚金额
    getAmount(action) {
      let level = action.discretionLevelList,
        amount
      // 所选裁量类型 action.type 正常处罚  逾期处罚  情节严重罚款 一般事故 较大事故 重大事故 特大事故 拒不改正
      if (Number(action.hasLevel) == 1) {
        // 有上下限
        let valueList = level[action.levelFlag].discretionValueList,
          valueData
        this.$set(action, 'prepareAmount', {}) // 用于收集 计算应处罚金额前 需处理的数据
        if (valueList.length === 0) {
          // 该处罚档次下没有裁量数据
          action.isPenaltyData = false
          return 0
        } else {
          action.isPenaltyData = true
        }
        // 获取该处罚档次对应的裁量类型
        action.prepareAmount.delayTypes = this.filterDiscretion(level[action.levelFlag].discretionLevelEntity.type)
        action.type = action.type ? action.type : action.prepareAmount.delayTypes[0].code
        action.prepareAmount.desc = '处罚层级'

        // 获取用于计算应处罚金额的某条裁量数据
        valueData = this.getValueData(valueList, action.type)

        // 确定此裁量数据是否需要 没收违法所得
        if (valueData.resultCode === 'dr009') {
          action.hasOtherAmount = true
        } else {
          action.hasOtherAmount = false
          action.otherAmount = 0
        }

        amount = Number(this.getLimitAmount(valueData, action))
      } else {
        // 无上下限
        if (action.discretionId) {
          this.penaltyReferance = level[0].discretionValueList[0]
          amount = Number(this.penaltyReferance.fixSum ? this.penaltyReferance.fixSum : 0)
        } else {
          // 自定义违法行为
          amount = 0
        }
      }
      return amount
    },
    // 获取某处罚档次下的某条裁量
    getValueData(valueArr, type) {
      let valueData = valueArr.filter(value => {
        // 判断处罚层级
        return value.type === type
      })
      this.penaltyReferance = valueData[0]
      return this.penaltyReferance
    },
    // 根据某条裁量的罚款类型 paramType:0 正常 1 违法所得 2 年收入  获取应处罚金额
    getLimitAmount({ paramType, rangeMax, rangeMin }, action) {
      let { max, min } = this.getExtreme(action)
      if (paramType === '0') {
        action.prepareAmount.paramTypeText = ''
      } else {
        action.prepareAmount.paramTypeText = paramType === '1' ? '违法所得' : '年总收入'
      }
      return parseFloat(max)
    },
    // 获取某处罚档次下可选的裁量类型
    filterDiscretion(typeArr) {
      let arr = []
      this.discretionTypeArr.forEach(type => {
        if (typeArr.indexOf(type.code) >= 0) {
          arr.push(type)
        }
      })
      return arr
    },
    // 设置处罚因子的回显
    reflectFactors(action) {
      let attiCount = []
      action.attitudeArr.forEach((factor, factIndex) => {
        if (action.divisorId && action.divisorId.indexOf(factor.id) >= 0) {
          factor.selected = true
          attiCount.push(factIndex)
          action.attiFactNum = this.computeCount(attiCount, 'atti')
          // action.attiFactNum += Number(factor.effectNum.toFixed(2));
          this.$nextTick(() => {
            this.$refs[action.attiTable][0].toggleRowSelection(factor)
          })
        }
      })
      action.appendArr.forEach((factor, factIndex) => {
        if (action.divisorId && action.divisorId.indexOf(factor.id) >= 0) {
          factor.selected = true
          action.appendFactNum += Number(factor.effectNum)
          this.$nextTick(() => {
            this.$refs[action.appeTable][0].toggleRowSelection(factor)
          })
        }
      })
    },
    selectFactors(e, arrName, index, item) {
      let factors = item.appendArr.concat(item.attitudeArr),
        selected = []
      // 1. 选中的背景样式
      item[arrName].forEach(factor => {
        factor.selected = false
      })
      e.forEach(factor => {
        factor.selected = true
      })
      // 2. 计算总体的因子值
      if (arrName === 'attitudeArr') {
        let res = this.computeCount(e, 'atti')
        item.attiFactNum = res
      } else {
        let res = this.computeCount(e, 'appe')
        item.appendFactNum = res
      }
      // 3. 做 divisorId 以备使用
      factors.map(factor => {
        if (factor.selected) selected.push(factor.id)
      })
      item.divisorId = selected.join(',')
      // 4. 计算应处罚金额
      let _amount = this.computeAmount(item)
      item.shouldAmount = _amount
      item.penaltyAmount = item.shouldAmount + Number(item.otherAmount)
      this.totalPunish() // 计算总金额
    },
    // 计算有因子影响的应处罚金额
    computeAmount(action) {
      // 应处罚金额 = （rangeMax - [(rangeMax - rangeMin) * 态度因子]）*（1 + 加重因子）
      // 不可超过 max，不可小于 min
      let { max, min } = this.getExtreme(action, 'preCalculate'),
        uplimit = this.penaltyReferance.uplimit
      let _amount
      if (typeof action.attiFactNum === 'string') {
        // 纠违态度因子值为分数
        let selectNum = Number(action.attiFactNum.split('/')[0])
        _amount = (max - [((max - min) * selectNum) / this.attitudeArr.length]) * (1 + action.appendFactNum)
      } else {
        // 纠违态度因子值为小数
        _amount = (max - [(max - min) * action.attiFactNum]) * (1 + action.appendFactNum)
      }
      if (uplimit && _amount >= uplimit) {
        _amount = uplimit
      } else {
        if (_amount > max) {
          _amount = max
        } else if (_amount < min) {
          _amount = min
        }
      }
      return Number(toFixed(_amount, 2))
    },
    // 判断纠违态度因子分数还是小数展示
    // 获取最低与最高限
    getExtreme(action, type) {
      let max, min
      // levelFlag
      let typeIndex = 0
      let valueList = action.discretionLevelList[action.levelFlag].discretionValueList
      valueList.map((item, index) => {
        if (item.type === action.type) {
          typeIndex = index
        }
      })
      if (valueList[typeIndex].paramType === '0' || !valueList[typeIndex].paramType) {
        max = Number(valueList[typeIndex].rangeMax)
        min = Number(valueList[typeIndex].rangeMin)
      } else {
        let baseAmount = action.paramValue
        max = Number(valueList[typeIndex].rangeMax) * Number(baseAmount)
        min = Number(valueList[typeIndex].rangeMin) * Number(baseAmount)
      }
      if (type === 'preCalculate') {
        // 有因子参与的，应计算后与uplimit比较
        return {
          max: max,
          min: min
        }
      } else if (Number(valueList[typeIndex].uplimit) && max > Number(valueList[typeIndex].uplimit)) {
        // 若计算出的值超过最大上限，取最大上限
        max = Number(valueList[typeIndex].uplimit)
      }
      return {
        max: max,
        min: min
      }
    },
    // 计算因子值
    computeCount(arr, type) {
      let count = 0
      if (type === 'atti') {
        // 纠违态度因子
        let res = judgeDivisor(arr.length, this.attitudeArr.length)
        if (res) {
          // 能除尽
          return arr.length / this.attitudeArr.length
        } else {
          // 不能除尽
          return arr.length + '/' + this.attitudeArr.length
        }
      } else {
        // 加重处罚因子
        arr.map(v => {
          count += Number(v.effectNum) * 1000
        })
        return count / 1000
      }
    },
    // 计算总应处罚金额
    totalPunish() {
      let count = 0

      this.actions.map(v => {
        if (v.isPenalty) count += Number(v.penaltyAmount) * 1000
      })
      this.totalPunishNum = count / 1000
    },
    // 初始化附件列表
    processAccesory(action) {
      this.$set(action, 'proofList', []) // 附件列表
      if (typeof action.accessoryId === 'string' && action.accessoryId.length > 0) {
        action.accessoryId = action.accessoryId.split(',')
      } else {
        action.accessoryId = []
      }
      action.accessoryId.forEach(proof => {
        let proofObj = this.getProofObj(proof)
        action.proofList.push(proofObj)
      })
    },
    // 删除证据后调用处理 accessoryId 及 proofList
    afterDelProof(id, index) {
      let fileIndex = this.actions[index].accessoryId.indexOf(id)
      this.actions[index].accessoryId.splice(fileIndex, 1)
      this.actions[index].proofList.splice(fileIndex, 1)
    },
    // 上传证据后调用处理 accessoryId 及 proofList
    afterUpload(e, index) {
      let proofObj = this.getProofObj(e.accessoryId)
      this.actions[index].accessoryId.push(e.accessoryId)
      this.actions[index].proofList.push(proofObj)
    },
    // 展开/收起全部
    setUnfold() {
      if (!this.unfold) {
        this.$nextTick(() => {
          this.initFactor()
        })
      }
      this.unfold = !this.unfold
      this.$emit('setUnfold', this.unfold)
    },
    // 根据 id 处理 proof
    getProofObj(id) {
      // const typeInd = res.path.lastIndexOf('.')
      return {
        accessoryDownUrl: `${baseUrl}/aj/writ/accessory/download?accessoryId=${id}`, // 附件下载url
        accessoryId: id, // 附件id
        accessoryName: '', // 附件名字
        accessoryType: '', // 附件类型
        accessoryUrl: `${baseUrl}/aj/writ/accessory/downLoadByImg?accessoryId=${id}`, // 附件在线显示url
        id: this.$store.state.penalty.penaltyUndEntity.penaltyId // 证据关联的id
      }
    },
    // 切换详情
    expandDetail(e, action) {
      this.dialogAction = {
        lawDetail: action.lawContent, //设定依据 法律规定内容
        punishmentBasis: action.penaltyAcdName, //处罚依据
        unLawfulActs: action.actName, //违法行为
        levelContent: action.levelContent, //处罚档次
        discretionRangeContent: action.discretionRangeContent //裁量幅度
      }
      this.showDetail = true
    },
    // 给间隔行及选中行设置样式
    getRowClass({ row, rowIndex }) {
      if (row.selected) {
        return 'selected_row'
      }
      if (rowIndex % 2 === 1) {
        return 'strip_row'
      }
    }
  }
}
</script>
<style lang="less" scope>
.offence_wrapper {
  font-family: PingFang-SC-Medium;

  .punish-level_desc {
    margin: 12px 1px 0 8px;
    line-height: 22px;
    color: #666666;
  }

  .summary {
    padding: 16px 41px 0;
    margin-top: 16px;
    border-top: 1px solid #e0e0e0;

    .total {
      font-size: 18px;
      font-weight: bold;
      color: #ff4901;
    }
  }

  .el-table {
    border-radius: 0;

    .table_header {
      height: 50px;
      background: rgba(227, 238, 246, 1);
      font-size: 16px;
      font-weight: bold;
      color: #222222;
      /deep/ .cell .el-checkbox {
        margin-right: 30px;
      }
    }

    .strip_row {
      background: #f4f8fa;
    }

    .selected_row {
      background: #cee4ff;
    }
  }

  .proof-list_offence {
    display: grid;
    grid-template-columns: repeat(2, 45%);
    justify-content: space-between;
    width: 100%;
    margin-top: 21px;

    .proof {
      margin-right: 5px;
      margin-bottom: 5px;
    }

    &.no_proof {
      display: flex;
    }
  }
}

.el-dialog {
  .action_detail {
    padding: 15px;
  }
}

.background-tit {
  height: 46px;
  font-size: 14px;
  background: #eef5f9;
  border-radius: 5px;
  padding: 0 16px;
  color: #999999;
}

.dataBox {
  list-style: none;
  padding: 0 16px;
  margin: 0;

  .toggle_factors {
    text-align: right;
  }

  .penalty_amount {
    align-items: center;
    padding: 0px 25px;
    margin-top: 8px;

    div:first-child {
      margin-right: 38px;
      min-width: 150px;
      padding-bottom: 10px;
    }
    .should_punish {
      font-size: 14px;
      color: #ff4901;
    }

    span.num_input .el-input {
      display: inline-block;
      width: 100px;
      .el-input__inner {
        padding-right: 0;
      }
    }
    span.basis_input {
      color: #333333;
      .el-input {
        display: inline-block;
        width: 30vw;
        .el-input__inner {
          padding-right: 0;
        }
      }
    }
  }
}

.fontBlue {
  color: #0099ff;
  cursor: pointer;

  &:hover {
    color: #409eff;
  }
}

.font-16 {
  margin-bottom: 14px;
  margin-top: 15px;
  font-weight: bold;
  font-family: PingFang-SC-Medium;
  font-size: 16px;
  color: #333333;
}

.input-box {
  width: 280px;

  span {
    width: 180px;
  }
}

.details {
  color: #1cc19c;
  cursor: pointer;
}

.showOrHide {
  color: #0099ff;
  cursor: pointer;
}

.borderBox {
  margin-top: 17px;
  padding: 0 25px;
}

.money {
  position: relative;

  &::before {
    content: '\FFE5';
    display: inline;
    position: absolute;
    top: 5px;
    left: 7px;
    color: #ff4901;
    font-size: 14px;
  }

  & input {
    padding-left: 20px;
  }
}

.ms-border {
  border: 1px solid #e0e0e0;
  padding: 16px;
  border-radius: 5px;

  .select_content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-top: 10px;
    & > div {
      margin-top: 5px;
    }
    .input {
      display: flex;
      align-items: center;

      /deep/ .el-input__inner {
        width: 150px;
      }

      label {
        width: 100px;
      }
      &.taken {
        label {
          width: 150px;
        }
      }
    }
  }

  .label {
    padding-top: 5px;
  }
}

.label {
  width: 80px;
}

.labelno {
  width: 100px;
}

.label-right-content {
  width: calc(100% - 80px);
  .popperClass {
    width: calc(100% - 80px) !important;
    .el-select-dropdown__item {
      height: auto;
      span {
        word-break: normal;
        width: auto;
        display: block;
        white-space: pre-wrap;
        word-wrap: break-word;
        overflow: hidden;
      }
    }
  }
}

.label-right-contentno {
  width: calc(100% - 100px);
}

.color-gury {
  line-height: 40px;
}

.color-org {
  color: #ff4901;
}

.noWrap {
  white-space: nowrap;
  display: inline-block;
  cursor: pointer;
  padding: 8px 15px;
  border-radius: 4px;
  margin-right: 8px;
  margin-top: 8px;
}

.padding-tit {
  padding: 23px 0 12px 0;
}

.append-padding_tit {
  padding: 35px 0 15px 0;
}

.offence-line {
  border-top: #e0e0e0 1px solid;
  margin-top: 16px;
  padding-bottom: 10px;
  box-shadow: 0 1px 1 0 #dce5e6;
}

.showBox {
  background: #eef5f9;
  border-radius: 5px;
  width: 100%;
  height: 150px;
  margin-top: 10px;
}

.iconfont {
  font-size: 12px;
}

.el-switch {
  vertical-align: bottom;
}
</style>
