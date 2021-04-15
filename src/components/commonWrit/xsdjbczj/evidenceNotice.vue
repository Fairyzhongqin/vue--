<template>
  <div class="evidenceNotice">
    <div class="content">
      <el-form ref="queryInformInfo" :model="queryInformInfo" label-width="115px" :rules="rules" label-position="left" :show-message="false">
        <el-row class="relateweifa">
          <el-form-item label="" prop="delict">
            <div slot="label" class="slot_label">涉嫌违法行为</div>
            <el-input v-model="queryInformInfo.delict" placeholder="请输入涉嫌违法行为" clearable type="textarea" autosize></el-input>
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="" prop="deadline">
              <div slot="label" class="slot_label">接收截止日期</div>
              <el-date-picker class="width330" v-model="queryInformInfo.deadline" type="date" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="executionAddress" label-width="130px">
              <div slot="label" class="slot_label">接受处理决定地址</div>
              <el-input placeholder="请输入保存地点" v-model="queryInformInfo.executionAddress" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-for="(item, index) in queryInformInfo.dataInfo" :key="index">
          <el-row :gutter="20">
            <el-col :span="3">
              <el-form-item label="" label-width="40px" prop="ordeNumber">
                <div slot="label" class="slot_label">序号</div>
                <el-input class="item_index" v-model="item.ordeNumber" placeholder="输入序号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="21">
              <el-row class="evidence-row">
                <el-col :span="11">
                  <el-form-item label="" :prop="`dataInfo[${index}].evidence`" label-width="80px" :rules="dataInfoRules.evidence">
                    <div slot="label" class="slot_label">证据名称</div>
                    <el-input v-model="item.evidence" placeholder="请输入证据名称" class="width280" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="" :prop="`dataInfo[${index}].model`" :rules="dataInfoRules.model">
                    <div slot="label" class="slot_label">规格型号</div>
                    <el-input v-model="item.model" placeholder="请输入规格型号" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="evidence-row">
                <el-col :span="11">
                  <el-form-item label="" label-width="80px" :prop="`dataInfo[${index}].origin`" :rules="dataInfoRules.origin">
                    <div slot="label" class="slot_label">产地</div>
                    <el-input v-model="item.origin" placeholder="请输入产地" class="width280" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="" :prop="`dataInfo[${index}].condition`" :rules="dataInfoRules.condition">
                    <div slot="label" class="slot_label">成色（品级）</div>
                    <el-input v-model="item.condition" placeholder="请输入成色（品级)" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="evidence-row">
                <el-col :span="11" class="mountAndUnit">
                  <el-form-item label="" label-width="80px" :prop="`dataInfo[${index}].count`" :rules="dataInfoRules.count">
                    <div slot="label" class="slot_label">数量</div>
                    <el-input v-model="item.count" placeholder="请输入数量" class="input-with-select" clearable>
                      <!--  <template slot="append">
                        <el-input v-model="item.unit" placeholder="请输入单位" class="width90" clearable></el-input>
                      </template>-->
                    </el-input>
                  </el-form-item>
                  <el-form-item label-width="0" :prop="`dataInfo[${index}].unit`" :rules="dataInfoRules.unit">
                    <el-input v-model="item.unit" placeholder="请输入单位" clearable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="" :prop="`dataInfo[${index}].price`" :rules="dataInfoRules.price">
                    <div slot="label" class="slot_label">价格</div>
                    <el-input v-model="item.price" placeholder="请输入价格" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-form-item label="" prop="remark" label-width="80px">
                  <div slot="label" class="slot_label">备注</div>
                  <el-input v-model="item.remark" placeholder="请输入备注" clearable></el-input>
                </el-form-item>
              </el-row>
            </el-col>
          </el-row>
          <el-row class="textRight">
            <el-button type="text" @click="del(item)" v-if="queryInformInfo.dataInfo.length > 1" class="colorRed">删除</el-button>
            <el-button type="text danger" @click="add(item)">新增</el-button>
          </el-row>
        </div>
      </el-form>
    </div>
    <div class="dialog-footer" style="margin-top: 60px;text-align: right;padding-bottom:10px">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成先行登记保存证据通知书</el-button>
    </div>
  </div>
</template>
<script>
import { getWritParams, dateFormat, stringToDate } from '@/utils/util'

