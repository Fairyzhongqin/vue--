<template>
  <div class="approval-writ-lay">
    <div class="approval-form-content">
      <el-form ref="approvalform" :rules="rules" :model="apprFormData" label-width="160px" label-position="right" :show-message="false">
        <el-row>
          <el-col>
            <el-form-item label="" prop="caseName">
              <div slot="label" class="slot_label">案件名称</div>
              <el-input v-model="apprFormData.caseName" placeholder="请输入案件名称" clearable type="textarea" autosize></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="" prop="udtNames">
              <div slot="label" class="slot_label">承办人</div>
              <el-input v-model="apprFormData.udtNames" placeholder="请输入承办人" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="subject">
              <div slot="label" class="slot_label">当事人</div>
              <el-input v-model="apprFormData.subject" placeholder="请输入当事人" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="exerDept">
              <div slot="label" class="slot_label">承办单位</div>
              <el-input v-model="apprFormData.exerDept" placeholder="承办单位" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="" prop="caseSituation">
              <div slot="label" class="slot_label">案件基本情况</div>
              <el-input v-model="apprFormData.caseSituation" type="textarea" :autosize="{ minRows: 1 }" placeholder="案件基本情况"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item prop="reason" class="long_label mb5 mt5" label="报请审批的行政强制事项及其理由、依据、种类及期限等">
              <el-input type="textarea" :rows="3" placeholder="报请事项及理由" v-model="apprFormData.reason" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
        <el-form-item label="期限：" prop="date">
          <el-date-picker
            v-model="apprFormData.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        </el-row>-->
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="" prop="register">
              <div slot="label" class="slot_label">登记人</div>
              <el-input v-model="apprFormData.register" placeholder="请输入登记人" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="regisDept">
              <div slot="label" class="slot_label">登记单位</div>
              <el-input v-model="apprFormData.regisDept" placeholder="请输入登记单位" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="regisTime">
              <div slot="label" class="slot_label">登记时间</div>
              <el-date-picker v-model="apprFormData.regisTime" type="datetime" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成行政强制审批表</el-button>
    </span>
  </div>
</template>

