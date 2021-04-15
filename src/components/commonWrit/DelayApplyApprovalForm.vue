<template>
  <div class="delayForm">
    <div class="delayFormWrap">
      <div class="approvalForm_content">
        <div class="flex justify-content-space-between">
          <div class="content-list">
            <el-form :model="ruleForm" ref="ruleForm" label-width="110px" :rules="rules" :show-message="false">
              <el-row>
                <el-col>
                  <el-form-item label="" prop="category">
                    <div slot="label" class="slot_label">当事人类别</div>
                    <el-select v-model="ruleForm.category" placeholder="请选择当事人类别" @change="selectChange('ruleForm')">
                      <el-option label="单位" value="0"></el-option>
                      <el-option label="个人" value="1"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- 单位 -->
              <div v-if="showCompany">
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-form-item label="" prop="unitName">
                      <div slot="label" class="slot_label">单位名称</div>
                      <el-input v-model="ruleForm.unitName" placeholder="请输入单位名称" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="" prop="person">
                      <div slot="label" class="slot_label">法定代表人</div>
                      <el-input v-model="ruleForm.person" placeholder="请输入法定代表人" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="" prop="phone">
                      <div slot="label" class="slot_label">联系电话</div>
                      <el-input v-model="ruleForm.phone" placeholder="请输入联系电话" maxlength="12" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="" prop="companyCode">
                      <div slot="label" class="slot_label">邮政编码</div>
                      <el-input v-model="ruleForm.companyCode" placeholder="请输入邮编" maxlength="6" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col>
                    <el-form-item label="" prop="address">
                      <div slot="label" class="slot_label">详细地址</div>
                      <el-input v-model="ruleForm.address" placeholder="请输入详细地址" clearable></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <!-- 个人 -->
              <div v-if="showPerson">
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-form-item label="" prop="personName">
                      <div slot="label" class="slot_label">个人姓名</div>
                      <el-input v-model="ruleForm.personName" placeholder="请输入姓名" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="">
                      <div slot="label" class="slot_label">出生年月</div>
                      <el-date-picker v-model="ruleForm.value" type="date" placeholder="出生年月" :picker-options="pickerOptionsBorn"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="" prop="sex">
                      <div slot="label" class="slot_label">性别</div>
                      <el-select v-model="ruleForm.sex" placeholder="请选择性别">
                        <el-option value="男"></el-option>
                        <el-option value="女"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="" prop="companyName">
                      <div slot="label" class="slot_label">所在单位</div>
                      <el-input v-model="ruleForm.companyName" placeholder="请输入单位名称" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col>
                    <el-form-item label="" prop="unitAddress">
                      <div slot="label" class="slot_label">单位地址</div>
                      <el-input v-model="ruleForm.unitAddress" placeholder="请输入单位地址" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col>
                    <el-form-item label="" prop="homeAddress">
                      <div slot="label" class="slot_label">家庭住址</div>
                      <el-input v-model="ruleForm.homeAddress" placeholder="请输入家庭住址" clearable></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="12">
                    <el-form-item label="" prop="personPhone">
                      <div slot="label" class="slot_label">联系电话</div>
                      <el-input v-model="ruleForm.personPhone" placeholder="请输入联系电话" maxlength="12" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="" prop="personCode">
                      <div slot="label" class="slot_label">邮政编码</div>
                      <el-input v-model="ruleForm.personCode" placeholder="请输入邮政邮编" maxlength="6" clearable></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
              <el-form-item label="" prop="appMatter">
                <div slot="label" class="slot_label">申请事项</div>
                <el-input type="textarea" :autosize="{ minRows: 2 }" v-model="ruleForm.appMatter"></el-input>
              </el-form-item>
              <el-form-item label="" prop="delayReason">
                <div slot="label" class="slot_label">延期理由</div>
                <el-input type="textarea" :autosize="{ minRows: 2 }" v-model="ruleForm.delayReason"></el-input>
              </el-form-item>

              <el-form-item label="" prop="delayTime">
                <div slot="label" class="slot_label">延期时间</div>
                <el-date-picker v-model="ruleForm.delayTime" type="date" placeholder="请选择延期时间" :picker-options="pickerOptions"></el-date-picker>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="callOf">取消</el-button>
        <el-button type="primary" @click="makeExtApplicationPdf('ruleForm')">保存并生成延期审批表</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { dateFormat, getWritParams } from '@/utils/util'
