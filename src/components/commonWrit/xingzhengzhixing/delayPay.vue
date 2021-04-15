<template>
  <div class="delay-pay_content">
    <el-form ref="delayPay" :model="delayInfo" label-width="190px" label-position="right" :rules="rules" :show-message="false">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="" prop="caseName">
              <div slot="label" class="slot_label">案件名称</div>
            <el-input v-model="delayInfo.caseName" placeholder="请输入案件名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="" prop="subject">
              <div slot="label" class="slot_label">当事人</div>
            <el-input v-model="delayInfo.subject" placeholder="请输入当事人"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="" prop="writNoName">
              <div slot="label" class="slot_label">处罚决定书编号</div>
            <el-input v-model="delayInfo.writNoName" placeholder="请输入处罚决定书文号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="" prop="address">
              <div slot="label" class="slot_label">地址</div>
            <el-input v-model="delayInfo.address" placeholder="请输入当事人地址"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="" prop="illeAndDecision">
              <div slot="label" class="slot_label">违法事实及处罚决定</div>
          <el-input
            type="textarea"
            v-model="delayInfo.illeAndDecision"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入违法事实及处罚决定："
          ></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="" prop="reason">
              <div slot="label" class="slot_label">延期缴纳罚款理由</div>
          <el-input type="textarea" v-model="delayInfo.reason" placeholder="请输入延期缴纳罚款理由" :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="" prop="suggestion">
              <div slot="label" class="slot_label">承办人意见</div>
          <el-input type="textarea" v-model="delayInfo.suggestion" placeholder="请输入延期缴纳罚款理由" :autosize="{ minRows: 2 }"></el-input>
        </el-form-item>
      </el-row>
    </el-form>
    <div class="dialog-footer" style="text-align: right">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成延期（分期）缴纳罚款审批表</el-button>
      <!-- <el-button type="primary" @click="seal" :disabled="!isAuditAllowed">提交审核</el-button> -->
    </div>
  </div>
