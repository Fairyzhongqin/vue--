<template>
  <div>
    <div class="content">
      <el-form
        ref="evidenceExecution"
        :model="queryInformInfo"
        :rules="rules"
        label-width="90px"
        label-position="left"
        :inline-message="true"
        :show-message="false"
        :hide-required-asterisk="true"
      >
        <el-row class="widStyle">
          <el-form-item label="关联先行登记保存证据通知书：" prop="notice" label-width="200px">
            <!-- <el-input v-model="queryInformInfo.notice" placeholder="请输入关联先行登记保存证据通知书" ></el-input> -->
            <el-select v-model="queryInformInfo.notice" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="抽查物品：" prop="checkGoods">
            <el-input v-model="queryInformInfo.checkGoods" placeholder="请输入抽查物品" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row class="selectDate">
          <el-form-item label="日期：" prop="date">
            <el-date-picker v-model="queryInformInfo.date" type="date" placeholder="选择日期时间"></el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="处理决定：" prop="handle">
            <el-input v-model="queryInformInfo.handle" placeholder="请输入处理决定" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="附件：" prop="caseName">
            <upload-proof uploadType="inspection" @getUploadMsg="successUpload"></upload-proof>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="dialog-footer" style="margin-top: 60px;text-align: right;padding-bottom:10px">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成先行登记保存证据处理处决书</el-button>
    </div>
  </div>
</template>
<script>
import { getWritParams, dateFormat } from "@/utils/util";
import uploadProof from "@components/uploadProof";
export default {
  props: {
    info: {
      type: Object
    }
  },
  components: {
    uploadProof
  },
  data() {
    return {
      options: [
        {
          value: "选项1",
          label: "（锡锡）应急监察先保通〔2019〕1号"
        }
      ],
      data: [],
      queryInformInfo: {
        notice: "", //关联先行登记保存证据通知书：
        checkGoods: "", //抽查物品：
        date: "", //日期：
        handle: "" //处理决定：
      },
      rules: {
        notice: [
          {
            notice: true,
            message: "请输入关联先行登记保存证据通知书",
            trigger: "blur"
          }
        ],
        checkGoods: [
          { notice: true, message: "请输入抽查物品", trigger: "blur" }
        ],
        notice: [{ notice: true, message: "请输入处理决定", trigger: "blur" }]
      }
    };
  },
  methods: {
    // 提交盖章
    // seal() {
    //   let _audiReq = {
    //     auditTypeCode: "ta80040", // 盖章审核
    //     handlerDeptId: "", // 审核人部门 id
    //     handlerUserId: "", // 审核人
    //     requestDeptName: JSON.parse(localStorage.getItem("res")).userEntity.deptName, // 承办人部门，现在先不填
    //     requestId: this.info.writId, // 文书 writId
    //     requestTime: void 0,
    //     requestUsersName: this.info.responsiblePerson, // 承办人名称
    //     submitterCause: this.info.companyName // 案件名称 或 企业名称
    //   };
    //   this.$emit("toSeal", _audiReq);
    // },
    successUpload(res) {
      this.data.push(res.accessoryId);
    },
    sure() {
      let user = JSON.parse(localStorage.getItem("res"));
      this.$refs.evidenceExecution.validate(val => {
        if (val) {
          let data = getWritParams({
            tag2: this.info.subject,
            tag3: dateFormat(this.queryInformInfo.date, "yyyy年mm月dd日"), //（锡锡）应急监察先保通〔2019〕1号
            tag4: this.queryInformInfo.checkGoods,
            tag5: this.queryInformInfo.notice,
            tag6: this.queryInformInfo.handle,
            tag7: user.sysDeptEntity.government,
            tag8: user.sysDeptEntity.fullDeptName,
            tag9: user.sysDeptEntity.court
            // tag3: this.queryInformInfo.delict,
            // tag4: dateFormat(this.queryInformInfo.deadline, 'yyyy年mm月dd日'),
            // tag5: this.queryInformInfo.executionAddress,
          });
          let params = {
            contractorIds: this.info.udtIds,
            writType: "XXDJBCZJCLJDS",
            sourceId: this.info.sourceId,
            data: data
          };
          this.$emit("createWrit", params);
        } else {
          console.log("hhh");
        }
      });
    },
    // 点击取消按钮事件
    close() {
      this.$emit("close");
    }
  }
};
</script>

<style lang="less" scoped>
.selectDate {
	.el-input {
		width:100%;
	}
}
.content {
  padding-left: 16px;
	padding-right: 28px;
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
}
.widStyle {

		margin-top:10px;

	.el-select {
		width:100%;
	}
}
.only {
  /deep/ .el-form-item__label {
    line-height: 24px;
    padding: 0;
    white-space: normal;
    width: 61px !important;
  }
  /deep/ .el-input > .el-input__inner {
    height: 76px;
  }
  /deep/ .el-input__inner {
    padding: 0 15px 15px 15px;
  }
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding-right: 16px;
  border-top: 1px solid #e0e0e0;
  padding-top: 10px;
  margin-top: 30px;
}
</style>
<style lang="less">
</style>
