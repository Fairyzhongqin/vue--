<template>
  <div class="penalty-bottom_button">
    <div class="penalty_content">
      <el-form label-width="110px" label-position="left">
        <el-row>
          <el-col
            class="discre-form_item"
            v-for="(item, index) in formData"
            :key="index"
            :span="item.span"
          >
            <el-form-item
              :label-width="item.labelWidth"
              :class="item.class"
            >
              <div slot="label" class="slot_label">{{item.label}}</div>
              <component
                :is="item.compont"
                v-model="penaltyInfo[item.codeName]"
                :placeholder="item.placeholder"
                :type="item.type"
                :maxlength="item.maxlength"
                autosize
              >
                <span v-if="item.compont=='div'" class="word-break">{{penaltyInfo[item.codeName]}}</span>
                <component
                  v-for="(itm, ind) in item.child"
                  :key="ind"
                  :is="itm.compont"
                  :label="itm.label"
                  :value="itm.value"
                ></component>
              </component>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <offence :actions="crit.breakLawCaseList" :type="type" @changeAmount="changeAmount"></offence>

    <div class="penalty_description">
      <span>裁量说明：</span>
      <el-input type="textarea" :autosize="{minRows:1}" v-model="penaltyInfo.processView"></el-input>
    </div>

    <penalty-upload :sourceType="'cfcl'" :btnText="'处罚材料'" :forBrowse="forBrowse"></penalty-upload>

    <bottom-bar>
      <el-button @click="goBack" class="penalty-small_button penalty_cancel">取消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="save" class="penalty-small_button">保存</el-button>
    </bottom-bar>
  </div>
</template>
<script>
import penaltyUpload from "@/pages/commonHandle/components/penaltyUpload.vue";
import bottomBar from "@/components/bottomBar";
import offence from "../component/offence"; // 违法行为
import { mapState } from "vuex";
import { saveOrUpdateCriteria } from "@api/anjianshenli";
import { getWritParams, dateFormat, debounce } from "@/utils/util";
import { finishPro } from "@api/common";
import { getCurrentProcess } from "@/api/filingRegister/index";

