<template>
  <el-dialog
    custom-class="improve_dialog"
    width="800px"
    title="完善个人信息"
    :visible.sync="improveShow"
    :show-close="false"
    :before-close="handleClose"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <!-- <button class="jump" @click="cancel" v-if="source==='login'">跳过</button> -->
    <el-form :model="personInfo" ref="personInfo" :rules="rules" :show-message="false">
      <table style="width:100%">
        <tbody>
          <tr>
            <td width="160" class="label">姓名</td>
            <td colspan="5" style="text-align: left;">
              <el-form-item prop="nickName">
                <el-input type="text" v-model="personInfo.nickName" placeholder="姓名"></el-input>
              </el-form-item>
            </td>
            <td width="160" class="label">身份证号</td>
            <td colspan="5" style="text-align: left;">
              <el-form-item prop="identityCard">
                <el-input type="text" v-model="personInfo.identityCard" placeholder="身份证号"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="160" class="label">性别</td>
            <td colspan="5" style="text-align: left;">
              <el-form-item prop="sexCode">
                <el-select v-model="personInfo.sexCode" placeholder="性别">
                  <!-- <el-option label="未知的性别" value="0"></el-option> -->
                  <el-option label="男" value="1"></el-option>
                  <el-option label="女" value="2"></el-option>
                  <!-- <el-option label="未说明的性别" value="9"></el-option> -->
                </el-select>
              </el-form-item>
            </td>
            <td width="160" class="label">执法证号</td>
            <td colspan="5" style="text-align: left;">
              <el-form-item prop="cardId">
                <el-input type="text" v-model="personInfo.cardId" placeholder="执法证号"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="160" class="label">发证机关</td>
            <td colspan="5" style="text-align: left;">
              <el-form-item prop="fzjg">
                <el-input type="text" v-model="personInfo.fzjg" placeholder="发证机关"></el-input>
              </el-form-item>
            </td>
            <td width="160" class="label">手机号码</td>
            <td colspan="5" style="text-align: left;">
              <el-form-item prop="mobile">
                <el-input type="text" v-model="personInfo.mobile" placeholder="手机号码"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="160" class="label">所在部门</td>
            <td colspan="5" style="text-align: left;">
              <el-form-item prop="deptName">
                <el-input type="text" v-model="personInfo.deptName" placeholder="所在部门"></el-input>
              </el-form-item>
            </td>
            <td width="160" class="label">职务</td>
            <td colspan="5" style="text-align: left;">
              <el-form-item prop="position">
                <el-input type="text" v-model="personInfo.position" placeholder="职务"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="160" class="label">职称</td>
            <td colspan="5" style="text-align: left;">
              <el-form-item prop="professionalName">
                <el-input type="text" v-model="personInfo.professionalName" placeholder="职称"></el-input>
              </el-form-item>
            </td>
            <td width="160" class="label">职级</td>
            <td colspan="5" style="text-align: left;">
              <el-form-item prop="professionalRankCode">
                <el-select v-model="personInfo.professionalRankCode" placeholder="职级">
                  <el-option label="国家级正职" value="1"></el-option>
                  <el-option label="国家级副职" value="2"></el-option>
                  <el-option label="省部级正职" value="3"></el-option>
                  <el-option label="省部级副职" value="4"></el-option>
                  <el-option label="厅局级正职" value="5"></el-option>
                  <el-option label="厅局级副职" value="6"></el-option>
                  <el-option label="县处级正职" value="7"></el-option>
                  <el-option label="县处级副职" value="8"></el-option>
                  <el-option label="乡科级正职" value="9"></el-option>
                  <el-option label="乡科级副职" value="10"></el-option>
                  <el-option label="一级巡视员" value="11"></el-option>
                  <el-option label="二级巡视员" value="12"></el-option>
                  <el-option label="一级调研员" value="13"></el-option>
                  <el-option label="二级调研员" value="14"></el-option>
                  <el-option label="三级调研员" value="15"></el-option>
                  <el-option label="四级调研员" value="16"></el-option>
                  <el-option label="一级主任科员" value="17"></el-option>
                  <el-option label="二级主任科员" value="18"></el-option>
                  <el-option label="三级主任科员" value="19"></el-option>
                  <el-option label="四级主任科员" value="20"></el-option>
                  <el-option label="一级科员" value="21"></el-option>
                  <el-option label="二级科员" value="22"></el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="160" class="label">民族</td>
            <td colspan="5" style="text-align: left;">
              <el-form-item prop="nationCode">
                <el-select v-model="personInfo.nationCode" placeholder="民族">
                  <el-option label="汉族" value="1"></el-option>
                  <el-option label="蒙古族" value="2"></el-option>
                  <el-option label="回族" value="3"></el-option>
                  <el-option label="藏族" value="4"></el-option>
                  <el-option label="维吾尔族" value="5"></el-option>
                  <el-option label="苗族" value="6"></el-option>
                  <el-option label="彝族" value="7"></el-option>
                  <el-option label="壮族" value="8"></el-option>
                  <el-option label="布依族" value="9"></el-option>
                  <el-option label="朝鲜族" value="10"></el-option>
                  <el-option label="满族" value="11"></el-option>
                  <el-option label="侗族" value="12"></el-option>
                  <el-option label="瑶族" value="13"></el-option>
                  <el-option label="白族" value="14"></el-option>
                  <el-option label="土家族" value="15"></el-option>
                  <el-option label="哈尼族" value="16"></el-option>
                  <el-option label="哈萨克族" value="17"></el-option>
                  <el-option label="傣族" value="18"></el-option>
                  <el-option label="黎族" value="19"></el-option>
                  <el-option label="傈傈族" value="20"></el-option>
                  <el-option label="佤族" value="21"></el-option>
                  <el-option label="畲族" value="22"></el-option>
                  <el-option label="高山族" value="23"></el-option>
                  <el-option label="拉祜族" value="24"></el-option>
                  <el-option label="水族" value="25"></el-option>
                  <el-option label="东乡族" value="26"></el-option>
                  <el-option label="纳西族" value="27"></el-option>
                  <el-option label="景颇族" value="28"></el-option>
                  <el-option label="柯尔克孜族" value="29"></el-option>
                  <el-option label="土族" value="30"></el-option>
                  <el-option label="达翰尔族" value="31"></el-option>
                  <el-option label="仫佬族" value="32"></el-option>
                  <el-option label="羌族" value="33"></el-option>
                  <el-option label="布朗族" value="34"></el-option>
                  <el-option label="撒拉族" value="35"></el-option>
                  <el-option label="毛南族" value="36"></el-option>
                  <el-option label="仡佬族" value="37"></el-option>
                  <el-option label="锡伯族" value="38"></el-option>
                  <el-option label="阿昌族" value="39"></el-option>
                  <el-option label="普米族" value="40"></el-option>
                  <el-option label="塔吉克族" value="41"></el-option>
                  <el-option label="怒族" value="42"></el-option>
                  <el-option label="乌孜别克族" value="43"></el-option>
                  <el-option label="俄罗斯族" value="44"></el-option>
                  <el-option label="鄂温克族" value="45"></el-option>
                  <el-option label="德昂族" value="46"></el-option>
                  <el-option label="保安族" value="47"></el-option>
                  <el-option label="裕固族" value="48"></el-option>
                  <el-option label="京族" value="49"></el-option>
                  <el-option label="塔塔尔族" value="50"></el-option>
                  <el-option label="独龙族" value="51"></el-option>
                  <el-option label="鄂伦春族" value="52"></el-option>
                  <el-option label="赫哲族" value="53"></el-option>
                  <el-option label="门巴族" value="54"></el-option>
                  <el-option label="珞巴族" value="55"></el-option>
                  <el-option label="基诺族" value="56"></el-option>
                  <el-option label="其他" value="57"></el-option>
                  <el-option label="外国血统" value="58"></el-option>
                </el-select>
              </el-form-item>
            </td>
            <td width="160" class="label">最高学历</td>
            <td colspan="5" style="text-align: left;">
              <el-form-item prop="highestEducationCode">
                <el-select v-model="personInfo.highestEducationCode" placeholder="最高学历">
                  <el-option value="10" label="研究生教育"></el-option>
                  <el-option value="11" label="博士研究生毕业"></el-option>
                  <el-option value="12" label="博士研究生结业"></el-option>
                  <el-option value="13" label="博士研究生肄业"></el-option>
                  <el-option value="14" label="硕士研究生毕业"></el-option>
                  <el-option value="15" label="硕士研究生结业"></el-option>
                  <el-option value="16" label="硕士研究生肄业"></el-option>
                  <el-option value="17" label="研究生班毕业"></el-option>
                  <el-option value="18" label="研究生班结业"></el-option>
                  <el-option value="19" label="研究生班肄业"></el-option>
                  <el-option value="20" label="大学本科教育"></el-option>
                  <el-option value="21" label="大学本科毕业"></el-option>
                  <el-option value="22" label="大学本科结业"></el-option>
                  <el-option value="23" label="大学本科肄业"></el-option>
                  <el-option value="28" label="大学普通班毕业"></el-option>
                  <el-option value="30" label="大学专科教育"></el-option>
                  <el-option value="31" label="大学专科毕业"></el-option>
                  <el-option value="32" label="大学专科结业"></el-option>
                  <el-option value="33" label="大学专科肄业"></el-option>
                  <el-option value="40" label="中等职业教育"></el-option>
                  <el-option value="41" label="中等专科毕业"></el-option>
                  <el-option value="42" label="中等专科结业"></el-option>
                  <el-option value="43" label="中等专科肄业"></el-option>
                  <el-option value="44" label="职业高中毕业"></el-option>
                  <el-option value="45" label="职业高中结业"></el-option>
                  <el-option value="46" label="职业高中肄业"></el-option>
                  <el-option value="47" label="技工学校毕业"></el-option>
                  <el-option value="48" label="技工学校结业"></el-option>
                  <el-option value="49" label="技工学校肄业"></el-option>
                  <el-option value="60" label="普通高级中学教育"></el-option>
                  <el-option value="61" label="普通高中毕业"></el-option>
                  <el-option value="62" label="普通高中结业"></el-option>
                  <el-option value="63" label="普通高中肄业"></el-option>
                  <el-option value="70" label="初级中学教育"></el-option>
                  <el-option value="71" label="初中毕业"></el-option>
                  <el-option value="72" label="初中肄业"></el-option>
                  <el-option value="80" label="小学教育"></el-option>
                  <el-option value="81" label="小学毕业"></el-option>
                  <el-option value="82" label="小学肄业"></el-option>
                  <el-option value="90" label="其他"></el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="160" class="label">专业</td>
            <td colspan="5" style="text-align: left;">
              <el-form-item prop="profession">
                <el-input type="text" v-model="personInfo.profession" placeholder="专业"></el-input>
              </el-form-item>
            </td>
            <td width="160" class="label">人员性质</td>
            <td colspan="5" style="text-align: left;">
              <el-form-item prop="personnelNatureCode">
                <el-select v-model="personInfo.personnelNatureCode" placeholder="人员性质">
                  <el-option label="公务员" value="01"></el-option>
                  <el-option label="聘任制公务员" value="02"></el-option>
                  <el-option label="事业编制工作人员" value="03"></el-option>
                  <el-option label="企业人员" value="04"></el-option>
                  <el-option label="执法辅助人员" value="05"></el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="160" class="label label_small">所属主体（受委托组织）全称</td>
            <td colspan="10" style="text-align: left;border-right:1px solid #a0c0e6;">
              <el-form-item prop="ssztqc">
                <el-input type="text" v-model="personInfo.ssztqc" placeholder="所属主体（受委托组织）全称"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="160" class="label">是否监督人员</td>
            <td colspan="5" style="text-align: left;padding-left: 10px">
              <el-radio v-model="personInfo.isJdry" label="0">是</el-radio>
              <el-radio v-model="personInfo.isJdry" label="1">否</el-radio>
            </td>
            <td width="160" class="label">是否具有法律职业资格</td>
            <td colspan="5" style="text-align: left;padding-left: 10px">
              <el-radio v-model="personInfo.isFlzyzg" label="0">是</el-radio>
              <el-radio v-model="personInfo.isFlzyzg" label="1">否</el-radio>
            </td>
          </tr>
          <tr>
            <td width="160" class="label">是否委托</td>
            <td colspan="5" style="text-align: left;padding-left: 10px">
              <el-radio v-model="personInfo.isWt" label="0">是</el-radio>
              <el-radio v-model="personInfo.isWt" label="1">否</el-radio>
            </td>
            <td width="160" class="label">是否授权</td>
            <td colspan="5" style="text-align: left;padding-left: 10px">
              <el-radio v-model="personInfo.isSq" label="0">是</el-radio>
              <el-radio v-model="personInfo.isSq" label="1">否</el-radio>
            </td>
          </tr>
        </tbody>
      </table>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="cancel" v-if="source !== 'login'">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { saveUser } from '@/api/systemManagement/adminiManagement'
