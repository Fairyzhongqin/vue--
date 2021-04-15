<template>
  <div style="height: 100%, width: 100%" class="examinationWrap">
    <div class="examination_content">
      <el-form
        size="small"
        ref="examinationform"
        :model="examinationform"
        :rules="rules"
        :show-message="false"
        label-width="100px"
        label-position="left"
      >
        <el-row>
          <el-col>
            <el-form-item label="" prop="caseName">
              <div slot="label" class="slot_label">案件名称</div>
              <el-input
                v-model="examinationform.caseName"
                placeholder="输入案件名称"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="" prop="radio">
              <div slot="label" class="slot_label">责任主体</div>
              <el-radio @change="changeSubject" v-model="examinationform.radio" label="1">法人或其他组织</el-radio>
              <el-radio @change="changeSubject" v-model="examinationform.radio" label="2">公民</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="examinationform.radio == '1'">
          <el-col :span="12">
            <el-form-item label="" prop="companyName">
              <div slot="label" class="slot_label">当事人</div>
              <el-input v-model="examinationform.companyName" placeholder="输入当事人" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="responaibleName">
              <div slot="label" class="slot_label">法定代表人</div>
              <el-input
                v-model="examinationform.responaibleName"
                placeholder="请输入法定代表（负责人）"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="examinationform.radio == '2'">
          <el-col :span="8">
            <el-form-item label="" prop="citizenName" class="widthmodify">
              <div slot="label" class="slot_label">姓名</div>
              <el-input v-model="examinationform.citizenName" placeholder="输入姓名" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="padding-left:5px">
            <el-form-item label="" prop="gender" label-width="70px">
              <div slot="label" class="slot_label">性别</div>
              <el-select v-model="examinationform.gender" placeholder="请选择性别">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="padding-left:0px">
            <el-form-item label="" prop="birthday">
              <div slot="label" class="slot_label">出生年月</div>
              <el-date-picker v-model="examinationform.birthday" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" class="addresclass">
            <el-form-item
              label=""
              prop="address"
              v-if="examinationform.radio == '1'"
            >
              <div slot="label" class="slot_label">地址</div>
              <el-input v-model="examinationform.address" placeholder="请输入地址" clearable></el-input>
            </el-form-item>
            <el-form-item
              label=""
              prop="addresshome"
              v-if="examinationform.radio == '2'"
            >
              <div slot="label" class="slot_label">住址</div>
              <el-input v-model="examinationform.addresshome" placeholder="请输入住址" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="phone" v-if="examinationform.radio == '1'">
              <div slot="label" class="slot_label">联系电话</div>
              <el-input v-model="examinationform.phone" placeholder="请输入联系电话" maxlength="12" clearable></el-input>
            </el-form-item>
            <el-form-item label="" prop="contactPhone" v-else>
              <div slot="label" class="slot_label">联系电话</div>
              <el-input v-model="examinationform.contactPhone" placeholder="请输入联系电话" maxlength="12" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="" prop="date" class="limitDate">
              <div slot="label" class="slot_label">期限</div>
              <el-date-picker
                v-model="examinationform.date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="responTime">
            <el-form-item label="" prop="checkTime">
              <div slot="label" class="slot_label">承办时间</div>
              <el-date-picker v-model="examinationform.checkTime" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="" prop="responsiblePerson">
              <div slot="label" class="slot_label">承办人</div>
              <el-input v-model="examinationform.responsiblePerson" placeholder="输入承办人" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="case-situation">
          <el-form-item label="案件基本情况：" prop="status">
            <el-input
              v-model="examinationform.status"
              placeholder="请输入案件基本情况"
              clearable
              type="textarea"
              autosize
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row class="case-situation">
          <el-form-item label="报请审批的行政强制事项及其理由、依据、种类及期限等" prop="statusall">
            <el-input
              v-model="examinationform.statusall"
              placeholder="请输入报请审批的行政强制事项及其理由、依据、种类及期限等"
              clearable
              type="textarea"
              autosize
            ></el-input>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div
      class="dialog-footer"
      style="margin-top: 20px;text-align: right; border-top:1px solid rgba(224, 224, 224, 1);padding-top: 10px;
    padding-right: 10px;padding-bottom:10px"
    >
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure('examinationform')">保存并生成行政强制审批表</el-button>
    </div>
    <!-- <el-dialog :append-to-body="true" width="900px" height="600px" :visible.sync="chooseExaminePeople" title="选择审核人员">
      <select-people :selectNum="1" @getPeople="getExaminePeople" v-if="chooseExaminePeople"></select-people>
    </el-dialog>-->
  </div>
