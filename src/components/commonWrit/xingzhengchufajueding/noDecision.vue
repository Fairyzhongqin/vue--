<template>
  <div>
    <div class="writ-overflow no-decision-content">
      <el-form
        ref="noDecision"
        :rules="rules"
        :model="noPenaltyInfo"
        label-width="187px"
        label-position="left"
        :show-message="false"
      >
        <el-row>
          <el-form-item label="" prop="subject">
              <div slot="label" class="slot_label">被处罚单位或个人</div>
            <el-input v-model="noPenaltyInfo.subject" placeholder="被处罚单位或个人"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="" prop="illeAndEvidence">
              <div slot="label" class="slot_label">违法事实及证据</div>
            <el-input
              v-model="noPenaltyInfo.illeAndEvidence"
              :autosize="{minRows: 1}"
              type="textarea"
              placeholder="请输入违法事实及证据"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="" prop="laws">
              <div slot="label" class="slot_label">违反的法律法规</div>
            <el-input
              v-model="noPenaltyInfo.laws"
              :autosize="{minRows: 1}"
              type="textarea"
              placeholder="请输入违反的法律法规"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="" prop="reason">
              <div slot="label" class="slot_label">不予行政处罚的理由</div>
            <el-input
              v-model="noPenaltyInfo.reason"
              :autosize="{minRows: 1}"
              type="textarea"
              placeholder="请输入不予行政处罚的理由"
            ></el-input>
          </el-form-item>
        </el-row>
      </el-form>
    </div>

    <div class="dialog-footer" style="text-align: right">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成不予行政处罚决定书</el-button>
      <!-- <el-button type="primary" @click="lawSeal" :disabled="lawDisabled">加盖执法专用章</el-button> -->
    </div>
  </div>
</template>
  <script>
import { getWritParams, getFirstErrMsg } from '@/utils/util'
import { getWritInfo, getWritDataByWritId, sealWrit } from '@/api/fileRelated'
export default {
  props: {
    info: {
      type: Object
    }
  },
  data() {
    return {
      rules: {
        subject: [{ required: true, trigger: 'blur', message: '请输入被处罚单位或个人' }],
        illeAndEvidence: [{ required: true, trigger: 'blur', message: '请输入违法事实及证据' }],
        laws: [{ required: true, trigger: 'blur', message: '请输入违反的法律法规' }],
        reason: [{ required: true, trigger: 'blur', message: '请输入不予行政处罚的理由' }]
      },
      lawDisabled: false,
      noPenaltyInfo: {
        subject: '', //被处罚单位: tag2
        illeAndEvidence: '', // 违法事实及证据：tag3
        laws: '', // 违反的法律法规：tag4
        reason: '' // 不予行政处罚的理由：tag5
      }
    }
  },
  created() {
    if (this.info.writInfo) {
      this.reflect()
    } else {
      this.initInfo()
    }
  },
  methods: {
    // 提交盖执法章
    lawSeal() {
      sealWrit({
        writId: this.info.auditInfo.writId,
        signType: 'SINGLE_LAW'
      })
        .then(res => {
          if (res.code === '0') {
            this.$message({
              message: '加盖执法专用章成功',
              type: 'success'
            })
            this.lawDisabled = true
            this.$emit('toLawSeal')
          }
        })
        .catch(err => {
          this.$message({
            message: err,
            type: 'warning'
          })
        })
    },
    sure() {
      this.$refs.noDecision.validate((valid, errInfo) => {
        if (valid) {
          let data = getWritParams({
            tag2: this.noPenaltyInfo.subject,
            tag3: this.noPenaltyInfo.illeAndEvidence,
            tag4: this.noPenaltyInfo.laws,
            tag5: this.noPenaltyInfo.reason
          })
          let params = {
              companyId: this.info.auditInfo.companyId, //制作文书传company_id
            contractorIds: this.info.auditInfo.udtIds,
            writType: 'BYXZCFJDS',
            sourceId: this.info.auditInfo.sourceId,
            data: data
          }
          this.$emit('createWrit', params)
        } else {
          this.$message({
            type: 'error',
            message: getFirstErrMsg(errInfo)
          })
        }
      })
    },
    // 点击取消按钮事件
    close() {
      this.$emit('close')
    },
    // 文书回显
    reflect() {
      let inputInfo = this.info.writInfo.reduce((total, item) => {
        switch (item.tagName) {
          case 'tag2':
            total.subject = item.tagContent
            break
          case 'tag3':
            total.illeAndEvidence = item.tagContent
            break
          case 'tag4':
            total.laws = item.tagContent
            break
          case 'tag5':
            total.reason = item.tagContent
            break
        }
        return total
      }, {})
      this.noPenaltyInfo = inputInfo
    },
    initInfo() {
      let user = JSON.parse(localStorage.getItem('res'))
      let evidence
      getWritInfo({
        sourceId: this.info.auditInfo.sourceId,
        type: 'XXCFGZ'
      })
        .then(res => {
          return getWritDataByWritId({
            writId: res.data[0].writId
          })
        })
        .then(res => {
          res.data.map(_item => {
            if (_item.tagName === 'tag4') {
              evidence = _item.tagContent
            }
          })
          this.noPenaltyInfo = {
            subject: this.info.auditInfo.subject, //被处罚单位: tag2
            illeAndEvidence: `${this.handleTags('actName')}\n${evidence}`, // 违法事实及证据：tag3
            laws: this.handleTags('lawContent', '法律规定内容：'), // 违反的法律法规：tag4
            reason: '' // 不予行政处罚的理由：tag5
          }
        })
    },
    // 处理违法事实，法律规定内容，处罚依据内容
    handleTags(type, char) {
      let arr = []
      let spliter = type === 'actName' ? '；' : '、'
      this.info.auditInfo.blcList.map(item => {
        arr.push(item[type])
      })
      return arr.filter(Boolean).join(spliter)
    }
  }
}
</script>
  <style lang="less" scoped>
.no-decision-content {
  padding: 0 16px;
  /deep/ .el-form-item {
    margin-bottom: 0px;
  }
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding-right: 16px;
  border-top: 1px solid #e0e0e0;
  padding-top: 10px;
  margin-top: 10px;
}
</style>
