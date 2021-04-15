<template>
  <div>
    <div class="seizureList_content">
      <el-form
        ref="seizureList"
        :model="queryInformInfo"
        :rules="rules"
        label-position="left"
        :show-message="false"
      >
        <!--  :hide-required-asterisk="true"    :inline-message="true"-->
        <div v-for="(item,index) in queryInformInfo.dataInfo" :key="index">
          <el-row>
            <el-col :span="3">
              <el-form-item label="编号" class="flexMargin" label-width="50px">
                <el-input
                  class="widthStyle"
                  v-model="item.ordeNumber"
                  placeholder="输入序号"
                  clearable
                  :disabled="true"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-row>
                <el-col :span="10">
                  <el-form-item
                    :prop="'dataInfo.' + index + '.evidence'"
                    label-width="80px"
                    :rules="rules.evidence"
                  >
                    <div slot="label" class="slot_label" style="width:55%">名称</div>
                    <el-input
                      v-model="item.evidence"
                      placeholder="请输入证据名称"
                      class="width280"
                      clearable
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label=""
                    :prop="'dataInfo.' + index + '.model'"
                    :rules="rules.model"
                    label-width="188px"
                  >
                    <div slot="label" class="slot_label" style="width:80%">规格（型号）或者地址</div>
                    <el-input
                      v-model="item.model"
                      placeholder="请输入规格型号或者地址"
                      class="width280"
                      clearable
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-form-item
                    label=""
                    :prop="'dataInfo.' + index + '.company'"
                    :rules="rules.company"
                    label-width="80px"
                  >
                    <div slot="label" class="slot_label" style="width:55%">单位</div>
                    <el-input v-model="item.company" placeholder="请输入单位" class="width280" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label=""
                    :prop="'dataInfo.' + index + '.count'"
                    :rules="rules.count"
                    label-width="188px"
                  >
                    <div slot="label" class="slot_label" style="width:80%">数量或者面积</div>
                    <el-input
                      v-model="item.count"
                      placeholder="请输入数量或者面积"
                      class="width280"
                      clearable
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-form-item
                  label=""
                  :prop="'dataInfo.' + index + '.remark'"
                  :rules="rules.remark"
                  label-width="80px"
                >
                  <div slot="label" class="slot_label" style="width:55%">备注</div>
                  <el-input v-model="item.remark" placeholder="请输入备注" class="w788" clearable></el-input>
                </el-form-item>
              </el-row>
            </el-col>
          </el-row>
          <el-row class="textRight">
            <el-button
              type="text"
              @click="del(item)"
              v-if="queryInformInfo.dataInfo.length >1"
              class="colorRed"
            >删除</el-button>
            <el-button type="text danger" @click="add(item)">新增</el-button>
          </el-row>
        </div>
      </el-form>
    </div>
    <div class="dialog-footer" style="text-align: right;padding-bottom:10px;">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成查封扣押（场所、设施、财物）清单</el-button>
    </div>
  </div>
</template>
<script>
import { getWritParams, dateFormat } from '@/utils/util'

