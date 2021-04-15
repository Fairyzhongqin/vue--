<template>
  <div>
    <div class="take_evidence_content">
      <el-form ref="postponeInfo" :model="postponeInfo" label-width="100px" label-position="right" :rules="rules" :inline-message="true" :show-message="false">
        <el-row>
          <el-form-item label="" prop="caseName">
              <div slot="label" class="slot_label">案件名称</div>
            <el-input v-model="postponeInfo.caseName" placeholder="请输入案件名称" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="" prop="createTime">
              <div slot="label" class="slot_label">立案时间</div>
              <el-date-picker :disabled="true" v-model="postponeInfo.createTime" align="left" format="yyyy-MM-dd HH:mm"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="postponeTime">
              <div slot="label" class="slot_label">延期至</div>
              <el-date-picker
                :picker-options="pickerOptions"
                placeholder="请选择延期时限"
                v-model="postponeInfo.postponeTime"
                align="left"
                format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" class="time_picker">
            <el-form-item label="" prop="udtNames">
              <div slot="label" class="slot_label">承办人</div>
              <el-input v-model="postponeInfo.udtNames" placeholder="请输入承办人名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="udtDepart">
              <div slot="label" class="slot_label">承办部门</div>
              <el-input v-model="postponeInfo.udtDepart" placeholder="请输入承办人部门" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="" class="margin_left" prop="subject">
              <div slot="label" class="slot_label">当事人</div>
            <el-input v-model="postponeInfo.subject" placeholder="请输入当事人" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-form-item label="" class="margin_left" prop="postponeReason">
              <div slot="label" class="slot_label">延期理由</div>
            <el-input v-model="postponeInfo.postponeReason" type="textarea" :autosize="{maxRows: 8}" placeholder="请输入延期理由" clearable></el-input>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="dialog-footer" style="text-align: right;padding:10px 0;padding-right:10px">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成案件延期审批表</el-button>
    </div>
  </div>
</template>

<script>
import { getWritParams, dateFormat, handleDateRef } from '@/utils/util'
import { sealWrit } from '@/api/fileRelated'
import { getDataInfo } from '@api/enterpriseInfo'

