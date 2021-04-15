<template>
  <div class="penalty-bottom_button end_audit_content">
    <el-form
      ref="endAudit"
      :inline-message="true"
      :show-message="false"
      label-width="140px"
      label-position="left"
      :rules="rules"
      :model="endAuditInfo"
    >
      <el-row :gutter="20">
        <el-col v-for="(item, index) in dataList" :key="index" :sm="24" :md="item.span">
          <el-form-item
            v-if="!item.belong || item.belong === objectType"
            :prop="item.codeName"
            :label-width="item.labelWidth"
          >
          
            <div v-if="item.component !== 'el-checkbox'" slot="label" class="slot_label">{{item.label}}</div>
            <component
              :is="item.component"
              v-model="endAuditInfo[item.codeName]"
              :type="item.type"
              :placeholder="item.placeholder"
              :autosize="item.autosize"
              :label="item.label"
              :readonly="item.readonly"
              :maxlength="item.maxlength"
            >
              <span v-if="item.component == 'div'">{{endAuditInfo[item.codeName]}}</span>
              <component
                v-for="(itm, ind) in item.child"
                :key="ind"
                :is="itm.component"
                :label="itm.label"
                :value="itm.value"
              ></component>
            </component>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <bottom-bar>
      <el-button class="end penalty-small_button" @click="goBack">取消</el-button>
      <el-button type="primary" class="penalty-small_button" @click="save">保存并生成案件终止审批表</el-button>
    </bottom-bar>
  </div>
</template>
<script>
import bottomBar from '@/components/bottomBar'
import { getWritParams, dateFormat, handleDateRef, getFirstErrMsg } from '@/utils/util'
import { getWritDataByWritId, createWrit, updateWrit } from '@api/fileRelated'
import { getEnterpriseInfo } from '@/api/inspectionScheme'