<script>
import { getWritDataByWritId } from '@api/fileRelated'
import { getWritParams, dateFormat, getFirstErrMsg } from '@/utils/util'
import { getExamineInfo } from '@api/ProcessingofInspectionResult'
export default {
  name: 'approvalForm',
  props: ['info'], // 文书创建从别处带来的信息
  data() {
    return {
      apprFormData: {
        caseName: '', // 案件名称
        udtNames: '', // 承办人
        subject: '', // 当事人
        exerDept: '', // 承办单位
        caseSituation: '', // 案件基本情况
        reason: '', // 报请事项及理由
        date: [], // 期限
        register: '', // 登记人
        regisDept: '', // 登记单位
        regisTime: new Date() // 登记时间
      },
      rules: {
        caseName: [{ required: true, message: '请输入案件名称', trigger: 'blur' }],
        udtNames: [{ required: true, message: '请输入承办人', trigger: 'blur' }],
        subject: [{ required: true, message: '请输入当事人', trigger: 'blur' }],
        exerDept: [{ required: true, message: '请输入承办单位', trigger: 'blur' }],
        caseSituation: [{ required: true, message: '案件基本情况', trigger: 'blur' }],
        reason: [{ required: true, message: '请输入报请事项及理由', trigger: 'blur' }],
        register: [{ required: true, message: '请输入登记人', trigger: 'blur' }],
        regisDept: [{ required: true, message: '请输入登记单位', trigger: 'blur' }],
        regisTime: [{ required: true, message: '请选择日期', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.initInfo()
    this.getDept()
  },
  methods: {
    // 点击取消按钮事件
    close() {
      this.$emit('close')
    },
    // 点击确定按钮事件
    sure() {
      this.$refs.approvalform.validate((val, errInfo) => {
        let user = JSON.parse(localStorage.getItem('res'))
        if (val) {
          let data = []
          let shared = getWritParams({
            tag2: this.apprFormData.caseName,
            tag12: this.apprFormData.caseSituation,
            tag13: this.apprFormData.reason,
            tag14: this.apprFormData.udtNames
          })
          if (this.info.auditInfo.objectType === '0') {
            // 单位
            data = getWritParams({
              tag8: this.info.auditInfo.subject,
              tag9: this.info.auditInfo.legalPerson, // 法定负责人
              tag10: this.info.auditInfo.address,
              tag11: this.info.auditInfo.phone
            })
          } else {
            // 个人
            data = getWritParams({
              tag3: this.info.auditInfo.subject,
              tag4: this.info.auditInfo.sex === '1' ? '女' : '男',
              // tag5: this.info.auditInfo.birthday,
              tag5: !!this.info.auditInfo.birthday ? dateFormat(new Date(this.info.auditInfo.birthday), 'yyyy年mm月') : '',
              tag6: this.info.auditInfo.phone,
              tag7: this.info.auditInfo.address
            })
          }

          let params = {
              companyId: this.info.auditInfo.companyId, //制作文书传company_id
            sourceId: this.info.auditInfo.sourceId,
            userId: user.userEntity.id,
            contractorIds: this.info.auditInfo.udtIds,
            writType: 'XZQZSPB',
            data: [...data, ...shared]
          }
          console.info("i'm approvalForm")
          this.$emit('createWrit', params)
        } else {
          this.$message({
            type: 'error',
            message: getFirstErrMsg(errInfo)
          })
        }
      })
    },
    initInfo() {
      let reason = '',
        date = ''
      let caseName = ''
      let udtNames = ''
      let caseSituation = ''
      if (this.info.writInfo) {
        this.info.writInfo.map(item => {
          switch (item.tagName) {
            case 'tag2':
              caseName = item.tagContent //案件名称
              break
            case 'tag12':
              caseSituation = item.tagContent //案件基本情况
              break
            case 'tag13':
              reason = item.tagContent
              break
            case 'tag15':
              date = item.tagContent
              break
          }
        })
      }
      let user = JSON.parse(localStorage.getItem('res'))

      let _penalty = this.$store.state.penalty
      this.apprFormData = {
        caseName: caseName || _penalty.penaltyUndEntity.caseName, // 案件名称
        // caseName: this.info.auditInfo.caseName, // 案件名称
        udtNames: this.info.auditInfo.responsiblePerson || _penalty.udtNames, // 承办人
        // udtNames: this.info.auditInfo.udtNames, // 承办人
        subject: this.info.auditInfo.subject, // 当事人
        exerDept: user.sysDeptEntity.name, // 承办单位
        // exerDept: user.sysDeptEntity.fullDeptName, // 承办单位
        caseSituation: this.info.auditInfo.caseSituation, // 案件基本情况
        reason: reason, // 报请事项及理由及期限
        // date: [], // 期限,等汪总确定
        register: user.userEntity.nickName, // 登记人
        regisDept: user.userEntity.deptName, // 登记单位
        // regisDept: user.sysDeptEntity.fullDeptName, // 登记单位
        regisTime: new Date() // 登记时间
      }
    },
    getDept() {
      getExamineInfo({
        id: this.info.auditInfo.sourceId
      })
        .then(res => {
          if (res.code === '0') {
            this.apprFormData.exerDept = res.data.executorDeptName
          }
        })
        .catch(err => {
          console.info(err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.approval-writ-lay {
  .approval-form-content {
    padding: 10px 16px 10px 16px;

    .el-textarea {
      margin: 5px 0;
    }

    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 100%;
    }
  }

  /deep/.el-form-item {
    margin-bottom: 0px;
    white-space: nowrap;

    &.long_label {
      white-space: initial;
      .el-form-item__label {
        padding-left: 10px;
        &:before {
          left: 10px;
        }
      }
      label {
        line-height: 22px;
      }
    }

    el.input {
      width: 100%;
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
    padding-bottom: 10px;
    border-top: 1px solid #e0e0e0;
    padding-top: 10px;
  }
}
</style>
