<template>
  <div class="penalty-bottom_button transfer_book_content">
    <el-form
      ref="transForm"
      :inline-message="true"
      :show-message="false"
      label-width="130px"
      label-position="left"
      :rules="rules"
      :model="transData"
    >
      <el-row :gutter="20">
        <el-col v-for="(item, index) in dataList" :key="index" :sm="24" :md="item.span">
          <el-form-item
            :prop="item.codeName"
            :class="item.class"
            :label-width="item.labelWidth"
          >
            <div slot="label" class="slot_label">{{item.label}}</div>
            <component
              :is="item.component"
              v-model="transData[item.codeName]"
              :type="item.type"
              :placeholder="item.placeholder"
              autosize
              :controls="false"
              :readonly="item.readonly"
            >
              <span v-if="item.component == 'div'">{{transData[item.codeName]}}</span>
            </component>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <bottom-bar>
      <el-button class="end penalty-small_button" @click="goBack">取消</el-button>
      <el-button type="primary" class="penalty-small_button" @click="save">保存并生成案件移送书</el-button>
    </bottom-bar>
  </div>
</template>
<script>
import bottomBar from "@/components/bottomBar";
import buttonGroup from "@/components/buttonGroup";
import { getWritParams, dateFormat, handleDateRef } from "@/utils/util";
import { getWritDataByWritId, createWrit, updateWrit } from "@api/fileRelated";