</template>

<script>
import { getWritParams, dateFormat, handleDateRef,getFirstErrMsg } from '@/utils/util'
import { Throttle } from '@/utils/util'
import { getDataInfo } from '@api/enterpriseInfo/index'
import Bus from '@/bus'
// import selectPeople from "@/pages/onSiteInspection/newInspection/component/selectPeople";

export default {
  name: 'examination',
  // components: {
  //   selectPeople
  // },
  props: {
    info: {
      type: Object
    },
    ableToAudit: {
      type: Boolean
    }
  },
  data() {
    return {
      chooseExaminePeople: false,
      sealAuditPeopleId: '',
      sealAuditPeopleDeptId: '',
      sealAuditPeopleDeptName: '',
      submitId: '',
      // isDisabled: false,
      examinationform: {
        caseName: '', // 案件名称
        companyName: '江阴市俱进钢板加工有限公司', // 公司名称
        radio: '1', //当事人：
        email: '200011',
        status: '', //案件基本情况：
        phone: '', //联系电话
        contactPhone: '', //公民联系电话
        responaibleName: '', //法定代表人
        address: '', //地址
        date: '', //期限
        statusall: '', //报请审批的行政强制事项及其理由、依据、种类及期限等：,
        checkTime: '', //承办时间
        responsiblePerson: '', //承办人
        citizenName: '', //公民姓名
        gender: '', //性别
        birthday: '', //出生年月
        addresshome: '' //住址
      },
      rules: {
        caseName: [{ required: true, message: '请输入案件名称', trigger: 'blur' }],
        companyName: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮编', trigger: 'blur' }],
        status: [{ required: true, message: '请输入案件基本情况', trigger: 'blur' }],
        phone: [{
          required: true,
          trigger: ['blur', 'change'],
          message: '请输入电话号码'
        },
        {
          pattern: /^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
          trigger: ['blur', 'change'],
          message: '您输入的电话号码格式不正确'
        }],
        contactPhone: [{
          required: true,
          trigger: ['blur', 'change'],
          message: '请输入电话号码'
        },
        {
          pattern: /^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
          trigger: ['blur', 'change'],
          message: '您输入的电话号码格式不正确'
        }],
        responaibleName: [{ required: true, message: '请输入法定代表人', trigger: 'blur' }],
        address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        addresshome: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        date: [{ required: true, message: '请输入期限', trigger: 'blur' }],
        radio: [{ required: true, message: '请输入责任主体', trigger: 'blur' }],
        checkTime: [{ required: true, message: '请输入承办时间', trigger: 'blur' }],
        responsiblePerson: [{ required: true, message: '请输入承办人', trigger: 'blur' }],
        statusall: [
          {
            required: true,
            message: '请输入报请审批的行政强制事项及其理由、依据、种类及期限等',
            trigger: 'blur'
          }
        ],
        citizenName: [{ required: true, message: '请输入公民姓名', trigger: 'blur' }],
        gender: [{ required: true, message: '请输入性别', trigger: 'blur' }],
        birthday: [{ required: true, message: '请输入出生年月', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.showGetDataInfo()
    if (this.info.writInfo) {
      let udtIds = null,
        sourceId = null
      let inputInfo = this.info.writInfo.reduce((total, item, index) => {
        switch (item.tagName) {
          case 'tag2':
            total.caseName = item.tagContent
            break
          case 'tag3':
            total.citizenName = item.tagContent
            break
          case 'tag4':
            total.gender = item.tagContent
            break
          case 'tag5':
            total.birthday = handleDateRef(item.tagContent)
            break
          case 'tag6':
            total.contactPhone = item.tagContent
            break
          case 'tag7':
            total.addresshome = item.tagContent
            break
          case 'tag8':
            total.companyName = item.tagContent
            break
          case 'tag9':
            total.responaibleName = item.tagContent
            break
          case 'tag10':
            total.address = item.tagContent
            break
          case 'tag11':
            total.phone = item.tagContent
            break
          case 'tag12':
            total.status = item.tagContent
            break
          case 'tag13':
            total.statusall = item.tagContent
            break
          case 'tag14':
            udtIds = item.tagContent
            break
        }
        return total
      }, {})
      let dataInfo = {
        udtIds,
        sourceId: this.info.writInfo[0].writId
      }
      inputInfo.radio = inputInfo.gender ? '2' : '1'
      inputInfo.responsiblePerson = this.info.auditInfo.responsiblePerson
      this.examinationform = inputInfo
    } else {
      this.initInfo()
    }
  },

  methods: {
    //企业详情
    showGetDataInfo() {
      getDataInfo({ id: this.info.auditInfo.companyId })
        .then(res => {
          // console.log("审批表里的企业详情", res);
          this.examinationform.responaibleName = res.data.legalPerson
          this.examinationform.address = res.data.businessAddress
          this.examinationform.phone = res.data.contactPhone
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    // 切换当事人
    changeSubject(val) {
      if (this.examinationform.radio === '1' && !this.examinationform.companyName) {
        this.examinationform.companyName = this.info.auditInfo.companyName
        this.showGetDataInfo()
      }
    },

    //初始化文书数据
    initInfo() {
      this.examinationform = {
        caseName: '', // 案件名称
        companyName: this.info.auditInfo.companyName, // 公司名称
        radio: '1', //当事人：
        email: '',
        status: '', //案件基本情况：
        phone: '', //联系电话
        responaibleName: this.examinationform.legalPerson, //法定代表人
        address: '', //地址
        date: [], //期限
        statusall: '', //报请审批的行政强制事项及其理由、依据、种类及期限等：
        checkTime: this.info.auditInfo.checkTime, //承办时间
        contactPhone: '', //公民联系电话
        responsiblePerson: this.info.auditInfo.responsiblePerson, //承办人
        citizenName: '', //公民姓名
        gender: '', //性别
        birthday: '', //出生年月
        addresshome: '' //住址
      }
    },
    sure(formName) {
      if (this.examinationform.radio === '1') {
        // 是法人
        this.examinationform.citizenName = ''
        this.examinationform.gender = ''
        this.examinationform.birthday = ''
        this.examinationform.addresshome = ''
        this.examinationform.contactPhone = ''
      } else {
        // 公民
        this.examinationform.companyName = null
        this.examinationform.responaibleName = null
        this.examinationform.phone = null
        this.examinationform.address = null
      }
      this.$refs[formName].validate((valid, errInfo) => {
        if (valid) {
          console.info('info', this.examinationform)
          let data = getWritParams({
            tag2: this.examinationform.caseName,
            tag3: this.examinationform.citizenName ? this.examinationform.citizenName : '',
            tag4: this.examinationform.gender ? this.examinationform.gender : '',
            tag5: dateFormat(this.examinationform.birthday, 'yyyy年mm月dd日'),
            tag6: this.examinationform.contactPhone,
            tag7: this.examinationform.addresshome,
            tag8: this.examinationform.companyName,
            tag9: this.examinationform.responaibleName,
            tag10: this.examinationform.address,
            tag11: this.examinationform.phone,
            tag12: this.examinationform.status,
            tag13: this.examinationform.statusall,
            tag14: this.examinationform.responsiblePerson,
            // tag14: this.info.auditInfo.udtIds
            // 生成文书时 tag15 和tag16 在执法模块 有用 勿删谢谢
            tag15: this.examinationform.date[0],
            tag151: this.examinationform.date[1],
            tag16: this.examinationform.checkTime
          })
          let params = {
              companyId: this.info.auditInfo.companyId, //执法检查模块制作文书传company_id
            contractorIds: this.info.auditInfo.udtIds,
            writType: 'XZQZSPB',
            sourceId: this.info.auditInfo.sourceId,
            data: data
          }
          this.$emit('createWrit', params)
        } else {
          this.$message({
            type: 'error',
            message: getFirstErrMsg(errInfo)
          })
          return false
        }
      })
    },
    //点击确定按钮事件
    /*   sure() {
      if (this.examinationform.radio === '1') {
        // 是法人
        this.examinationform.citizenName = ''
        this.examinationform.gender = ''
        this.examinationform.birthday = ''
        this.examinationform.addresshome = ''
        this.examinationform.contactPhone = ''
      } else {
        // 公民
        this.examinationform.companyName = null
        this.examinationform.responaibleName = null
        this.examinationform.phone = null
        this.examinationform.address = null
      }
      console.info('info', this.examinationform)
      let data = getWritParams({
        tag2: this.examinationform.caseName,
        tag3: this.examinationform.citizenName ? this.examinationform.citizenName : '',
        tag4: this.examinationform.gender ? this.examinationform.gender : '',
        tag5: dateFormat(this.examinationform.birthday, 'yyyy年mm月dd日'),
        tag6: this.examinationform.contactPhone,
        tag7: this.examinationform.addresshome,
        tag8: this.examinationform.companyName,
        tag9: this.examinationform.responaibleName,
        tag10: this.examinationform.address,
        tag11: this.examinationform.phone,
        tag12: this.examinationform.status,
        tag13: this.examinationform.statusall,
        tag14: this.examinationform.responsiblePerson,
        // tag14: this.info.auditInfo.udtIds
        // 生成文书时 tag15 和tag16 在执法模块 有用 勿删谢谢
        tag15: this.examinationform.date[0],
        tag151: this.examinationform.date[1],
        tag16: this.examinationform.checkTime
      })
      let params = {
        contractorIds: this.info.auditInfo.udtIds,
        writType: 'XZQZSPB',
        sourceId: this.info.auditInfo.sourceId,
        data: data
      }
      this.$emit('createWrit', params)
    }, */
    //点击取消按钮事件
    close() {
      this.$emit('close')
    }
  },
  watch: {
    examinationform: {
      handler: function(newVal, oldVal) {
        this.$set(this.examinationform, 'citizenName', this.examinationform.citizenName)
        this.$set(this.examinationform, 'gender', this.examinationform.gender)
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.examinationWrap {
  .responTime {
    .el-input {
      width: 362px;
    }
  }
  .case-situation {
    /deep/ .el-form-item {
      display: flex;
      flex-direction: column;
      label.el-form-item__label {
        margin-left: 10px;
        &:before {
          left: 0;
        }
      }
      /deep/.el-form-item__content {
        margin-left: 0 !important;
      }
    }
  }
  /deep/.el-form-item__content {
    line-height: 30px;
  }
  .examination_content {
    padding: 2px 16px 0px 16px;
    padding-right: 28px;
    /deep/ .el-form-item__label {
      color: #333 !important;
    }
  }
  .el-form-item {
    margin-bottom: -5px;
    margin-top: 4px;
  }
  /deep/el-form-item__content {
    margin-left: 60px !important;
  }
  // /deep/.el-form-item__content {
  //   line-height: 37px !important;
  // }
  /deep/ .el-form--label-top .el-form-item__label {
    padding: 0 0 0px !important;
  }
  .el-input {
    /deep/ .el-input__inner {
      height: 30px;
      line-height: 30px;
    }
  }
  // .el-row {
  //   margin: 3px 0;
  // }
  .addresclass {
    /deep/.el-form-item__content {
      margin-left: 100px !important;
    }
    /deep/ .el-input__inner {
      width: 100%;
    }
  }
  .limitDate {
    /* /deep/.el-range-editor.el-input__inner {
      width: 366px !important;
    } */
    // 在小于1400时  用86%
    // 大于1401时  小于1620时 用89&
    // 大于1621时 到1920期间 用 91%
    @media screen and (max-width: 1400px) {
      /deep/.el-range-editor.el-input__inner {
        width: 100%;
      }
    }
    @media screen and (min-width: 1401px) and (max-width: 1620px) {
      /deep/.el-range-editor.el-input__inner {
        width: 100%;
      }
    }
    @media screen and (min-width: 1621px) and (max-width: 1920px) {
      /deep/.el-range-editor.el-input__inner {
        width: 100%;
      }
    }

 
  }
  /deep/.el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
  /deep/.el-range-editor--small.el-input__inner {
    height: 30px;
  }
  // .widthmodify {
  //   // /deep/ .el-form-item__label {
  //   //   width: 70px !important;
  //   // }
  //   /deep/ .el-form-item__content {
  //     margin-left: 72px !important;
  //   }
  // }
}
</style>
