<template>
  <div>
    <div class="evidence-examine">
      <el-form
        ref="evidenceExamInfo"
        :model="evidenceExamInfo"
        :rules="rules"
        label-width="160px"
        label-position="left"
        :show-message="false"
      >
        <el-row class="only topDistance">
          <el-form-item prop="caseName">
            <div slot="label" class="slot_label">案件名称</div>
            <el-input v-model="evidenceExamInfo.caseName" placeholder="请输入案件名称" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row class="only">
          <el-form-item prop="partyBasic">
            <div slot="label" class="slot_label">当事人及基本情况</div>
            <el-input v-model="evidenceExamInfo.partyBasic" type="textarea" :autosize="{minRows: 2, maxRows: 5}" placeholder="请输入当事人及基本情况" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row class="only">
          <el-form-item prop="caseBasic">
            <div slot="label" class="slot_label">案件基本情况</div>
            <el-input v-model="evidenceExamInfo.caseBasic" type="textarea" :autosize="{minRows: 2, maxRows: 5}" placeholder="请输入案件基本情况" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row class="only">
          <el-form-item prop="opinion">
            <div slot="label" class="slot_label">呈请意见</div>
            <el-input v-model="evidenceExamInfo.opinion" type="textarea" :autosize="{minRows: 2, maxRows: 5}" placeholder="请输入呈请意见" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row class="only">
          <el-form-item prop="submitEvidence">
            <div slot="label" class="slot_label">提请理由及依据</div>
            <el-input v-model="evidenceExamInfo.submitEvidence" type="textarea" :autosize="{minRows: 2, maxRows: 5}" placeholder="请输入提请理由及依据" clearable></el-input>
          </el-form-item>
        </el-row>
        <div v-for="(item,index) in evidenceExamInfo.dataInfo" :key="index">
          <el-row>
            <el-col :span="3">
              <el-form-item class="marginFlex" label-width="30px" prop="ordeNumber">
                <div slot="label" class="slot_label">序号</div>
                <el-input class="item_index" v-model="item.ordeNumber" placeholder="序号" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="21">
              <el-row>
                <el-col :span="12">
                  <el-form-item :prop="`dataInfo[${index}].evidence`" :rules="dataInfoRules.evidence" label-width="80px">
                    <div slot="label" class="slot_label">证据名称</div>
                    <el-input v-model="item.evidence" placeholder="请输入证据名称" class="width280" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :prop="`dataInfo[${index}].model`" :rules="dataInfoRules.model" label-width="100px">
                    <div slot="label" class="slot_label">规格型号</div>
                    <el-input v-model="item.model" placeholder="请输入规格型号" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item :prop="`dataInfo[${index}].origin`" :rules="dataInfoRules.origin" label-width="80px">
                    <div slot="label" class="slot_label">产地</div>
                    <el-input v-model="item.origin" placeholder="请输入产地" class="width280" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :prop="`dataInfo[${index}].condition`" :rules="dataInfoRules.condition" label-width="100px">
                    <div slot="label" class="slot_label">成色(品级)</div>
                    <el-input v-model="item.condition" placeholder="请输入成色（品级)" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item :prop="`dataInfo[${index}].count`" :rules="dataInfoRules.count" label-width="80px">
                    <div slot="label" class="slot_label">数量</div>
                    <el-input v-model="item.count" placeholder="请输入数量" class="width280" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :prop="`dataInfo[${index}].price`" :rules="dataInfoRules.price" label-width="100px">
                    <div slot="label" class="slot_label">价格</div>
                    <el-input v-model="item.price" placeholder="请输入价格" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-form-item prop="remark" label-width="80px">
                  <div slot="label" class="slot_label">备注</div>
                  <el-input v-model="item.remark" placeholder="请输入备注" clearable></el-input>
                </el-form-item>
              </el-row>
            </el-col>
          </el-row>
          <el-row class="textRight">
            <el-button
              type="text"
              @click="del(item)"
              v-if="evidenceExamInfo.dataInfo.length >1"
              class="colorRed"
            >删除</el-button>
            <el-button type="text danger" @click="add(item)">新增</el-button>
          </el-row>
        </div>
      </el-form>
    </div>
    <div class="dialog-footer" style="margin-top: 60px;text-align: right;padding-bottom:10px;">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成先行登记保存证据处理审批表</el-button>
    </div>
  </div>
</template>
<script>
import { getWritParams, dateFormat } from "@/utils/util";