export default {
  name: "transferBookEdit",
  props: ["writInfo", 'forBrowse'],
  components: {
    buttonGroup,
    bottomBar
  },
  data() {
    return {
      rules: {
        receiver: [
          { required: true, message: "请输入受移送机关", trigger: "blur" }
        ],
        material: [
          { required: true, message: "请输入移送材料", trigger: "blur" }
        ],
        lawReference: [
          { required: true, message: "请输入法律依据", trigger: "blur" }
        ],
        transReason: [
          { required: true, message: "请输入移送理由", trigger: "blur" }
        ],
        pageNo: [
          { required: true, message: "请输入移送理由", trigger: "blur" }
        ],
        num: [{ required: true, message: "请输入移送理由", trigger: "blur" }]
      },
      dataList: [
        {
          label: "案件名称",
          value: "江阴市清扬浩辰塑料制品有限公司",
          component: "div",
          codeName: "caseName",
          span: 24
        },
        {
          label: "案件移送对象",
          value: "",
          component: "div",
          placeholder: "输入案件移送对象",
          labelWidth: "",
          codeName: "subject",
          span: 24
        },
        {
          label: "立案时间",
          value: "",
          component: "div",
          codeName: "caseCrimeTime",
          span: 12,
          readonly: true,
          format: "yyyy-MM-dd"
        },
        {
          label: "受移送机关",
          value: "",
          component: "el-input",
          placeholder: "输入受移送机关",
          codeName: "receiver",
          span: 24
        },
        {
          label: "移送原因",
          value: "",
          component: "el-input",
          type: "textarea",
          placeholder: "输入移送原因",
          codeName: "transReason",
          span: 24
        },
        {
          label: "法律依据",
          value: "",
          component: "el-input",
          class: "mt5",
          type: "textarea",
          placeholder: "输入法律依据",
          codeName: "lawReference",
          span: 24
        },
        {
          label: "移送材料",
          value: "",
          class: "mt5",
          component: "el-input",
          type: "textarea",
          placeholder: "输入移送材料",
          codeName: "material",
          span: 24
        },
        {
          label: "移送页数",
          value: "",
          component: "el-input-number",
          codeName: "pageNo",
          placeholder: "请输入移送页数",
          span: 12
        },
        {
          label: "移送材料份数",
          value: "",
          component: "el-input-number",
          labelWidth: "",
          placeholder: "请输入移送材料份数",
          codeName: "num",
          span: 12
        }
      ],
      transData: {
        caseName: "", // 案件名称
        caseCrimeTime: "", // 立案时间
        num: 0, // 移送材料份数
        receiver: "", // 受移送机关
        subject: "", // 案件移送对象
        material: "", // 移送材料
        lawReference: "", // 法律依据
        transReason: "", // 移送理由
        pageNo: 0 // 移送材料页数
      }
    };
  },
  created() {
    if (this.writInfo && this.writInfo.writId) {
      this.reflect();
    } else {
      this.initInfo();
    }
  },
  methods: {
    // 回到上一页
    goBack() {
      this.$parent.initInfo();
    },
    initInfo() {
      let _penalty = this.$store.state.penalty;
      this.transData = {
        caseName: _penalty.penaltyUndEntity.caseName, // 案件名称
        caseCrimeTime: _penalty.penaltyUndEntity.caseCrimeTime
          ? _penalty.penaltyUndEntity.caseCrimeTime
          : '暂无', // 立案时间
        num: void 0, // 移送材料份数
        receiver: "", // 受移送机关
        subject:
          _penalty.penaltyUndEntity.objectType === "0"
            ? _penalty.punishCompanyName
            : _penalty.penaltyUndEntity.punishPersonName, // 案件移送对象
        material: "", // 移送材料
        lawReference: "", // 法律依据
        transReason: "", // 移送理由
        pageNo: void 0 // 移送材料页数
      };
    },
    // 文书回显
    reflect() {
      getWritDataByWritId({ writId: this.writInfo.writId }).then(res => {
        let _penalty = this.$store.state.penalty;
        let inputInfo = res.data.reduce((total, item) => {
          switch (item.tagName) {
            case "tag2":
              total.receiver = item.tagContent;
              break;
            case "tag4":
              total.caseName = item.tagContent;
              break;
            case "tag5":
              total.transReason = item.tagContent;
              break;
            case "tag6":
              total.lawReference = item.tagContent;
              break;
            case "tag7":
              total.material = item.tagContent;
              break;
            case "tag8":
              total.num = item.tagContent;
              break;
            case "tag9":
              total.pageNo = item.tagContent;
              break;
          }
          total.caseCrimeTime = _penalty.penaltyUndEntity.caseCrimeTime
          total.subject =
            _penalty.penaltyUndEntity.objectType === "0"
              ? _penalty.punishCompanyName
              : _penalty.penaltyUndEntity.punishPersonName;
          return total;
        }, {});
        this.transData = inputInfo;
      });
    },
    // 制作案件移送书
    save() {
      this.$refs.transForm.validate(val => {
        if (val) {
          let data = getWritParams({
            tag2: this.transData.receiver,
            tag3: dateFormat(new Date(this.transData.caseCrimeTime), 'yyyy年mm月dd日'),
            tag4: this.transData.caseName,
            tag5: this.transData.transReason,
            tag6: this.transData.lawReference,
            tag7: this.transData.material,
            tag8: this.transData.num,
            tag9: this.transData.pageNo
          });
          let params = {
              companyId: this.$store.state.penalty.penaltyUndEntity.punishCompanyId, //制作文书传company_id
            contractorIds: this.$store.state.penalty.penaltyUndEntity.udtIds,
            writType: "AJYSS",
            sourceId: this.$store.state.penalty.penaltyUndEntity.penaltyId,
            data: data
          };

          if (this.writInfo && this.writInfo.writId) {
            updateWrit({ writId: this.writInfo.writId }, params.data).then(
              res => {
                this.getMessage("success", "制作成功！");
                this.$parent.initInfo("afterCreated");
              },
              err => {
                this.getMessage("error", "制作失败！");
              }
            );
          } else {
            createWrit(params).then(
              res => {
                this.getMessage("success", "制作成功！");
                this.$parent.initInfo("afterCreated");
              },
              err => {
                this.getMessage("error", "制作失败！");
              }
            );
          }
        } else {
          this.getMessage("warning", "还有必填字段没有填写！");
        }
      });
    },
    getMessage(type, message) {
      this.$message({
        type: type,
        message: message
      });
    }
  }
};
</script>
<style lang="less" scope>
.end {
  background: white !important;
}
.transfer_book_content {
  .el-form {
    /deep/ .el-form-item {
      margin-bottom: 0px !important;
      .el-input-number {
        width: 100%;
      }
    }
  }
}
.el-input-number.is-without-controls .el-input__inner {
  text-align: left;
}

.penalty-bottom_button {
  /deep/ .bottom-button-container {
    right: 0;
  }
  &.transfer_book_content {
    padding: 3px 16px 0;
  }
}
</style>
