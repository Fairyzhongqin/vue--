<template>
  <div>
    <div class="applicationForEnforcement writ-overflow">
      <el-form ref="enforceInfo" :model="enforceInfo" :rules="rules" label-position="right" label-width="130px" :show-message="false">
        <el-row>
          <el-form-item label="" prop="subject">
              <div slot="label" class="slot_label">强制执行对象</div>
            <el-input v-model="enforceInfo.subject" placeholder="请输入强制执行对象"></el-input>
          </el-form-item>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="" prop="writNoName">
              <div slot="label" class="slot_label">文书号</div>
              <el-input v-model="enforceInfo.writNoName" placeholder="请输入文书号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="decisionTime">
              <div slot="label" class="slot_label">决定时间</div>
              <el-date-picker v-model="enforceInfo.decisionTime" type="date" placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="" prop="contactor">
              <div slot="label" class="slot_label">联系人</div>
              <el-input v-model="enforceInfo.contactor" placeholder="请输入联系人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="" prop="phone">
              <div slot="label" class="slot_label">联系电话</div>
              <el-input v-model="enforceInfo.phone" placeholder="请输入联系电话" maxlength="12"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="" prop="signer">
              <div slot="label" class="slot_label">签发人</div>
              <el-input v-model="enforceInfo.signer" placeholder="请输入签发人"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="" class="mt5" prop="decision">
              <div slot="label" class="slot_label">行政决定</div>
            <el-input class="vab" v-model="enforceInfo.decision" type="textarea" :autosize="{ minRows: 1 }" placeholder="请输入行政决定" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <p class="label_text">材料内容：</p>
          <div class="box" v-for="(detail, index) in materialList" :key="index">
            <el-input type="text" v-model="detail.info"></el-input>
            <div class="delete_buttons">
              <span @click="addDetail" v-if="index === materialList.length - 1">新增材料内容</span>
              <span class="delete" @click="deleteRule(index)">删除</span>
            </div>
          </div>
        </el-row>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成强制执行申请书</el-button>
    </span>
  </div>
</template>

<script>
import { getWritInfo } from '@api/fileRelated'
import { getWritParams, dateFormat, handleDateRef, reflectEntity, getFirstErrMsg } from '@/utils/util'

