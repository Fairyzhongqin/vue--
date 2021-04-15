<template>
  <el-row class="body execution-punishment_content">
    <div class="create-tab-title">罚款执行</div>
    <div class="body-content-button" v-if="!forBrowse">
      <el-button type="primary" class="body-button" @click="uploadFile">+ 延期（分期）申请证据</el-button>
      <el-button
        type="primary"
        class="body-button"
        :disabled="isDisable"
        @click="checkType('延期（分期）缴纳罚款审批表')"
      >+ 延期（分期）缴纳罚款审批表</el-button>
      <el-button
        type="primary"
        class="body-button"
        :disabled="isDisable"
        @click="checkType('延期（分期）缴纳罚款批准书')"
      >+ 延期（分期）缴纳罚款批准书</el-button>
      <el-button
        type="primary"
        class="body-button"
        :disabled="isDisable"
        @click="checkType('延期（分期）缴纳罚款送达回执')"
      >+ 延期（分期）缴纳罚款送达回执</el-button>
    </div>
    <div class="doc-container">
      <template v-if="docList.length!==0">
        <doc-card
          v-for="(docItem, index) of docList"
          :key="index"
          :docData="docItem"
          :auditInfo="auditInfo"
          :readOnly="forBrowse"
          @afterDelete="initInfo"
          @toLawSeal="toLawSeal"
          @previewWrit="preview"
          @toSeal="toSeal"
          @modifyWrit="checkType"
          @submit="toSeal"
        ></doc-card>
      </template>
      <sn-empty-data text="暂无罚款的执行相关文书" v-if="docList.length===0"></sn-empty-data>
    </div>

    <penalty-upload ref="penaltyUpload" @getEnoughProof="getEnoughProof" :justHide="true" :sourceType="'fkdzx'" :btnText="'延期（分期）申请证据'" :forBrowse="forBrowse"></penalty-upload>

    <el-dialog
      width="900px"
      class="big-dialog"
      :visible.sync="showPdfDialog"
      :title="dialogTitle"
      :before-close="close"
    >
      <common-writ
        v-if="showPdfDialog && dialogContent === 'writDialog'"
        :info="info"
        :writType="writType"
        @toLawSeal="initInfo"
        @toSeal="toSeal"
        @createWrit="createWrit"
        @close="close"
      ></common-writ>
      <select-people
        v-if="dialogContent === 'selectPeople'"
        :selectNum="1"
        @getPeople="submitToAudition"
      ></select-people>
    </el-dialog>
    <show-pdf
      :pdfId="visibleWritId"
      v-if="showPdf"
      :writName="writType"
      :buttonList="buttonList"
      :writTypeCode="writTypeCode"
      @auditPdf="auditPdf"
      @lawSealPdf="initInfo"
      @sealPdf="sealPdf"
      @updatePdf="updatePdf"
      @finishPdf="closePdf"
      @closePdf="closePdf"
    ></show-pdf>
  </el-row>
</template>
<script>
import commonWrit from "@/components/commonWrit";
import snEmptyData from "@/components/snEmptyData";
import docCard from "@/components/docCard";
import {
  getPunishExecute,
  createWrit,
  updateWrit,
  deleteWrit,
  getWritDataByWritId,
  getWritInfo,
  getPunishInform
} from "@api/fileRelated";
import ShowPdf from "@/components/showPdf";
import selectPeople from "@/pages/onSiteInspection/newInspection/component/selectPeople";
import { dateFormat } from "@/utils/util";
import { finishPro, sealAudit } from "@api/common";
import { handleBtnList, setInfo } from "@/utils/audit";
import penaltyUpload from '@/pages/commonHandle/components/penaltyUpload.vue'

