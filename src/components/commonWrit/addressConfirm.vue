<template>
  <div>
    <div class="address-confirm_content writ-overflow">
      <el-form
        ref="addressConfInfo"
        :model="addressConfInfo"
        label-width="100px"
        label-position="right"
        :rules="rules"
        :inline-message="true"
        :show-message="false"
      >
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item prop="address" label-width="140px">
              <div slot="label" class="slot_label">送达地址</div>
              <el-input v-model="addressConfInfo.address" placeholder="请输入送达地址" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="receiverComp" label-width="140px">
              <div slot="label" class="slot_label">收件人单位</div>
              <el-input v-model="addressConfInfo.receiverComp" placeholder="请输入收件人单位" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="postCode" label-width="140px">
              <div slot="label" class="slot_label">邮编</div>
              <el-input v-model="addressConfInfo.postCode" placeholder="请输入邮编" maxlength="6" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="14">
            <el-form-item label-width="160px" prop="creditCode">
              <div slot="label" class="slot_label">统一社会信用代码</div>
              <el-input v-model="addressConfInfo.creditCode" placeholder="请输入统一社会信用代码" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="9">
            <el-form-item label-width="140px" prop="legalPerson">
              <div slot="label" class="slot_label">法定代表人</div>
              <el-input v-model="addressConfInfo.legalPerson" placeholder="请输入法定代表人" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label-width="90px" :prop="addressConfInfo.mobile ? '' : 'officialPhone'">
              <div slot="label" class="slot_label">办公电话</div>
              <el-input v-model="addressConfInfo.officialPhone" placeholder="请输入办公电话" maxlength="12" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="90px" :prop="addressConfInfo.officialPhone ? '' : 'mobile'">
              <div slot="label" class="slot_label">移动电话</div>
              <el-input v-model="addressConfInfo.mobile" placeholder="请输入移动电话" maxlength="12" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="9">
            <el-form-item label-width="140px" prop="safePerson">
              <div slot="label" class="slot_label">安全管理负责人</div>
              <el-input v-model="addressConfInfo.safePerson" placeholder="请输入安全管理负责人" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label-width="90px" :prop="addressConfInfo.safeMobile ? '' : 'safeOfficialPhone'">
              <div slot="label" class="slot_label">办公电话</div>
              <el-input v-model="addressConfInfo.safeOfficialPhone" placeholder="请输入办公电话" maxlength="12" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="90px" :prop="addressConfInfo.safeOfficialPhone ? '' : 'safeMobile'">
              <div slot="label" class="slot_label">移动电话</div>
              <el-input v-model="addressConfInfo.safeMobile" placeholder="请输入移动电话" maxlength="12" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="140px">
              <div slot="label" class="slot_label">传真号码</div>
              <el-input v-model="addressConfInfo.faxCode" placeholder="请输入传真号码" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="130px" prop="email">
              <div slot="label" class="slot_label">电子邮件地址</div>
              <el-input v-model="addressConfInfo.email" placeholder="请输入电子邮件地址" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-form-item label-width="140px">
            <div slot="label"  class="slot_label">其他联系方式</div>
            <el-input v-model="addressConfInfo.otherWay" placeholder="请输入其他联系方式" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label-width="140px">
            <div slot="label" class="slot_label">备注</div>
            <el-input v-model="addressConfInfo.remark" type="textarea" :autosize="{ minRows: 1 }" placeholder="请输入备注" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label-width="200px" prop="suggestWay">
              <div slot="label" class="slot_label">受送达人建议送达方式</div>
              <el-radio v-model="addressConfInfo.suggestWay" label="直接送达" value="直接送达"></el-radio>
              <el-radio v-model="addressConfInfo.suggestWay" label="邮寄送达" value="邮寄送达"></el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="160px" prop="onlineWay">
              <div slot="label" class="slot_label">是否接受电子送达</div>
              <el-radio v-model="addressConfInfo.onlineWay" label="是" value="是"></el-radio>
              <el-radio v-model="addressConfInfo.onlineWay" label="否" value="否"></el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="dialog-footer" style="text-align: right;padding-bottom:10px;padding-top:10px;margin-top:10px">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">保存并生成送达地址确认书</el-button>
    </div>
  </div>
</template>

<script>
import { getWritParams, getFirstErrMsg } from '@/utils/util'
import { getDataInfo } from '@/api/enterpriseInfo'