export default {
  name: 'endCaseAuditEdit',
  props: ['writInfo'],
  components: {
    bottomBar
  },
  data() {
    return {
      rules: {
        caseName: [{ required: true, trigger: 'blur', message: '请输入案件名称' }],
        name: [{ required: true, trigger: 'blur', message: '请输入当事人姓名' }],
        sex: [{ required: true, trigger: 'blur', message: '请选择性别' }],
        birthday: [{ required: true, trigger: 'blur', message: '请选择出生年月' }],
        homeAddress: [{ required: true, trigger: 'blur', message: '请输入当事人住址' }],
        compName: [{ required: true, trigger: 'blur', message: '请输入当事人名称' }],
        legalPerson: [{ required: true, trigger: 'blur', message: '请输入法人或负责人' }],
        compAddress: [{ required: true, trigger: 'blur', message: '请输入公司地址' }],
        contactPhone: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入电话号码'
          },
          {
            pattern: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/,
            trigger: ['blur', 'change'],
            message: '您输入的电话号码格式不正确'
          }
        ],
        caseSituation: [{ required: true, trigger: 'blur', message: '请输入案件基本情况' }]
      },
      objectType: '0', // 0 单位 1 个人
      dataList: [
        {
          label: '案件名称',
          value: '江阴市清扬浩辰塑料制品有限公司',
          component: 'div',
          codeName: 'caseName',
          span: 24,
          name: ''
        },
        {
          label: '姓名',
          value: '',
          component: 'el-input',
          placeholder: '输入当事人姓名',
          labelWidth: '',
          codeName: 'name',
          span: 12,
          name: '',
          belong: '1'
        },
        {
          label: '性别',
          value: '',
          component: 'el-select',
          placeholder: '请选择性别',
          labelWidth: '',
          codeName: 'sex',
          span: 12,
          name: '',
          child: [
            {
              component: 'el-option',
              label: '女',
              value: '女'
            },
            {
              component: 'el-option',
              label: '男',
              value: '男'
            }
          ],
          belong: '1'
        },
        {
          label: '出生年月',
          value: '',
          component: 'el-date-picker',
          placeholder: '请选择出生年月',
          labelWidth: '',
          codeName: 'birthday',
          name: '',
          span: 12,
          belong: '1'
        },
        {
          label: '住址',
          value: '',
          component: 'el-input',
          placeholder: '请输入当事人住址',
          labelWidth: '',
          codeName: 'homeAddress',
          span: 24,
          name: '',
          belong: '1'
        },
        {
          label: '当事人',
          value: '',
          component: 'el-input',
          placeholder: '请输入当事人名称',
          labelWidth: '',
          codeName: 'compName',
          span: 24,
          name: '',
          belong: '0'
        },
        {
          label: '法人/负责人',
          value: '',
          component: 'el-input',
          placeholder: '请输入法人或负责人',
          labelWidth: '',
          codeName: 'legalPerson',
          span: 24,
          name: '',
          belong: '0'
        },
        {
          label: '公司地址',
          value: '',
          component: 'el-input',
          placeholder: '请输入公司地址',
          labelWidth: '',
          codeName: 'compAddress',
          span: 24,
          name: '',
          belong: '0'
        },
        {
          label: '联系电话',
          value: '',
          component: 'el-input',
          placeholder: '请输入联系电话',
          labelWidth: '',
          codeName: 'contactPhone',
          maxlength: 12,
          span: 24,
          name: '',
          belong: '0'
        },
        {
          label: '案件基本情况',
          value: '',
          component: 'el-input',
          placeholder: '请输入案件基本情况',
          labelWidth: '',
          codeName: 'caseSituation',
          span: 24,
          type: 'textarea',
          autosize: { minRows: 1 },
          name: ''
        },
        {
          label: '案件终止的具体情形',
          value: '',
          component: 'div',
          placeholder: '',
          labelWidth: '200px',
          codeName: '',
          span: 24,
          name: ''
        },
        {
          label: '当事人死亡或失踪',
          value: false,
          component: 'el-checkbox',
          placeholder: '',
          labelWidth: '0',
          codeName: 'missing',
          span: 24,
          name: ''
        },
        {
          label: '法人或者其他组织终止，无财产可供执行的',
          value: false,
          component: 'el-checkbox',
          placeholder: '',
          labelWidth: '0',
          codeName: 'uncapable',
          span: 24,
          name: ''
        },
        {
          label: '据以执行的行政处理决定被撤销的',
          value: false,
          component: 'el-checkbox',
          placeholder: '',
          labelWidth: '0',
          codeName: 'retrieved',
          span: 24,
          name: ''
        },
        {
          label: '其他需要终止的',
          value: true,
          component: 'el-checkbox',
          placeholder: '',
          labelWidth: '0',
          codeName: 'others',
          span: 24,
          name: ''
        }
      ],
      endAuditInfo: {
        caseName: '', // 案件名称 tag2
        name: '', // 姓名 tag3
        sex: '', // 性别 tag4
        birthday: void 0, // 出生年月 tag5
        homeAddress: '', // 住址 tag6
        compName: '', // 公司名称 tag7
        legalPerson: '', // 法人、代表人或负责人 tag8
        compAddress: '', // 公司地址 tag9
        contactPhone: '', // 联系电话 tag 10
        caseSituation: '', // 案件基本情况 tag11
        missing: false, // 当事人死亡或失踪 tag12
        uncapable: false, // 法人或者其他组织终止，无财产可供执行的 tag13
        retrieved: false, // 据以执行的行政处理决定被撤销的 tag14
        others: true // 其他需要终止的 tag15
      }
    }
  },
  created() {
    if (this.writInfo && this.writInfo.writId) {
      this.reflect()
    } else {
      this.initInfo()
    }
    this.objectType = this.$store.state.penalty.penaltyUndEntity.objectType
  },
  methods: {
    // 回到上一页
    goBack() {
      this.$parent.initInfo()
    },
    initInfo() {
      let _penalty = this.$store.state.penalty
      if (_penalty.penaltyUndEntity.objectType === '0') {
        this.objectType = '0'
        getEnterpriseInfo({
          id: _penalty.penaltyUndEntity.punishCompanyId
        }).then(res => {
          this.endAuditInfo = {
            caseName: _penalty.penaltyUndEntity.caseName, // 案件名称 tag2
            compName: _penalty.punishCompanyName, // 公司名称 tag7
            legalPerson: res.data.legalPerson ? res.data.legalPerson : '', // 法人、代表人或负责人 tag8
            compAddress: _penalty.penaltyUndEntity.objectAddress, // 公司地址 tag9
            contactPhone: _penalty.penaltyUndEntity.telphone, // 联系电话 tag 10
            caseSituation: _penalty.penaltyUndEntity.caseSituation, // 案件基本情况 tag11
            missing: false, // 当事人死亡或失踪 tag12
            uncapable: false, // 法人或者其他组织终止，无财产可供执行的 tag13
            retrieved: false, // 据以执行的行政处理决定被撤销的 tag14
            others: true
          }
        })
      } else {
        this.endAuditInfo = {
          caseName: _penalty.penaltyUndEntity.caseName, // 案件名称 tag2
          name: _penalty.penaltyUndEntity.punishPersonName, // 姓名 tag3
          sex: _penalty.penaltyUndEntity.sex === '1' ? '女' : '男', // 性别 tag4
          birthday: new Date(_penalty.penaltyUndEntity.birthday), // 出生年月 tag5
          homeAddress: _penalty.penaltyUndEntity.objectAddress, // 住址 tag6
          caseSituation: _penalty.penaltyUndEntity.caseSituation, // 案件基本情况 tag11
          missing: false, // 当事人死亡或失踪 tag12
          uncapable: false, // 法人或者其他组织终止，无财产可供执行的 tag13
          retrieved: false, // 据以执行的行政处理决定被撤销的 tag14
          others: true // 其他需要终止的 tag15
        }
      }
    },
    // 文书回显
    reflect() {
      getWritDataByWritId({ writId: this.writInfo.writId }).then(res => {
        let _penalty = this.$store.state.penalty
        this.objectType = _penalty.penaltyUndEntity.objectType
        let inputInfo = res.data.reduce((total, item) => {
          switch (item.tagName) {
            case 'tag2':
              total.caseName = item.tagContent
              break
            case 'tag3':
              total.name = item.tagContent
              break
            case 'tag4':
              total.sex = item.tagContent
              break
            case 'tag5':
              total.birthday = handleDateRef(item.tagContent)
              break
            case 'tag6':
              total.homeAddress = item.tagContent
              break
            case 'tag7':
              total.compName = item.tagContent
              break
            case 'tag8':
              total.legalPerson = item.tagContent
              break
            case 'tag9':
              total.compAddress = item.tagContent
              break
            case 'tag10':
              total.contactPhone = item.tagContent
              break
            case 'tag11':
              total.caseSituation = item.tagContent
              break
            case 'tag12':
              total.missing = item.tagContent === 'false' ? false : true
              break
            case 'tag13':
              total.uncapable = item.tagContent === 'false' ? false : true
              break
            case 'tag14':
              total.retrieved = item.tagContent === 'false' ? false : true
              break
            case 'tag15':
              total.others = item.tagContent === 'false' ? false : true
              break
          }
          return total
        }, {})
        this.endAuditInfo = inputInfo
      })
    },
    // 制作案件终止审批表
    save() {
      this.$refs.endAudit.validate((valid, errInfo) => {
        if (valid) {
          if (this.endAuditInfo.missing || this.endAuditInfo.uncapable || this.endAuditInfo.retrieved || this.endAuditInfo.others) {
            let data = getWritParams({
              tag2: this.endAuditInfo.caseName,
              tag3: this.endAuditInfo.name,
              tag4: this.endAuditInfo.sex,
              tag5: dateFormat(this.endAuditInfo.birthday, 'yyyy年mm月dd日'),
              tag6: this.endAuditInfo.homeAddress,
              tag7: this.endAuditInfo.compName,
              tag8: this.endAuditInfo.legalPerson,
              tag9: this.endAuditInfo.compAddress,
              tag10: this.endAuditInfo.contactPhone,
              tag11: this.endAuditInfo.caseSituation,
              tag12: this.endAuditInfo.missing,
              tag13: this.endAuditInfo.uncapable,
              tag14: this.endAuditInfo.retrieved,
              tag15: this.endAuditInfo.others
            })
            let params = {
                companyId: this.$store.state.penalty.penaltyUndEntity.punishCompanyId, //制作文书传company_id
              contractorIds: this.$store.state.penalty.penaltyUndEntity.udtIds,
              writType: 'AJZZYJS',
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
            this.$message({
              type: 'error',
              message: '请选一个案件终止的具体情形'
            })
          }
        } else {
          this.$message({
            type: 'error',
            message: getFirstErrMsg(errInfo)
          })
        }
      })
    },
    getMessage(type, message) {
      this.$message({
        type: type,
        message: message
      })
    }
  }
}
</script>
<style lang="less" scope>
.end {
  background: white !important;
}
.end_audit_content {
  padding: 4px 14px;
  .el-form {
    /deep/ .el-form-item {
      margin-bottom: 0px !important;
      display: flex;
      flex-wrap: nowrap;
      .el-date-editor.el-input,
      .el-date-editor.el-input__inner {
        width: 100%;
      }
      .el-select {
        width: 100%;
      }
      .el-form-item__content {
        flex: 1;
        margin-left: 0px !important;
      }
    }
  }
}
.el-input-number.is-without-controls .el-input__inner {
  text-align: left;
}
.penalty-bottom_button {
  /deep/ .bottom-button-container {
    right: 0;
  }
  &.transfer_book_content {
    padding: 3px 16px 0;
  }
}
</style>