export default {
  props: {
    info: {
      type: Object
    }
  },
  data() {
    return {
      queryInformInfo: {
        dataInfo: [
          {
            ordeNumber: '1', //序号
            evidence: '', //证据名称
            model: '', //规格型号
            company: '', //单位
            count: '', //数量
            remark: '' //备注
          }
        ]
      },
      rules: {
        ordeNumber: [{ required: true }],
        evidence: [{ required: true, message: '请输入证据名称', trigger: 'blur' }],
        model: [{ required: true, message: '请输入规格型号', trigger: 'blur' }],
        company: [{ required: true, message: '请输入单位', trigger: 'blur' }],
        count: [{ required: true, message: '请输入数量', trigger: 'blur' }],
        remark: [{ required: false, message: '如有需要请输入备注', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    if (this.info.writInfo) {
      let arr = []
      this.info.writInfo.forEach(item => {
        let first = Number(item.tagName.split('-')[0].slice(6)) - 1,
          second = item.tagName.split('-')[1]
        if (!arr[first]) {
          arr[first] = {}
        }
        switch (second) {
          case 'col1':
            arr[first].ordeNumber = item.tagContent
            break
          case 'col2':
            arr[first].evidence = item.tagContent
            break
          case 'col3':
            arr[first].model = item.tagContent
            break
          case 'col4':
            arr[first].company = item.tagContent
            break
          case 'col5':
            arr[first].count = item.tagContent
            break
          case 'col6':
            arr[first].remark = item.tagContent
            break
        }
      })
      this.queryInformInfo.dataInfo = arr
    }
  },
  methods: {
    handleEvidence() {
      let arr = []
      this.queryInformInfo.dataInfo.map((item, index) => {
        for (let key in item) {
          if (key === 'ordeNumber') {
            arr.push({
              tagContent: item[key],
              tagName: `entity${index + 1}-col1`
            })
          } else if (key === 'evidence') {
            arr.push({
              tagContent: item[key],
              tagName: `entity${index + 1}-col2`
            })
          } else if (key === 'model') {
            arr.push({
              tagContent: item[key],
              tagName: `entity${index + 1}-col3`
            })
          } else if (key === 'company') {
            arr.push({
              tagContent: item[key],
              tagName: `entity${index + 1}-col4`
            })
          } else if (key === 'count') {
            arr.push({
              tagContent: item[key],
              tagName: `entity${index + 1}-col5`
            })
          } else if (key === 'remark') {
            arr.push({
              tagContent: item[key],
              tagName: `entity${index + 1}-col6`
            })
          }
        }
      })
      return arr
    },
    sure() {
      this.$refs.seizureList.validate(val => {
        console.log('清单')
        if (val) {
          let data = this.handleEvidence()
          let params = {
              companyId: this.info.auditInfo.companyId, //执法检查模块制作文书传company_id
            contractorIds: this.info.auditInfo.udtIds,
            writType: 'CFKYQD',
            sourceId: this.info.auditInfo.sourceId,
            data: data
          }
          this.$emit('createWrit', params)
        } else {
          console.info('error submit')
        }
      })
      // let data = this.handleEvidence()
      // let params = {
      //   contractorIds: this.info.auditInfo.udtIds,
      //   writType: 'CFKYQD',
      //   sourceId: this.info.auditInfo.sourceId,
      //   data: data
      // }
      // this.$emit('createWrit', params)
    },
    // 点击取消按钮事件
    close() {
      this.$emit('close')
    },
    del(item) {
      let index = this.queryInformInfo.dataInfo.indexOf(item)
      this.queryInformInfo.dataInfo.splice(index, 1)
      this.queryInformInfo.dataInfo.forEach((item, index) => {
        item.ordeNumber = (index + 1).toString()
      })
    },
    add(item) {
      this.queryInformInfo.dataInfo.push({
        ordeNumber: (this.queryInformInfo.dataInfo.length + 1).toString(), //序号
        evidence: '', //证据名称
        model: '', //规格型号
        count: '', //数量
        remark: '' //备注
      })
    }
  }
}
</script>

<style lang="less" scoped>
.seizureList_content {
  padding: 16px;
  overflow-y: auto;
  max-height: 300px;
  /deep/ .el-form-item {
    margin-bottom: 0;
  }
  /deep/.el-form-item__label {
    color: #333 !important;
  }
}
.flexMargin {
  margin: 0;
  display: flex;
  flex-direction: column;
  /deep/ .el-form-item__content {
    margin: 0 !important;
  }
}
.widthStyle {
  /deep/ .el-input__inner {
    width: 76px;
    height: 74px;
  }
}
// .width280 {
//   /deep/ .el-input__inner {
//     width: 280px;
//   }
// }
// .w788 {
//   /deep/ .el-input__inner {
//     width: 788px;
//   }
// }
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
  margin-top: 30px;
}
/deep/.el-col-12 {
  width: 54%;
}
/deep/.el-col-10 {
  margin-right: 22px;
}
</style>