export default {
  name: 'addressConfirm',
  props: ['info', 'isRecalled'],
  data() {
    var checkPhone = (rule, value, callback) => {
      let phoneReg = /^1[3|4|5|6|7|8][0-9]{9}$/
      if (!value) {
        return callback(new Error('请输入法定代表人移动电话或办公电话'))
      } else {
        setTimeout(() => {
          if (phoneReg.test(value)) {
            callback()
          } else {
            callback(new Error('电话号码格式不对'))
          }
        }, 100)
      }
    }
    var checkEmail = (rule, value, callback) => {
      var emailReg = /^([a-zA-Z0-9-_])+@([a-zA-Z0-9-_])+(.[a-zA-Z0-9-_])+$/
      if (!value) {
        // callback(new Error('请填写电子邮箱'))
        callback()
      } else {
        setTimeout(() => {
          if (emailReg.test(value)) {
            callback()
          } else {
            callback(new Error('请输入正确的邮箱格式'))
          }
        }, 100)
      }
    }
    return {
      addressConfInfo: {
        address: '', // 送达地址 tag2
        postCode: '', // 邮编 tag3
        receiverComp: '', // 收件人单位 tag4
        creditCode: '', // 统一社会信用代码 tag5
        legalPerson: '', // 法定代表人 tag6
        officialPhone: '', // 法定代表人办公电话 tag7
        mobile: '', // 移动电话 tag8
        safePerson: '', // 安全管理负责人 tag9
        safeOfficialPhone: '', // 安全管理负责人办公电话 tag10
        safeMobile: '', // 安全管理负责人移动电话 tag11
        faxCode: '', // 传真号码 tag12
        email: '', // 电子邮件地址 tag13
        otherWay: '', // 其他联系方式 tag14
        suggestWay: '邮寄送达', // 受送达人建议送达方式 tag15/tag16
        onlineWay: '是', // 是否接受电子送达 tag17/tag18
        remark: '' // 备注 tag19
      },
      rules: {
        address: [{ required: true, message: '请输入送达地址', trigger: 'blur' }],
        postCode: [
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
        receiverComp: [{ required: true, message: '请输入收件人单位', trigger: 'blur' }],
        creditCode: [{ required: true, message: '请输入统一社会信用代码', trigger: 'blur' }],
        legalPerson: [{ required: true, message: '请输入法定代表人', trigger: 'blur' }],
        officialPhone: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入法定代表人移动电话或办公电话'
          },
          {
            pattern: /^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
            trigger: ['blur', 'change'],
            message: '您输入的电话号码格式不正确'
          }
        ],
        mobile: [{ required: true, validator: checkPhone, trigger: 'blur' }],
        safePerson: [{ required: true, message: '请输入安全负责人', trigger: 'blur' }],
        safeOfficialPhone: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入安全管理负责人办公电话或移动电话'
          },
          {
            pattern: /^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
            trigger: ['blur', 'change'],
            message: '您输入的电话号码格式不正确'
          }
        ],
        safeMobile: [
          {
            required: true,
            trigger: ['blur', 'change'],
            message: '请输入安全管理负责人办公电话或移动电话'
          },
          {
            pattern: /^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
            trigger: ['blur', 'change'],
            message: '您输入的电话号码格式不正确'
          }
        ],
        faxCode: [{ required: false, message: '传真号码', trigger: 'blur' }],
        email: [{ required: false, validator: checkEmail, trigger: 'blur' }],
        otherWay: [{ required: true, message: '其他联系方式', trigger: 'blur' }],
        suggestWay: [{ required: true, message: '', trigger: 'blur' }],
        onlineWay: [{ required: true, message: '', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    if (this.info.writInfo) {
      let udtIds = null,
        sourceId = null,
        auditItems = []
      let inputInfo = this.info.writInfo.reduce((total, item, index) => {
        switch (item.tagName) {
          case 'tag2':
            total.address = item.tagContent
            break
          case 'tag3':
            total.postCode = item.tagContent
            break
          case 'tag4':
            total.receiverComp = item.tagContent
            break
          case 'tag5':
            total.creditCode = item.tagContent
            break
          case 'tag6':
            total.legalPerson = item.tagContent
            break
          case 'tag7':
            total.officialPhone = item.tagContent
            break
          case 'tag8':
            total.mobile = item.tagContent
            break
          case 'tag9':
            total.safePerson = item.tagContent
            break
          case 'tag10':
            total.safeOfficialPhone = item.tagContent
            break
          case 'tag11':
            total.safeMobile = item.tagContent
            break
          case 'tag12':
            total.faxCode = item.tagContent
            break
          case 'tag13':
            total.email = item.tagContent
            break
          case 'tag14':
            total.otherWay = item.tagContent
            break
          case 'tag15':
            total.suggestWay = item.tagContent == 'true' ? '直接送达' : '邮寄送达'
            break
          case 'tag17':
            total.onlineWay = item.tagContent == 'true' ? '是' : '否'
            break
          case 'tag19':
            total.remark = item.tagContent
            break
        }
        return total
      }, {})
      this.addressConfInfo = inputInfo
    } else {
      this.initInfo()
    }
  },
  methods: {
    // 初始化文书数据
    initInfo() {
      if (this.info.auditInfo.objectType === '0') {
        getDataInfo({ id: this.info.auditInfo.punishCompanyId }).then(res => {
          this.addressConfInfo = {
            address: this.info.auditInfo.objectAddress, // 送达地址 tag2
            postCode: this.info.auditInfo.postCode, // 邮编 tag3
            receiverComp: this.info.auditInfo.subject, // 收件人单位 tag4
            creditCode: res.data.companyCode, // 统一社会信用代码 tag5
            legalPerson: res.data.legalPerson, // 法定代表人 tag6
            officialPhone: res.data.legalPersonTelephone, // 法定代表人办公电话 tag7
            mobile: res.data.legalPersonMobilephone, // 移动电话 tag8
            safePerson: res.data.safetyPrimaryPerson, // 安全管理负责人 tag9
            safeOfficialPhone: res.data.safetyPrimaryPersonTelephone, // 安全管理负责人办公电话 tag10
            safeMobile: res.data.safetyPrimaryPersonMobilephone, // 安全管理负责人移动电话 tag11
            faxCode: res.data.companyFaxNo, // 传真号码 tag12
            email: res.data.safetyPrimaryPersonEmail, // 电子邮件地址 tag13
            otherWay: '', // 其他联系方式 tag14
            suggestWay: '邮寄送达', // 受送达人建议送达方式 tag15/tag16
            onlineWay: '是', // 是否接受电子送达 tag17/tag18
            remark: '' // 备注 tag19
          }
        })
      } else {
        this.addressConfInfo.address = this.info.auditInfo.objectAddress
        this.addressConfInfo.postCode = this.info.auditInfo.postCode
        this.addressConfInfo.receiverComp = this.info.auditInfo.currentCompany
      }
    },
    // 点击确定按钮事件
    sure() {
      this.$refs.addressConfInfo.validate((val, errInfo) => {
        if (val) {
          let data = getWritParams({
            tag2: this.addressConfInfo.address,
            tag3: this.addressConfInfo.postCode,
            tag4: this.addressConfInfo.receiverComp,
            tag5: this.addressConfInfo.creditCode,
            tag6: this.addressConfInfo.legalPerson,
            tag7: this.addressConfInfo.officialPhone,
            tag8: this.addressConfInfo.mobile,
            tag9: this.addressConfInfo.safePerson,
            tag10: this.addressConfInfo.safeOfficialPhone,
            tag11: this.addressConfInfo.safeMobile,
            tag12: this.addressConfInfo.faxCode,
            tag13: this.addressConfInfo.email,
            tag14: this.addressConfInfo.otherWay,
            tag15: this.addressConfInfo.suggestWay === '直接送达' ? true : false,
            tag16: this.addressConfInfo.suggestWay === '直接送达' ? false : true,
            tag17: this.addressConfInfo.onlineWay === '是' ? true : false,
            tag18: this.addressConfInfo.onlineWay === '是' ? false : true,
            tag19: this.addressConfInfo.remark
          })
          let params = {
            companyId: this.info.auditInfo.companyId, //制作文书传company_id
            contractorIds: this.info.auditInfo.udtIds,
            writType: 'SDDZQRS',
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
    }
  }
}
</script>

<style lang="less" scoped>
.address-confirm_content {
  padding: 10px 16px 0px 16px;
}
.el-form-item {
  margin-bottom: 0;
  white-space: nowrap;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #e0e0e0;
  padding: 5px 16px 5px 0;
  margin-top: 30px;
}
.el-input--suffix .el-input__inner {
  padding-right: 15px;
}
</style>