import { getInvesWrits, createWrit, updateWrit, deleteWrit, getWritInfo, getWritDataByWritId } from '@api/fileRelated' //新建文书
import { mapState } from 'vuex'
import { getComInfo } from '@/api/onSiteInspection/index'
import showPdf from '@/components/showPdf/index'
import { showRectificationReviewDetail, saveRectificationDelayDetail } from '@/api/rectification'
import { Throttle } from '@/utils/util'
import Bus from '@/bus'
export default {
  name: '',
  components: {
    showPdf
  },
  props: {
    spbInfo: {
      type: Array
    },
    writIdInSPB: {
      type: String
    },
    applyFromDelayStatus: {
      type: Boolean
    }
  },
  data() {
    return {
      ruleForm: {
        category: '', //默认打开单位
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
        unitAddress: '',
        homeAddress: '',
        personPhone: '',
        delayReason: '',
        appMatter: '',
        delayTime: '',
        targetName: '',
        number: '',
        decision: '',
        delayReason: '',
        decisionTime: '',
        delayTime: ''
      },
      rules: {
        category: [{ required: true, message: '请输入当事人类别', trigger: 'blur' }],
        unitName: [{ required: true, message: '请输入单位名称', trigger: 'blur' }],
        person: [{ required: true, message: '请输入法人代表人', trigger: 'blur' }],
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
        ],
        companyCode: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入邮编'
          },
          {
            pattern: /^(0[1234567]|1[012356]|2[01234567]|3[0123456]|4[01234567]|5[1234567]|6[1234567]|7[012345]|8[013456])\d{4}$/,
            trigger: ['blur', 'change'],
            message: '您输入的邮编格式不正确'
          }
        ],
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        personName: [{ required: true, message: '请输入个人姓名', trigger: 'blur' }],
        value: [{ required: true, message: '请输入出生年月', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        companyName: [{ required: true, message: '请选择所在单位', trigger: 'blur' }],
        unitAddress: [{ required: true, message: '请选择单位地址', trigger: 'blur' }],
        homeAddress: [{ required: true, message: '请选择家庭住址', trigger: 'blur' }],
        personPhone: [
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
        ],
        personCode: [
          {
            required: true,
            trigger: 'blur',
            message: '请输入邮编'
          },
          {
            pattern: /^(0[1234567]|1[012356]|2[01234567]|3[0123456]|4[01234567]|5[1234567]|6[1234567]|7[012345]|8[013456])\d{4}$/,
            trigger: ['blur', 'change'],
            message: '您输入的邮编格式不正确'
          }
        ],
        appMatter: [{ required: true, message: '请选择申请事项', trigger: 'blur' }],
        delayReason: [{ required: true, message: '请选择延期理由', trigger: 'blur' }],
        delayTime: [{ required: true, message: '请选择延期理由', trigger: 'blur' }]
      },
      showCompany: false,
      showPerson: false,
      businessId: '',
      updateWritStatus: false,
      updateId: '',
      sealInfo: {}, //提交审核的信息
      editData: {}, //修改的数据
      // 禁止选择当前时间之前的检查时间
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      // 选择出生日期时禁止选择当前日期之后的日期
      pickerOptionsBorn: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  methods: {
    callOf() {
      this.$emit('cancel')
    },
    makeExtApplicationPdf() {
      if (this.ruleForm.category === '0') {
        // 单位
        this.ruleForm.companyName = null
        this.ruleForm.unitAddress = null
        this.ruleForm.personCode = null
        this.makeExtApplication()
      } else {
        // 个人
        this.ruleForm.unitName = null
        this.ruleForm.person = null
        this.ruleForm.address = null
        this.ruleForm.companyCode = null
        this.ruleForm.phone = null
        this.makeExtApplication()
      }
    },
    // 制作审批表 生成文书
    makeExtApplication() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.updateWritStatus === false) {
            // 第一次生成
            // 先延期成功
            saveRectificationDelayDetail({
              reviewId: this.delayDataId,
              delayCheckId: this.$store.state.newDelayArr.join(',')
            }).then(
              res => {
                if (res.code === '0') {
                  this.businessId = res.id
                  if (this.businessId) {
                    // 再生成文书
                    let params = {
                      companyId: this.delayCompanyId, //执法检查模块制作文书传company_id
                      contractorIds: this.delayExecutorId,
                      sourceId: this.delayDataId,
                      writType: 'ZGFCYQSQSPB',
                      businessId: this.businessId
                    }
                    let data = getWritParams({
                      tag2: this.ruleForm.unitName,
                      tag3: this.ruleForm.person,
                      tag4: this.ruleForm.phone,
                      tag5: this.ruleForm.address,
                      tag6: this.ruleForm.companyCode,
                      tag7: this.ruleForm.personName,
                      tag8: this.ruleForm.value ? dateFormat(this.ruleForm.value, 'yyyy-mm-dd') : '',
                      tag9: this.ruleForm.sex,
                      tag10: this.ruleForm.companyName,
                      tag11: this.ruleForm.unitAddress,
                      tag12: this.ruleForm.homeAddress,
                      tag13: this.ruleForm.personPhone,
                      tag14: this.ruleForm.personCode,
                      tag15: this.ruleForm.appMatter,
                      tag16: this.ruleForm.delayReason,
                      tag17: this.delayPerson,
                      delayTime: dateFormat(this.ruleForm.delayTime, 'yyyy-mm-dd HH:MM:ss'),
                      UNITORPERSON: this.ruleForm.category
                    })
                    params.data = data
                    this.$emit('createPdf', params)
                  }
                }
              },
              err => {
                this.$message.error('延期失败!已延期不能再延期了')
              }
            )
          } else if (this.updateWritStatus === true) {
            // 修改文书
            let data = getWritParams({
              tag2: this.ruleForm.unitName,
              tag3: this.ruleForm.person,
              tag4: this.ruleForm.phone,
              tag5: this.ruleForm.address,
              tag6: this.ruleForm.companyCode,
              tag7: this.ruleForm.personName,
              tag8: this.ruleForm.value ? dateFormat(this.ruleForm.value, 'yyyy-mm-dd') : '',
              tag9: this.ruleForm.sex,
              tag10: this.ruleForm.companyName,
              tag11: this.ruleForm.unitAddress,
              tag12: this.ruleForm.homeAddress,
              tag13: this.ruleForm.personPhone,
              tag14: this.ruleForm.personCode,
              tag15: this.ruleForm.appMatter,
              tag16: this.ruleForm.delayReason,
              tag17: this.delayPerson,
              delayTime: dateFormat(this.ruleForm.delayTime, 'yyyy-mm-dd HH:MM:ss'),
              UNITORPERSON: this.ruleForm.category
            })
            let params = {
              writId: this.updateId,
              data: data
            }
            this.$emit('updateWrit', params)
          }
        } else {
          console.info('error submit')
        }
      })
    },
    // 切换单位和个人审批表
    selectChange() {
      if (this.ruleForm.category == '') {
        this.showCompany = false
        this.showPerson = false
      } else if (this.ruleForm.category == 0) {
        // 单位
        this.showCompany = true
        this.showPerson = false
      } else if (this.ruleForm.category == 1) {
        // 个人
        this.showCompany = false
        this.showPerson = true
      }
    },
    editFormData() {
      this.editData = JSON.parse(JSON.stringify(this.spbInfo))
      if (this.editData && this.editData.length > 0) {
        this.updateWritStatus = true
        //格式化数据
        this.editData.forEach(item => {
          switch (item.tagName) {
            case 'UNITORPERSON':
              this.ruleForm.category = item.tagContent
              if (this.ruleForm.category === '0') {
                this.showCompany = true
                this.showPerson = false
              } else {
                this.showPerson = true
                this.showCompany = false
              }
              this.initDelayData()
              break
            case 'tag2':
              this.ruleForm.unitName = item.tagContent
              break
            case 'tag3':
              this.ruleForm.person = item.tagContent
              break
            case 'tag4':
              this.ruleForm.phone = item.tagContent
              break
            case 'tag5':
              this.ruleForm.address = item.tagContent
              break
            case 'tag6':
              this.ruleForm.companyCode = item.tagContent
              break
            case 'tag7':
              this.ruleForm.personName = item.tagContent
              break
            case 'tag8':
              this.ruleForm.value =
                item.tagContent && item.tagContent !== ''
                  ? item.tagContent
                      .replace('年', '-')
                      .replace('月', '-')
                      .replace('日', '')
                  : null
              break
            case 'tag9':
              this.ruleForm.sex = item.tagContent
              break
            case 'tag10':
              this.ruleForm.companyName = item.tagContent
              break
            case 'tag11':
              this.ruleForm.unitAddress = item.tagContent
              break
            case 'tag12':
              this.ruleForm.homeAddress = item.tagContent
              break
            case 'tag13':
              this.ruleForm.personPhone = item.tagContent
              break
            case 'tag14':
              this.ruleForm.personCode = item.tagContent
              break
            case 'tag15':
              this.ruleForm.appMatter = item.tagContent
              break
            case 'tag16':
              this.ruleForm.delayReason = item.tagContent
              break
            case 'delayTime':
              this.ruleForm.delayTime = item.tagContent && item.tagContent !== '' ? item.tagContent.replace('/', '-').replace('/', '-') : null
              break
          }
        })
      }
    },
    initDelayData(type) {
      // 数据格式化
      if (type === 'create') {
        this.showCompany = true
        this.ruleForm.category = '0'
        // 单位
        this.ruleForm.delayReason = null
        this.ruleForm.appMatter = null
        this.ruleForm.delayTime = null
        // 个人
        this.ruleForm.homeAddress = null
        this.ruleForm.sex = null
        this.ruleForm.value = null
      }

      // 表格默认数据
      getComInfo({ id: this.delayCompanyId }).then(res => {
        // 单位联系电话，需要带入--法人电话，个人类型的，需要带入所在单位、单位地址、邮编
        if (!res.data) return
        if (!this.applyFromDelayStatus && this.showCompany) {
          this.ruleForm.companyName = res.data.companyName
          this.ruleForm.unitAddress = res.data.businessAddress
          this.ruleForm.personCode = res.data.postalCode
        } else if (!this.applyFromDelayStatus && this.showPerson) {
          this.ruleForm.unitName = res.data.companyName
          this.ruleForm.person = res.data.legalPerson
          this.ruleForm.phone = res.data.legalPersonTelephone
          this.ruleForm.companyCode = res.data.postalCode
          this.ruleForm.address = res.data.businessAddress
        } else {
          this.ruleForm.unitName = res.data.companyName
          this.ruleForm.companyName = res.data.companyName
          this.ruleForm.person = res.data.legalPerson
          this.ruleForm.phone = res.data.legalPersonTelephone
          this.ruleForm.address = res.data.businessAddress
          this.ruleForm.unitAddress = res.data.businessAddress
          this.ruleForm.companyCode = res.data.postalCode
          this.ruleForm.personCode = res.data.postalCode
        }
      })
    }
  },
  created() {
    if (!this.applyFromDelayStatus) {
      // 取到默认的数据信息
      this.updateId = this.writIdInSPB
      this.editFormData()
    } else {
      this.initDelayData('create')
    }
  },
  mounted() {},
  destroyed() {
    this.editData = null
  },
  computed: {
    ...mapState(['delayExecutorId', 'delayDataId', 'delayCompanyId', 'delayPerson', 'delayStartTime'])
  },
  watch: {
    applyFromDelayStatus: function(val, oldVal) {
      if (this.applyFromDelayStatus == true) {
        // 为真即是要重新编辑表单生成新的文书 一些数据必须置空
        // 取默认信息
        this.initDelayData('create')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.delayForm {
  .approvalForm_content {
    width: 100%;
    background: #fff;
    padding: 10px 16px 10px 16px;
    box-sizing: border-box;
    border-radius: 8px;
    position: relative;
    .content-list {
      // line-height: 40px;
      color: #333333;
      // width: 668px;
      width: 100%;
      border-bottom: none;
      // .el-select {
      //   width: 228px;
      // }
    }
    /deep/.el-date-editor.el-input,
    /deep/.el-form-item {
      width: auto;
      margin-bottom: 0px;
    }
    .pdf {
      width: 916px;
    }
    .make-writ-dialog {
      /deep/ .el-dialog {
        width: 700px;
      }
    }

    .el-textarea {
      // padding-bottom: 5px;
      margin: 5px 0;
    }
  }

  .dialog-footer {
    text-align: right;
    height: 42px;
    // padding: 6px 16px;
    padding-top: 10px;
    padding-right: 30px;
    border-top: 1px solid #e0e0e0;
  }
}
</style>
