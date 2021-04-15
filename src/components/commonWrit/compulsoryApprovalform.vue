<template>
  <div style="height: 100%, width: 100%" class="compulsoryWrap">
    <div class="compulsory_form_content">
      <el-form
        size="small"
        ref="compulsoryForm"
        :model="compulsoryForm"
        :rules="rules"
        :show-message="false"
        label-width="100px"
        label-position="left"
      >
        <el-row>
          <el-form-item label="" prop="caseName">
            
              <div slot="label" class="slot_label">案件名称</div>
            <el-input
              v-model="compulsoryForm.caseName"
              placeholder="输入案件名称"
              clearable
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="" prop="radio">
            
              <div slot="label" class="slot_label">责任主体</div>
            <el-radio v-model="compulsoryForm.radio" label="1">法人或其他组织</el-radio>
            <el-radio v-model="compulsoryForm.radio" label="2">公民</el-radio>
          </el-form-item>
        </el-row>
        <el-row :gutter="20" v-if="compulsoryForm.radio == '1'">
          <el-col :span="12">
            <el-form-item label="" prop="companyName">
              
              <div slot="label" class="slot_label">当事人</div>
              <el-input v-model="compulsoryForm.companyName" placeholder="输入当事人" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="responsibleName">
              
              <div slot="label" class="slot_label">法定代表人</div>
              <el-input
                v-model="compulsoryForm.responsibleName"
                placeholder="请输入法定代表（负责人）"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="compulsoryForm.radio == '2'">
          <el-col :span="8">
            <el-form-item label="" prop="citizenName" class="widthmodify">
              
              <div slot="label" class="slot_label">姓名</div>
              <el-input v-model="compulsoryForm.citizenName" placeholder="输入姓名" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="padding-left:5px">
            <el-form-item label="" prop="gender" label-width="70px">
              
              <div slot="label" class="slot_label">性别</div>
              <el-select v-model="compulsoryForm.gender" placeholder="请选择性别">
                <el-option label="男" value="男"></el-option>
                <el-option label="女" value="女"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" style="padding-left:0px">
            <el-form-item label="" prop="birthday">
              
              <div slot="label" class="slot_label">出生年月</div>
              <el-date-picker v-model="compulsoryForm.birthday" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" class="addresclass">
            <el-form-item
              label=""
              prop="address"
              v-if="compulsoryForm.radio == '1'"
            >
            
              <div slot="label" class="slot_label">地址</div>
              <el-input v-model="compulsoryForm.address" placeholder="请输入地址" clearable></el-input>
            </el-form-item>
            <el-form-item
              label=""
              prop="addresshome"
              v-if="compulsoryForm.radio == '2'"
            >
            
              <div slot="label" class="slot_label">住址</div>
              <el-input v-model="compulsoryForm.addresshome" placeholder="请输入住址" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="phone" v-if="compulsoryForm.radio == '1'">
              
              <div slot="label" class="slot_label">联系电话</div>
              <el-input v-model="compulsoryForm.phone" placeholder="请输入联系电话" maxlength="12" clearable></el-input>
            </el-form-item>
            <el-form-item label="" prop="contactPhone" v-else>
              
              <div slot="label" class="slot_label">联系电话</div>
              <el-input v-model="compulsoryForm.contactPhone" placeholder="请输入联系电话" maxlength="12" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="" prop="date" class="limitDate">
              
              <div slot="label" class="slot_label">期限</div>
              <el-date-picker
                v-model="compulsoryForm.date"
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
              <el-date-picker v-model="compulsoryForm.checkTime" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="" prop="responsiblePerson">
            
              <div slot="label" class="slot_label">承办人</div>
            <el-input v-model="compulsoryForm.responsiblePerson" placeholder="输入承办人" clearable></el-input>
          </el-form-item>
        </el-row>
        <el-row class="case-situation">
          <el-form-item label="案件基本情况" prop="status">
            <el-input
              v-model="compulsoryForm.status"
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
              v-model="compulsoryForm.statusall"
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
      <el-button type="primary" @click="sure('compulsoryForm')">保存并生成行政强制审批表</el-button>
    </div>
  </div>