export default {
  props: {
    improveShow: {
      type: Boolean,
      default: true
    },
    source: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      personInfo: {
        id: '',
        nickName: '',
        identityCard: '',
        sexCode: '',
        cardId: '',
        fzjg: '',
        mobile: '',
        deptName: '',
        position: '',
        professionalName: '',
        professionalRankCode: '',
        nationCode: '',
        highestEducationCode: '',
        profession: '',
        personnelNatureCode: '',
        ssztqc: '',
        isJdry: '',
        isFlzyzg: '',
        isWt: '',
        isSq: ''
      },
      userInfo: {},
      rules: {
        nickName: [{ required: true, trigger: 'blur' }],
        identityCard: [{ required: true, trigger: 'blur' }],
        sexCode: [{ required: true, trigger: 'blur' }],
        cardId: [{ required: true, trigger: 'blur' }],
        fzjg: [{ required: true, trigger: 'blur' }],
        mobile: [{ required: true, trigger: 'blur' }],
        deptName: [{ required: true, trigger: 'blur' }],
        position: [{ required: true, trigger: 'blur' }],
        professionalName: [{ required: true, trigger: 'blur' }],
        professionalRankCode: [{ required: true, trigger: 'blur' }],
        nationCode: [{ required: true, trigger: 'blur' }],
        highestEducationCode: [{ required: true, trigger: 'blur' }],
        profession: [{ required: true, trigger: 'blur' }],
        personnelNatureCode: [{ required: true, trigger: 'blur' }],
        ssztqc: [{ required: true, trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.initInfo()
  },
  methods: {
    initInfo() {
      this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      for (let key in this.personInfo) {
        this.personInfo[key] = this.userInfo.userEntity[key]
      }
      this.personInfo.id = this.userInfo.userEntity.id
      this.personInfo.isJdry = !this.personInfo.isJdry ? '1' : this.personInfo.isJdry
      this.personInfo.isFlzyzg = !this.personInfo.isFlzyzg ? '1' : this.personInfo.isFlzyzg
      this.personInfo.isWt = !this.personInfo.isWt ? '1' : this.personInfo.isWt
      this.personInfo.isSq = !this.personInfo.isSq ? '1' : this.personInfo.isSq
    },
    handleClose(done) {
      this.$emit('cancel') // 防止反向操作父组件的来值
    },
    cancel() {
      this.$emit('cancel')
    },
    save() {
      this.$refs.personInfo.validate(valid => {
        if (valid) {
          if (this.source === 'login') {
            this.personInfo.isCompletion = '1'
          }
          saveUser(this.personInfo).then(res => {
            if (res.code === '0') {
              sessionStorage.setItem('isCompletion', '1')
              for (let key in this.userInfo.userEntity) {
                this.userInfo.userEntity[key] = this.personInfo[key]
              }
              sessionStorage.setItem('userInfo', JSON.stringify(this.userInfo))
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.cancel()
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.improve_dialog {
  button.jump {
    background-color: transparent;
    color: #0099ff;
    font-size: 16px;
    border: none;
    position: absolute;
    right: 12px;
    top: 12px;
    outline: none;
    cursor: pointer;
  }
  .el-dialog__body {
    .el-form {
      padding: 11px 16px 9px;
      border-radius: 4px;
      table {
        border-right: 1px solid #a0c0e6;
        border-collapse: collapse;
        width: 100%;
        tbody {
          tr {
            td {
              border-left: 1px solid #a0c0e6;
              border-top: 1px solid #a0c0e6;
              border-bottom: 1px solid #a0c0e6;
              line-height: 30px;
              &.label {
                background-color: #ecf2fa;
                color: #222222;
                font-size: 14px;
                padding-left: 8px;
                &.label_small {
                  font-size: 12px;
                  line-height: 15px;
                }
              }
              /deep/.el-form-item {
                margin-bottom: 0;
                .el-form-item__content {
                  line-height: 0;
                  .el-input {
                    .el-input__inner {
                      border-color: transparent;
                    }
                  }
                  // .el-form-item__error {
                  //   display: none
                  // }
                }
                &.is-error {
                  .el-form-item__content {
                    .el-input {
                      .el-input__inner {
                        border-color: #f56c6c;
                      }
                    }
                  }
                }
              }

              /deep/.el-radio__input {
                span.el-radio__inner {
                  width: 20px;
                  height: 20px;
                }
              }
            }
          }
        }
      }
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid #e0e0e0;
    padding: 5px 16px 5px 0;
    .el-button {
      padding: 8px 15px;
    }
  }
}
</style>
