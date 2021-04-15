<template>
  <div>
    <div class="content">
      <el-form ref="nonResInfo" :model="nonResInfo" :rules="rules" label-width="80px" label-position="right" :inline-message="true" :show-message="false">
        <el-row>
          <el-form-item label="" prop="subjectName">
              <div slot="label" class="slot_label">目标名称</div>
            <el-input v-model="nonResInfo.subjectName" placeholder="请输入目标名称" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="" prop="checkTime">
              <div slot="label" class="slot_label">检查时间</div>
              <el-date-picker v-model="nonResInfo.checkTime" format="yyyy-MM-dd" type="datetime" placeholder="选择检查时间"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="checkCompany">
              <div slot="label" class="slot_label">检查企业</div>
              <el-input v-model="nonResInfo.checkCompany" placeholder="请输入检查企业" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="" prop="materialsNum">
              <div slot="label" class="slot_label">材料份数</div>
              <el-input v-model="nonResInfo.materialsNum" placeholder="请输入材料份数" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="pageNum">
              <div slot="label" class="slot_label">材料页数</div>
              <el-input v-model="nonResInfo.pageNum" placeholder="请输入材料页数" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="" prop="contactor">
              <div slot="label" class="slot_label">联系人</div>
              <el-input v-model="nonResInfo.contactor" placeholder="请输入联系人" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="phone">
              <div slot="label" class="slot_label">联系电话</div>
              <el-input v-model="nonResInfo.phone" placeholder="请输入联系电话" maxlength="12" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="" prop="question">
              <div slot="label" class="slot_label">问题</div>
            <el-input v-model="nonResInfo.question" placeholder="请输入问题" type="textarea" clearable></el-input>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="dialog-footer" style="text-align: right;padding:10px 0;padding-right:10px">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成非职责范围安全问题移交单</el-button>
    </div>
  </div>
</template>

<script>
import { getWritParams, dateFormat, handleDateRef } from '@/utils/util'

export default {
  props: {
    info: {
      type: Object
    }
  },
  data() {
    return {
      nonResInfo: {
        subjectName: '', //目标名称
        checkTime: '', // 检查时间
        checkCompany: '', // 检查企业
        question: '', // 问题
        materialsNum: '', // 材料份数
        pageNum: '', // 材料页数
        contactor: '', //联系人
        phone: '' // 联系电话
      },
      rules: {
        subjectName: [{ required: true, message: '请输入目标名称', trigger: 'blur' }],
        checkTime: [{ required: true, message: '请输入检查时间', trigger: 'blur' }],
        checkCompany: [{ required: true, message: '请输入检查企业', trigger: 'blur' }],
        question: [{ required: true, message: '请输入问题', trigger: 'blur' }],
        materialsNum: [{ required: true, message: '请输入材料份数', trigger: 'blur' }],
        pageNum: [{ required: true, message: '请输入材料页数', trigger: 'blur' },
        {
            pattern: /^[1-9][0-9]*$/,
            trigger: ['blur', 'change'],
            message: '请输入数字'
        }],
        contactor: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        phone: [{
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入联系电话'
          },
          {
            pattern: /^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
            trigger: ['blur', 'change'],
            message: '您输入的电话号码格式不正确'
        }]
      }
    }
  },
  mounted() {
    if (this.info.writInfo) {
      let inputInfo = this.info.writInfo.reduce((total, item, index) => {
        switch (item.tagName) {
          case 'tag2':
            total.subjectName = item.tagContent
            break
          case 'tag3':
            total.checkTime = handleDateRef(item.tagContent)
            break
          case 'tag4':
            total.checkCompany = item.tagContent
            break
          case 'tag5':
            total.question = item.tagContent
            break
          case 'tag6':
            total.materialsNum = item.tagContent
            break
          case 'tag7':
            total.pageNum = item.tagContent
            break
          case 'tag8':
            total.contactor = item.tagContent
            break
          case 'tag9':
            total.phone = item.tagContent
            break
        }
        return total
      }, {})
      this.nonResInfo = inputInfo
    } else {
      this.initInfo()
    }
  },
  methods: {
    // 初始化文书数据
    initInfo() {
      let user = JSON.parse(localStorage.getItem('res'))
      this.nonResInfo = {
        onsiteInsp: '',
        subjectName: this.info.auditInfo.companyName, //目标名称
        checkTime: this.info.auditInfo.checkTime, // 检查时间
        checkCompany: this.info.auditInfo.companyName, // 检查企业
        question: this.info.auditInfo.transQuestion, // 问题
        materialsNum: '', // 材料份数
        pageNum: '', // 材料页数
        contactor: user.userEntity.nickName, //联系人
        phone: user.userEntity.phone ? user.userEntity.phone : '' // 联系电话
      }
    },
    // 点击确定按钮事件
    sure() {
      this.$refs.nonResInfo.validate(val => {
        if (val) {
          let data = getWritParams({
            tag2: this.nonResInfo.subjectName,
            tag3: dateFormat(this.nonResInfo.checkTime, 'yyyy年mm月dd日'),
            tag4: this.nonResInfo.checkCompany,
            tag5: this.nonResInfo.question,
            tag6: this.nonResInfo.materialsNum,
            tag7: this.nonResInfo.pageNum,
            tag8: this.nonResInfo.contactor,
            tag9: this.nonResInfo.phone
          })
          let params = {
            contractorIds: this.info.auditInfo.udtIds,
            writType: 'FZZAQWTYJD',
            sourceId: this.info.auditInfo.sourceId,
            data: data
          }
          this.$emit('createWrit', params)
        } else {
          console.log('hhh')
        }
      })
    },
    // 提交盖章
    seal() {
      let _audiReq = {
        auditTypeCode: 'ta80040', // 盖章审核
        handlerDeptId: '', // 审核人部门 id
        handlerUserId: '', // 审核人
        requestDeptName: JSON.parse(localStorage.getItem('res')).userEntity.deptName, // 承办人部门，现在先不填
        requestId: this.info.writId, // 文书 writId
        requestTime: void 0,
        requestUsersName: this.info.responsiblePerson, // 承办人名称
        submitterCause: this.info.companyName // 案件名称 或 企业名称
      }
      this.$emit('toSeal', _audiReq)
    },
    // 点击取消按钮事件
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  padding: 0 16px;
}
.el-form-item {
  margin-bottom: -5px;
  margin-top: 10px;
  white-space: nowrap;
}
/deep/.el-col-11 {
  margin-right: 39px;
}
/deep/.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
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
.special {
  margin-top: 24px;
  .el-checkbox {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
  span {
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
  }
  .el-row:nth-child(4) {
    /deep/.el-input__inner {
      width: 85%;
    }
  }
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
  display: flex;
  justify-content: flex-end;
  padding-right: 16px;
  border-top: 1px solid #e0e0e0;
  padding-top: 10px;
  margin-top: 30px;
}
</style>
