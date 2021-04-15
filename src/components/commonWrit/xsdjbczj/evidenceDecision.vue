<template>
  <div class="evidence-decision-content">
    <el-form
      ref="evidenceDeInfo"
      :model="evidenceDeInfo"
      :rules="rules"
      label-width="97px"
      label-position="right"
      :inline-message="true"
      :show-message="false"
    >
      <el-row>
        <el-form-item prop="checkedItems">
            <div slot="label" class="slot_label">抽查物品</div>
          <el-input v-model="evidenceDeInfo.checkedItems" type="textarea" placeholder="请输入抽查物品" :autosize="{ minRows: 2 }" clearable></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="decision">
            <div slot="label" class="slot_label">处理决定</div>
          <el-input v-model="evidenceDeInfo.decision" type="textarea" placeholder="请输入处理决定" :autosize="{ minRows: 2 }" clearable></el-input>
        </el-form-item>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item prop="date">
            <div slot="label" class="slot_label">日期</div>
            <el-date-picker v-model="evidenceDeInfo.date" placeholder="请选择日期" align="left" format="yyyy-MM-dd"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="16" class="evidence-notice">
          <el-form-item label-width="280px" prop="evidenceNotice">
            <div slot="label" class="slot_label">关联先行登记保存证据通知书</div>
            <el-select v-model="evidenceDeInfo.evidenceNotice" placeholder="请选择先行登记保存证据通知书">
              <el-option :key="index" v-for="(item, index) in writList" :label="item.label" :value="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="dialog-footer" style="margin-top: 60px;text-align: right;padding-bottom:10px">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成先行登记保存证据处理决定书</el-button>
    </div>
  </div>
</template>

<script>
import { getWritParams, dateFormat, handleDateRef } from '@/utils/util'
import { getWritInfo } from '@api/fileRelated'

export default {
  name: 'evidenceDecision',
  props: ['info'],
  data() {
    return {
      rules: {
        evidenceNotice: [{ required: true, message: '请选择先行登记保存证据通知书', trigger: 'blur' }],
        checkedItems: [{ required: true, message: '请输入抽查物品', trigger: 'blur' }],
        decision: [{ required: true, message: '请输入处理决定', trigger: 'blur' }],
        date: [{ required: true, message: '请选择时间', trigger: 'blur' }]
      },
      writList: [],
      evidenceDeInfo: {
        evidenceNotice: '', // 先行登记保存证据通知书
        checkedItems: '', // 抽查物品
        decision: '', // 处理决定
        date: void 0
      }
    }
  },
  mounted() {
		if (this.info.writInfo) {
      let inputInfo = this.info.writInfo.reduce((total, item, index) => {
        switch (item.tagName) {
          case 'tag3':
            total.date = handleDateRef(item.tagContent)
            break
          case 'tag4':
            total.checkedItems = item.tagContent
            break
          case 'tag5':
            total.evidenceNotice = item.tagContent
            break
          case 'tag6':
            total.decision = item.tagContent
            break
        }
        return total
      }, {})
      this.evidenceDeInfo = inputInfo
		}
		this.getEvidenceNotice()
	},
  methods: {
    sure() {
      this.$refs.evidenceDeInfo.validate(val => {
        let user = JSON.parse(localStorage.getItem('res'))
        if (val) {
          let data = getWritParams({
            tag2: this.info.auditInfo.subject, //单位
            tag3: dateFormat(this.evidenceDeInfo.date, 'yyyy年mm月dd日'),
            tag4: this.evidenceDeInfo.checkedItems,
            tag5: this.evidenceDeInfo.evidenceNotice,
            tag6: this.evidenceDeInfo.decision,
            tag7: user.sysDeptEntity.government,
            tag8: user.sysDeptEntity.fullDeptName,
            tag9: user.sysDeptEntity.court
          })
          let params = {
            companyId: this.info.auditInfo.companyId, //执法检查模块制作文书传company_id
            contractorIds: this.info.auditInfo.udtIds,
            writType: 'XXDJBCZJCLJDS',
            sourceId: this.info.auditInfo.sourceId,
            data: data
          }
          this.$emit('createWrit', params)
        } else {
          console.log('error submit')
        }
      })
		},
		// 获取关联先行登记保存证据通知书
		getEvidenceNotice() {
			this.writList = []
      let req = {
        sourceId: this.info.auditInfo.sourceId,
        type: 'XXDJBCZJTZS'
      }
      getWritInfo(req)
        .then(res => {
          res.data.forEach(val => {
            this.writList.push({
              label: val.writNoName,
              writId: val.writId
            })
          })
        })
        .catch(err => console.info(err))
		},
		// 点击取消按钮事件
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less">
.evidence-decision-content {
  padding: 10px 16px 0px 16px;
  .el-form-item {
    margin-bottom: 5px;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
  .evidence-notice {
    /deep/ .el-form-item__content {
      display: flex;
      /deep/ .el-select {
        flex-grow: 1;
      }
    }
  }
  .dialog-footer {
    margin-top: 10px !important;
  }
}
</style>
