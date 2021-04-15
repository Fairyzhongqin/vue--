<template>
  <div class="examine-container" v-loading="pageLoading">
    <sn-page-bar>
      <template slot="button">
        <el-button type="text" icon="el-icon-arrow-left" @click="back()">返回</el-button>
      </template>
      <!-- <div class="bar-title">{{compTitle}}</div> -->

      <el-row class="examine-content">
        <el-col :span="17" class="col-left">
          <div style="visibility:hidden">
            我也太他妈帅了
          </div>
          <show-pdf :pdfId="leftPdfId" v-if="showPdf" :isWorkArea="true"></show-pdf>

        </el-col>
        <el-col :span="7" class="col-right">
          <div class="result_area">
            <div class="buttons">
              <!-- <el-button type="primary" mini>案件调查报告浏览</el-button> -->
              <!-- <el-button type="primary" mini>查看证据材料</el-button> -->
             <el-button :loading="loading" type="primary" mini class="fzsh-primary-button" @click="showInnerPdf">综合浏览</el-button>


              <div class="input-bar" v-show="examineFrom.radio==='同意'&&compType==='audit'">
                <div class="input-name">是否发起集体讨论：</div>
                <div v-if="compType==='audit'">
                  <el-radio v-model="examineFrom.isNeed" :disabled="isChooseDis" label="0">是</el-radio>
                  <el-radio v-model="examineFrom.isNeed" label="1" :disabled="isChooseDis" v-if ="!passJjtlchoiceStatus" v-cloak>否</el-radio>
                </div>
              </div>


            </div>
            <!-- 预审核 -->
            <div class="pre_audit_area" v-if="compType==='preAudit'">
              <div class="create-tab-title">预审结果</div>
              <el-form
                :model="reExamineFrom"
                label-width="100px"
                label-position="left">
                <el-form-item>
                  <div slot="label" class="slot_label">审核意见</div>
                  <el-input :disabled="hasSign" v-model="reExamineFrom.opinion" type="textarea" autosize placeholder="请输入预审核意见"></el-input>
                </el-form-item>
                <el-form-item>
                  <div slot="label" class="slot_label">审核结果</div>
                  <el-radio :disabled="hasSign" v-model="reExamineFrom.radio" label="同意">同意</el-radio>
                  <el-radio :disabled="hasSign" v-model="reExamineFrom.radio" label="不同意">不同意</el-radio>
                </el-form-item>

                <el-form-item>
                  <div slot="label" class="slot_label">审核时间</div>
                  <p style="line-height:35px;margin:0;color:#606266">{{date}}</p>
                </el-form-item>

              </el-form>

            </div>
            <div class="finaly_audit_area" v-if="compType==='audit'">
              <div class="create-tab-title">审核结果</div>
              <el-form
                :model="examineFrom"
                label-width="100px"
                label-position="left">
                <el-form-item>
                  <div slot="label" class="slot_label">审核意见</div>
                  <el-input :disabled="hasSign" v-model="examineFrom.opinion" type="textarea" autosize placeholder="请输入审核意见"></el-input>
                </el-form-item>
                <el-form-item>
                  <div slot="label" class="slot_label">审核结果</div>
                  <el-radio :disabled="hasSign" v-model="examineFrom.radio" label="同意">同意</el-radio>
                  <el-radio :disabled="hasSign" v-model="examineFrom.radio" label="不同意">不同意</el-radio>
                </el-form-item>

                <el-form-item>
                  <div slot="label" class="slot_label">审核时间</div>
                  <p style="line-height:35px;margin:0;color:#606266">{{date}}</p>
                </el-form-item>

              </el-form>
            </div>

            <div class="audit_btns">
              <!-- <el-button type="primary" :disabled="hasSign" v-if="info.compType==='audit'" @click="sign">{{hasSign?'已':''}}签名</el-button> -->
              <el-button type="primary" :disabled="hasSign" v-if="info.compType==='audit'&&examineFrom.radio==='同意'" @click="sign">{{hasSign?'已':''}}签名</el-button>
              <el-button type="danger" :disabled="hasFinish" v-if="(compType==='preAudit'&&reExamineFrom.radio==='不同意')||(compType==='audit'&&examineFrom.radio==='不同意')" @click="sure('notAgree')">{{compType==='preAudit'?'预审':''}}不同意</el-button>
              <el-button type="danger" :disabled="hasFinish" v-if="compType==='audit'&&examineFrom.radio==='不同意'" @click="sure('returnModify')" plain>退回编辑</el-button>
              
              <el-button type="primary" :disabled="!hasSign&&compType==='audit'" v-if="(compType==='preAudit'&&reExamineFrom.radio==='同意')||(compType==='audit'&&examineFrom.radio==='同意')" @click="sure">{{examineFrom.isNeed==='0'?'提交': '完成'}}</el-button>
              <el-button type="primary" v-if="hasFinish" @click="back">完成</el-button>
            </div>
          </div>

          <div class="create-tab-title">法制审核流程</div>
          <time-line class="time-line" :lineData="auditProcesses"></time-line>
        </el-col>
      </el-row>
    </sn-page-bar>
    <footer class="audit">
      <el-button @click="back">返回</el-button>

    </footer>

    <!--选择执法人员弹窗 start-->
    <div v-if="peopleVisiable">
      <el-dialog
        title="选择发起集体讨论人员"
        :visible.sync="peopleVisiable"
        width="990px"
        height="570px"
        :close-on-click-modal="false"
      >
        <select-people @getPeople="getSelectedPeople" :selectNum="1"></select-people>
      </el-dialog>
    </div>
    <!--选择执法人员弹窗 end-->
    
    <comprehensive-browse v-if="compBrowseShow" @closeFrame="compBrowseShow=false"></comprehensive-browse>
  </div>
