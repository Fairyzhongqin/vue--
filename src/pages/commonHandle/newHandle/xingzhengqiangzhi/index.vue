<template>
  <el-row class="body">
    <div class="create-tab-title">行政强制</div>
    <div class="body-content-button" v-if="!forBrowse">
      <el-button type="primary" class="body-button" @click="checkType('行政强制审批表')">+ 行政强制审批表</el-button>
      <el-button type="primary" class="body-button" @click="checkType('缴纳罚款催告书')">+ 缴纳罚款催告书</el-button>
      <el-button type="primary" :disabled="writTypes.indexOf('JNFKCGS')===-1" class="body-button" @click="checkType('缴纳罚款催告书送达回执')">+ 缴纳罚款催告书送达回执</el-button>
      <el-button type="primary" class="body-button" @click="checkType('加处罚款决定书')">+ 加处罚款决定书</el-button>
      <el-button type="primary" :disabled="writTypes.indexOf('JCFKJDS')===-1" class="body-button" @click="checkType('加处罚款决定书送达回执')">+ 加处罚款决定书送达回执</el-button>

      <el-button type="primary" class="body-button" @click="checkType('行政强制执行事先催告书')">+ 行政强制执行事先催告书</el-button>
      <el-button type="primary" :disabled="writTypes.indexOf('XZQZZXSQCGS')===-1" class="body-button" @click="checkType('行政强制执行事先催告书送达回执')">+ 行政强制执行事先催告书送达回执</el-button>

      <el-button type="primary" class="body-button" @click="checkType('强制执行申请书')">+ 强制执行申请书</el-button>
      <el-button type="primary" :disabled="writTypes.indexOf('QZZXSQS')===-1" class="body-button" @click="checkType('强制执行申请书送达回执')">+ 强制执行申请书送达回执</el-button>
    </div>
    <div class="doc-container">
      <template v-if="examineadminList.length!==0">
        <doc-card
          v-for="(item, index) of examineadminList"
          :key="index"
          :docData="item"
          :auditInfo="auditInfo"
          :readOnly="forBrowse"
          @toLawSeal="toLawSeal"
          @toSeal="toSeal"
          @afterUpload="initInfo"
          @modifyWrit="checkType"
          @afterDelete="initInfo"
          @previewWrit="preview"
          @submit="toSeal"
        ></doc-card>
      </template>
      <sn-empty-data text="暂无行政强制文书" v-if="examineadminList.length===0"></sn-empty-data>

    </div>

    <penalty-upload :sourceType="'xzqz'" :btnText="'行政强制资料'" :forBrowse="forBrowse"></penalty-upload>
    <el-dialog
      class="big-dialog"
      :visible.sync="showPdfDialog"
      :title="dialogTitle"
      :before-close="close"
    >
      <common-writ
        v-if="showPdfDialog && dialogContent === 'writDialog'"
        :info="info"
        :writType="writType"
        @createWrit="createWrit"
        @close="close"
      ></common-writ>
      <select-people
        width="1000px"
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
      @updatePdf="updatePdf"
      @lawSealPdf="initInfo"
      @auditPdf="auditFromPdf"
      @sealPdf="sealFromPdf"
      @finishPdf="closePdf"
      @closePdf="closePdf"></show-pdf>
  </el-row>
