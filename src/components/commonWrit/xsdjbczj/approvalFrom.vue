<template>
  <div>
    <div class="approval-from">
      <el-form
        ref="queryInformInfo"
        :model="queryInformInfo"
        :rules="rules"
        label-width="95px"
        label-position="left"
        :show-message="false"
      >
        <el-row class="caseNameone">
          <el-form-item label="" prop="caseName">
            <div slot="label" class="slot_label">案件名称</div>
            <el-input
              v-model="queryInformInfo.caseName"
              placeholder="请输入案件名称"
              clearable
              type="textarea"
              autosize
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="radio">
            <div slot="label" class="slot_label">保存方式</div>
              <el-radio v-model="queryInformInfo.radio" label="原地保存">原地保存</el-radio>
              <el-radio v-model="queryInformInfo.radio" label="异地保存">异地保存</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="saveSite" v-if="queryInformInfo.radio === '异地保存'">
            <div slot="label" class="slot_label">保存地点</div>
              <el-input placeholder="请输入保存地点" v-model="queryInformInfo.saveSite" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row> 
        <el-row>
          <el-form-item prop="partyBasic" class="only" label-width="160px">
            <div slot="label" class="slot_label">当事人及基本情况</div>
            <el-input
              v-model="queryInformInfo.partyBasic"
              placeholder="请输入当事人及基本情况，比如单位名称、代表人、地址、电话"
              clearable
              type="textarea"
              :autosize="{ minRows: 2}"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row class="only">
          <el-form-item prop="caseBasic" label-width="160px">
            <div slot="label" class="slot_label">案件基本情况</div>
            <el-input
              v-model="queryInformInfo.caseBasic"
              placeholder="请输入案件基本情况"
              clearable
              type="textarea"
              :autosize="{ minRows: 2}"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row class="only">
          <el-form-item prop="evidence" label-width="160px">
            <div slot="label" class="slot_label">证据名称及数量</div>
            <el-input
              v-model="queryInformInfo.evidence"
              placeholder="请输入证据名称及数量"
              clearable
              type="textarea"
              :autosize="{ minRows: 2}"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row class="only">
          <el-form-item prop="submitEvidence" label-width="160px">
            <div slot="label" class="slot_label">提请理由及依据</div>
            <el-input
              v-model="queryInformInfo.submitEvidence"
              placeholder="请输入提请理由及依据"
              clearable
              type="textarea"
              :autosize="{ minRows: 2}"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="contractorIdea" label-width="160px">
            <div slot="label" class="slot_label">承办人意见</div>
            <el-input
              v-model="queryInformInfo.contractorIdea"
              placeholder="请输入承办人意见"
              clearable
              type="textarea"
              autosize
            ></el-input>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="dialog-footer" style="text-align: right;padding-bottom:10px">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成先行登记保存证据审批表</el-button>
    </div>
  </div>
</template>
<script>
import { getWritParams, dateFormat } from '@/utils/util'
import Bus from '@/bus'
import selectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople'
export default {
  components: {
    selectPeople
  },
  props: {
    info: {
      type: Object
    }
  },
  data() {
    return {
      queryInformInfo: {
        caseName: '', //案件名称
        radio: '原地保存', //保存方式
        saveSite: '', //保存地点
        partyBasic: '', //当事人及基本情况
        caseBasic: '', //案件基本情况
        evidence: '', //证据名称及数量
        submitEvidence: '', //提请理由及依据
        contractorIdea: '' //承办人意见
      },
      rules: {
        caseName: [{ required: true, message: '请输入案件名称', trigger: 'blur' }],
        saveSite: [{ required: true, message: '请输入保存地点', trigger: 'blur' }],
        partyBasic: [{ required: true, message: '请输入当事人及基本情况', trigger: 'blur' }],
        caseBasic: [{ required: true, message: '请输入案件基本情况', trigger: 'blur' }],
        evidence: [{ required: true, message: '请输入证据名称及数量', trigger: 'blur' }],
        submitEvidence: [{ required: true, message: '请输入提请理由及依据', trigger: 'blur' }],
        contractorIdea: [{ required: true, message: '请输入承办人意见', trigger: 'blur' }]
      },
      chooseXXDJPeople: false,
      submitId: '',
      sealAuditPeopleId: '',
      sealAuditPeopleDeptId: '',
      sealAuditPeopleDeptName: ''
    }
  },
  created() {
    if (this.info.writInfo) {
      let udtIds = null,
        sourceId = null,
        time = []
      let inputInfo = this.info.writInfo.reduce((total, item, index) => {
        switch (item.tagName) {
          case 'tag2':
            total.caseName = item.tagContent
            break
          case 'tag3':
            total.partyBasic = item.tagContent
            break
          case 'tag4':
            total.caseBasic = item.tagContent
            break
          case 'tag5':
            total.evidence = item.tagContent
            break
          case 'tag6':
            total.submitEvidence = item.tagContent
            break
          case 'tag7':
            total.radio = item.tagContent.substring(0, 4)
            break
          case 'tag8':
            total.contractorIdea = item.tagContent
            break
          case 'tag9':
            total.saveSite = item.tagContent
            break
        }
        return total
      }, {})
      this.queryInformInfo = inputInfo
    } else {
      this.initInfo()
    }
  },
  methods: {
    // 初始化
    initInfo() {
      this.queryInformInfo.partyBasic = this.info.auditInfo.subject
    },
    // 点击确定按钮事件
    sure() {
      this.$refs.queryInformInfo.validate(val => {
        if (val) {
          let data = getWritParams({
            tag2: this.queryInformInfo.caseName,
            tag3: this.queryInformInfo.partyBasic,
            tag4: this.queryInformInfo.caseBasic,
            tag5: this.queryInformInfo.evidence,
            tag6: this.queryInformInfo.submitEvidence,
            tag7: this.queryInformInfo.radio === '原地保存' ? this.queryInformInfo.radio : this.queryInformInfo.radio + '至',
            tag8: this.queryInformInfo.contractorIdea,
            tag9: this.queryInformInfo.radio === '原地保存' ? '' : this.queryInformInfo.saveSite
          })
          let params = {
              companyId: this.info.auditInfo.companyId, //执法检查模块制作文书传company_id
            contractorIds: this.info.auditInfo.udtIds,
            writType: 'XXDJBCZJSPB',
            sourceId: this.info.auditInfo.sourceId,
            data: data
          }
          console.info('先行登记保存证据审批表', params)
          this.$emit('createWrit', params)
        } else {
          console.log('hhh')
        }
      })
    },
    // 点击取消按钮事件
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.approval-from {
  padding: 2px 16px 0px 16px;
  .caseNameone {
    margin-top: 10px;
  }
  /deep/ .el-form-item {
    margin-bottom: 4px;
  }
  /deep/.el-form-item__label {
    white-space: nowrap;
    color: #333 !important;
  }
  /deep/.el-form-item__label:before {
    // content: '' !important;
    // margin-right: 0 !important;
  }
}
.only {
  /deep/ .el-form-item__label {
    line-height: 24px;
    padding: 0;
    white-space: normal;
  }
  /deep/ .el-input > .el-input__inner {
    height: 52px;
  }
  /deep/ .el-input__inner {
    padding: 0 15px 15px 15px;
  }
}
.saveMethod {
  margin-right: 4px;
  color: #f56c6c !important;
  font-style: normal;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding-right: 16px;
  border-top: 1px solid #e0e0e0;
  padding-top: 10px;
  // margin-top: 5px;
}
</style>
