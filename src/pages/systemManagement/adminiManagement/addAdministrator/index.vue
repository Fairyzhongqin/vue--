<template>
  <div>
    <div class="content">
      <div @click="backPage" class="back-button">
        <i class="el-icon-arrow-left"></i> 返回
      </div>
      <div class="flex justify-content-space-between top-pading">
        <div class="content-list">
          <el-row>
            <el-col :span="2">姓名(昵称)：</el-col>
            <el-col :span="6">
              <el-input
                v-model="totalData.nickName"
                placeholder="请输入用户真实姓名或昵称"
                clearable
                :disabled="isDetail"
              ></el-input>
            </el-col>

            <el-col :span="3">
              <span class="required" />
              用户名：
            </el-col>
            <el-col :span="6">
              <el-input
                v-model="totalData.username"
                placeholder="请输入用户名"
                :disabled="isDetail"
                clearable
              ></el-input>
            </el-col>
            <el-col :span="1">
              <span v-if="$store.state.flag!=='updataFlag'&&$store.state.flag!=='signFlag'" class="required" />
              密码：
            </el-col>
            <el-col :span="5">
              <el-input v-model="totalData.password" placeholder="请输入密码" :disabled="isDetail"></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">
              <span class="required" />
              执法证号：
            </el-col>
            <el-col :span="6">
              <el-input
                v-model="totalData.cardId"
                placeholder="请输入执法证号"
                :disabled="isDetail"
                clearable
              ></el-input>
            </el-col>
            <el-col :span="3">身份证号：</el-col>
            <el-col :span="6">
              <el-input
                v-model="totalData.identityCard"
                placeholder="请输入身份证号"
                :disabled="isDetail"
                clearable
              ></el-input>
            </el-col>
            <el-col :span="1">性别：</el-col>
            <el-col :span="5">
              <el-select v-model="totalData.sexCode" placeholder="请选择性别">
                <el-option label="男" value="1"></el-option>
                <el-option label="女" value="2"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">最高学历：</el-col>
            <el-col :span="6">
              <el-select
                v-model="totalData.highestEducationCode"
                placeholder="请选择学历"
                :disabled="isDetail"
              >
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
            </el-col>
            <el-col :span="3">人员性质：</el-col>
            <el-col :span="6">
              <el-select
                v-model="totalData.personnelNatureCode"
                placeholder="请选择人员性质"
                :disabled="isDetail"
              >
                <el-option label="公务员" value="01"></el-option>
                <el-option label="聘任制公务员" value="02"></el-option>
                <el-option label="事业编制工作人员" value="03"></el-option>
                <el-option label="企业人员" value="04"></el-option>
                <el-option label="执法辅助人员" value="05"></el-option>
              </el-select>
            </el-col>
            <el-col :span="1">专业：</el-col>
            <el-col :span="5">
              <el-input
                v-model="totalData.profession"
                placeholder="请输入专业"
                :disabled="isDetail"
                clearable
              ></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">职称：</el-col>
            <el-col :span="6">
              <el-input
                v-model="totalData.professionalName"
                placeholder="请输入职称"
                :disabled="isDetail"
                clearable
              ></el-input>
            </el-col>
            <el-col :span="3">职位：</el-col>
            <el-col :span="6">
              <el-input
                v-model="totalData.position"
                placeholder="请输入职位"
                :disabled="isDetail"
                clearable
              ></el-input>
            </el-col>
            <el-col :span="1">职级：</el-col>
            <el-col :span="5">
              <el-select
                v-model="totalData.professionalRankCode"
                placeholder="请选择职级"
                :disabled="isDetail"
              >
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
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">
              <span class="required" />
              所属部门：
            </el-col>
            <el-col :span="6">
              <el-input
                :disabled="isDetail"
                v-model="headerInfo.dept.name"
                placeholder="请选择部门"
                style="width:100%"
                readonly
                @focus="handleOrg"
              >
                <i class="el-icon-more" slot="suffix" @click="handleOrg" v-if="!isShow"></i>
              </el-input>

              <el-dialog
                title="选择部门"
                width="640px"
                height="570px"
                :before-close="handleOrg"
                :visible.sync="showOrgList"
              >
                <select-org
                  :closeOrgDialog="handleOrg"
                  @getOrg="getSelectedOrg"
                  :userOrgEntity="sysDeptEntity"
                ></select-org>
              </el-dialog>
            </el-col>

            <el-col :span="3">手机号：</el-col>
            <el-col :span="6">
              <el-input
                v-model="totalData.mobile"
                placeholder="请输入手机号"
                :disabled="isDetail"
                maxlength="11"
                clearable
              ></el-input>
            </el-col>
            <el-col :span="1">民族：</el-col>
            <el-col :span="5">
              <el-select v-model="totalData.nationCode" placeholder="请选择民族" :disabled="isDetail">
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
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">发证机关：</el-col>
            <el-col :span="6">
              <el-input
                v-model="totalData.fzjg"
                placeholder="请输入发证机关"
                :disabled="isDetail"
                clearable
              ></el-input>
            </el-col>
            <el-col :span="3">排序号：</el-col>
            <el-col :span="6">
              <el-input
                v-model="totalData.orderNum"
                placeholder="请输入排序号"
                :disabled="isDetail"
                clearable
              ></el-input>
            </el-col>
            <el-col :span="1">邮箱：</el-col>
            <el-col :span="5">
              <el-input
                v-model="totalData.email"
                placeholder="请输入邮箱"
                :disabled="isDetail"
                clearable
              ></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">是否监督人员：</el-col>
            <el-col :span="4">
              <el-radio-group v-model="totalData.isJdry" :disabled="isDetail">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-col>
            <el-col :span="3">是否委托：</el-col>
            <el-col :span="6">
              <el-radio-group v-model="totalData.isWt" :disabled="isDetail">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">是否就有法律职业资格：</el-col>
            <el-col :span="4">
              <el-radio-group v-model="totalData.isFlzyzg" :disabled="isDetail">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-col>
            <el-col :span="3">是否授权：</el-col>
            <el-col :span="6">
              <el-radio-group v-model="totalData.isSq" :disabled="isDetail">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">用户角色：</el-col>
            <el-col :span="21">
              <el-checkbox-group v-model="list" :disabled="isDetail">
                <el-checkbox
                  v-for="(item,index) in arrList"
                  :key="index"
                  :label="item.id"
                >{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">用户状态：</el-col>
            <el-col :span="6">
              <el-radio-group v-model="totalData.status" :disabled="isDetail">
                <el-radio :label="0">禁用</el-radio>
                <el-radio :label="1">正常</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <!-- 底部按钮 -->
          <seal-list :fileData="fileData" v-if="isShow"></seal-list>
        </div>
      </div>
    </div>
    <bottom-bar v-if="isHide">
      <el-button @click="callOf">取消</el-button>
      <el-button type="primary" @click="saveData">保存</el-button>
    </bottom-bar>
  </div>
</template>
<script>
import { saveUser, showUserList, detailUserList, showSignature, deleteSignature, upLoadSignature } from '@/api/systemManagement/adminiManagement/index'
import buttonGroup from '@components/buttonGroup/index'
import bottomBar from '@/components/bottomBar'
import selectOrg from '../../../onSiteInspection/newInspection/component/selectOrg'
import downProof from '@components/downProof/index'
import { mapState } from 'vuex'
import sealList from './uploadSealList'
export default {
  components: {
    selectOrg,
    downProof,
    sealList,
    bottomBar,
    buttonGroup
  },

  data() {
    return {
      fileData: {},
      arrList: [],
      list: [],
      isShow: false,
      isHide: true,
      name: '',
      userName: '',
      passWord: '',
      enforcement: '',
      IdCard: '',
      position: '',
      department: '',
      mailbox: '',
      SortNumber: '',
      checkList: [],
      phoneNumber: '',
      radio: '1',
      headerInfo: {
        time: null,
        place: null,
        exampleData: null,
        dept: {
          id: null,
          name: null,
          children: [],
          remark: null
        }
        // company: {
        //   id: null,
        //   companyName: null
        // },
      },
      totalData: {
        cardId: '',
        deptId: '',
        email: '',
        id: '',
        identityCard: '',
        mobile: '',
        nickName: '',
        sexCode: '',
        orderNum: null,
        password: null,
        position: '',
        roleIdList: [],
        status: 1,
        isJdry: '',
        isFlzyzg: '',
        isWt: '',
        isSq: '',
        username: '',
        nationCode: '', //民族
        highestEducationCode: '', //最高学历
        personnelNatureCode: '', //人员性质
        profession: '', //专业
        professionalName: '', //职称
        professionalRankCode: '', //职级
        fzjg: '' //发证机关
      },
      isDetail: false,
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      signPicture: [],
      proofList: [],
      sysDeptEntity: {} //部门
    }
  },
  methods: {
    //返回
    backPage() {
      this.$store.commit('setAdminiManagementCurrentComponent', 'adminList')
    },
    //取消
    callOf() {
      this.$store.commit('setAdminiManagementCurrentComponent', 'adminList')
    },
    //展示角色选择
    getShowUserList(data = {}) {
      showUserList(data)
        .then(res => {
          this.arrList = res.page.list
        })
        .catch(err => {
          console.log(err)
        })
    },
    //展示签章图片
    getShowSignature() {
      let detailId = this.$store.state.detailId
      let info = {
        type: '-1',
        userId: detailId
      }
      showSignature(info)
        .then(res => {
          console.log(res)
          this.signPicture = res.data
          console.log(this.signPicture)
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    initInfo() {
      this.totalData.isJdry = !this.totalData.isJdry ? '1' : this.totalData.isJdry
      this.totalData.isFlzyzg = !this.totalData.isFlzyzg ? '1' : this.totalData.isFlzyzg
      this.totalData.isWt = !this.totalData.isWt ? '1' : this.totalData.isWt
      this.totalData.isSq = !this.totalData.isSq ? '1' : this.totalData.isSq
    },
    //系统用户详情
    getShowdetailUserList() {
      let detailId = this.$store.state.detailId
      let req = {
        id: detailId
      }
      detailUserList(req)
        .then(res => {
          console.log(res)
          this.totalData = res.data.userEntity
          this.headerInfo.dept.name = res.data.userEntity.deptName
          this.list = res.data.userEntity.roleIdList
          this.sysDeptEntity = res.data.sysDeptEntity
          // console.log(this.totalData, '2546')
        })
        .catch(err => {
          console.log(err)
        })
    },
    //输出错误信息
    alterErrorMsg(errorMsg) {
      this.$message({
        type: 'error',
        message: errorMsg,
        duration: 2000
      })
    },
    //验证用户数据
    validateUserData() {
      if (!this.totalData.username) {
        this.alterErrorMsg('请输入用户名')
        return false
      }
      if (!this.totalData.cardId) {
        this.alterErrorMsg('请输入执法证号')
        return false
      }
      if (!this.headerInfo.dept.name) {
        this.alterErrorMsg('请选择所属部门')
        return false
      }
      // 密码没填不用校验
      if (this.$store.state.flag==='updataFlag'||this.$store.state.flag==='signFlag') {
        if (!this.totalData.password) {
          return true
        }
      } else {
        if (!this.totalData.password) {
          this.alterErrorMsg('请填写密码')
          return false
        }
      }

      if (!/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\\W_]+$)[a-zA-Z0-9\W_]{8,}$/.test(this.totalData.password)) {
        this.alterErrorMsg('密码必须包含字母、数字、特殊字符的组合，且不少于八位')
        return false
      }
      
      return true
    },
    //保存
    saveData() {
      console.info(this.totalData)
      //新增
      this.totalData.deptId = this.headerInfo.dept.id
      this.totalData.roleIdList = this.list
      delete this.totalData.createTime
      delete this.totalData.updateTime
      if (this.validateUserData()) {
        saveUser(this.totalData)
          .then(res => {
            this.$message({
              type: 'success',
              message: '保存成功！'
            })
            let myUserInfo = JSON.parse(sessionStorage.getItem('userInfo'))
            if(this.totalData.id === myUserInfo.userEntity.id) {
              // 需要更新自己的信息
              this.updateMyInfo(this.totalData.id)
            }
            this.$store.commit('setAdminiManagementCurrentComponent', 'adminList')
          })
          .catch(err => {
            console.log(err)
            this.$message({
              type: 'error',
              message: err
            })
          })
      } else {
        return false
      }
    },
    updateMyInfo(id) {
      detailUserList({
        id: id
      }).then(res => {
        sessionStorage.setItem('userInfo', JSON.stringify(res.data))
        // console.info(res)
      })
    },
    handleOrg() {
      this.$store.commit('setOrgDialog')
    },
    // 选择部门
    getSelectedOrg(org) {
      // console.log(org,"__++++")
      this.headerInfo.dept = org
    }
  },
  created() {
    this.initInfo()
    this.fileData = { userId: this.detailId }
    this.getShowUserList({ isPaging: 'false' })
    let flag = this.$store.state.flag
    console.info(flag)
    if (flag == 'updataFlag') {
      this.getShowdetailUserList()
    }
    if (flag == 'addFlag') {
      !this.getShowdetailUserList()
    }
    if (flag == 'signFlag') {
      this.isHide = false
      this.isShow = true
      this.isDetail = true
      this.getShowSignature()
      this.getShowdetailUserList()
      // let tempDept = JSON.parse(localStorage.getItem('userInfo'))
      // this.headerInfo.dept.id = tempDept.sysDeptEntity.id
      // this.headerInfo.dept.name = tempDept.sysDeptEntity.name
    }
  },
  computed: {
    ...mapState(['showOrgList', 'detailId'])
  }
}
</script>

<style lang="less" scoped>
.content {
  background: #fff;
  // padding: 8px;
  margin: 8px;
  box-sizing: border-box;
  width: calc(100% - 16px);
  padding: 30px 82px 33px;
  margin-bottom: 80px;
  border-radius: 8px;
  height: 100%;
  position: relative;
}
.back-button {
  position: absolute;
  left: 16px;
  top: 18px;
  color: #0099ff;
  cursor: pointer;
  &:hover {
    color: #409eff;
  }
}
.content-list {
  line-height: 30px;
  padding: 14px 14px 14px 0px;
  color: #333333;
  width: 100%;
  // height: 600px;
  // overflow-y: auto;
}
/deep/.el-col-1 {
  width: 6%;
}
/deep/.el-col-2 {
  width: 9%;
}
/deep/.el-col-3 {
  width: 8%;
}
/deep/.el-col-4 {
  width: 18%;
}
/deep/.el-col-5 {
  width: 22.5%;
  // width: 19%
}
/deep/.el-col-6 {
  margin-right: 30px;
  width: 24%;
}

.el-row {
  padding-bottom: 8px;
}
/deep/.el-checkbox__label {
  padding-left: 5px;
}
/deep/.el-checkbox {
  margin-right: 15px;
}
/deep/.el-radio {
  margin-right: 15px;
}
.required {
  display: inline-block;
  height: 0.8em;
  position: relative;
}
.required:before {
  position: absolute;
  content: '*';
  color: rgb(245, 108, 108);
  margin-left: -5px;
  margin-top: -7px;
  transform: translate(0, -1px);
  vertical-align: middle;
  font-size: 12px;
  height: 100%;
}
.PrivateSeal {
  // display: inline;
  height: 100%;
}
/deep/.el-upload__textpan {
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(0, 153, 255, 1);
}
/deep/.el-upload--picture-card {
  line-height: 30px;
  height: 160px;
  margin-right: 10px;
}
/deep/.el-upload--picture-card i {
  padding-top: 30px;
}
.tips {
  width: 90px;
  padding-left: 30px;
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(153, 153, 153, 1);
}
// /deep/.el-upload-list--picture-card .el-upload-list__item {
//   height: 160px;
// }
/deep/.el-dialog__wrapper .el-dialog__header {
  border: 0px;
}
/deep/.el-tree .el-tree-node__expand-icon {
  margin-left: 5px;
}
/deep/.el-select {
  width: 100%;
}
</style>