export default {
  name: 'applicationForEnforcement',
  props: ['info'],
  data() {
    return {
      enforceInfo: {
        signer: '', // 签发人（当前登录人）：tag2
        court: '', // 当前登录人信息下的法院：tag3
        decisionTime: void 0, // 决定时间：tag4
        subject: '', // 强制执行对象：tag5
        decision: '', // 行政决定：tag6
        writNoName: '', // 行政处罚决定书的文号：tag7
        material: '', // 材料内容：tag8
        contactor: '', // 联系人：tag9
        phone: '' // 联系电话：tag10
      },
      materialList: [{ info: '' }],
      rules: {
        subject: [{ required: true, message: '请输入强制执行对象', trigger: 'blur' }],
        signer: [{ required: true, message: '请输入签发人', trigger: 'blur' }],
        court: [{ required: true, message: '请输入案件名称', trigger: 'blur' }],
        decisionTime: [{ required: true, message: '请选择决定时间', trigger: 'blur' }],
        decision: [{ required: true, message: '请输入行政决定', trigger: 'blur' }],
        writNoName: [{ required: true, message: '请输入文书号', trigger: 'blur' }],
        contactor: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        phone: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入电话号码'
          },
          {
            pattern: /^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
            trigger: ['blur', 'change'],
            message: '您输入的电话号码格式不正确'
          }
        ]
      }
    }
  },
  created() {
    this.initInfo()
  },
  methods: {
    initInfo() {
      if (this.info.writInfo) {
        let infoList = this.info.writInfo.filter(item => {
          if (item.tagName.indexOf('tag8Item') !== -1) {
            return item
          }
        })
        this.materialList = []

        this.info.writInfo.map(item => {
          switch (item.tagName) {
            case 'tag2':
              this.enforceInfo.signer = item.tagContent
              break
            case 'tag4':
              this.enforceInfo.decisionTime = handleDateRef(item.tagContent)
              break
            case 'tag5':
              this.enforceInfo.subject = item.tagContent
              break
            case 'tag6':
              this.enforceInfo.decision = item.tagContent
              break
            case 'tag7':
              this.enforceInfo.writNoName = item.tagContent
              break
            case 'tag8Item':
              this.materialList.push({
                info: item.tagContent
              })
              break
            case 'tag9':
              this.enforceInfo.contactor = item.tagContent
              break
            case 'tag10':
              this.enforceInfo.phone = item.tagContent
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
        }).then(
          res => {
            this.enforceInfo = {
              signer: user.userEntity.nickName,
              court: user.sysDeptEntity.court,
              decisionTime: void 0,
              subject: this.info.auditInfo.subject,
              decision: '',
              contactor: user.userEntity.nickName,
              phone: user.userEntity.mobile,
              material: '',
              writNoName: !!res.data[0] ? res.data[0].writNoName : ''
            }
          },
          err => console.info(err)
        )
      }
    },
    // 点击取消按钮事件
    close() {
      this.$emit('close')
    },
    // 点击确定按钮事件
    sure() {
      this.$refs.enforceInfo.validate((val,errInfo) => {
        if (val) {
          let data = getWritParams({
            tag2: this.enforceInfo.signer,
            tag3: this.enforceInfo.court,
            tag4: dateFormat(this.enforceInfo.decisionTime, 'yyyy年mm月dd日'), // 行政处罚决定书文书编号
            tag5: this.enforceInfo.subject,
            tag6: this.enforceInfo.decision,
            tag7: this.enforceInfo.writNoName,
            // tag8: '',
            tag9: this.enforceInfo.contactor,
            tag10: this.enforceInfo.phone
          })
          // data.map(_data => {
          //   if(_data.tagName === 'tag8') {
          //     _data.tagContent = this.handleInfo()
          //   }
          // })
          data = [...data, ...this.handleInfo()]
          console.info('DATA', data)
          let params = {
            companyId: this.info.auditInfo.companyId, //制作文书传company_id
            contractorIds: this.info.auditInfo.udtIds,
            writType: 'QZZXSQS',
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
    deleteRule(ind) {
      if (this.materialList.length == 1) {
        this.$message.error('请保证至少有一条附件材料')
      } else {
        this.materialList.splice(ind, 1)
      }
    },
    addDetail() {
      this.materialList.push({
        info: ''
      })
    },
    handleInfo() {
      if (this.materialList.length === 1 && this.materialList[0].info === '') {
        return [
          {
            tagName: 'tag8Item',
            tagContent: '无'
          }
        ]
      }
      let arr = this.materialList.reduce((total, item, index) => {
        total.push({
          // tagName: `entity1-col${index + 1}`,
          tagName: 'tag8Item',
          tagContent: item.info
        })
        return total
      }, [])
      return arr
    }
  }
}
</script>

<style lang="less" scoped>
.applicationForEnforcement {
  padding: 0 16px;

  .el-form-item {
    margin-bottom: -5px;

    /deep/ .el-input {
      width: 100% !important;
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
        width: 90%;
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

  .box {
    padding: 20px 20px 10px 20px;
    background: #eef5f9;

    .delete_buttons {
      margin-top: 8px;
      font-size: 0;
      text-align: right;

      span {
        font-size: 14px;
        color: #0099ff;
        cursor: pointer;

        & + span {
          margin-left: 16px;
        }

        &.delete {
          color: #ff3030;
        }
      }
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding-right: 16px;
  padding-bottom: 10px;
  border-top: 1px solid #e0e0e0;
  padding-top: 10px;
  margin-top: 15px;
}
</style>