export default {
  name: 'caseDelay',
  props: {
    info: {
      type: Object
    },
    isSecond: {
      // 是否可生成第二次案件延期审批表
      type: Boolean
    }
  },
  data() {
    return {
      postponeInfo: {
        caseName: '', // 案件名称
        subject: '', // 当事人
        createTime: void 0, // 立案时间
        postponeTime: void 0, // 延期时限
        companyName: '', // 单位名称
        udtNames: '', // 承办人名称
        udtDepart: '', // 承办人部门
        postponeReason: '', // 延期理由
        objectType: '' // 当事人类型
      },
      createReq: {
        sourceId: '',
        userId: '',
        contractorIds: '',
        writType: 'AJYQSPB',
        data: []
      },
      rules: {
        caseName: [{ required: true, message: '请输入案件名称', trigger: 'blur' }],
        subject: [{ required: true, message: '请输入当事人', trigger: 'blur' }],
        createTime: [{ required: true, message: '请选择立案时间', trigger: 'blur' }],
        postponeTime: [{ required: true, message: '', trigger: 'blur' }],
        udtNames: [{ required: true, message: '请输入承办人名称', trigger: 'blur' }],
        udtDepart: [{ required: true, message: '请输入承办人部门', trigger: 'blur' }],
        postponeReason: [{ required: true, message: '请输入延期理由', trigger: 'blur' }]
      },
      pickerOptions: {}
    }
  },
  mounted() {
    this.initInfo()
    if (this.info.writInfo) {
      this.info.writInfo.forEach((item, index) => {
        switch (item.tagName) {
          case 'tag16':
            this.postponeInfo.postponeReason = item.tagContent
            break
          case 'postponeTime_tag':
            this.postponeInfo.postponeTime = handleDateRef(item.tagContent)
            break
        }
      })
    }
  },
  // 不可选的时间

  methods: {
    initInfo() {
      let user = JSON.parse(localStorage.getItem('res'))
      this.postponeInfo = {
        caseName: this.info.auditInfo.caseName, // 案件名称
        postponeTime: void 0, // 延期时限
        createTime: new Date(this.info.auditInfo.caseCrimeTime),
        subject: this.info.auditInfo.subject, // 当事人名称
        udtNames: this.info.auditInfo.udtNames, // 承办人名称
        udtDepart: user.sysDeptEntity.name ? user.sysDeptEntity.name : '暂无', // 承办人部门
        objectType: this.info.auditInfo.objectType,
        postponeReason: '' // 延期理由
      }
      // 限制时间选择
      let dataOne = new Date(this.info.auditInfo.caseCrimeTime).getTime() + 1000 * 60 * 60 * 24 * 120
      let dataTwo = new Date(this.info.auditInfo.caseCrimeTime).getTime() + 1000 * 60 * 60 * 24 * 210
      let dataThree = new Date(this.info.auditInfo.caseCrimeTime).getTime() + 1000 * 60 * 60 * 24 * 30
      this.pickerOptions = {
        disabledDate: time => {
          let res
          if (this.isSecond) {
            // 第二份案件延期审批表
            res = time.getTime() < dataOne || time.getTime() > dataTwo
          } else {
            res = time.getTime() < dataThree || time.getTime() > dataTwo
          }
          return res
        }
      }
    },
    sure() {
      this.$refs.postponeInfo.validate(async val => {
        if (val) {
          let userInfo = {},
            companyInfo = {}
          if (this.info.auditInfo.objectType === '0') {
            // 0 单位 1 个人
            let compRes = await getDataInfo({
              id: this.info.auditInfo.punishCompanyId
            })
            companyInfo = {
              companyName: compRes.data.companyName, // 单位名称
              legalPerson: compRes.data.legalPerson ? compRes.data.legalPerson : '暂无', // 法定代表人
              legalPersonMobilephone: compRes.data.legalPersonMobilephone ? compRes.data.legalPersonMobilephone : '暂无', // 法定代表人联系电话
              businessAddress: compRes.data.businessAddress ? compRes.data.businessAddress : '暂无', // 生产经营地址
              postCode: this.info.auditInfo.postCode // 邮政编码
            }
          } else {
            userInfo = {
              userName: this.info.auditInfo.subject, // 用户名
              age: this.info.auditInfo.age, // 年龄
              sex: this.info.auditInfo.sex === '1' ? '女' : '男', // 性别
              fullDeptName: this.info.auditInfo.currentCompany, // 所在单位
              currentCompanyAddress: this.info.auditInfo.currentCompanyAddress, // 所在单位地址
              location: this.info.auditInfo.objectAddress, // 居住地址 立案时未填 coding
              telphone: this.info.auditInfo.telphone, // 联系电话
              postCode: this.info.auditInfo.postCode // 邮编
            }
          }
          let data = getWritParams({
            tag2: this.postponeInfo.caseName,
            tag3: companyInfo.companyName,
            tag4: companyInfo.legalPerson,
            tag5: companyInfo.legalPersonMobilephone,
            tag6: companyInfo.businessAddress,
            tag7: companyInfo.postCode,
            tag8: userInfo.userName,
            tag9: userInfo.age,
            tag10: userInfo.sex,
            tag11: userInfo.fullDeptName,
            tag12: userInfo.currentCompanyAddress,
            tag13: userInfo.location,
            tag14: userInfo.telphone,
            tag15: userInfo.postCode,
            tag16: this.postponeInfo.postponeReason,
            postponeTime_tag: dateFormat(this.postponeInfo.postponeTime, 'yyyy年mm月dd日HH时MM分')
          })
          this.createReq = {
              companyId: this.info.auditInfo.companyId, //制作文书传company_id
            sourceId: this.info.auditInfo.sourceId,
            contractorIds: this.info.auditInfo.udtIds,
            writType: 'AJYQSPB',
            data: data
          }
          this.$emit('createWrit', this.createReq)
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
.take_evidence_content {
  max-height: 60vh;
  overflow-y: auto;
  padding: 10px 16px 10px 16px;
}
.el-form-item {
  margin-bottom: -5px;
  margin-top: 2px;
  white-space: nowrap;
  &.margin_left {
    margin-right: 10px;
    margin-left: 10px;
  }
}
.el-col-12 {
  /deep/ .el-input {
    width: 100%;
  }
  &:last-child {
    /deep/ .el-input__inner {
      width: 100%;
    }
  }
}
/deep/.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
  height: 30px;
  padding-left: 0 0 0 10px;
}
/deep/ .el-date-editor .el-range__icon,
/deep/ .el-date-editor .el-range__close-icon {
  line-height: 24px;
}
/deep/ .el-date-editor .el-range-separator {
  line-height: 20px;
}
.only {
  /deep/ .el-form-item__content {
    margin-left: 125px !important;
  }
}
/deep/ .el-dialog__header {
  padding: 17px 20px 10px;
}
/deep/ .el-dialog__wrapper .el-dialog__header .el-dialog__headerbtn {
  top: 12px;
  right: 15px;
  font-size: 24px;
}
/deep/ .el-dialog__body {
  padding-left: 16px;
  padding-right: 29px;
}
/deep/ .el-dialog__wrapper .el-dialog__footer {
  margin-top: 15px;
  padding: 0;
  line-height: 42px;
  padding-right: 10px;
}
/deep/ .el-dialog__title {
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
}
.dialog-footer {
  border-top: 1px solid #e0e0e0;
  padding: 5px 16px 5px 0;
  margin-top: 5px;
}
.time_picker .el-form-item__content {
  display: flex;
}
/deep/.el-col-2 {
  margin-left: 20px;
  margin-bottom: 5px;
}
/deep/.el-date-editor .el-range-input {
  width: 80%;
}
</style>
