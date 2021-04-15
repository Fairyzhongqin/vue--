<template>
  <div>
    <div class="case-inform_content writ-overflow">
      <el-form
        ref="caseInformInfo"
        :model="caseInformInfo"
        label-width="105px"
        :rules="rules"
        :inline-message="true"
        :show-message="false"
        label-position="right"
      >
        <el-row>
          <el-form-item prop="caseName">
          <div slot="label" class="slot_label">案件名称</div>
            <el-input v-model="caseInformInfo.caseName" placeholder="请输入案件名称" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="auditItems" class="mt5">
          <div slot="label" class="slot_label">审批事项</div>
            <el-input
              class="vabo"
              v-model="caseInformInfo.auditItems"
              type="textarea"
              :autosize="{ minRows: 1 }"
              placeholder="请输入审批事项"
              clearable
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item prop="exerOpinion" class="mt5">
          <div slot="label" class="slot_label">承办人意见</div>
            <el-input
              type="textarea"
              :autosize="{ minRows: 1 }"
              v-model="caseInformInfo.exerOpinion"
              class="vabo"
              placeholder="请输入承办人意见"
              clearable
            ></el-input>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="dialog-footer" style="text-align: right;padding-bottom:10px;padding-top:10px;margin-top:10px">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure" :disabled="!isCreateAllowed">保存并生成案件告知审批表</el-button>
      <!-- <el-button type="primary" @click="goToAudit" :disabled="!isAuditAllowed">提交审核</el-button> -->
    </div>
  </div>
</template>

<script>
import { getWritParams } from '@/utils/util'
import { handleWritStatus } from '@/utils/audit'

export default {
  name: 'caseInform',
  props: ['info', 'isRecalled'],
  data() {
    return {
      caseInformInfo: {
        subject: '', // 当事人 tag1
        caseName: '', // 案件名称 tag2
        auditItems: '', // 审批事项 tag16Item 有多个
        exerOpinion: '' // 承办人意见 tag19
      },
      rules: {
        caseName: [{ required: true, message: '请输入案件名称', trigger: 'blur' }],
        auditItems: [{ required: true, message: '请输入审批事项', trigger: 'blur' }],
        exerOpinion: [{ required: true, message: '请输入承办人意见', trigger: 'blur' }]
      },
      isAuditAllowed: false,
      isCreateAllowed: false
    }
  },
  mounted() {
    this.initButtons()
    if (this.info.writInfo) {
      let udtIds = null,
        sourceId = null,
        time = [],
        auditItems = []
      let inputInfo = this.info.writInfo.reduce((total, item, index) => {
        switch (item.tagName) {
          case 'tag1':
            total.subject = item.tagContent
            break
          case 'tag2':
            total.caseName = item.tagContent
            break
          case 'tag16Item':
            auditItems.push(item.tagContent)
            break
          case 'tag19':
            total.exerOpinion = item.tagContent
            break
        }
        return total
      }, {})
      inputInfo.auditItems = auditItems.join('、')
      this.caseInformInfo = inputInfo
    } else {
      this.initInfo()
    }
  },
  methods: {
    // 设置按钮状态
    initButtons() {
      if (this.isRecalled === '1' && this.info.auditInfo.processVersion > this.info.writVersion) {
        // 当流程回退时 且审核审批信息为回退前
        this.isCreateAllowed = true
        return
      }
      let res = handleWritStatus(this.info.auditInfo.writId)
      res.then(data => {
        if (data) {
          this.isCreateAllowed = data.isCreateAllowed
          this.isAuditAllowed = data.isAuditAllowed
        }
      })
    },
    // 提交审核
    goToAudit() {
      let _audiReq = {
        auditTypeCode: 'ta80043', // 提交审核
        handlerDeptId: '', // 审核人部门 id
        handlerUserId: '', // 审核人
        requestDeptName: JSON.parse(localStorage.getItem('res')).userEntity.deptName, // 承办人部门，现在先不填
        requestId: this.info.auditInfo.writId, // 文书 writId
        requestTime: void 0,
        requestUsersName: this.info.auditInfo.responsiblePerson, // 承办人名称
        submitterCause: this.info.auditInfo.caseName // 案件名称
      }
      this.$emit('toSeal', _audiReq)
    },
    // 初始化文书数据
    initInfo() {
      this.caseInformInfo = {
        subject: this.info.auditInfo.subject, // 当事人
        caseName: this.info.auditInfo.caseName, // 案件名称
        auditItems: this.info.auditInfo.docNoNames, // 审批事项
        exerOpinion: this.info.auditInfo.handleSuggInfo // 承办人意见
      }
    },
    // 点击确定按钮事件
    sure() {
      this.$refs.caseInformInfo.validate(val => {
        if (val) {
          let data = getWritParams({
            tag2: this.caseInformInfo.caseName,
            tag19: this.caseInformInfo.exerOpinion
          })
          let arr = this.handleAuditItem(this.caseInformInfo.auditItems)
          let params = {
              companyId: this.info.auditInfo.companyId, //制作文书传company_id
            contractorIds: this.info.auditInfo.udtIds,
            writType: 'AJGZSPB',
            sourceId: this.info.auditInfo.sourceId,
            data: [...data, ...arr]
          }
          this.$emit('createWrit', params)
        } else {
          console.log('hhh')
        }
      })
    },
    // 生成文书时处理审批事项
    handleAuditItem(items) {
      let result = []
      let arr = items.split('、')
      arr.forEach(v => {
        result.push({
          tagName: 'tag16Item',
          tagContent: v
        })
      })
      return result
    },
    // 点击取消按钮事件
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.case-inform_content {
  padding: 10px 16px 0px 16px;
}
.el-form-item {
  margin-bottom: 0;
  white-space: nowrap;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #e0e0e0;
  padding: 5px 16px 5px 0;
  margin-top: 30px;
}
.el-col-11 {
  margin-right: 39px;
}
</style>