export default {
  name: "executionPunishment",
  components: {
    docCard,
    commonWrit,
    ShowPdf,
    selectPeople,
    penaltyUpload,
    snEmptyData
  },
  props: {
    forBrowse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      writTypeCode: "", // WS 开头的文书号
      docList: [],
      auditInfo: {},
      showPdfDialog: false,
      dialogContent: "",
      dialogTitle: "",
      audiReq: {},
      showPdf: false,
      buttonList: {},
      isDisable: true
    };
  },
  created() {
    this.initInfo();
  },
  methods: {
    close() {
      this.$store.commit('UPT_MODAL_SHOW', false)
      this.showPdfDialog = false;
      this.dialogContent = "";
      this.dialogTitle = "";
    },
    initInfo() {
      let _penalty = this.$store.state.penalty;
      // 文书审核需要的信息
      this.auditInfo = {
        requestUsersName: _penalty.udtNames, // 承办人名称
        caseName: _penalty.penaltyUndEntity.caseName // 案件名称
      };
      this.getPunishExecute();
    },
    getPunishExecute() {
      getPunishExecute({
        penaltyId: this.$store.state.penalty.penaltyUndEntity.penaltyId
      }).then(res => {
        this.docList = res.data;
      });
    },
    getWritId(req) {
      getWritInfo(req)
        .then(res => {
          this.currWritId = res.data[0] ? res.data[0].writId : "";
          this.info.writId = this.currWritId;
          this.showPdfDialog = true;
          this.dialogContent = "writDialog";
        })
        .catch(err => console.info(err));
    },
    checkType(type, writType, writId) {
      let _penalty = this.$store.state.penalty;
      let infoArr = [
        "writId",
        "suggestion",
        "objectType",
        "punishCompanyId",
        "blcList",
        "caseName",
        "objectAddress",
        "postCode",
        "responsiblePerson",
        "job",
        "subject",
        "sourceId",
        "companyId",
        "udtIds"
      ];
      let auditInfo = setInfo(infoArr)
      auditInfo.docList = this.docList

      if (!writType) {
        // 从 + 按钮处 新增文书
        auditInfo.writId = "";
        this.currWritId = "";
        this.showPdfDialog = true;
        this.dialogContent = "writDialog";
        this.info = { writInfo: null, auditInfo };
      } else {
        // 从卡片处 修改文书
        auditInfo.writId = writId;
        this.currWritId = writId;
        getWritDataByWritId({ writId: writId }).then(res => {
          let updateWritInfo = res.data;
          this.showPdfDialog = true;
          this.dialogContent = "writDialog";
          this.info = { writInfo: updateWritInfo, auditInfo };
        });
      }

      this.writType = type;
      this.dialogTitle = type;
    },
    // 卡片加盖执法专用章后的回调
    toLawSeal(data) {
      this.buttonList = handleBtnList(data.typeCode, true);
      this.preview(data.id, data.title);
      this.initInfo();
    },
    preview(id, title, status) {
      if (status) this.buttonList = status;
      this.showPdf = true;
      this.writType = title;
      this.visibleWritId = id;
    },
    toSeal(audiReq) {
      this.audiReq = audiReq;
      this.showPdfDialog = true;
      this.dialogContent = "selectPeople";
      this.dialogTitle = "选择审核人员";
    },
    // 从showPdf来 审核审批/加盖公章/加盖执法专用章
    sealPdf(obj) {
      let _penalty = this.$store.state.penalty;
      sealAudit({
        auditTypeCode: "ta80040",
        handlerDeptId: obj.deptId,
        handlerUserId: obj.peopleId,
        requestUsersIds: _penalty.penaltyUndEntity.udtIds,
        requestDeptName: JSON.parse(localStorage.getItem("userInfo"))
          .sysDeptEntity.name,
        requestId: obj.pdfId,
        requestTime: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
        requestUsersName: _penalty.udtNames,
        submitterCause: _penalty.penaltyUndEntity.caseName,
        partyName: _penalty.penaltyUndEntity.objectType === '0' ? _penalty.punishCompanyName : _penalty.penaltyUndEntity.punishPersonName,
        partyId: _penalty.penaltyUndEntity.objectType === '0' ? _penalty.punishCompanyId : ''
      })
        .then(res => {
          this.getMessage("success", "提交审核成功！");
          this.closePdf();
          this.initInfo();
        })
        .catch(err => console.info(err));
    },
    auditPdf(obj) {
      //
      let _penalty = this.$store.state.penalty;
      sealAudit({
        auditTypeCode: "ta80022",
        handlerDeptId: obj.deptId,
        handlerUserId: obj.peopleId,
        requestUsersIds: _penalty.penaltyUndEntity.udtIds,
        requestDeptName: JSON.parse(localStorage.getItem("userInfo"))
          .sysDeptEntity.name,
        requestId: obj.pdfId,
        requestTime: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
        requestUsersName: _penalty.udtNames,
        submitterCause: _penalty.penaltyUndEntity.caseName,
        partyName: _penalty.penaltyUndEntity.objectType === '0' ? _penalty.punishCompanyName : _penalty.penaltyUndEntity.punishPersonName,
        partyId: _penalty.penaltyUndEntity.objectType === '0' ? _penalty.punishCompanyId : ''
      })
        .then(res => {
          this.getMessage("success", "提交审核成功！");
          this.closePdf();
          this.initInfo();
        })
        .catch(err => console.info(err));
    },
    // 审核审批（盖章）
    submitToAudition(bool, auditor) {
      this.dialogContent = "";
      this.showPdfDialog = false;
      if (!bool) return;
      let _penalty = this.$store.state.penalty;
      this.audiReq.handlerDeptId = auditor[0].deptId;
      this.audiReq.handlerUserId = auditor[0].id;
      this.audiReq.requestUsersIds = _penalty.penaltyUndEntity.udtIds;
      this.audiReq.requestDeptName = JSON.parse(
        localStorage.getItem("userInfo")
      ).sysDeptEntity.name;
      this.partyName = _penalty.penaltyUndEntity.objectType === '0' ? _penalty.punishCompanyName : _penalty.penaltyUndEntity.punishPersonName;
      this.partyId = _penalty.penaltyUndEntity.objectType === '0' ? _penalty.punishCompanyId : ''
        this.audiReq.partyName=this.partyName
        this.audiReq.partyId=this.partyId
        // 调用接口向下走流程
      sealAudit(this.audiReq)
        .then(res => {
          this.getMessage("success", "提交审核成功！");
          this.initInfo();
        })
        .catch(err => console.info(err));
    },
    createWrit(reqData) {
      // 调用接口生成文书
      if (this.currWritId) {
        // 重新创建
        updateWrit({ writId: this.currWritId }, reqData.data)
          .then(res => {
            this.getMessage("success", "制作成功！");
            this.writTypeCode = res.writType;
            this.buttonList = handleBtnList(res.writType);
            this.preview(this.currWritId, this.writType);
            this.initInfo();
          })
          .catch(err => {
            this.getMessage("error", "制作失败！");
          });
      } else {
        createWrit(reqData)
          .then(res => {
            this.getMessage("success", "制作成功！");
            this.writTypeCode = res.writType;
            this.buttonList = handleBtnList(res.writType);
            this.preview(res.writId, this.writType);
            this.initInfo();
          })
          .catch(err => {
            this.getMessage("error", "制作失败！");
          });
      }
    },
    // 提示信息
    getMessage(type, message) {
      this.$message({
        type: type,
        message: message
      });
    },
    closePdf() {
      this.initInfo();
      this.showPdf = false;
      this.showPdfDialog = false;
    },
    updatePdf(id) {
      this.currWritId = id;
      this.showPdf = false;
    },
    // 上传回执证据
    uploadFile() {
      this.$refs.penaltyUpload.addProof()
    },
    // 已上传回执证据
    getEnoughProof(bool) {
      this.isDisable = bool
    }
  }
};
</script>
<style lang="less" scoped>
.execution-punishment_content {
  .body-content-button {
    padding-top: 18px;
  }
}
.body-content-button {
  .body-button {
    border-radius: 5px;
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: 500;
    line-height: 6px;
    height: 28px;
    padding: 7px 8px;
    margin-left: 0;
    &:not(.is-disabled) {
      background: rgba(0, 153, 255, 1);
    }
  }
}
.content {
  background: #fff;
  padding: 8px;
  margin: 8px;
  box-sizing: border-box;
  width: calc(100% - 16px);
  padding: 16px 82px 33px;
  border-radius: 8px;
  position: relative;
}
.matter {
  font-size: 14px;
  color: #333333;
  padding: 16px;
  box-sizing: border-box;
  height: 200px;
}
.matter-tit {
  width: 75px;
  margin-bottom: 10px;
}
.matter-val {
  width: calc(100% - 75px);
  margin-bottom: 10px;
}
.el-row {
  .el-col {
    padding-top: 16px;
  }
}
.card-footer {
  border-top: 1px solid #eeeeee;
  height: 46px;
  padding: 0 16px;
}

.status {
  background: #1cc19c;
  width: 105px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
}
.statuss {
  background: #eef5f9;
  width: 105px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
}

.status-waits {
  &:extend(.statuss);
  color: #0099ff;
  margin-top: 8px;
}
.status-error {
  &:extend(.status);
  color: #ff0000;
}

.hover-font {
  color: #0099ff;
  padding: 0 5px;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
}
.align-items-center {
  align-items: normal;
}
.align-items-center-1 {
  line-height: 47px;
}
.el-col-lg-8 {
  width: 43%;
}
// 卡片区域
.doc-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-top: 16px;
  .doc-card {
    margin-bottom: 18px;
  }
}
.big-dialog {
  /deep/.el-dialog {
    padding-bottom: 10px;
    height: auto;
  }
}
</style>
