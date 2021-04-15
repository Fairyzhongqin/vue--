<template>
  <div>
    <div class="partyState_content">
      <div class="partyState_form-body-center">
        <div class="partyState_form-left">
          <el-form
            :model="partyStateform"
            label-position="right"
            :rules="rules"
            ref="partyStateform"
            size="medium"
            :inline-message="true"
            :show-message="false"
          >
            <div class="partyState_block">
              <el-form-item label="" :label-width="ruleformLabelWidth" prop="caseName">
              <div slot="label" class="slot_label">案件名称</div>
                <el-input
                  v-model="partyStateform.caseName"
                  autocomplete="off"
                  placeholder="请输入案件名称"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="" :label-width="ruleformLabelWidth" prop="time">
                <div slot="label" class="slot_label">笔录时间</div>
                <el-date-picker
                  v-model="partyStateform.time"
                  type="datetimerange"
                  align="left"
                  format="yyyy-MM-dd HH:mm"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="" :label-width="ruleformLabelWidth" prop="place">
                <div slot="label" class="slot_label">笔录地点</div>
                <el-input
                  v-model="partyStateform.place"
                  autocomplete="off"
                  placeholder="请输入地点"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="" :label-width="ruleformLabelWidth" prop="statePerson">
                <div slot="label" class="slot_label">申辩人</div>
                <el-input
                  v-model="partyStateform.statePerson"
                  autocomplete="off"
                  placeholder="请输入申辩人姓名"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="" :label-width="ruleformLabelWidth" prop="gender">
                <div slot="label" class="slot_label">性别</div>
                <el-select v-model="partyStateform.gender" placeholder="请选择性别">
                  <el-option label="男" value="0"></el-option>
                  <el-option label="女" value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="" :label-width="ruleformLabelWidth" prop="phone">
                <div slot="label" class="slot_label">联系电话</div>
                <el-input
                  v-model="partyStateform.phone"
                  autocomplete="off"
                  placeholder="请输入联系电话"
                  maxlength="12"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="" :label-width="ruleformLabelWidth" prop="work">
                <div slot="label" class="slot_label">工作单位</div>
                <el-input
                  v-model="partyStateform.work"
                  autocomplete="off"
                  placeholder="请输入工作单位"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="" :label-width="ruleformLabelWidth" prop="address">
                <div slot="label" class="slot_label">联系地址</div>
                <el-input
                  v-model="partyStateform.address"
                  autocomplete="off"
                  placeholder="请输入联系地址"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="" :label-width="ruleformLabelWidth" prop="post">
                <div slot="label" class="slot_label">职务</div>
                <el-input
                  v-model="partyStateform.post"
                  autocomplete="off"
                  placeholder="请输入职务"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="" :label-width="ruleformLabelWidth" prop="zipCode">
                <div slot="label" class="slot_label">邮编</div>
                <el-input
                  v-model="partyStateform.zipCode"
                  autocomplete="off"
                  placeholder="请输入邮编"
                  maxlength="6"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="" :label-width="ruleformLabelWidth" prop="executorName">
                <div slot="label" class="slot_label">承办人</div>
                <el-input
                  v-model="partyStateform.executorName"
                  autocomplete="off"
                  placeholder="请输入承办人"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="" :label-width="ruleformLabelWidth" prop="recodeName">
                <div slot="label" class="slot_label">记录人</div>
                <el-input
                  v-model="partyStateform.recodeName"
                  autocomplete="off"
                  placeholder="请输入记录人"
                  clearable
                ></el-input>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="form-right">
          <p class="partyStateRequired">陈述申辩记录：</p>
          <div class="detail_part">

            <el-input
              type="textarea"
              placeholder="请输入笔录"
              v-model="partyStateform.desc"
              autosize
              class="defenseDetail"
            ></el-input>
          </div>
        </div>
      </div>
    </div>
    <div
      slot="footer"
      class="dialog-footer"
      style="text-align: right;border-top: 1px solid #E0E0E0;padding: 10px 0;padding-right:10px"
    >
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure('partyStateform')">保存并生成笔录文书</el-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { enterPriseInquireByid } from '@api/ProcessingofInspectionResult'
import { getWritParams, dateFormat, stringToDate, reflectEntity, getFirstErrMsg } from '@/utils/util'
export default {
  props: {
    info: {
      type: Object
    }
  },
  data() {
    return {
      //当事人申辩记录
      /*  defenseRecordList: [
        {
          question: '', //问
          answer: '' //答
        }
      ], */
      companyInform: '', //企业信息
      ruleformLabelWidth: '100px',
      partyStateform: {
        time: [], //笔录时间：
        place: '', //笔录地点：
        statePerson: '', //申辩人
        gender: '', //性别
        phone: '', //phone
        work: '', //工作单位
        address: '', //联系地址：
        post: '', //职务
        zipCode: '', //邮编
        executorName: '', //承办人：
        recodeName: '', //记录人
        desc: '', //陈述申辩记录：
        caseName: '' // 案件名称
      },
      rules: {
        caseName: [{ required: true, message: '请输入笔录时间', trigger: 'blur' }],
        time: [{ required: true, message: '请选择笔录时间', trigger: 'change' }],
        place: [{ required: true, message: '请输入笔录地点', trigger: 'blur' }],
        statePerson: [{ required: true, message: '请输入申辩人', trigger: 'blur' }],
        gender: [{ required: true, message: '请输入性别', trigger: 'blur' }],
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
        work: [{ required: true, message: '请输入工作单位', trigger: 'blur' }],
        deptAddress: [{ required: true, message: '请输入联系地址', trigger: 'blur' }],
        address: [{ required: true, message: '请输入联系地址', trigger: 'blur' }],
        post: [{ required: true, message: '请输入职务', trigger: 'blur' }],
        zipCode: [
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
        executorName: [{ required: true, message: '请输入承办人', trigger: 'blur' }],
        recodeName: [{ required: true, message: '请输入记录人', trigger: 'blur' }],
        desc: [{ required: true, message: '请输入陈述申辩记录', trigger: 'blur' }]
      }
    }
  },
  created() {
    // console.info(this.info);
  },
  mounted() {
    if (this.info.writInfo) {
      let udtIds = null,
        sourceId = null,
        time = []
      /*   // 申辩记录
      let infoList = this.info.writInfo.filter(item => {
        if (item.tagName.indexOf('entity') !== -1) {
          return item
        }
      })
      let qaArr = ['question', 'answer']
      this.defenseRecordList = reflectEntity(infoList, qaArr) */
      let inputInfo = this.info.writInfo.reduce((total, item, index) => {
        switch (item.tagName) {
          case 'tag2':
            let temp = item.tagContent
              ? item.tagContent
                  .replace('年', '-')
                  .replace('月', '-')
                  .replace('日', ' ')
                  .replace('时', ':')
                  .replace('分', ':') + '00'
              : null
            time[0] = temp ? stringToDate(temp) : null
            break
          case 'tag3':
            let endTemp = item.tagContent
              ? item.tagContent
                  .replace('年', '-')
                  .replace('月', '-')
                  .replace('日', ' ')
                  .replace('时', ':')
                  .replace('分', ':') + '00'
              : null
            time[1] = temp ? stringToDate(endTemp) : null
            break
          case 'tag4':
            total.place = item.tagContent
            break
          case 'tag5':
            total.statePerson = item.tagContent
            break
          case 'tag6':
            total.gender = item.tagContent === '男' ? '0' : '1'
            break
          case 'tag7':
            total.post = item.tagContent
            break
          case 'tag8':
            total.work = item.tagContent
            break
          case 'tag9':
            total.phone = item.tagContent
            break
          case 'tag10':
            total.address = item.tagContent
            break
          case 'tag11':
            total.zipCode = item.tagContent
            break
          case 'tag12':
            total.executorName = item.tagContent
            break
          case 'tag13':
            total.recodeName = item.tagContent
            break
          case 'tag17':
            total.caseName = item.tagContent
            break
          case 'tag18':
            total.desc = item.tagContent
            break
        }
        return total
      }, {})
      let dataInfo = {
        udtIds,
        sourceId: this.info.writInfo[0].writId
      }
      inputInfo.time = time
      this.partyStateform = inputInfo
    } else {
      this.initInfo()
    }
  },
  computed: {},
  methods: {
    // 当事人申辩问答
    // 新增
    /*   addDetail() {
      this.defenseRecordList.push({
        question: '', //问
        answer: '' //答
      })
    }, */
    /*  handleInfo() {
      let arr = this.defenseRecordList.reduce((total, item, index) => {
        total.push({
          tagName: `entity${index + 1}-col1`,
          tagContent: item.question
        })
        total.push({
          tagName: `entity${index + 1}-col2`,
          tagContent: item.answer
        })
        return total
      }, [])
      return arr
    }, */
    // 删除
    // 删除申辩回答记录
    /*   deleteRule(ind) {
      if (this.defenseRecordList.length == 1) {
        this.$message.error('请保证至少有一条申辩记录')
      } else {
        this.defenseRecordList.splice(ind, 1)
      }
    }, */
    //根据企业id查询企业信息
    initenterPriseInquireByid() {
      enterPriseInquireByid({
        id: this.info.auditInfo.companyId
      }).then(res => {
        console.log(res)
        this.$set(this.partyStateform, 'address', res.data.businessAddress)
        this.$set(this.partyStateform, 'zipCode', res.data.postalCode)
        this.$set(this.partyStateform, 'work', this.info.auditInfo.subject)
        this.$set(this.partyStateform, 'statePerson', '')
        this.$set(this.partyStateform, 'post', '')
        this.$set(this.partyStateform, 'phone', '')
        this.$set(this.partyStateform, 'gender', '')
      })
    },
    //初始化文书数据 (没有回显数据时)
    initInfo() {
      let user = JSON.parse(localStorage.getItem('res'))
      this.partyStateform = {
        time: [new Date(), new Date(new Date().getTime() + 60 * 120 * 1000)], //笔录时间：
        place: '', //笔录地点：
        gender: this.info.auditInfo.sex === '0' ? '0' : '1', //性别，没有就男
        executorName: this.info.auditInfo.responsiblePerson.replace(/，/g, '、'), //承办人：
        recodeName: user.userEntity.nickName, //记录人
        caseName: this.info.auditInfo.caseName ? this.info.auditInfo.caseName : this.info.auditInfo.companyName
      }
      if (this.info.auditInfo.companyId) {
        // 传了企业id，说明处罚类型为企业
        this.initenterPriseInquireByid()
      } else {
        this.$set(this.partyStateform, 'address', this.info.auditInfo.objectAddress)
        this.$set(this.partyStateform, 'zipCode', this.info.auditInfo.postCode)
        this.$set(this.partyStateform, 'work', this.info.auditInfo.job)
        this.$set(this.partyStateform, 'statePerson', this.info.auditInfo.punishPersonName)
        this.$set(this.partyStateform, 'post', this.info.auditInfo.primaryPersonJob)
        this.$set(this.partyStateform, 'phone', this.info.auditInfo.telphone)
      }
    },
    //点击确定按钮
    sure(partyStateform) {
      this.$refs.partyStateform.validate((val, errInfo) => {
        if (val) {
          if (!this.partyStateform.desc || this.partyStateform.desc === '') {
            this.$message.error('陈述申辩笔录不能为空！')
          } else {
            let fullDeptName = JSON.parse(localStorage.getItem('res')).sysDeptEntity.fullDeptName
            let initstartTime = this.partyStateform.time[0]
            let initendTime = this.partyStateform.time[1]
            let responsibleId = this.info.auditInfo.udtIds.split(',')
            let responName = this.partyStateform.executorName.split(',')
            let data = getWritParams({
              tag2: dateFormat(initstartTime, 'yyyy年mm月dd日HH时MM分'),
              tag3: dateFormat(initendTime, 'yyyy年mm月dd日HH时MM分'),
              tag4: this.partyStateform.place,
              tag5: this.partyStateform.statePerson,
              tag6: this.partyStateform.gender === '1' ? '女' : '男',
              tag7: this.partyStateform.post,
              tag8: this.partyStateform.work,
              tag9: this.partyStateform.phone,
              tag10: this.partyStateform.address,
              tag11: this.partyStateform.zipCode,
              tag12: this.partyStateform.executorName,
              tag13: this.partyStateform.recodeName,
              tag14: fullDeptName ? fullDeptName : '暂无',
              tag15: responName,
              tag16: responsibleId,
              tag17: this.partyStateform.caseName,
              tag18: this.partyStateform.desc,
              tag19: responsibleId
            })
            /*  let arr = this.handleInfo()
          data = [...data, ...arr] */
            let params = {
              companyId: this.info.auditInfo.companyId, //执法检查模块制作文书传company_id
              contractorIds: this.info.auditInfo.udtIds,
              writType: 'DSRCSSBBL',
              sourceId: this.info.auditInfo.sourceId,
              data: data
            }
            params.isUserSign = 1
            this.$emit('createWrit', params)
          }
        } else {
          this.$message({
            type: 'error',
            message: getFirstErrMsg(errInfo)
          })
        }
      })
    },
    //点击按钮取消
    close() {
      this.$emit('close')
    },
    /*   addInfo() {
      // console.log("hello");
      let index = this.infoList.length
      if (this.infoList[index - 1].flag) {
        this.infoList.push({
          info: '',
          flag: false
        })
      } else {
        this.infoList.push({
          info: '',
          flag: true
        })
      }
      this.$refs.text[this.$refs.text.length - 1].focus()
    }, */
    test() {
      let item = this.$refs.ask
    }
  },
  computed: {
    getInfoList: function() {
      return this.infoList
    }
  }
}
</script>
<style lang='less' scoped>
.partyState_content {
  .partyState_block {
    padding-top: 10px;
  }
  .answerAndQuestion {
    border: 1px solid #ccc;
    width: 100%;
    height: 365px;
    overflow: auto;
    text-decoration: blue;
    resize: none;
  }
  .copyright {
    margin-top: 15px;
    text-align: center;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(187, 187, 187, 1);
    margin-bottom: 58px;
  }
  .marTop {
    margin-top: 50px;
    height: 50px;
    background-color: #fff;
    text-align: center;
    line-height: 50px;
  }
  .btnGroup {
    margin-top: 20px;
  }
  .check-bac {
    margin: 200px auto 187px;
    height: 131px;
    width: 193px;
    background: url('~@/assets/imgs/receipt.jpg') no-repeat 50% 24px;
    background-size: 194px 97px;
    &::after {
      content: '暂无简易处罚';
      position: relative;
      top: 122px;
      left: 29%;
      color: #333 !important;
    }
    .bac {
      height: 179px;
    }
  }
  .partyState_form-body-center {
    display: flex;
  }
  .partyState_form-left {
    margin-left: 20px;
  }
  .form-right {
    width: 48%;
    padding-left: 15px;
    height: 100%;
    li {
      // width:103px;
      list-style: none;
      height: 14px;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      line-height: 14px;
      padding: 10px 0px;
    }
    .partyStateRequired {
      position: relative;
      margin-top: 15px;
    }
    .partyStateRequired:before {
      position: absolute;
      content: '*';
      color: rgb(245, 108, 108);
      margin-left: -10px;
      margin-top: 4px;
      transform: translate(0, -1px);
      vertical-align: middle;
      font-size: 12px;
      height: 100%;
    }
  }
  /deep/.el-select {
    width: 100%;
  }
  /deep/.el-form-item {
    margin-bottom: 0px;
    text-align: left;
  }
  /deep/.el-range-editor.el-input__inner {
    height: 31px;
    padding: 0px 3px 0 10px;
    margin-left: 0;
    // margin: 8px 0 6px 33px;
  }
  // .el-button-select{
  //     padding-top:60px;
  // }
  /deep/.el-button-first {
    width: 140px;
    height: 30px;
    background: rgba(0, 153, 255, 1);
    border-radius: 5px;
    padding: 0 13px 12px;
    span {
      width: 110px;
      height: 14px;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 26px;
    }
  }
  /deep/ .el-button-second {
    width: 268px;
    height: 30px;
    background: rgba(0, 153, 255, 1);
    border-radius: 5px;
    padding: 0 13px 12px;
    span {
      width: 249px;
      height: 14px;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      line-height: 26px;
    }
  }
  /deep/.el-icon-time:before {
    content: '';
  }
  /deep/.el-dialog__wrapper .el-dialog__header .el-dialog__title {
    width: 142px;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
  }

  /deep/.el-radio-group {
    margin-left: 24px;
  }
  /deep/.demonstration {
    width: 90px;
  }
  textarea {
    // width: 408px;
    // height: 45px;
    border: 1px solid rgba(204, 204, 204, 1);
    border-radius: 5px;
  }
  .input-second {
    width: 414px;
    height: 30px;
    border: 1px solid rgba(204, 204, 204, 1);
    border-radius: 5px;
  }

  // .el-form-item {
  //   margin-bottom: 8px;
  // }
  /deep/ .el-input > .el-input__inner {
    height: 30px;
    line-height: 30px;
  }

  /deep/ .el-dialog__wrapper .el-dialog__footer {
    margin: 150px 0px 42px;
    padding: 1px;
    line-height: 55px;
    padding-right: 10px;
    height: 55px;
  }
  // /deep/ .el-input__inner {
  //   width: 290px;

  //   height: 30px !important;
  // }
  .detail_part {
    // line-height: 40px;
    // height: 380px;
    // overflow-y: auto;
    margin-right: 10px;
    /*     .detail {
      position: relative;
      padding: 9px 16px 30px;
      background: #eef5f9;
      border-radius: 5px;
      &:last-child {
        margin-bottom: 0;
      }
      .el-form-item__label {
        // width: 60px;
        text-align: left;
        line-height: 30px;
      }
      .el-row {
        display: flex;
        .el-input {
          flex-grow: 1;
        }
      }
      .delete_buttons {
        position: absolute;
        bottom: -8px;
        right: 17px;
        margin-top: 8px;
        font-size: 0;
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
    } */
    .defenseDetail {
      height: 350px;
      /deep/ &.el-textarea {
        margin-top: 0;
      }
      /deep/ .el-textarea__inner {
        height: 391px !important;
      }
    }
  }
}
</style>