export default {
  props: {
    info: {
      type: Object
    }
  },
  data() {
    return {
      evidenceExamInfo: {
        caseName: "",
        partyBasic: "", //当事人及基本情况
        caseBasic: "", //案件基本情况
        opinion: "", //呈递意见
        submitEvidence: "", //提请理由及依据
        dataInfo: [
          {
            ordeNumber: "1", //序号
            evidence: "", //证据名称
            model: "", //规格型号
            origin: "", //产地
            condition: "", //成色（品级）
            count: "", //数量
            price: "", //价格
            remark: "" //备注
          }
        ]
      },
      // v-for校验
      dataInfoRules: {
        evidence: [{ required: true, message: '请输入证据名称', trigger: 'blur' }],
        model: [{ required: true, message: '请输入规格型号', trigger: 'blur' }],
        origin: [{ required: true, message: '请输入产地', trigger: 'blur' }],
        condition: [{ required: true, message: '请输入成色（品级）', trigger: 'blur' }],
        count: [{ required: true, message: '请输入数量', trigger: 'blur' }],
        // unit: [{ required: true, message: '请输入单位', trigger: 'blur' }],
        price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
        remark: [{ required: false, message: '请输入备注', trigger: 'blur' }]
      },
      rules: {
        caseName: [
          { required: true, message: "请输入案件名称", trigger: "blur" }
        ],
        partyBasic: [
          { required: true, message: "请输入当事人及基本情况", trigger: "blur" }
        ],
        caseBasic: [
          { required: true, message: "请输入案件基本情况", trigger: "blur" }
        ],
        opinion: [
          { required: true, message: "请输入呈递意见", trigger: "blur" }
        ],
        submitEvidence: [
          { required: true, message: "请输入提请理由及依据", trigger: "blur" }
        ]
      }
    };
  },
  created() {
		if (this.info.writInfo) {
      let inputInfo = this.info.writInfo.reduce((total, item, index) => {
        switch (item.tagName) {
          case "tag2":
            total.caseName = item.tagContent;
						break;
					case "tag3":
            total.partyBasic = item.tagContent;
						break;
					case "tag4":
            total.caseBasic = item.tagContent;
						break;
					case "tag_proof":
            total.dataInfo = JSON.parse(item.tagContent);
            break;
          case "tag6":
            total.submitEvidence = item.tagContent;
						break;
					case "tag7":
            total.opinion = item.tagContent;
            break;
        }
        return total;
      }, {});
      this.evidenceExamInfo = inputInfo;
    } else {
      this.evidenceExamInfo.partyBasic = this.info.auditInfo.subject
    }
  },
  methods: {
    sure() {
      this.$refs.evidenceExamInfo.validate(val => {
        if (val) {
					let proof = this.evidenceExamInfo.dataInfo.reduce((total, item) => {
						total += `${item.ordeNumber}、${item.evidence},数量为${item.count}个;`;
						return total;
					}, '')
          let data = getWritParams({
            tag2: this.evidenceExamInfo.caseName,
            tag3: this.evidenceExamInfo.partyBasic,
            tag4: this.evidenceExamInfo.caseBasic,
            tag5: proof,
            tag6: this.evidenceExamInfo.submitEvidence,
            tag7: this.evidenceExamInfo.opinion, //承办人意见
            tag_proof: JSON.stringify(this.evidenceExamInfo.dataInfo)
          });
          let params = {
            contractorIds: this.info.auditInfo.udtIds,
            writType: "XXDJBCZJCLSPB",
            sourceId: this.info.auditInfo.sourceId,
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
    },
    del(item) {
      let index = this.evidenceExamInfo.dataInfo.indexOf(item);
      this.evidenceExamInfo.dataInfo.splice(index, 1);
      this.evidenceExamInfo.dataInfo.forEach((item, index) => {
        item.ordeNumber = (index + 1).toString();
      });
    },
    add(item) {
      this.evidenceExamInfo.dataInfo.push({
        ordeNumber: (this.evidenceExamInfo.dataInfo.length + 1).toString(), //序号
        evidence: "", //证据名称
        model: "", //规格型号
        origin: "", //产地
        condition: "", //成色（品级）
        count: "", //数量
        price: "", //价格
        remark: "" //备注
      });
    }
    // 点击确定按钮事件

    // 点击取消按钮事件
  }
};
</script>

<style lang="less" scoped>
.evidence-examine {
  padding: 0 16px;
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
  /deep/.el-form-item__label {
    white-space: nowrap !important;
  }
  .only {
    margin-bottom: 8px;
  }
}
.topDistance.topDistance {
  margin-top: 7px;
  margin-bottom: 2px;
}
.width280 {
  /deep/ .el-input__inner {
    width: 280px;
  }
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding-right: 16px;
  border-top: 1px solid #e0e0e0;
  padding-top: 10px;
  margin-top: 10px !important;
}
.textRight {
  text-align: right;
}
.colorRed {
  color: red;
}
</style>