</template>
<script>
import ShowPdf from "@/components/showPdf";
import selectPeople from "@/pages/onSiteInspection/newInspection/component/selectPeople";
import {
  getInvesWrits,
  createWrit,
  deleteWrit,
  updateWrit,
  getWritInfo,
  getWritDataByWritId
} from "@api/fileRelated";
import { sealAudit, querySysDictById } from "@api/common";
import { dateFormat } from "@/utils/util";
import docCard from "@/components/docCard";
import snAddButton from "@/components/snAddButton";
import snEmptyData from "@/components/snEmptyData";
import commonWrit from "@/components/commonWrit";
import { examineadminList } from "@api/xingzhengqiangzhi";
import { handleBtnList, setInfo } from "@/utils/audit";
import penaltyUpload from '@/pages/commonHandle/components/penaltyUpload.vue'
export default {
  name: "xingzhengqiangzhi",
  components: {
    commonWrit,
    ShowPdf,
    docCard,
    snAddButton,
    snEmptyData,
    selectPeople,
    penaltyUpload
  },
  props: {
    forBrowse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      examineadminList: [], //行政强制的文书信息
      queryInformVisible: false,
      writType: "",
      currWritId: "", // 当前在处理的文书 id
      visibleWritId: "", // 浏览文书的id
      info: {},
      showPdfDialog: false, // 是否显示dialog
      dialogContent: "", // 展示哪个 dialog
      dialogTitle: "", // dialog 框标题
      writTypeCode: "", // WS 开头的文书号
      showPdf: false,
      buttonList: {
        updatePdf: true, // 回退编辑
        signPdf: false, // 签名
        auditPdf: false, // 提交审核
        sealPdf: true, // 加盖公章
        finishPdf: true, // 完成
        lawSealPdf: false, // 加盖执法专用章
        closePdf: true // 退出
      },
      writTypes: []
    };
  },

  created() {
    console.info(this.$store.state.penalty)
    this.initInfo();
    //当案件结案之后  按钮不能操作
    this.initButton();
  },
  methods: {
    initButton(){
      //如果已经结案了  结案时间不为空
      if(this.$store.state.penalty.penaltyUndEntity.caseEndTime){
        this.forBrowse = true;
      }
    },
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
      // 获取案件调查文书
      const writsReq = {
        penaltyId: _penalty.penaltyUndEntity.penaltyId
      };
      examineadminList(writsReq)
        .then(res => {
          this.examineadminList = res.data;
          this.writTypes = []
          res.data.map(item => {
            this.writTypes.push(item.writTypeName)
          })
        })
        .catch(err => console.info(err));
    },
    async checkType(writTitle, writTypeName, writId, businessId) {
      let _penalty = this.$store.state.penalty,
        compRes;
      if (_penalty.penaltyUndEntity.objectType === "0") {
        compRes = await querySysDictById({
          id: _penalty.penaltyUndEntity.punishCompanyId
        });
      }
      let infoArr = [
        'caseName', 'caseSituation', 'objectType', 'subject', 'sourceId', 'companyId', 'udtIds', 'udtNames', 'creatorTime',
        'address', 'phone', 'sex', 'birthday'
      ]
      let auditInfo = {
        // 传给文书的信息
        exerDept: "", // 承办单位
        ...setInfo(infoArr)
      }
      if (!writTypeName) {
        // 从 + 按钮处 新增文书
        this.info.writId = "";
        this.currWritId = "";
        this.showPdfDialog = true;
        this.dialogContent = "writDialog";
        this.info = { writInfo: null, auditInfo, docList: this.examineadminList };
      } else {
        // 从卡片处 修改文书
        getWritDataByWritId({ writId: writId }).then(res => {
          let updateWritInfo = res.data;
          this.showPdfDialog = true;
          this.dialogContent = "writDialog";
          this.info = { writInfo: updateWritInfo, auditInfo,  docList: this.examineadminList };
        });
        this.currWritId = writId;
        this.info.writId = writId;
      }
      this.dialogTitle = writTitle;
      this.writType = writTitle;
    },
    // 弹出提交审核框
    toSeal(audiReq) {
      this.audiReq = audiReq;
      this.showPdfDialog = true;
      this.dialogContent = "selectPeople";
      this.dialogTitle = "选择审核人员";
    },
    // 提交审核
    submitToAudition(bool, auditor) {
      this.dialogContent = "";
      this.showPdfDialog = false;
      if (!bool) return;
      this.audiReq.handlerDeptId = auditor[0].deptId;
      this.audiReq.handlerUserId = auditor[0].id;
      this.audiReq.requestUsersIds = this.$store.state.penalty.penaltyUndEntity.udtIds;
      this.audiReq.requestDeptName = JSON.parse(localStorage.getItem('userInfo')).sysDeptEntity.name;

      this.audiReq.partyName = this.$store.state.penalty.penaltyUndEntity.objectType === '0' ? this.$store.state.penalty.punishCompanyName : this.$store.state.penalty.penaltyUndEntity.punishPersonName;
      this.audiReq.partyId = this.$store.state.penalty.penaltyUndEntity.objectType === '0' ? this.$store.state.penalty.punishCompanyId : ''
      // 调用接口向下走流程
      sealAudit(this.audiReq)
        .then(res => {
          this.$message({
            type: "success",
            message: "提交审核成功！"
          });
          this.initInfo();
        })
        .catch(err => console.info(err));
    },
    controlBtns() {
      let signArr = ["行政强制审批表"],
        auditArr = ["行政强制审批表"],
        sealArr = ["缴纳罚款催告书", "加处罚款决定书", "行政强制执行事先催告书", "停止供电（供应民用爆炸物品）通知书","停止供电（供应民用爆炸物品）决定书", "恢复供电（供应民用爆炸物品）通知书", "强制执行申请书"],
        lawSealPdf = [];
      this.buttonList = {
        // 文书浏览的按钮
        updatePdf: true, // 回退编辑
        signPdf: signArr.indexOf(this.writType) >= 0 ? true : false, // 签名
        auditPdf: auditArr.indexOf(this.writType) >= 0 ? true : false, // 提交审核
        sealPdf: sealArr.indexOf(this.writType) >= 0 ? true : false, // 加盖公章
        finishPdf: true, // 完成
        // lawSealPdf: lawSealPdf.indexOf(this.writType) >= 0 ? true : false, // 加盖执法专用章
        closePdf: true // 退出
      };
    },
    //创建文书
    createWrit(reqData) {
      this.controlBtns()

      // 调用接口生成文书
      if (this.currWritId) {
        // 重新创建
        updateWrit({ writId: this.currWritId }, reqData.data)
          .then(res => {
            this.$message({
              type: "success",
              message: "制作成功！"
            });
            this.writTypeCode = res.writType;
            this.buttonList = handleBtnList(res.writType);
            this.preview(this.currWritId, this.writType);
            this.initInfo();
          })
          .catch(err => {
            this.$message({
              type: "error",
              message: "制作失败！"
            });
          });
      } else {
        createWrit(reqData)
          .then(res => {
            this.$message({
              type: "success",
              message: "制作成功！"
            });
            this.writTypeCode = res.writType;
            this.buttonList = handleBtnList(res.writType);
            this.preview(res.writId, this.writType);
            this.initInfo();
          })
          .catch(err => {
            this.$message({
              type: "error",
              message: "制作失败！"
            });
          });
      }
    },
    // 卡片加盖执法专用章后的回调
    toLawSeal(data) {
      this.buttonList = handleBtnList(data.typeCode, true);
      this.preview(data.id, data.title);
      this.initInfo();
    },
    // 浏览文书
    preview(id, title, status) {
      if (status) this.buttonList = status;
      this.showPdf = true
      this.writType = title
      this.visibleWritId = id;
    },
    closePdf() {
      this.showPdfDialog = false;
      this.showPdf = false;
      this.initInfo()
    },
    updatePdf(id) {
      this.currWritId = id;
      this.showPdf = false;
    },
    auditFromPdf(obj) {
      let _penalty = this.$store.state.penalty
      // let task = this.$store.state.processes.get("AJSL")
      //   ? JSON.parse(this.$store.state.processes.get("AJSL"))
      //   : [];
      sealAudit({
        auditTypeCode: "ta80032",
        handlerDeptId: obj.deptId,
        handlerUserId: obj.peopleId,
        // parentTaskId: task[0].taskId,
        requestDeptName: JSON.parse(localStorage.getItem('userInfo')).sysDeptEntity.name,
        requestUsersIds: _penalty.penaltyUndEntity.udtIds,
        requestId: obj.pdfId,
        requestTime: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss"),
        requestUsersName: _penalty.udtNames,
        submitterCause: _penalty.penaltyUndEntity.caseName,
        partyName: _penalty.penaltyUndEntity.objectType === '0' ? _penalty.punishCompanyName : _penalty.penaltyUndEntity.punishPersonName,
        partyId: _penalty.penaltyUndEntity.objectType === '0' ? _penalty.punishCompanyId : ''
        // requestUsersIds:_penalty.udtIds
      })
      .then(res => {
        this.$message({
          type: "success",
          message: "提交审核成功！"
        });
        this.closePdf()
        this.initInfo();
      })
    },
    sealFromPdf(obj) {
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
        // requestUsersIds:_penalty.udtIds
      })
        .then(res => {
          this.$message({
            type: "success",
            message: "提交审核成功！"
          });
          this.closePdf();
          this.initInfo();
        })
        .catch(err => console.info(err));
    }
  }
};
</script>
<style lang="less" scoped>
/* .tit {
  background: #e3eef6;
  font-size: 16px;
  color: #333333;
  text-indent: 15px;
  height: 24px;
  font-family: PingFang SC;
  font-weight: bold;
} */
.doc-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  .doc-card {
    margin-bottom: 18px;
  }
}
.body-content-button {
  margin-bottom: 16px;
}
.body-button {
  height: 28px;
  padding: 7px 8px;
  margin-left: 0;
  margin-top: 16px;
  background: rgba(0, 153, 255, 1);
  border-radius: 5px;
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
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
.big-dialog {
  /deep/ .el-dialog {
    width: 900px;
  }
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
  background: #1cc19c;
  width: 105px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
}
.status-waits {
  &:extend(.statuss);
  color: #feffff;
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
  width: 33%;
}
</style>