export default {
  name: "penaltyDiscretionEdit",
  components: {
    offence,
    bottomBar,
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
      formData: [
        {
          label: "案件名称",
          compont: "div",
          codeName: "caseName",
          value: "江阴市清扬浩辰塑料制品有限公司",
          span: 24
        },
        {
          label: "当事人",
          compont: "div",
          codeName: "subject",
          value: "江阴市清扬浩辰塑料制品有限公司",
          span: 12
        },
        {
          label: "承办人",
          compont: "div",
          codeName: "udtNames",
          value: "王晓明、杜琦",
          span: 12
        }
      ],
      type: 'add', // 处罚裁量是新增还是修改
      penaltyInfo: {
        caseName: "",
        subject: "",
        udtNames: "",
        partyViewLabel: "当事人的申辩意见：",
        partyView: "",
        processView: ""
      },
      btnLoading: false
    };
  },
  created() {
    this.initDetail();
    this.save = debounce(this.save, 2000, true);
  },
  methods: {
    changeAmount(index, action) {
      this.crit.breakLawCaseList[index].shouldAmount = Number(action.shouldAmount)
    },
    initDetail() {
      let penalty = this.$store.state.penalty;
      this.penaltyInfo = {
        caseName: penalty.penaltyUndEntity.caseName,
        subject:
          penalty.penaltyUndEntity.objectType == 0
            ? penalty.punishCompanyName
            : penalty.penaltyUndEntity.punishPersonName,
        udtNames: penalty.udtNames,
        partyViewLabel: "当事人的申辩意见：",
        partyView: this.crit.laDiscretionEntity.partyView,
        processLabel: "处理意见：",
        processView: this.crit.laDiscretionEntity.laDiscretionId
          ? this.crit.laDiscretionEntity.processView
          : ""
      };
      this.type = this.crit.laDiscretionEntity.laDiscretionId ? 'edit' : 'add'
    },
    handleActions(req) {
      // 处理违法行为
      this.crit.breakLawCaseList.forEach(action => {
        let _data = {
          accessoryId: "",
          actName: "",
          breakLawCaseId: "",
          checkContent: "",
          checkDesc: "",
          checkId: "",
          dataSource: "",
          discretionId: "",
          divisorId: "",
          isPenalty: "",
          lawContent: "",
          levelFlag: "",
          paramType: "",
          paramValue: 0,
          penaltyAcdName: "",
          penaltyAmount: 0,
          shouldAmount: action.shouldAmount,
          penaltyId: "",
          reason: "",
          ruleId: "",
          type: "",
          punishmentBasis: ''
        };
        if (action.isPenalty === "0") {
          // 不处罚
          for (let key in _data) {
            if (key === "divisorId") {
              _data[key] = "";
            } else if (key === "levelFlag") {
              _data[key] = "0";
            } else if (key === "paramValue") {
              _data[key] = 0;
            } else if (key === "penaltyAmount") {
              _data[key] = 0;
            } else if (key === "shouldAmount") {
              _data[key] = 0;
            } else if (key === "type") {
              _data[key] = "";
            } else if (key === "accessoryId") {
              _data[key] = action.accessoryId.join(",");
            } else {
              _data[key] = action[key];
            }
          }
        } else {
          // 处罚
          for (let key in _data) {
            if (key === "accessoryId") {
              _data[key] = "";
            } else if (key === "reason") {
              _data[key] = "";
            } else if(key === "shouldAmount") {
              _data[key] = Number(_data[key])
            } else {
              _data[key] = action[key];
            }
          }
        }
        req.breakLawCaseList.push(_data);
        req.laDiscretionEntity.sumMoney += Number(_data.shouldAmount);
      });
    },
    // 取消
    goBack() {
      this.$emit("getCrit");
    },
    // 保存处罚裁量
    save() {
      this.btnLoading = true;
      let addOrUpdateReq = {
        breakLawCaseList: [],
        laDiscretionEntity: {
          laDiscretionId: "",
          objectType: "", // 行政处罚类型 0：一般行政处罚案件 1：重大行政处罚案件
          partyView: "",
          penaltyId: this.$store.state.penalty.penaltyUndEntity.penaltyId,
          processView: "",
          sumMoney: 0
        }
      };
      this.handleActions(addOrUpdateReq);
      addOrUpdateReq.laDiscretionEntity.penaltyId = this.$store.state.penalty.penaltyUndEntity.penaltyId;
      addOrUpdateReq.laDiscretionEntity.partyView = this.penaltyInfo.partyView;
      addOrUpdateReq.laDiscretionEntity.processView = this.penaltyInfo.processView;
      addOrUpdateReq.laDiscretionEntity.laDiscretionId = this.crit.laDiscretionEntity.laDiscretionId;
      saveOrUpdateCriteria(addOrUpdateReq)
        .then(res => {
          if (this.$store.state.currCaseHandle > 0) {
            // 如果之前做过处罚裁量 流程已走到下一步
            this.$message({
              type: "success",
              message: "处罚裁量保存成功！"
            });
            this.$emit("getCrit");
          } else {
            // 流程走到处罚裁量处的情况
            this.finishPuniCrit();
          }
          this.btnLoading = false
        })
        .catch(err => {
          this.btnLoading = false
          this.$message({
            type: "error",
            message: "处罚裁量保存失败！"
          });
        });
    },
    // 结束处罚裁量流程
    finishPuniCrit() {
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
          this.$message({
            type: "success",
            message: "处罚裁量保存成功！"
          });
          // 获取当前流程及我的任务
          return getCurrentProcess(prosReq);
        })
        .then(res => {
          this.$emit("getCrit");
          this.$store.commit("setCurrProcesses", res.data);
          this.$emit("initSmallNodes", "fromDP");
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: "处罚裁量保存失败！"
          });
        });
    }
  }
};
</script>
<style lang="less" scoped>
.el-form > div {
  padding: 10px;
  .el-form-item__label {
    line-height: 30px;
  }
  .el-form-item__content {
    line-height: 30px;
  }
}
.penalty_cancel {
  background: white !important;
}
.discre-form_item {
  /deep/ .el-form-item {
    margin-bottom: 0;
    .marginLeft /deep/ .el-form-item__content {
      margin-left: 0 !important;
    }
  }
}
.penalty_content {
  padding: 0 !important;
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
.penalty_buttons {
  height: 60px;
  line-height: 60px;
  text-align: center;
  .el-button {
    height: 28px;
    padding: 7px 8px;
    margin-left: 0;
    background: rgba(0, 153, 255, 1);
  }
}
.penalty-bottom_button {
  /deep/ .el-form-item__label {
    line-height: 35px !important;
  }
  /deep/ .el-form-item__content {
    line-height: 35px !important;
  }
  /deep/ .bottom-button-container {
    right: 0;
  }
}
</style>