</template>

<script>
import { getWritParams, dateFormat, stringToDate, handleDateRef, Throttle, getFirstErrMsg } from '@/utils/util'
import { getDataInfo } from '@api/enterpriseInfo/index'

export default {
  name: 'compulsoryForm',
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
      // updateStatus: false, //修改状态
      // isDisabled: false,
      compulsoryForm: {
        caseName: '', // 案件名称
        companyName: '江阴市俱进钢板加工有限公司', // 公司名称
        radio: '1', //当事人：
        email: '200011',
        status: '', //案件基本情况：
        phone: '', //联系电话
        contactPhone: '', //公民联系电话
        responsibleName: '', //法定代表人
        address: '', //地址
        date: [], //期限
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
        responsibleName: [{ required: true, message: '请输入法定代表人', trigger: 'blur' }],
        address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        addresshome: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        date: [{ required: true, message: '请选择期限', trigger: 'change' }],
        radio: [{ required: true, message: '请输入责任主体', trigger: 'blur' }],
        checkTime: [{ required: true, message: '请输入承办时间', trigger: 'change' }],
        responsiblePerson: [{ required: true, message: '请输入承办人', trigger: 'blur' }],
        statusall: [
          {
            required: true,
            message: '请输入报请审批的行政强制事项及其理由、依据、种类及期限等',
            trigger: 'blur'
          }
        ],
        citizenName: [{ required: true, message: '请输入公民姓名', trigger: 'blur' }],
        gender: [{ required: true, message: '请输入性别', trigger: 'change' }],
        birthday: [{ required: true, message: '请输入出生年月', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    console.info('here is complusory rewrite')
    if (this.info.writInfo) {
      let udtIds = null,
        sourceId = null
      let time = []
      this.info.writInfo.forEach(item => {
        switch (item.tagName) {
          case 'tag2':
            this.compulsoryForm.caseName = item.tagContent
            break
          case 'tag3':
            this.compulsoryForm.citizenName = item.tagContent
            break
          case 'tag4':
            this.compulsoryForm.gender = item.tagContent
            break
          case 'tag5':
            this.compulsoryForm.birthday = item.tagContent
              ? item.tagContent
                  .replace('年', '-')
                  .replace('月', '-')
                  .replace('日', '')
              : null
            break
          case 'tag6':
            this.compulsoryForm.contactPhone = item.tagContent
            break
          case 'tag7':
            this.compulsoryForm.addresshome = item.tagContent
            break
          case 'tag8':
            this.compulsoryForm.companyName = item.tagContent
            break
          case 'tag9':
            this.compulsoryForm.responsibleName = item.tagContent
            break
          case 'tag10':
            this.compulsoryForm.address = item.tagContent
            break
          case 'tag11':
            this.compulsoryForm.phone = item.tagContent
            break
          case 'tag12':
            this.compulsoryForm.status = item.tagContent
            break
          case 'tag13':
            this.compulsoryForm.statusall = item.tagContent
            break
          case 'tag14':
            udtIds = item.tagContent
            break
          case 'tag15':
            time[0] = handleDateRef(item.tagContent)
            break
          case 'tag151':
            time[1] = handleDateRef(item.tagContent)
            break
          case 'tag16':
            this.compulsoryForm.checkTime = handleDateRef(item.tagContent)
            break
          case 'tag17':
            this.compulsoryForm.radio = item.tagContent
            break
        }
      })
      let dataInfo = {
        udtIds,
        sourceId: this.info.writInfo[0].writId
      }
      this.compulsoryForm.radio = this.compulsoryForm.gender ? '2' : '1'
      this.compulsoryForm.responsiblePerson = this.info.auditInfo.responsiblePerson
      console.info('time', time)
      this.compulsoryForm.date = time
      /*       let inputInfo = this.info.writInfo.reduce((total, item, index) => {
        switch (item.tagName) {
          case "tag2":
            total.caseName = item.tagContent;
            break;
          case "tag3":
            total.citizenName = item.tagContent;
            break;
          case "tag4":
            total.gender = item.tagContent;
            break;
          case "tag5":
            total.birthday = item.tagContent
              ? item.tagContent
                  .replace("年", "-")
                  .replace("月", "-")
                  .replace("日", "")
              : null;
            break;
          case "tag6":
            total.contactPhone = item.tagContent;
            break;
          case "tag7":
            total.addresshome = item.tagContent;
            break;
          case "tag8":
            total.companyName = item.tagContent;
            break;
          case "tag9":
            total.responsibleName = item.tagContent;
            break;
          case "tag10":
            total.address = item.tagContent;
            break;
          case "tag11":
            total.phone = item.tagContent;
            break;
          case "tag12":
            total.status = item.tagContent;
            break;
          case "tag13":
            total.statusall = item.tagContent;
            break;
          case "tag14":
            udtIds = item.tagContent;
            break;
          case "tag15":
            total.date = item.tagContent;
            break;
          case "tag16":
            total.checkTime = item.tagContent;
            break;
        }
        return total;
      }, {});
      console.info("total", inputInfo);

      let dataInfo = {
        udtIds,
        sourceId: this.info.writInfo[0].writId
      };
      inputInfo.radio = inputInfo.gender ? "2" : "1";
      inputInfo.responsiblePerson = this.info.auditInfo.responsiblePerson;
      this.compulsoryForm = inputInfo;
      console.info("compulsoryForm", this.compulsoryForm); */
    } else {
      this.initInfo()
      this.showGetDataInfo()
    }
    /* 处理审核状态按钮 */
    /* Bus.$on("setSubmitAuditBtn", btnAbled => {
      if (btnAbled) {
        this.isAuditAllowed = true;
        this.submitId = btnAbled;
      }
    }); */
    // 选人
    /* Bus.$on("selectedPeople", people => {
      this.sealAuditPeopleId = people[0].id;
      this.sealAuditPeopleDeptId = people[0].deptId;
      this.sealAuditPeopleDeptName = people[0].deptName;
    }); */
  },

  methods: {
    //企业详情
    showGetDataInfo() {
      getDataInfo({ id: this.info.auditInfo.companyId })
        .then(res => {
          // console.log("审批表里的企业详情", res);
          this.compulsoryForm.responsibleName = res.data.legalPerson
          this.compulsoryForm.address = res.data.businessAddress
          this.compulsoryForm.phone = res.data.contactPhone
        })
        .catch(err => {
          throw new Error(err)
        })
    },

    //初始化文书数据
    initInfo() {
      this.compulsoryForm = {
        caseName: '', // 案件名称
        companyName: this.info.auditInfo.companyName, // 公司名称
        radio: '1', //当事人：
        email: '',
        status: '', //案件基本情况：
        phone: '', //联系电话
        responsibleName: this.compulsoryForm.legalPerson, //法定代表人
        address: '', //地址
        date: [], //期限
        citizenName: '', // 姓名
        addresshome: '', // 住址
        gender: '',
        birthday: '', //出生年月
        contactPhone: '', //公民联系电话
        statusall: '', //报请审批的行政强制事项及其理由、依据、种类及期限等：
        checkTime: this.info.auditInfo.checkTime, //承办时间
        responsiblePerson: this.info.auditInfo.responsiblePerson //承办人
      }
    },
    //点击确定按钮事件
    sure(compulsoryForm) {
      this.$refs.compulsoryForm.validate((valid, errInfo) => {
        if (valid) {
          let data = getWritParams({
            tag2: this.compulsoryForm.caseName,
            tag3: this.compulsoryForm.radio !== '1' ? this.compulsoryForm.citizenName : '',
            tag4: this.compulsoryForm.radio !== '1' ? this.compulsoryForm.gender : '',
            tag5: this.compulsoryForm.birthday
              ? typeof this.compulsoryForm.birthday !== 'string'
                ? dateFormat(this.compulsoryForm.birthday, 'yyyy年mm月dd日')
                : this.compulsoryForm.birthday.replace('-', '年').replace('-', '月') + '日'
              : null,
            tag6: this.compulsoryForm.contactPhone,
            tag7: this.compulsoryForm.addresshome,
            tag8: this.compulsoryForm.radio === '1' ? this.compulsoryForm.companyName : '',
            tag9: this.compulsoryForm.radio === '1' ? this.compulsoryForm.responsibleName : '',
            tag10: this.compulsoryForm.radio === '1' ? this.compulsoryForm.address : '',
            tag11: this.compulsoryForm.radio === '1' ? this.compulsoryForm.phone : '',
            tag12: this.compulsoryForm.status,
            tag13: this.compulsoryForm.statusall,
            tag14: this.compulsoryForm.responsiblePerson,
            // tag15: this.compulsoryForm.date,
            tag15: this.compulsoryForm.date[0],
            tag151: this.compulsoryForm.date[1],
            tag16: this.compulsoryForm.checkTime
          })
          // let params = {
          //   contractorIds: this.info.auditInfo.udtIds,
          //   writType: "XZQZSPB",
          //   sourceId: this.info.auditInfo.sourceId,
          //   data: data
          // };
          let params = {
            data: data
          }
          this.$emit('createOtherWrit', params)
        } else {          
          this.$message({
            type: 'error',
            message: getFirstErrMsg(errInfo)
          })
        }
      })
    },

    //点击取消按钮事件
    close() {
      this.$emit('close')
    }
  } /* ,
  watch: {
    'compulsoryForm': {
      handler: function(nv, ov) {
        console.info('xixixi wobeidiaoyongle', nv)
        if (nv == '2') {
          this.$set(this.compulsoryForm, 'citizenName', '')
          this.$set(this.compulsoryForm, 'gender', '')
        }
      },
      deep: true
    }
  } */
}
</script>

<style lang="less" scoped>
.compulsoryWrap {
  // /deep/ .el-form-item__label:before {
  //   content: '' !important;
  // }
  .responTime {
    .el-input {
      width: 362px;
    }
  }
  .case-situation {
    /deep/ .el-form-item {
      display: flex;
      flex-direction: column;
      .el-form-item__label {
        padding-left: 10px;
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
  .compulsory_form_content {
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

  /deep/ .el-form--label-top .el-form-item__label {
    padding: 0 0 0px !important;
  }
  .el-input {
    /deep/ .el-input__inner {
      height: 30px;
      line-height: 30px;
    }
  }

  .addresclass {
    /deep/.el-form-item__content {
      margin-left: 100px !important;
    }
    /deep/ .el-input__inner {
      width: 100%;
    }
  }
  .limitDate {
    // /deep/.el-range-editor.el-input__inner {
    //   width: 366px !important;
    // }
    // 在小于1400时  用86%
    // 大于1401时  小于1620时 用89&
    // 大于1621时 到1920期间 用 91%
    @media screen and (max-width: 1400px) {
      /deep/.el-range-editor.el-input__inner {
        width: 86%;
      }
    }
    @media screen and (min-width: 1401px) and (max-width: 1620px) {
      /deep/.el-range-editor.el-input__inner {
        width: 91%;
      }
    }
    @media screen and (min-width: 1621px) and (max-width: 1920px) {
      /deep/.el-range-editor.el-input__inner {
        width: 91%;
      }
    }
    /deep/ .el-form-item__content {
      margin-left: 67px !important;
    }
  }
  /deep/.el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
  /deep/.el-range-editor--small.el-input__inner {
    height: 30px;
  }
}
</style>