</template>

<script>
import snPageBar from "@/components/snPageBar";
import TimeLine from "@/components/TimeLine";
import showPdf from "@/components/showPdf";
import { getCriteria } from "@api/anjianshenli";
import { sealAuditStatus } from "@/api/common";
import { handlePenalty, isFGVirtualSign,passJjtlchoice } from "@/api/lawExamine";
import { getNowFormatDate } from "@/utils/util"
import { setCaseDetail } from "@/utils/audit";
import { sealWrit } from "@/api/fileRelated";
import selectPeople from "@/pages/onSiteInspection/newInspection/component/selectPeople";
import comprehensiveBrowse from "@/pages/comprehensiveBrowse"
import { getFilingRegister } from "@/api/filingRegister/index";
export default {
  components: {
    snPageBar,
    TimeLine,
    showPdf,
    selectPeople,
    comprehensiveBrowse
  },
  props: {
    info: {
      type: Object
    }
  },
  data() {
    return {
      isChooseDis: true, // 处罚金额是否大于20000，是：必须提请集体讨论
      pageLoading: true,
      auditProcesses: [
      ],
      reExamineFrom: {
        radio: '同意',
        opinion: '同意'
      },
      examineFrom: {
        radio: '同意',
        opinion: '同意并提请集体讨论',
        isNeed: '0'
      },
      date: getNowFormatDate(true),
      leftPdfId: "",
      showPdf: false,
      dialogTitle: '',
      dialogContent: '',
      compTitle: '法制审核',
      compType: '',
      hasPreAudit: false, // 审核流程已有预审核数据
      hasSign: false,
      peopleVisiable: false,
      originator: '',
      passJjtlchoiceStatus: true,
      returnModify: false, // 是退回修改而不是不同意
      hasFinish: false,
      compBrowseShow: false,
      loading: false
    };
  },
  async created() {
    console.info(this.info)
    this.checkComType()
    this.showLeftPdf();
    this.getFlow()
    this.passJjtlchoice()
    if (this.info.compType === 'audit') {
      await this.getPenaltyAmount()
    } else {
      this.pageLoading = false
    }
  },
  methods: {
    checkComType() {
      // 以下需要还是需要根据按钮来源来判断
      // this.info.auditStatusCode
      // this.info.compType
      this.compType = this.info.compType;
      console.info('this.info', this.info)
      switch (this.info.compType) {
        case 'review':
          this.compTitle = '法制审核详情'
          break;
        case 'audit':

          break;
        case 'preAudit':
          this.compTitle = '法制审核（预审核）'
          break;
        default:
          break;
      }
    },
    // 获取处罚金额，判断是否必须提请集体讨论
    getPenaltyAmount() {
      let req = {
        laDiscretionId: "",
        penaltyId: this.info.caseId
      };
      getCriteria(req)
        .then(res => {
          if (res.data.laDiscretionEntity.laDiscretionId && Number(res.data.laDiscretionEntity.sumMoney) >= 20000 ) {
            this.isChooseDis = true
            this.examineFrom.isNeed = "0"
          } else {
            this.isChooseDis = false
          }
          this.pageLoading = false
        })
        .catch(err => console.info(err));
    },
    passJjtlchoice() {
      // 等待梦雨修改返回数据的审核状态id coding
      passJjtlchoice({
        writId: this.info.requestId
      }).then(res => {
        if(res.code === '0'){
          console.info('ress', res)
          this.passJjtlchoiceStatus = res.data
        }
      })
    },
    getFlow() {
      sealAuditStatus({
        requestId: this.info.requestId,
        type: 'lawAudit'
      }).then(res => {
        if(res.code === '0'){
          console.info('ress', res)
          this.auditProcesses = res.data
        }
      })
    },


    showLeftPdf() {
      this.leftPdfId = this.info.writId || this.info.requestId // coding 目前没有数据暂时用reqid
      this.showPdf = true
      // 查询签章状态
      isFGVirtualSign({
        writId: this.leftPdfId
      }).then(res => {
        if(res.code === '0') {
          this.hasSign = res.data
          if(res.data === 'SPR_OK') {
            this.examineFrom.radio = '同意'
          } else if (res.data === 'SPR_NO') {
            this.examineFrom.radio = '不同意'
          }
        }
      })
    },
    showInnerPdf() {
      this.loading = true
      getFilingRegister({
        penalty: this.info.caseId
      }).then(res => {
        this.$store.commit("setPenalty", res.data);
        
        this.loading = false
        this.compBrowseShow = true
      })
    },
    back() {
      this.$store.commit("setCurrentAuditComponent", "dataDisplay");
    },
    sure(type) {
      if (type === 'returnModify') {
         this.returnModify = true
      } else {
        this.returnModify = false
      }
      if(this.compType === 'preAudit') {
        // 预审核
        this.submit('ta80017', 'b03', this.info.leaderId, false)
      }
      if(this.compType === 'audit') {

        if(this.examineFrom.isNeed === '0' && this.examineFrom.radio === '同意') {
          // 是否集体讨论
          this.peopleVisiable = true
        } else {
          // 直接提交
          this.beforeSubmit(this.info.executorId)
        }
      }
    },
    // 提交前确认集体讨论发起人
    beforeSubmit(originator) {
      this.originator = originator;
      if(this.info.auditStatusCode === "b031" || this.info.auditStatusCode === "b032"){
        // 最终审核提交
        this.submit("ta80017", "b05", originator, true)
      }
      if(this.info.auditStatusCode === "b01"){
        // 先走虚拟流程
        // this.submit("ta80017", "b04", this.info.leaderId, false, true)
        this.submit("ta80017", "b04", this.info.leaderId, false, true)

      }
    },
    /* 提交审核
      * @method submit
      * @param{str} auditTypeCode
      * @param{str} firstResultCode 前缀（isFictitious时被替换）
      * @param{str} handlerUserId
      * @param{str} hasIsNeed 是否需要选择是否集体讨论
      * @param{bol} isFictitious 是否为虚拟流程
      */
    submit(auditTypeCode, firstResultCode, handlerUserId, hasIsNeed, isFictitious){
      let _dept = JSON.parse(localStorage.getItem('userInfo')).sysDeptEntity
      let _auditResultCode, _auditResultOption;
      if(this.compType === 'preAudit') {
        _auditResultCode = this.reExamineFrom.radio==="同意"?`${firstResultCode}1`:`${firstResultCode}2`
      } else {
        if (this.returnModify) {
          // 终审退回修改
          _auditResultCode = this.examineFrom.radio==="同意"?`${firstResultCode}1`:'tfs01'//新的退回修改
        } else {
          if (this.examineFrom.radio==="同意") {
            _auditResultCode = `${firstResultCode}1`
          } else {
            // 终审不同意
            if (isFictitious) {
              _auditResultCode = `${firstResultCode}2`
            } else {
              // 不是虚拟流程才会先签字
              if (this.hasSign) {
                _auditResultCode = `${firstResultCode}2`
              } else {
                this.sign(auditTypeCode, firstResultCode, handlerUserId, hasIsNeed, isFictitious)
                return
              }
            }

          }
          _auditResultCode = this.examineFrom.radio==="同意"?`${firstResultCode}1`:`${firstResultCode}2`
        }
      }
      let req = {
        "auditResultCode": _auditResultCode,
        "auditResultOption": this.compType === 'preAudit'?this.reExamineFrom.opinion:this.examineFrom.opinion,
        "auditResult": this.compType === 'preAudit'?this.reExamineFrom.radio:this.examineFrom.radio,
        "auditTypeCode": this.examineFrom.radio === "不同意" ? 'ta80014' : auditTypeCode,// 回退时传14到部门审核人
        "auditStatus": "",
        "executorId": this.info.executorId,
        "caseId": this.info.caseId,
        "caseName": this.info.caseName,
        "handlerDeptId": _dept.id,
        "handlerDeptName": _dept.name,
        "handlerUserId": handlerUserId,
        "parentTaskId": this.info.parentTaskId,// 缺字段
        "partyName": this.info.partyName,
        "partyId": this.info.partyId ? this.info.partyId : '',
        "requestDeptName": this.info.requestDeptName, // 君文说她传了
        "requestId": this.info.requestId,
        "requestTime": this.date,
        "requestUsersName": this.info.requestUserName,
        "requestUsersIds": this.info.executorId,
        "submitterCause": this.info.caseName,

      }
      if(hasIsNeed){
        req.isNeed = this.examineFrom.radio==="同意"?this.examineFrom.isNeed:''
      }
      if(isFictitious){
        req.auditResultCode = firstResultCode
      }
      handlePenalty(req).then(res => {
        if(res.code === "0"){
          if(isFictitious) {
            // 走完了虚拟流程然后提交最后一步
            this.submit("ta80017", "b04", this.originator, true)
          } else {
            if ((this.compType==='preAudit'&&this.reExamineFrom.radio==='不同意')||(this.compType==='audit'&&this.examineFrom.radio==='不同意')){
              this.$message({
                type: "warning",
                message: "退回成功！"
              });
            // 获取案件信息，更新流程正常回退状态
            setCaseDetail(req.caseId);
            }else{
              this.$message({
                type: "success",
                message: "审核成功！"
              });
            }
            
            if(this.compType==='audit'&&this.examineFrom.radio==='不同意'&&this.returnModify===false) {
              this.hasFinish = true
            } else {
              this.back()
            }
            
          }
        }


      })
    },
    // 获取发起集体讨论人员
    getSelectedPeople(bool, auditor) {
      this.peopleVisiable = false;
      if (!bool) return;
      if (auditor.length === 0) {
        this.$message({
          showClose: true,
          message: "请选择发起人员",
          type: "error"
        });
      } else {
        // if(this.isFromPreAudit) {
        //   this.submit("ta80017","b05",auditor[0].id, true)
        // } else {
        //   this.submit("ta80017", "b04", auditor[0].id, true)
        // }
        this.beforeSubmit(auditor[0].id)
      }
    },

    // 签字
    sign(auditTypeCode, firstResultCode, handlerUserId, hasIsNeed, isFictitious) {
      this.showPdf = false
      sealWrit({
        writId: this.leftPdfId,
        signType: this.examineFrom.radio === '同意'?"SPR_OK":"SPR_NO"
      }).then(res => {


        this.hasSign = true
        this.showPdf = true
        if(this.examineFrom.radio==="不同意" && this.info.compType==='audit') {
          this.submit(auditTypeCode, firstResultCode, handlerUserId, hasIsNeed, isFictitious)
        } else {
          // 不同意只有一个弹框提示，不需要提示签名
          this.$message({
            type: "success",
            message: "签名成功！"
          });
        }
      }).catch(err => {
        this.$message({
          message: err,
          type: "warning"
        });
      });
    },
    opinionDef() {
      this.examineFrom.opinion = this.examineFrom.radio // 不同意，同意不提起
      if(this.examineFrom.radio === '同意' && this.examineFrom.isNeed === '0') {
        this.examineFrom.opinion = '同意并提请集体讨论'
      }
    },
    reOpinionDef() {
      this.reExamineFrom.opinion = this.reExamineFrom.radio
    }
  },

  watch: {
    'examineFrom.isNeed': {
      handler: function() {
        this.opinionDef()
      }
    },
    'examineFrom.radio': {
      handler: function() {
        this.opinionDef()
      }
    },
    'reExamineFrom.radio': {
      handler: function() {
        this.reOpinionDef()
      }
    }
  }
};
</script>

