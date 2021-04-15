<template>
  <div>
    <div class="hear-notice_content writ-overflow">
      <el-form ref="notice" :model="notice" :rules="rules" :show-message="false" label-width="160px" label-position="right">
        <el-form-item label="" prop="caseName">
              <div slot="label" class="slot_label">案件名称</div>
          <el-input v-model="notice.caseName" placeholder="案件名称"></el-input>
        </el-form-item>
        <el-form-item label="" prop="unit">
              <div slot="label" class="slot_label">受送达单位/个人</div>
          <el-input v-model="notice.unit" placeholder="受送达单位（个人）"></el-input>
        </el-form-item>

        <div v-for="(item, index) in notice.dataInfo" :key="index">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="" :prop="`dataInfo[${index}].name`" :rules="dataInfoRules.name">
              <div slot="label" class="slot_label">送达文书编号</div>
                <el-input v-model="item.name" placeholder="送达文书编号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="" :prop="`dataInfo[${index}].way`">
              <div slot="label" class="slot_label">送达方式</div>
                <el-select v-model="item.way">
                  <el-option label="直接送达" value="直接送达"></el-option>
                  <el-option label="委托送达" value="委托送达"></el-option>
                  <el-option label="邮寄送达" value="邮寄送达"></el-option>
                  <el-option label="留置送达" value="留置送达"></el-option>
                  <el-option label="公告送达" value="公告送达"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="" :prop="`dataInfo[${index}].address`" :rules="dataInfoRules.address">
              <div slot="label" class="slot_label">送达地点</div>
                <el-input v-model="item.address" placeholder="送达地点"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="">
              <div slot="label" class="slot_label">送达日期</div>
                <el-date-picker v-model="item.date" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row class="textRight">
            <el-button type="text" @click="del(item)" v-if="notice.dataInfo.length > 1" class="colorRed">删除</el-button>
            <el-button type="text danger" v-if="index === notice.dataInfo.length - 1" @click="add(item)">新增</el-button>
          </el-row> -->
        </div>
        <el-form-item label="" class="mt5" prop="remark">
              <div slot="label" class="slot_label">备注</div>
          <el-input v-model="notice.remark" class="vab" type="textarea" :autosize="{ minRows: 1 }" placeholder="备注"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <div class="dialog-footer" style="text-align: right">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成延期（分期）缴纳罚款送达回执</el-button>
      <!-- <el-button type="primary" @click="lawSeal" :disabled="lawDisabled">加盖执法专用章</el-button> -->
    </div>
  </div>
