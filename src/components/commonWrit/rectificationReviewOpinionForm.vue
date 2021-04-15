<template>
  <div>
    <div class="letterReply_content">
      <div class="content-list">
        <el-form :model="ruleForm" ref="ruleForm" :label-position="labelPosition" label-width="110px">
          <el-form-item label="">
            <div slot="label" class="slot_label">目标名称</div>
            <el-input v-model="ruleForm.targetName" placeholder="请输入目标名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="">
            <div slot="label" class="slot_label">决定</div>
            <el-input v-model="ruleForm.decision" placeholder="请输入决定" clearable></el-input>
          </el-form-item>
          <el-form-item label="">
            <div slot="label" class="slot_label">决定时间</div>
            <el-date-picker v-model="ruleForm.decisionTime" type="date" placeholder="请选择决定时间" clearable></el-date-picker>
          </el-form-item>
          <el-form-item label="">
            <div slot="label" class="slot_label">文书编号</div>
            <el-input v-model="ruleForm.number" placeholder="请输入文书编号" clearable></el-input>
          </el-form-item>
          <el-form-item label="">
            <div slot="label" class="slot_label">是否延期</div>
            <el-select style="paddingBottom:5px" v-model="ruleForm.category" placeholder="请选择是否延期" @change="selectChanged('ruleForm')">
              <el-option label="是" value="0"></el-option>
              <el-option label="否" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" v-if="ShowTime">
            <div slot="label" class="slot_label">延期时间</div>
            <el-date-picker v-model="ruleForm.delayTime" type="date" placeholder="请选择延期时间" clearable></el-date-picker>
          </el-form-item>
          <el-form-item label="" v-if="ShowCause" label-width="150px">
            <div slot="label" class="slot_label">不同意延期原因</div>
            <el-input type="textarea" v-model="ruleForm.delayReason" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('ruleForm')">取 消</el-button>
      <el-button type="primary" @click="makeReplyApplicationPdf('ruleForm')">保存并生成延期申请答复书</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: '',
  data() {
    return {
      labelPosition: 'left',
      isUserSign: 0,
      ruleForm: {
        category: '',
        unitName: '',
        person: '',
        phone: '',
        value: '',
        sex: '',
        personPhone: '',
        address: '',
        companyCode: '',
        personCode: '',
        personName: '',
        companyName: '',
        unitAdress: '',
        homeAdress: '',
        personPhone: '',
        delayReason: '',
        appMatter: '',
        delayTime: '',
        targetName: '',
        number: '',
        decision: '',
        delayReason: '',
        category: '',
        decisionTime: '',
        delayTime: ''
      }
    }
  },
  methods: {
    cancel() {
      //   关闭弹窗
      this.$emit('cancel')
    },
    makeReplyApplicationPdf() {
      console.info('生成答复书')
    }
  }
}
</script>
<style lang="less" scoped>
.letterReply_content {
  padding: 10px 16px 10px 16px;
  box-sizing: border-box;
  // width: calc(100% - 16px);
  border-radius: 8px;
  height: 100%;
  .content-list {
    // line-height: 40px;
    color: #333333;
    width: 100%;
    border-bottom: none;
  }
}
</style>
