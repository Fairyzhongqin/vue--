<template>
  <div class="make-end_lay penalty-bottom_button">
    <div class="lay">
      <el-form label-width="100px" label-position="left" :model="endCaseInfo" :rules="rules" :inline-message="true" :show-message="false" ref="endCase">
        <el-row>
          <el-col v-for="(item, index) in formData" v-show="!item.hide" :key="index" :span="item.span">
            <el-form-item :label="`${item.label}：`" label-width="110px" :class="item.class" :prop="item.codeName">
              <component
                :is="item.compont"
                v-model="endCaseInfo[item.codeName]"
                :placeholder="item.placeholder"
                :type="item.type"
                autosize
                :format="item.format"
              >
                <span v-if="item.compont == 'div'" :title="`${endCaseInfo[item.codeName]}`">{{ endCaseInfo[item.codeName] }}</span>
                <component v-for="(itm, ind) in item.child" :key="ind" :is="itm.compont" :label="itm.label" :value="itm.value"></component>
              </component>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <penalty-upload :sourceType="'AJCXJLD'" :btnText="'案件终止材料'" :forBrowse="forBrowse"></penalty-upload>
    </div>
    <bottom-bar>
      <el-button class="penalty-small_button cancel_endCase" @click="goBack">取消</el-button>
      <el-button type="primary" class="penalty-small_button" size="mini" @click="makeCase">保存并生成案件终止记录单</el-button>
    </bottom-bar>
  </div>
</template>

<script>
import bottomBar from '@/components/bottomBar'
import { getDataInfo } from '@/api/enterpriseInfo'
import { getWritParams, dateFormat, handleDateRef } from '@/utils/util'
import { createWrit, updateWrit, getWritInfo, getWritDataByWritId } from '@api/fileRelated'
import { getCurrentProcess } from '@/api/filingRegister/index'
import penaltyUpload from '@/pages/commonHandle/components/penaltyUpload.vue'