</template>
<script>
import { getWritParams, dateFormat, reflectEntity, getFirstErrMsg } from "@/utils/util";
import { sealWrit } from "@/api/fileRelated";
export default {
  props: ["info", "isRecalled"],
  data() {
    return {
      lawDisabled: false,
      notice: {
        caseName: "", //案件名称
        unit: "", //单位
        remark: "", //备注
        dataInfo: [
          {
            name: "", //送达文书名称、文号
            people: "", //收件人签名或者盖章
            address: "", //送达地点
            date: "", //送达日期
            way: "", //送达方式
            server: "" //送达人
          }
        ]
      },
      rules: {
        caseName: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入案件名称'
          }
        ],
        unit: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入受送达单位/个人'
          }
        ]
      },
      dataInfoRules: {
        name: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入送达文书编号'
          }
        ],
        address: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入送达地点'
          }
        ],
        date: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入送达日期'
          }
        ],
        way: [
          {
            required: true,
            trigger: 'blur',
            message: '请选择送达方式'
          }
        ]
      }
    };
  },
  created() {
    if (this.info.writInfo) {
      this.reflect();
    } else {
      this.initInfo();
    }
  },
  methods: {
    handleEvidence() {
      let arr = [];
      this.notice.dataInfo.map((item, index) => {
        for (let key in item) {
          if (key === "name") {
            arr.push({
              tagContent: item[key],
              tagName: `entity${index + 1}-col1`
            });
          } else if (key === "address") {
            arr.push({
              tagContent: item[key],
              tagName: `entity${index + 1}-col2`
            });
          } else if (key === "people") {
            arr.push({
              tagContent: item[key],
              tagName: `entity${index + 1}-col5`
            });
          } else if (key === "date") {
            arr.push({
              tagContent: dateFormat(item[key], "yyyy年mm月dd日"),
              tagName: `entity${index + 1}-col3`
            });
        } else if (key === "way") {
            arr.push({
              tagContent: item[key],
              tagName: `entity${index + 1}-col4`
            });
          } else if (key === "server") {
            arr.push({
              tagContent: item[key],
              tagName: `entity${index + 1}-col6`
            });
          }
        }
      });
      return arr;
    },
    sure() {
      this.$refs.notice.validate((val,errInfo) => {
        if (val) {
          let data = getWritParams({
            tag2: this.notice.caseName,
            tag3: this.notice.unit,
            tag10: this.notice.remark
          });
          let dataInfo = this.handleEvidence();
          data = data.concat(dataInfo);
          let params = {
              companyId: this.info.auditInfo.companyId,//执法检查模块制作文书传company_id
            contractorIds: this.info.auditInfo.udtIds,
            writType: "YQFQJNFKSDHZ",
            sourceId: this.info.auditInfo.sourceId,
            data: data
          };
          this.$emit("createWrit", params);
        } else {
          this.$message({
            type: 'error',
            message: getFirstErrMsg(errInfo)
          })
        }
      });
    },
    // 提交盖执法章
    lawSeal() {
      sealWrit({
        writId: this.info.auditInfo.writId,
        signType: "SINGLE_LAW"
      })
        .then(res => {
          if (res.code === "0") {
            this.$message({
              message: "加盖执法专用章成功",
              type: "success"
            });
            this.lawDisabled = true;
            this.$emit("toLawSeal");
          }
        })
        .catch(err => {
          this.$message({
            message: err,
            type: "warning"
          });
        });
    },
    // 点击取消按钮事件
    close() {
      this.$emit("close");
    },
    add(item) {
      this.notice.dataInfo.push({
        name: "", //送达文书名称、文号
        people: "", //收件人签名或者盖章
        address: "", //送达地点
        date: "", //送达日期
        way: "", //送达方式
        server: "" //送达人
      });
    },
    del(item) {
      let index = this.notice.dataInfo.indexOf(item);
      this.notice.dataInfo.splice(index, 1);
    },
    // 文书回显
    reflect() {
      let entityArr = [],
        fieldArr = ["name", "address", "date", "way", "people"];
      let inputInfo = this.info.writInfo.reduce((total, item) => {
        switch (item.tagName) {
          case "tag2":
            total.caseName = item.tagContent;
            break;
          case "tag3":
            total.unit = item.tagContent;
            break;
          case "tag10":
            total.remark = item.tagContent;
            break;
          default:
            entityArr.push(item);
        }
        return total;
      }, {});
      inputInfo.dataInfo = reflectEntity(entityArr, fieldArr);
      this.notice = inputInfo;
    },
    initInfo() {
      this.info.auditInfo.docList.map(item => {
        if (item.writTypeName == "YQJNFKPZS") {
          this.notice.dataInfo[0].name = item.writNoName;
          this.$set(this.notice.dataInfo);
        }
      });
      let user = JSON.parse(localStorage.getItem("res"));
      let _penalty = this.$store.state.penalty;
      this.notice.unit = this.info.auditInfo.subject;
      this.notice.caseName = this.info.auditInfo.caseName;
      //  + "案";
    }
  }
};
</script>

<style lang="less" scoped>
.hear-notice_content {
  padding: 0 16px;
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
  /deep/ .el-select.el-select {
    width: 100%;
  }
  /deep/ .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
}
.textRight {
  text-align: right;
}
.colorRed {
  color: red;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding-right: 16px;
  border-top: 1px solid #e0e0e0;
  padding-top: 10px;
}
</style>
