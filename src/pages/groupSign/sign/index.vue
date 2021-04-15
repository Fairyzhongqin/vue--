<template>
  <div class="examine-container">
    <sn-page-bar>
      <template slot="button">
        <el-button type="text" icon="el-icon-arrow-left" @click="back()">返回</el-button>
      </template>
      <!-- <div class="bar-title">{{compTitle}}</div> -->

      <el-row class="examine-content">
        <el-col :span="17" class="col-left">
          <div style="visibility:hidden">
            我也太他妈帅了
            - 并不
          </div>
          <show-pdf :pdfId="leftPdfId" v-if="showPdf" :isWorkArea="true"></show-pdf>

        </el-col>
        <el-col :span="7" class="col-right">
          <div class="result_area">
            <div class="finaly_audit_area">
              <div class="create-tab-title">确认意见</div>
              <el-form
                :model="examineFrom"
                label-width="100px"
                label-position="left">
                <el-form-item>
                  <div slot="label" class="slot_label">确认意见</div>
                  <el-input :disabled="hasSign||disabled" v-model="examineFrom.opinion" type="textarea" :maxlength="200" autosize placeholder="请输入200字以内的意见"></el-input>
                </el-form-item>
                <el-form-item>
                  <div slot="label" class="slot_label">确认结果</div>
                  <el-radio :disabled="hasSign||disabled" v-model="examineFrom.radio" label="0">同意</el-radio>
                  <el-radio :disabled="hasSign||disabled" v-model="examineFrom.radio" label="1">不同意</el-radio>
                </el-form-item>

                <el-form-item>
                  <div slot="label" class="slot_label">确认时间</div>
                  <p style="line-height:35px;margin:0;color:#606266">{{date}}</p>
                </el-form-item>

              </el-form>
            </div>

            <div class="audit_btns">
              <el-button type="primary" @click="sign" v-if="info.compType==='sign'">签名</el-button>
              <el-button type="primary" @click="sure" v-if="info.compType==='confirm'">提交</el-button>
            </div>
          </div>

          <!-- <div class="create-tab-title">审核审批流程</div>
          <time-line class="time-line" :lineData="auditProcesses"></time-line> -->
        </el-col>
      </el-row>
    </sn-page-bar>
    <footer class="audit">
      <el-button @click="back">返回</el-button>

    </footer>

    <!--选择执法人员弹窗 end-->
  </div>
</template>

<script>
import snPageBar from "@/components/snPageBar";
import TimeLine from "@/components/TimeLine";
import showPdf from "@/components/showPdf";
import { sealAuditStatus } from "@/api/common";
import { handlePenalty, isFGVirtualSign } from "@/api/lawExamine";
import { getGroupOpinionUpdate } from "@/api/groupDiscussion"
import { getNowFormatDate } from "@/utils/util"
import { setCaseDetail } from "@/utils/audit";
import { sealWrit } from "@/api/fileRelated";
import selectPeople from "@/pages/onSiteInspection/newInspection/component/selectPeople";
export default {
  components: {
    snPageBar,
    TimeLine,
    showPdf,
    selectPeople
  },
  props: {
    info: {
      type: Object
    }
  },
  data() {
    return {
      auditProcesses: [
      ],

      examineFrom: {
        radio: '0',
        opinion: '同意'
      },
      date: getNowFormatDate(true),
      leftPdfId: "",
      showPdf: false,
      showDialog: false,
      dialogTitle: '',
      dialogContent: '',
      hasPreAudit: false, // 审核流程已有预审核数据
      hasSign: false,
      peopleVisiable: false,
      originator: '',
      returnModify: false, // 是退回修改而不是不同意
      disabled: false
    };
  },
  created() {


    this.showLeftPdf();
    // this.getFlow()
  },
  mounted() {
      if (this.info.compType === 'review') {
        this.examineFrom.radio = this.info.auditResult ? this.info.auditResult : '0'
        
        this.$nextTick(()=> {
            this.examineFrom.opinion = this.info.auditOpinion ? this.info.auditOpinion :'同意'
            this.disabled = true
        })
      }

  },
  methods: {

    getFlow() {
      sealAuditStatus({
        requestId: this.info.writId
      }).then(res => {
        if(res.code === '0'){
          console.info('ress', res)
          this.auditProcesses = res.data
        }
      })
    },


    showLeftPdf() {
      this.leftPdfId = this.info.writId // coding 目前没有数据暂时用reqid
      this.showPdf = true
      // 查询签章状态
      isFGVirtualSign({
        writId: this.leftPdfId
      }).then(res => {
        if(res.code === '0') {
          this.hasSign = res.data
          if(res.data === 'SPR_OK') {
            this.examineFrom.radio = '0'
          } else if (res.data === 'SPR_NO') {
            this.examineFrom.radio = '1'
          }
        }
      })
    },
    showInnerPdf() {
      if (this.info.surveyWritId) {
        this.innerPdfId = this.info.surveyWritId;
        this.dialogContent = 'showPdf';
        this.showDialog = true
      } else {
        this.$message({
          type: "warning",
          message: "暂无案卷信息"
        });
      }

    },
    back() {
      this.$store.commit("setCurrGroupComp", "dataDisplay");
    },
    sure(type) {
      let req;
      if(type === 'hasSign') {
        req = {id: this.info.id }
      } else {
        req = {
          id: this.info.id,
          auditOpinion: this.examineFrom.opinion,
          auditResult: this.examineFrom.radio,
          writId: this.info.writId
        }
      }
      getGroupOpinionUpdate(req).then(res => {
        if(res.code === '0') {
          this.$message({
            type: "success",
            message: "提交成功"
          });
          this.back()
        } else {
          this.$message({
            type: "warning",
            message: res.data
          });
        }
      }).catch(err => {
          this.$message({
            type: "warning",
            message: err
          });
      })
    },



    // 签字
    sign() {
      this.showPdf = false
      sealWrit({
        writId: this.leftPdfId,
        signType: 'MULTI_PERSION'
      }).then(res => {
        this.$message({
          type: "success",
          message: "签名成功！"
        });

        this.hasSign = true
        this.showPdf = true
        this.sure('hasSign')
      }).catch(err => {
        this.$message({
          message: err,
          type: "warning"
        });
      });
    },
    opinionDef() {
      this.examineFrom.opinion = this.examineFrom.radio === '1' ? '不同意' : '同意' 
    },
  },

  watch: {
    'examineFrom.radio': {
      handler: function() {
        this.opinionDef()
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