export default {
  name: 'anjianzhongzhiMakePage',
  components: {
    penaltyUpload,
    bottomBar
  },
  data() {
    return {
      rules: {
        approval: [{ required: true, message: '请输入批准人', trigger: 'blur' }],
        apprTime: [{ required: true, message: '请输入批准时间', trigger: 'blur' }],
        reason: [{ required: true, message: '请输入撤销原因', trigger: 'blur' }]
      },
      formData: [
        {
          label: '被处罚单位（个人）',
          compont: 'div',
          codeName: 'subject',
          value: '',
          span: 24,
          class: 'end_subject'
        },
        {
          label: '案件名称',
          compont: 'div',
          codeName: 'caseName',
          value: '',
          span: 24,
          labelWidth: '100px'
        },
        {
          label: '承办人',
          compont: 'div',
          codeName: 'udtNames',
          value: '',
          span: 12
        },
        {
          label: '文书编号',
          compont: 'div',
          codeName: 'writNoName',
          value: '',
          span: 12
        },
        {
          label: '批准人',
          compont: 'el-input',
          codeName: 'approval',
          value: '',
          span: 12,
          placeholder: '请输入批准人'
        },
        {
          label: '批准时间',
          compont: 'el-date-picker',
          codeName: 'apprTime',
          format: 'yyyy-MM-dd',
          type: 'date',
          value: void 0,
          span: 12,
          placeholder: '请选择批准时间'
        },

        {
          label: '撤销原因',
          codeName: 'reason',
          compont: 'el-input',
          type: 'textarea',
          value: '',
          span: 24,
          placeholder: '请输入撤销原因'
        }
      ],
      endCaseInfo: {
        caseName: '', // 案件名称
        writNoName: '', // 文书编号
        subject: '', // 终止对象
        udtNames: '', // 承办人
        approval: '', // 批准人
        apprTime: void 0, // 批准时间
        reason: '' // 撤销原因
      },
      penalty: {},
      companyInfo: {}
    }
  },
  props: ['writInfo', 'forBrowse'],
  mounted() {
    if (this.writInfo && this.writInfo.writId) {
      this.reflect()
    } else {
      this.setFormData()
    }
  },
  methods: {
    setFormData() {
      let _penalty = this.$store.state.penalty
      this.endCaseInfo = {
        caseName: _penalty.penaltyUndEntity.caseName, // 案件名称
        writNoName: '', // 文书编号
        subject: _penalty.penaltyUndEntity.objectType === '0' ? _penalty.punishCompanyName : _penalty.penaltyUndEntity.punishPersonName, // 终止对象
        udtNames: _penalty.udtNames, // 承办人
        approval: '', // 批准人
        apprTime: new Date(), // 批准时间
        reason: '' // 撤销原因
      }
      let req = {
        sourceId: this.$store.state.penalty.penaltyUndEntity.penaltyId,
        type: 'LASPB'
      }
      getWritInfo(req).then(
        res => {
          if (res.data[0]) {
            this.endCaseInfo.writNoName = res.data[0].writNoName
          }
        },
        err => console.info(err)
      )
    },
    // 文书回显
    reflect() {
      getWritDataByWritId({ writId: this.writInfo.writId }).then(res => {
        console.info('112211', res.data)
        let inputInfo = res.data.reduce((total, item) => {
          switch (item.tagName) {
            // case "tag1":
            //   total.caseName = item.tagContent;
            //   break;
            case 'tag2':
              total.writNoName = item.tagContent
              break
            case 'tag3':
              total.subject = item.tagContent
              break
            case 'tag4':
              total.reason = item.tagContent
              break
            case 'tag5':
              total.approval = item.tagContent
              break
            case 'tag6':
              total.apprTime = handleDateRef(item.tagContent)
              break
            case 'tag7':
              total.udtNames = item.tagContent
              break
          }
          return total
        }, {})
        this.endCaseInfo = inputInfo
        this.endCaseInfo.caseName = this.$store.state.penalty.penaltyUndEntity.caseName
      })
    },
    makeCase() {
      this.$refs.endCase.validate(val => {
        if (val) {
          let _entity = this.$store.state.penalty.penaltyUndEntity
          let companyInfo = this.companyInfo
          let data = getWritParams({
            tag1: this.endCaseInfo.caseName,
            tag2: this.endCaseInfo.writNoName,
            tag3: this.endCaseInfo.subject,
            tag4: this.endCaseInfo.reason,
            tag5: this.endCaseInfo.approval,
            tag6: dateFormat(this.endCaseInfo.apprTime, 'yyyy年mm月dd日'),
            tag7: this.endCaseInfo.udtNames
          })
          let params = {
            contractorIds: _entity.udtIds,
            writType: 'AJCXJLD',
            sourceId: _entity.penaltyId,
            data: data
          }
          // 创建文书
          this.createWrit(params)
        } else {
          this.getMessage('warning', '还有必填项没有填写！')
        }
      })
    },
    // 回到上一页
    goBack() {
      this.$parent.initStatus()
      this.$emit('pageChange', '')
    },
    // 生成文书
    createWrit(reqData) {
      if (this.writInfo && this.writInfo.writId) {
        updateWrit({ writId: this.writInfo.writId }, reqData.data).then(
          res => {
            this.getMessage('success', '制作成功！')
            this.$parent.initStatus('afterCreated')
          },
          err => {
            this.getMessage('error', '制作失败！')
          }
        )
        return
      }
      createWrit(reqData)
        .then(res => {
          this.getMessage('success', '制作成功！')
          this.$parent.initStatus('afterCreated')
        })
        .catch(err => {
          this.getMessage('error', '制作失败！')
        })
    },
    // 弹出提示信息
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
.make-end_lay {
  position: relative;
  .lay {
    padding: 0 16px;
  }
  .el-form-item {
    margin-bottom: 0px;
    margin-right: 10px;
    /deep/ .el-input__prefix,
    .el-input__suffix {
      text-align: right;
    }
  }
  .el-date-editor--date {
    width: 100% !important;
    /deep/ .el-icon-date {
      width: 100%;
      text-align: left;
    }
  }
  .el-form-item__content > div > span {
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: keep-all;
    overflow: hidden;
    display: block;
  }
  .el-form-item:not(.is-required) {
    margin-left: 10px;
    /deep/ .el-form-item__label {
      width: 100px !important;
    }
    /deep/ .el-form-item__content {
      margin-left: 100px !important;
    }
  }
  .el-form-item.end_subject {
    /deep/ .el-form-item__label {
      width: 155px !important;
    }
    /deep/ .el-form-item__content {
      margin-left: 155px !important;
    }
  }
}
.penalty-bottom_button {
  /deep/ .bottom-button-container {
    right: 0;
  }
  .cancel_endCase {
    background: white !important;
  }
}
</style>
