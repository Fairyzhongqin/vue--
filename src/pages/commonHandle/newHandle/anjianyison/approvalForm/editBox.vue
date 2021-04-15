<template>
  <div class="penalty-bottom_button approval_form_content">
    <el-form
      label-width="100px"
      label-position="left"
      :inline-message="true"
      :show-message="false"
      :rules="rules"
      :model="apprData"
      ref="apprForm"
    >
      <el-row :gutter="20">
        <el-col v-for="(item, index) in dataList" :key="index" :sm="24" :md="item.span">
          <el-form-item :class="item.class" :prop="item.codeName">
            <div slot="label" class="slot_label">{{item.label}}</div>
            <component
              :is="item.component"
              v-model="apprData[item.codeName]"
              :type="item.type"
              :placeholder="item.placeholder"
              :class="item.class === 'mt5' ? 'vab' : ''"
              autosize
            >
              <span v-if="item.component == 'div'">{{apprData[item.codeName]}}</span>
            </component>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <bottom-bar>
      <el-button class="app_end penalty-small_button" @click="goBack">取消</el-button>
      <el-button class="penalty-small_button" type="primary" @click="save">保存并生成案件移送审批表</el-button>
    </bottom-bar>
  </div>
</template>
<script>
import bottomBar from '@/components/bottomBar'
import { getWritParams, dateFormat } from '@/utils/util'
import { createWrit, updateWrit, getWritDataByWritId } from '@api/fileRelated'

export default {
  name: 'approvalFormEdit',
  components: {
    bottomBar
  },
  props: ['writInfo'],
  data() {
    return {
      rules: {
        receiver: [{ required: true, message: '请输入受移送机关', trigger: 'blur' }],
        address: [{ required: true, message: '请输入法律依据', trigger: 'blur' }],
        caseInfo: [{ required: true, message: '请输入移送理由', trigger: 'blur' }],
        transReason: [{ required: true, message: '请输入移送理由', trigger: 'blur' }],
        suggestion: [{ required: true, message: '请输入移送理由', trigger: 'blur' }]
      },
      dataList: [
        {
          label: '案件名称',
          value: '江阴市清扬浩辰塑料制品有限公司',
          component: 'div',
          codeName: 'caseName',
          span: 24,
          class: 'appr_line'
        },
        {
          label: '案由',
          value: '安全生产规章制度类违法',
          component: 'div',
          codeName: 'caseReasonNames',
          span: 24,
          class: 'appr_line'
        },
        {
          codeName: 'subject',
          label: '当事人',
          value: '江阴市清扬浩辰塑料制品有限公司',
          component: 'div',
          span: 24,
          class: 'appr_line'
        },
        {
          codeName: 'receiver',
          label: '接收单位',
          value: '',
          component: 'el-input',
          placeholder: '输入接收单位',
          span: 24
        },
        {
          codeName: 'address',
          label: '地址',
          value: '江阴市啥啥区幸福大道252号清扬村二组',
          component: 'el-input',
          placeholder: '输入地址',
          span: 24
        },
        {
          codeName: 'caseInfo',
          label: '案件简介',
          value: '',
          component: 'el-input',
          type: 'textarea',
          class: 'vam',
          placeholder: '输入案件简介',
          span: 24
        },
        {
          codeName: 'transReason',
          label: '移送理由',
          value: '',
          class: 'mt5',
          component: 'el-input',
          type: 'textarea',
          placeholder: '输入移送理由',
          span: 24
        },
        {
          codeName: 'suggestion',
          label: '承办意见',
          value: '',
          class: 'mt5',
          component: 'el-input',
          type: 'textarea',
          placeholder: '输入承办意见',
          span: 24
        }
      ],
      apprData: {
        caseName: '', // 案件名称
        caseReasonNames: '', // 案由
        receiver: '', // 接收单位
        subject: '', // 当事人
        address: '', // 地址
        caseInfo: '', // 案件简介
        transReason: '', // 移送理由
        suggestion: '' // 承办意见
      }
    }
  },
  created() {
    if (this.writInfo && this.writInfo.writId) {
      this.reflect()
    } else {
      this.initInfo()
    }
  },
  methods: {
    initInfo() {
      let _penalty = this.$store.state.penalty
      this.apprData = {
        caseName: _penalty.penaltyUndEntity.caseName, // 案件名称
        caseReasonNames: _penalty.caseReasonNames, // 案由
        receiver: '', // 接收单位
        subject: _penalty.penaltyUndEntity.objectType === '0' ? _penalty.punishCompanyName : _penalty.penaltyUndEntity.punishPersonName, // 当事人
        address: _penalty.penaltyUndEntity.objectAddress, // 地址
        caseInfo: '', // 案件简介
        transReason: '', // 移送理由
        suggestion: '' // 承办意见
      }
    },
    // 文书回显
    reflect() {
      getWritDataByWritId({ writId: this.writInfo.writId }).then(res => {
        let inputInfo = res.data.reduce((total, item) => {
          switch (item.tagName) {
            case 'tag2':
              total.caseReasonNames = item.tagContent
              break
            case 'tag3':
              total.subject = item.tagContent
              break
            case 'tag4':
              total.address = item.tagContent
              break
            case 'tag5':
              total.receiver = item.tagContent
              break
            case 'tag6':
              total.caseInfo = item.tagContent
              break
            case 'tag7':
              total.transReason = item.tagContent
              break
            case 'tag8':
              total.suggestion = item.tagContent
              break
          }
          return total
        }, {})
        this.apprData = inputInfo
        this.apprData.caseName = this.$store.state.penalty.penaltyUndEntity.caseName
      })
    },
    // 制作案件移送审批表
    save() {
      this.$refs.apprForm.validate(val => {
        if (val) {
          let data = getWritParams({
            tag2: this.apprData.caseReasonNames,
            tag3: this.apprData.subject,
            tag4: this.apprData.address,
            tag5: this.apprData.receiver,
            tag6: this.apprData.caseInfo,
            tag7: this.apprData.transReason,
            tag8: this.apprData.suggestion
          })
          let params = {
              companyId: this.$store.state.penalty.penaltyUndEntity.punishCompanyId, //制作文书传company_id
            contractorIds: this.$store.state.penalty.penaltyUndEntity.udtIds,
            writType: 'AJYSSPB',
            sourceId: this.$store.state.penalty.penaltyUndEntity.penaltyId,
            data: data
          }

          if (this.writInfo && this.writInfo.writId) {
            updateWrit({ writId: this.writInfo.writId }, params.data).then(
              res => {
                this.getMessage('success', '制作成功！')
                this.$parent.initInfo('afterCreated')
              },
              err => {
                this.getMessage('error', '制作失败！')
              }
            )
          } else {
            createWrit(params).then(
              res => {
                this.getMessage('success', '制作成功！')
                this.$parent.initInfo('afterCreated')
              },
              err => {
                this.getMessage('error', '制作失败！')
              }
            )
          }
        } else {
          this.getMessage('warning', '还有必填项没有填写！')
        }
      })
    },
    getMessage(type, message) {
      this.$message({
        type: type,
        message: message
      })
    },
    goBack() {
      this.$parent.initInfo()
    }
  }
}
</script>
<style lang="less" scope>
.approval_form_content {

  /deep/ .el-form-item {
    margin-bottom: 0px;
  }
}

.mt5.el-form-item .el-form-item__content {
  line-height: 9px;
}
.penalty-bottom_button {
  /deep/ .bottom-button-container {
    right: 0;
  }
  .app_end {
    background: white;
  }
  &.approval_form_content {
    padding: 3px 16px 0;
  }
}
</style>