export default {
  props: {
    info: {
      type: Object
    }
  },
  data() {
    return {
      queryInformInfo: {
        delict: '', //涉嫌违法行为
        deadline: null, //接收截止日期
        executionAddress: '', //接受处理决定地址
        //dataInfo
        dataInfo: [
          {
            ordeNumber: '1', //序号
            evidence: '', //证据名称
            model: '', //规格型号
            origin: '', //产地
            condition: '', //成色（品级）
            count: '', //数量
            unit: '', //单位
            price: '', //价格
            remark: '' //备注
          }
        ]
      },
      rules: {
        delict: [{ required: true, message: '请输入涉嫌违法行为', trigger: 'blur' }],
        executionAddress: [{ required: true, message: '请输入接受处理决定地址', trigger: 'blur' }],
        deadline: [{ required: true, message: '请输入接收截止日期', trigger: 'blur' }]
      },
      // v-for校验
      dataInfoRules: {
        evidence: [{ required: true, message: '请输入证据名称', trigger: 'blur' }],
        model: [{ required: true, message: '请输入规格型号', trigger: 'blur' }],
        origin: [{ required: true, message: '请输入产地', trigger: 'blur' }],
        condition: [{ required: true, message: '请输入成色（品级）', trigger: 'blur' }],
        count: [{ required: true, message: '请输入数量', trigger: 'blur' }],
        unit: [{ required: true, message: '请输入单位', trigger: 'blur' }],
        price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
        remark: [{ required: false, message: '请输入备注', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    if (this.info.writInfo) {
      let arr = []
      let inputInfo = this.info.writInfo.reduce((total, item, index) => {
        switch (item.tagName) {
          case 'tag3':
            total.delict = item.tagContent
            break
          case 'tag4':
            total.deadline = item.tagContent
              ? stringToDate(
                  item.tagContent
                    .replace('年', '-')
                    .replace('月', '-')
                    .replace('日', '')
                )
              : null
            break
          case 'tag5':
            total.executionAddress = item.tagContent
            break
        }
        return total
      }, {})
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
            arr[first].origin = item.tagContent
            break
          case 'col5':
            arr[first].condition = item.tagContent
            break
          case 'col6':
            arr[first].unit = item.tagContent
            break
          case 'col7':
            arr[first].price = item.tagContent
            break
          case 'col8':
            arr[first].count = item.tagContent
            break
          case 'col9':
            arr[first].remark = item.tagContent
            break
        }
      })
      inputInfo.dataInfo = arr
      this.queryInformInfo = inputInfo
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
          } else if (key === 'origin') {
            arr.push({
              tagContent: item[key],
              tagName: `entity${index + 1}-col4`
            })
          } else if (key === 'condition') {
            arr.push({
              tagContent: item[key],
              tagName: `entity${index + 1}-col5`
            })
          } else if (key === 'unit') {
            arr.push({
              tagContent: item[key],
              tagName: `entity${index + 1}-col6`
            })
          } else if (key === 'price') {
            arr.push({
              tagContent: item[key],
              tagName: `entity${index + 1}-col7`
            })
          } else if (key === 'count') {
            arr.push({
              tagContent: item[key],
              tagName: `entity${index + 1}-col8`
            })
          } else if (key === 'remark') {
            arr.push({
              tagContent: item[key],
              tagName: `entity${index + 1}-col9`
            })
          }
        }
      })
      return arr
    },
    sure() {
      this.$refs.queryInformInfo.validate(val => {
        if (val) {
          let data = getWritParams({
            tag2: this.info.auditInfo.subject, //单位
            tag3: this.queryInformInfo.delict,
            tag4: dateFormat(this.queryInformInfo.deadline, 'yyyy年mm月dd日'),
            tag5: this.queryInformInfo.executionAddress
          })
          let dataInfo = this.handleEvidence()
          data = data.concat(dataInfo)
          let params = {
            companyId: this.info.auditInfo.companyId, //执法检查模块制作文书传company_id
            contractorIds: this.info.auditInfo.udtIds,
            writType: 'XXDJBCZJTZS',
            sourceId: this.info.auditInfo.sourceId,
            data: data
          }
          this.$emit('createWrit', params)
        } else {
          console.log('error submit')
        }
      })
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
        origin: '', //产地
        condition: '', //成色（品级）
        count: '', //数量
        unit: '', //单位
        price: '', //价格
        remark: '' //备注
      })
    }
  }
}
</script>

<style lang="less" scoped>
.evidenceNotice {
  /deep/.el-form-item__content .el-input-group {
    vertical-align: middle;
  }
  /deep/.el-form-item__label {
    white-space: nowrap;
  }
  .evidence-row {
    display: flex;
    /deep/ .el-col-12 {
      flex-grow: 1;
    }
  }
  .content {
    padding: 0 16px;
    /deep/ .el-form-item {
      margin-bottom: 0;
    }
  }
  .relateweifa {
    margin-top: 10px;
  }

  .width90 {
    /deep/ .el-input__inner {
      width: 120px;
      border-radius: 0% 6% 6% 0%;
    }
  }
  .input-with-select {
    /deep/ .el-input-group__append,
    .el-input-group__prepend {
      background-color: #fff;
      border: 0;
      padding: 0;
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
    margin-top: 10px !important;
  }
  .el-col-11 {
    margin-right: 23px;
  }
  .mountAndUnit {
    display: flex;
  }
  .el-col-10 {
    margin-right: 54px;
  }
  /deep/.el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
  /deep/.el-input.item_index > .el-input__inner {
    width: 40px;
    height: auto;
  }
}
</style>