</template>
<script>
import { getWritParams, getFirstErrMsg } from '@/utils/util'
import { getWritInfo, getWritDataByWritId } from '@api/fileRelated'
export default {
  props: ['info'],
  data() {
    return {
      rules: {
        caseName: [{ required: true, trigger: 'blur', message: '请输入案件名称' }],
        subject: [{ required: true, trigger: 'blur', message: '请输入当事人' }],
        writNoName: [{ required: true, trigger: 'blur', message: '请输入处罚决定书文号' }],
        address: [{ required: true, trigger: 'blur', message: '请输入地址' }],
        illeAndDecision: [{ required: true, trigger: 'blur', message: '请输入违法事实及处罚决定：' }],
        reason: [{ required: true, trigger: 'blur', message: '请输入延期缴纳罚款理由' }],
        suggestion: [{ required: true, trigger: 'blur', message: '承办人意见' }]
      },
      delayInfo: {
        caseName: '', // 案件名称: tag2
        writNoName: '', // 处罚决定书文号：tag3
        subject: '', // 当事人：tag4
        address: '', // 地址：tag5
        illeAndDecision: '', // 违法事实及处罚决定：tag6
        reason: '', // 当事人申请延期（分期）缴纳罚款的理由: tag7
        suggestion: '' // 承办人意见: tag8
      }
    }
  },
  created() {
    this.initInfo()
  },
  methods: {
    initInfo() {
      if (this.info.writInfo) {
        this.info.writInfo.map(item => {
          this.delayInfo.caseName = this.info.auditInfo.caseName
          switch (item.tagName) {
            case 'tag2':
              this.delayInfo.caseName = item.tagContent
              break
            case 'tag3':
              this.delayInfo.writNoName = item.tagContent
              break
            case 'tag4':
              this.delayInfo.subject = item.tagContent
              break
            case 'tag5':
              this.delayInfo.address = item.tagContent
              break
            case 'tag6':
              this.delayInfo.illeAndDecision = item.tagContent
              break
            case 'tag7':
              this.delayInfo.reason = item.tagContent
              break
            case 'tag8':
              this.delayInfo.suggestion = item.tagContent
              break
            default:
              return
          }
        })
      } else {
        let user = JSON.parse(localStorage.getItem('res'))
        getWritInfo({
          sourceId: this.info.auditInfo.sourceId,
          type: this.info.auditInfo.objectType === '0' ? 'XXCFJDSDW' : 'XXCFJDSGR'
        })
          .then(
            res => {
              this.delayInfo = {
                caseName: this.info.auditInfo.caseName, // 案件名称: tag2
                writNoName: !!res.data[0] ? res.data[0].writNoName : '', // 处罚决定书文号：tag3
                subject: this.info.auditInfo.subject, // 当事人：tag4
                address: this.info.auditInfo.objectAddress, // 地址：tag5
                illeAndDecision: `该公司${this.handleTags('actName', '')}`, // 违法事实及处罚决定：tag6
                reason: '', // 当事人申请延期（分期）缴纳罚款的理由: tag7
                suggestion: '' // 承办人意见: tag8
              }
              return getWritDataByWritId({
                writId: !!res.data[0] ? res.data[0].writId : ''
              })
            },
            err => console.info(err)
          )
          .then(res => {
            res.data.map(_item => {
              if (this.info.auditInfo.objectType === '0') {
                if (_item.tagName === 'tag11') {
                  let _illeAndDecision = this.delayInfo.illeAndDecision
                  this.delayInfo.illeAndDecision = `${_illeAndDecision}对该公司作出${_item.tagContent}的行政处罚`
                }
              } else {
                if (_item.tagName === 'tag14') {
                  let _illeAndDecision = this.delayInfo.illeAndDecision
                  this.delayInfo.illeAndDecision = `${_illeAndDecision}对该公司作出${_item.tagContent}的行政处罚`
                }
              }
            })
            console.info(this.delayInfo.illeAndDecision)
          })
      }
    },
    // 处理违法事实，法律规定内容
    handleTags(type, char) {
      let arr = []
      this.info.auditInfo.blcList.map(item => {
        arr.push(item[type])
      })
      return char + arr.filter(Boolean).join(',')
    },
    // 提交盖章
    seal() {
      let _audiReq = {
        auditTypeCode: 'ta80040', // 盖章审核
        handlerDeptId: '', // 审核人部门 id
        handlerUserId: '', // 审核人
        requestDeptName: JSON.parse(localStorage.getItem('res')).userEntity.deptName, // 承办人部门，现在先不填
        requestId: this.info.auditInfo.writId, // 文书 writId
        requestTime: void 0,
        requestUsersName: this.info.auditInfo.responsiblePerson, // 承办人名称
        submitterCause: this.info.auditInfo.companyName // 案件名称 或 企业名称
      }
      this.$emit('toSeal', _audiReq)
    },
    sure() {
      this.$refs.delayPay.validate((valid, errInfo) => {
        if (valid) {
          let data = getWritParams({
            tag2: this.delayInfo.caseName,
            tag3: this.delayInfo.writNoName,
            tag4: this.delayInfo.subject,
            tag5: this.delayInfo.address,
            tag6: this.delayInfo.illeAndDecision,
            tag7: this.delayInfo.reason,
            tag8: this.delayInfo.suggestion
          })
          let params = {
              companyId: this.info.auditInfo.companyId, //制作文书传company_id
            contractorIds: this.info.auditInfo.udtIds,
            writType: 'YQJNFKSPB',
            sourceId: this.info.auditInfo.sourceId,
            data: data
          }
          this.$emit('createWrit', params)
        } else {
          this.$message({
            type: 'warning',
            message: getFirstErrMsg(errInfo)
          })
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
.delay-pay_content {
//   padding: 0 16px;
  /deep/.el-form {
    padding-right: 16px;
    .el-form-item {
      margin-bottom: 0;
    }
    .el-textarea {
      margin-bottom: 10px;
    }
  }

//   /deep/ .el-form-item__label {
//     padding-right: 0;
//   }
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding-right: 16px;
  border-top: 1px solid #e0e0e0;
  padding-top: 10px;
}
</style>