<style lang="less" scoped>
.examine-container {
  .examine-content {
    // height: calc(100vh - 115px);
    margin-top: 25px;
    .col-left {
      padding-right: 25px;
      height: 600px;
      padding-bottom: 50px;
      // .tabs {
      //   margin-top: 20px;
      // }

    }
    .col-right {
      padding-bottom: 10px;
      /deep/.el-icon-loading {
        line-height: 0;
      }
      .result_area{
        padding-bottom: 10px;
        .create-tab-title {
          margin-bottom: 10px
        }
        .buttons {
          margin-top: 10px;
          margin-bottom: 10px;
          .el-button {
            margin-left: 0;
          }
          .input-bar {
            line-height: 30px;
            height: 30px;
          }
        }
        .input-bar {
          height: 35px;
          line-height: 35px;
          width: 100%;
          display: flex;
          flex-direction: row;
          .input-name {
            margin-right: 10px;
          }
          .input {
            width: 75%;
          }
        }
        /deep/.el-form-item {
          margin-bottom: 0;
          .el-form-item__label {
            line-height: 35px
          }
        }
        .audit_btns {
          padding-top: 4px;
          /deep/.el-button {
            font-size: 14px;
            padding: 2px 12px;
          }
        }
      }
    }


  }

  footer.audit {
    width: 82%;
    position: fixed;
    padding: 11px 0;
    text-align: center;
    bottom: 0;
    background: #ffffff;
    height: auto;
    line-height: initial;
  }
}
</style>
