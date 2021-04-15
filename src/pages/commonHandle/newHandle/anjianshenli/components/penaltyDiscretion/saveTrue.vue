<template>
  <div class="penalty_discretion_saveTrue">
    <el-row style="padding: 17px 12px 24px 14px">
      <el-col :sm="24" :md="24" class="flex align-items-center">
        <span class="casetit word-break">案件名称</span>
        <span class="word-break">{{info.caseName}}</span>
      </el-col>
      <el-col :sm="24" :md="24" class="flex align-items-center">
        <span class="casetit">案由</span>
        <span>{{info.caseReasonNames}}</span>
      </el-col>
      <el-col :sm="24" :md="12" class="flex align-items-center">
        <span class="casetit">责任主体</span>
        <span>{{info.subjectType}}</span>
      </el-col>
      <el-col :sm="24" :md="12" class="flex align-items-center">
        <span class="casetit">当事人</span>
        <span>{{info.punishObject}}</span>
      </el-col>
      <el-col :sm="24" :md="12" class="flex align-items-center">
        <span class="casetit">承办人</span>
        <span>{{info.udtNames}}</span>
      </el-col>
      <el-col :sm="24" :md="12" class="flex align-items-center">
        <span class="casetit">检查时间</span>
        <span>{{info.creatorTime}}</span>
      </el-col>
    </el-row>

    <div class="info_line" v-if="!showDetail"></div>

    <div
      class="flex justify-content-space-between align-items-center"
      style="padding: 0 16px;"
      v-if="!showDetail"
    >
      <el-button type="primary" size="small" class="penalty-small_button" @click="lookDetail">查看详情</el-button>
      <div v-if="!forBrowse">
        <span class="edit" @click="edit" v-if="isModifyAllowed && final">修改</span>
        <span class="del" @click="deleteCrit" v-if="isDeleteAllowed && final">删除</span>
      </div>
    </div>

    <offence-box @setUnfold="setUnfold" :type="'look'" :actions="crit.breakLawCaseList" v-if="showDetail"></offence-box>

    <div class="penalty_description" v-if="showDetail && showProView">
      <span>裁量说明：</span>
      <el-input
        disabled
        type="textarea"
        :autosize="{minRows:1}"
        v-model="crit.laDiscretionEntity.processView"
      ></el-input>
    </div>

    <penalty-upload v-if="showDetail && showPenaltyPro" :sourceType="'cfcl'" :btnText="'处罚材料'" :forBrowse="true"></penalty-upload>
    

    <div class="back_button" v-if="showDetail">
      <el-button
        class="penalty-small_button"
        type="primary"
        size="small"
        @click="showDetail = false;showProView = false"
      >返回</el-button>
    </div>
  </div>
</template>
<script>
import penaltyUpload from "@/pages/commonHandle/components/penaltyUpload.vue";
import offenceBox from "../component/offence"; // 违法行为
import { sealAuditStatus } from "@api/common";
import { deleteCriteria } from "@api/anjianshenli";
import { getWritDataByWritId, getWritInfo } from "@api/fileRelated";
import { mapState } from "vuex";

