<template>
  <div class="investi_content penalty-bottom_button">
    <el-form
      label-width="110px"
      label-position="left"
      :model="invesReportInfo"
      ref="invesInfo"
      :rules="rules"
    >
      <el-row>
        <el-col
          class="inves-form_item"
          v-for="(item, index) in formData"
          :key="index"
          :sm="24"
          :md="item.span"
        >
          <el-form-item
            :prop="item.codeName"
            v-if="!item.belong || item.belong === $store.state.penalty.penaltyUndEntity.objectType"
            :label-width="item.labelWidth"
            :class="item.class"
          >
            <div slot="label" class="slot_label">{{item.label}}</div>
            <component
              :is="item.component || 'div'"
              :placeholder="item.placeholder"
              v-model="invesReportInfo[item.codeName]"
              :type="item.type"
              :format="item.format"
              :autosize="item.autosize ? item.autosize : true"
              :maxlength="item.maxlength"
            >
              <div
                v-if="!item.component || item.component == 'div'"
              >{{ invesReportInfo[item.codeName] }}</div>
              <component
                v-for="itm in item.children"
                :key="itm.value"
                :label="itm.label"
                :value="itm.value"
                :is="itm.component"
              ></component>
            </component>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <bottom-bar>
      <el-button @click="goBack" class="penalty-small_button inves_cancel">取消</el-button>
      <el-button class="penalty-small_button" @click="save" type="primary">保存并生成案件调查报告书</el-button>
    </bottom-bar>
  </div>
</template>
<script>
import bottomBar from "@/components/bottomBar";
import { debounce, getWritParams, dateFormat, handleDateRef } from "@/utils/util";
import { finishPro, individualInfo } from "@api/common";
import { enterPriseInquireByid } from "@api/ProcessingofInspectionResult";
import { createWrit, updateWrit, getWritDataByWritId } from "@api/fileRelated";
import { getCurrentProcess } from "@/api/filingRegister/index";

export default {
  name: "investigationReportEdit",
  components: {
    bottomBar
  },
  props: {
    report: {
      type: Object
    },
    critInfo: {
      type: Object
    }
  },
  data() {
    return {
      buttonList: [
        {
          type: "primary",
          name: "保存并生成案件调查报告书",
          fun: this.save
        }
      ],
      rules: {
        suggestion: [
          { required: true, message: "请输入处理建议", trigger: "blur" }
        ]
      },
      formData: [
        {
          label: "案件名称",
          value: "",
          span: 24,
          codeName: "caseName"
        },
        {
          label: "当事人",
          component: "div",
          value: "0",
          span: 24,
          codeName: "subject"
        },
        {
          label: "注册地址",
          value: "--",
          span: 24,
          codeName: "regisAddress",
          belong: "0"
        },
        {
          label: "法定代表人",
          value: "陈建",
          span: 12,
          codeName: "corporate",
          belong: "0"
        },
        {
          label: "联系电话",
          value: "15865425963",
          span: 12,
          codeName: "corpoPhone"
        },
        {
          label: "承办部门",
          value: "支队领导",
          span: 12,
          codeName: "excutorDept"
        },
        {
          label: "立案时间",
          value: "",
          component: "el-date-picker",
          format: "yyyy/MM/dd",
          type: "date",
          placeholder: "请选择日期",
          span: 12,
          codeName: "createTime"
        },
        {
          label: "承办人",
          value: "王晓明、承建",
          span: 12,
          codeName: "excutor"
        },
        {
          label: "案件来源",
          value: "执法检查",
          span: 12,
          codeName: "caseSource"
        },
        {
          label: "案件事实",
          value: "",
          component: "el-input",
          placeholder: "输入案件事实",
          type: "textarea",
          autosize: { minRows: 1 },
          span: 24,
          codeName: "caseSituation"
        },
        {
          label: "调查经过",
          value: "",
          component: "el-input",
          placeholder: "输入调查经过",
          type: "textarea",
          span: 24,
          autosize: { minRows: 1 },
          codeName: "invesDetail"
        },
        {
          label: "处罚依据",
          labelWidth: "",
          value: "",
          component: "el-input",
          placeholder: "输入处罚依据",
          type: "textarea",
          span: 24,
          autosize: { minRows: 1 },
          codeName: "lawReference"
        },
        {
          label: "裁量说明",
          labelWidth: "",
          value: "",
          component: "el-input",
          placeholder: "输入裁量说明",
          type: "textarea",
          span: 24,
          autosize: { minRows: 1 },
          codeName: "processView"
        },
        {
          label: "处理建议",
          labelWidth: "",
          value: "",
          component: "el-input",
          placeholder: "输入处理建议",
          type: "textarea",
          span: 24,
          autosize: { minRows: 1 },
          codeName: "suggestion"
        },
        {
          label: "证据清单",
          value: "",
          component: "el-input",
          placeholder: "输入证据清单",
          type: "textarea",
          span: 24,
          autosize: { minRows: 1 },
          codeName: "caseNailedEvi"
        }
      ],
      invesReportInfo: {
        caseName: "", // 案件名称
        subject: "", // 涉案对象单位（个人）
        regisAddress: "", // 注册地址
        corporate: "", // 法定代表人
        corpoPhone: "", // 联系电话
        excutorDept: "", // 承办部门
        createTime: "", // 立案时间
        excutor: "", // 承办人
        caseSource: "", // 案件来源
        caseSituation: "", // 案件事实
        invesDetail: "", // 调查经过
        lawReference: "", // 处罚依据
        processView: "", // 裁量说明
        suggestion: "", // 处理建议
        registrant: "", // 登记人
        registrantDept: "", // 登记单位
        regisTime: "", // 登记时间
        caseNailedEvi: "" // 证据清单
      },
      createReq: {
        sourceId: "",
        userId: "",
        contractorIds: "",
        writType: "",
        data: []
      }
    };
  },
  created() {
    if (this.report && this.report.writId) {
      this.reflect();
    } else {
      this.initDetail();
    }
    this.save = debounce(this.save, 2000, true)
  },
  methods: {
    initDetail() {
      let penalty = this.$store.state.penalty,
        userInfo = JSON.parse(localStorage.getItem("res"));

      if (this.$store.state.penalty.penaltyUndEntity.objectType === "0") {
        enterPriseInquireByid({
          id: penalty.penaltyUndEntity.punishCompanyId
        }).then(res => {
          this.invesReportInfo.regisAddress = res.data.registerAddress;
          this.invesReportInfo.corporate = res.data.legalPerson;
        });
      }
      // 链式调用获取处罚裁量里的当事人意见及处理意见
      this.invesReportInfo = {
        caseName: penalty.penaltyUndEntity.caseName, // 案件名称
        subject:
          penalty.penaltyUndEntity.objectType == 0
            ? penalty.punishCompanyName
            : penalty.penaltyUndEntity.punishPersonName, // 涉案对象单位（个人）
        regisAddress: "", // 注册地址
        corporate: "", // 法定代表人
        corpoPhone: penalty.penaltyUndEntity.telphone, // 联系电话
        excutorDept: userInfo.sysDeptEntity.name
          ? userInfo.sysDeptEntity.name
          : "暂无", // 承办部门
        createTime: penalty.penaltyUndEntity.creatorTime, // 立案时间
        excutor: penalty.udtNames, // 承办人
        caseSource: penalty.caseSourceName, // 案件来源
        caseSituation: this.handleTags("actName", "违法行为"), // 案件事实
        invesDetail: "", // 调查经过
        lawReference:
          this.handleTags("lawContent", "法律规定") +
          this.handleTags("penaltyAcdName", "处罚依据"), // 处罚依据
        processView: this.critInfo.processView ? this.critInfo.processView : "",
        suggestion: "",
        registrant: userInfo.userEntity.nickName, // 登记人
        registrantDept: userInfo.sysDeptEntity.name, // 登记单位
        regisTime: new Date(), // 登记时间
        caseNailedEvi: "" // 证据清单
      };
      this.createReq = {
          companyId: penalty.penaltyUndEntity.punishCompanyId, //制作文书传company_id
        sourceId: penalty.penaltyUndEntity.penaltyId,
        userId: userInfo.userEntity.id,
        contractorIds: penalty.penaltyUndEntity.udtIds,
        writType: "XZCFAJDCBG",
        data: []
      };
    },
    reflect() {
      getWritDataByWritId({ writId: this.report.writId }).then(res => {
        let inputInfo = res.data.reduce((total, item) => {
          switch (item.tagName) {
            case "tag2":
              total.caseName = item.tagContent;
              break;
            case "tag3":
              total.subject = item.tagContent;
              break;
            case "tag4":
              total.regisAddress = item.tagContent;
              break;
            case "tag6":
              total.corporate = item.tagContent;
              break;
            case "tag7":
              total.corpoPhone = item.tagContent;
              break;
            case "tag8":
              total.excutorDept = item.tagContent;
              break;
            case "tag9":
              total.createTime = handleDateRef(item.tagContent);
              break;
            case "tag10":
              total.caseSource = item.tagContent;
              break;
            case "tag11":
              total.caseSituation = item.tagContent;
              break;
            case "tag12":
              total.invesDetail = item.tagContent;
              break;
            case "tag13":
              total.lawReference = item.tagContent;
              break;
            case "tag14":
              total.processView = item.tagContent;
              break;
            case "tag15":
              total.suggestion = item.tagContent;
              break;
            case "tag16":
              total.caseNailedEvi = item.tagContent;
              break;
          }
          total.excutor = this.$store.state.penalty.udtNames;
          total.udtTime = this.$store.state.penalty.penaltyUndEntity.creatorTime;
          return total;
        }, {});
        this.invesReportInfo = inputInfo;
      });
    },
    handleTags(type, char) {
      let arr = [],
        penalty = this.$store.state.penalty;
      penalty.blcList.map(item => {
        arr.push(item[type]);
      });
      return arr.filter(Boolean).join(";");
    },
    save() {
      this.$refs.invesInfo.validate(val => {
        if (val) {
          // 文书请求参数处理
          let time = dateFormat(
            this.invesReportInfo.createTime,
            "yyyy年mm月dd日"
          );
          let invesReportData = getWritParams({
            tag2: this.invesReportInfo.caseName, //案件名称
            tag3: this.invesReportInfo.subject, //当事人
            tag4: this.invesReportInfo.regisAddress, //注册地址
            tag6: this.invesReportInfo.corporate, //法定代表人
            tag7: this.invesReportInfo.corpoPhone, //电话
            tag8: this.invesReportInfo.excutorDept, //承办机构
            tag9: time ? time : "", //立案时间
            tag10: this.invesReportInfo.caseSource, //案件来源
            tag11: this.invesReportInfo.caseSituation, //案件事实
            tag12: this.invesReportInfo.invesDetail, //调查经过
            tag13: this.invesReportInfo.lawReference, //处罚依据
            tag14: this.invesReportInfo.processView, //裁量意见
            tag15: this.invesReportInfo.suggestion, // 处理建议
            tag16: this.invesReportInfo.caseNailedEvi //证据清单
          });
          let processesNames = this.$store.state.processesNames;
          if (this.report && this.report.writId) {
            let id = { writId: this.report.writId };
            updateWrit(id, invesReportData)
              .then(res => {
                if (processesNames && processesNames[0] !== "案件调查报告") {
                  // 流程已走到下一步
                  this.getMessage("success", "制作成功！");
                  this.$parent.getReport("afterCreated");
                }
              })
              .catch(err => {
                this.getMessage("error", "制作失败！");
              });
            return;
          }
          this.createReq.data = invesReportData;
          createWrit(this.createReq)
            .then(res => {
              if (this.$store.state.currCaseHandle > 1) {
                // 流程已走到下一步
                this.getMessage("success", "制作成功！");
                this.$parent.getReport("afterCreated");
              } else if (
                processesNames &&
                processesNames[0] === "案件调查报告"
              ) {
                // 流程走到案件调查报告处的情况
                this.finishInvesReport();
              }
            })
            .catch(err => {
              this.getMessage("error", "制作失败！");
            });
        } else {
          this.$message({
            type: "warning",
            message: "请填写处理建议！"
          });
        }
      });
    },
    finishInvesReport() {
      let task = this.$store.state.processes.get("AJSL")
        ? JSON.parse(this.$store.state.processes.get("AJSL"))
        : [];
      let endReq = {
        taskId: task[0].taskId,
        undertakerIds: task[0].vars.undertakerIds
      };
      const prosReq = {
        businessKey: this.$store.state.penalty.penaltyUndEntity.penaltyId
      };
      finishPro(endReq)
        .then(res => {
          this.getMessage("success", "案件调查报告生成成功！");
          // 获取当前流程及我的任务
          return getCurrentProcess(prosReq);
        })
        .then(res => {
          this.$store.commit("setCurrProcesses", res.data);
          // 跳转
          this.$parent.getReport("afterCreated");
          if (this.$store.state.currCaseHandle === 1) {
            this.$emit("initSmallNodes", "fromIG");
          }
        })
        .catch(err => {
          this.getMessage("error", "案件调查报告生成失败！");
        });
    },
    // 提示信息
    getMessage(type, message) {
      this.$message({
        type: type,
        message: message
      });
    },
    // 返回
    goBack() {
      this.$parent.getReport();
    }
  }
};
</script>
<style lang="less" scope>
.investi_content {
  padding: 12px 32px 0 16px !important;

}
.inves_cancel {
  background: white !important;
}
.inves-form_item {
  /deep/ .el-form-item {
    margin-bottom: 0 !important;
  }
}
.el-textarea {
  margin-bottom: 5px;
}
.penalty-bottom_button {
  /deep/ .bottom-button-container {
    right: 0;
  }
}
</style>