export default {
  name: "penaltyDiscretionSaveTrue",
  components: {
    offenceBox,
    penaltyUpload
  },
  props: {
    crit: {
      type: Object
    },
    forBrowse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showProView: false, // 是否展示裁量说明
      showPenaltyPro: false, // 是否展示处罚证据
      showDetail: false, // 是否展示详情
      info: {
        caseName: "", // 案件名称
        caseReasonNames: "", // 案由
        subjectType: "", // 主体类型
        punishObject: "", // 处罚对象
        udtNames: "", // 承办人
        creatorTime: "", // 检查时间
        processView: "", // 裁量说明
        partyView: "" // 当事人的申辩意见
      },
      final: false, // 按钮的最终状态
      isDeleteAllowed: false,
      isModifyAllowed: false,
      processVersion: 0, // 第几次回退
      isRecalled: "0" // 是否是回退流程： 0 正常 1 你猜正常不正常
    };
  },
  computed: {
    ...mapState(["currCaseHandle"])
  },
  created() {
    console.info('saveTrue', this.crit)
    this.initInfo();
    if (this.currCaseHandle === 0) {
      // 流程在当前节点，肯定可编辑
      this.isDeleteAllowed = true;
      this.isModifyAllowed = true;
      this.final = true;
    } else {
      this.getPreAudit(); // 非当前节点 获取法制审核文书审核审批情况，控制按钮展示
    }
  },
  methods: {
    // 获取法制审核文书
    getPreAudit() {
      let writReq = {
        sourceId: this.$store.state.penalty.penaltyUndEntity.penaltyId,
        type: "XZCFJDFZSHYJS"
      };
      getWritInfo(writReq)
        .then(res => {
          let writ = res.data[0];
          this.isRecalled = this.$store.state.penalty.penaltyUndEntity.processStatus;
          this.processVersion = this.$store.state.penalty.penaltyUndEntity.processVersion;
          if (
            writ &&
            this.isRecalled === "1" &&
            this.processVersion > writ.writVersion
          ) {
            this.isModifyAllowed = true;
            this.isDeleteAllowed = true;
            this.final = true;
            return;
          }
          if (writ) {
            return sealAuditStatus({ requestId: writ.writId });
          } else {
            this.isDeleteAllowed = true;
            this.isModifyAllowed = true;
            this.final = true;
          }
        })
        .then(res => {
          if (res) {
            let lastStatus = res.data[0]; // 最后一次审核审批状态
            if (lastStatus) {
              // 有提交
              const code = lastStatus.auditResultCode;
              let waiting = ['a01', 'a002', 'a004', 'a006', 'b01', 'b03', 'b04', 'b031', 'b032', 'b041', 'b051']
              let needHandling = ['a001', 'a003', 'a005', 'b02', 'b042', 'b052']
              this.isDeleteAllowed = false;
              if (waiting.indexOf(code) >= 0) {
                this.isModifyAllowed = false;
              } else if (needHandling.indexOf(code) >= 0) {
                this.isModifyAllowed = true;
              }
              this.final = true;
            } else {
              // 无提交: 可以制作 可以删除
              this.isModifyAllowed = true;
              this.isDeleteAllowed = true;
              this.final = true;
            }
          }
        })
        .catch(err => console.info(err));
    },
    initInfo() {
      let penalty = this.$store.state.penalty;
      this.info = {
        caseName: penalty.penaltyUndEntity.caseName,
        caseReasonNames: penalty.caseReasonNames,
        subjectType: penalty.penaltyUndEntity.objectType == 0 ? "单位" : "个人",
        punishObject:
          penalty.penaltyUndEntity.objectType == 0
            ? penalty.punishCompanyName
            : penalty.penaltyUndEntity.punishPersonName,
        udtNames: penalty.udtNames,
        creatorTime: penalty.penaltyUndEntity.creatorTime,
        processView: this.crit.laDiscretionEntity.processView,
        partyView: this.crit.laDiscretionEntity.partyView
      };
    },
    edit() {
      this.$parent.setCritComponent("editBox");
    },
    deleteCrit() {
      let req = {
        laDiscretionId: this.crit.laDiscretionEntity.laDiscretionId
      };
      deleteCriteria(req)
        .then(res => {
          this.$message({
            type: "success",
            message: "删除成功！"
          });
          this.$emit("afterDelete");
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: "删除失败！"
          });
        });
    },
    lookDetail() {
      this.showDetail = true;
      this.showProView = true
      this.showPenaltyPro = true
    },
    // 裁量说明的展示与否
    setUnfold(bool) {
      this.showProView = bool
      this.showPenaltyPro = bool
    }
  }
};
</script>
<style lang="less" scope>
.lookDetail {
  height: 28px;
  padding: 7px 8px;
  margin-left: 0;
  background: rgba(0, 153, 255, 1);
}

.penalty_discretion_saveTrue {
  .el-col {
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.penalty_description {
  display: flex;
  align-items: center;
  margin-top: 32px;
  border-top: 1px solid #e0e0e0;
  padding: 8px 41px 0 16px;
  & > span {
    flex-shrink: 0;
    align-self: flex-start;
    margin-top: 10px;
    height: 33px;
    line-height: 33px;
    font-size: 16px;
    font-weight: bold;
  }
  .el-textarea {
    margin-top: 10px;
  }
}

.back_button {
  margin-top: 15px;
  text-align: center;
}

.tit {
  color: #333333;
  background: #e3eef6;
  padding: 0 14px;
  line-height: 24px;
}

.casetit {
  width: 60px;
  flex-shrink: 0;
  align-self: flex-start;
  word-break: break-all;
  text-align: justify;
  text-align-last: justify;
  padding-right: 20px;
  position: relative;
  &:after {
    content: ':';
    position: absolute;
    right: 13px;
  }
  &.long_casetit {
    width: 130px;
  }
}

.info_line {
  margin-bottom: 16px;
  border-top: 1px solid #e0e0e0;
}

.edit {
  color: #0099ff !important;
  cursor: pointer;
}

.del {
  color: #ff0000;
  cursor: pointer;
}
</style>