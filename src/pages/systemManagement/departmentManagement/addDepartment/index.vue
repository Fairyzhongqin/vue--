<template>
  <div>
    <div class="content">
      <div @click="backPage" class="back-button">
        <i class="el-icon-arrow-left"></i> 返回
      </div>
      <div class="flex justify-content-space-between top-pading">
        <div class="content-list">
          <el-row>
            <el-col :span="2">
              <span class="required" />部门名称：
            </el-col>
            <el-col :span="4">
              <el-input v-model="totalData.name" placeholder="输入部门名称" clearable></el-input>
            </el-col>
            <el-col :span="2">
              <span class="required" />部门简称：
            </el-col>
            <el-col :span="4">
              <el-input v-model="totalData.abbName" placeholder="输入部门简称" clearable></el-input>
            </el-col>
            <el-col :span="2">
              <span class="required" />部门全称：
            </el-col>
            <el-col :span="4">
              <el-input v-model="totalData.fullDeptName" placeholder="输入部门全称" clearable></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">
              <span class="required" />上级部门：
            </el-col>
            <el-col :span="4">
              <el-input
                v-model="headerInfo.dept.name"
                placeholder="选择上级部门"
                style="width:100%"
                readonly
                @focus="handleOrg"
              >
                <i class="el-icon-more" slot="suffix" @click="handleOrg"></i>
              </el-input>
              <el-dialog
                title="选择部门"
                width="640px"
                height="570px"
                :before-close="handleOrg"
                :visible.sync="showOrgList"
              >
                <select-org :closeOrgDialog="handleOrg" @getOrg="getSelectedOrg"></select-org>
              </el-dialog>
            </el-col>
            <el-col :span="2">是否虚拟：</el-col>
            <el-col :span="4">
              <el-radio-group v-model="totalData.virtualFlag">
                <el-radio :label="0">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
            </el-col>
            <el-col :span="2">排序号：</el-col>
            <el-col :span="4">
              <el-input v-model="totalData.orderNum" placeholder="输入排序号" clearable></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">
              <span class="required" />部门编码：
            </el-col>
            <el-col :span="4">
              <el-input v-model="totalData.code" placeholder="输入部门编码" clearable></el-input>
            </el-col>
            <el-col :span="2">部门地址：</el-col>
            <el-col :span="4">
              <el-input v-model="totalData.deptAddress" placeholder="输入部门地址" clearable></el-input>
            </el-col>
            <el-col :span="2">邮政编码：</el-col>
            <el-col :span="4">
              <el-input v-model="totalData.postCode" placeholder="请输入6位邮政编码" maxlength="6" clearable></el-input>
            </el-col>
          </el-row>
          <el-row>
               <el-col :span="2">复议人民政府：</el-col>
            <el-col :span="7">
              <el-input v-model="totalData.government" placeholder="输入复议人民政府" clearable></el-input>
            </el-col>
            <el-col :span="5">复议人民政府地址：</el-col>
            <el-col :span="8">
              <el-input v-model="totalData.governmentAddress" placeholder="复议人民政府地址" clearable></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">复议应急管理局：</el-col>
            <el-col :span="7">
              <el-input v-model="totalData.bureau" placeholder="输入复议应急管理局" clearable></el-input>
            </el-col>
            <el-col :span="5">复议应急管理局地址：</el-col>
            <el-col :span="8">
              <el-input v-model="totalData.bureauAddress" placeholder="输入复议应急管理局地址" clearable></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">诉讼人民法院：</el-col>
            <el-col :span="7">
              <el-input v-model="totalData.court" placeholder="输入诉讼人民法院" clearable></el-input>
            </el-col>
            <el-col :span="5">诉讼人民法院地址：</el-col>
            <el-col :span="8">
              <el-input v-model="totalData.courtAddress" placeholder="诉讼人民法院地址" clearable></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">缴款银行：</el-col>
            <el-col :span="7">
              <el-input v-model="totalData.bank" placeholder="输入缴款银行" clearable></el-input>
            </el-col>
            <el-col :span="5">缴款银行地址：</el-col>
            <el-col :span="8">
              <el-input v-model="totalData.bankAddress" placeholder="输入缴款银行地址" clearable></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">缴款银行账号：</el-col>
            <el-col :span="7">
              <el-input v-model="totalData.bankAccount" placeholder="输入缴款银行账号" clearable></el-input>
            </el-col>
             <el-col :span="5">部门地图ID：</el-col>
            <el-col :span="8">
              <el-input v-model="totalData.mapId" placeholder="输入部门地图ID：" clearable></el-input>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="2">加盖公章类型：</el-col>
            <el-col :span="7">
              <el-select clearable v-model="totalData.signMode">
                <el-option
                  v-for="item in signModeptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="2">部门等级：</el-col>
            <el-col :span="7">
              <el-input v-model="totalData.level" placeholder="输入部门等级" clearable></el-input>
            </el-col>
          </el-row>


          <!-- 底部按钮 -->
        </div>
      </div>
    </div>
    <buttonGroup :buttonList="buttonList"></buttonGroup>
  </div>
</template>
<script>
import { saveDepartment, detailDepartment } from '@/api/systemManagement/departmentManagement/index'
import buttonGroup from '@components/buttonGroup/index'
import selectOrg from '../../../onSiteInspection/newInspection/component/selectOrg'
import { mapState } from 'vuex'
import { getWritTypeInfo } from '@/api/login/login'
export default {
  components: {
    selectOrg,
    buttonGroup
  },
  data() {
    return {
      buttonList: [
        {
          name: '取消',
          type: '',
          disable: false,
          fun: this.callOf
        },
        {
          name: '保存',
          type: 'primary',
          disable: false,
          fun: this.saveData
        }
      ],
      signModeptions:[
          {
              value: '1',
              label: '加盖公章'
          }, {
              value:'2',
              label: '加盖执法章'
          }
      ],
      resource: '',
      totalData: {
        abbName: '',
        areaName: '',
        fullDeptName: '',
        bank: '',
        bankAccount: '',
        bankAddress: '',
        bureau: '',
        bureauAddress: '',
        child: [],
        code: '',
        court: '',
        courtAddress: '',
        createTime: '',
        createUser: '',
        delFlag: '',
        deptAddress: '',
        government: '',
        governmentAddress: '',
        id: '',
        level: '',
        name: '',
        orderNum: '',
        parentId: '',
        postCode: '',
        updateTime: '',
        updateUser: '',
        virtualFlag: 1,
        parentName: '',
        mapId:'',
          signMode:'',
        level:''
      },
      headerInfo: {
        dept: {
          id: null,
          name: null
        }
      }
    }
  },
  methods: {
    //返回
    backPage() {
      this.$store.commit('setDepartment')
    },
    //取消
    callOf() {
      this.$store.commit('setDepartment')
    },
    //部门数据详情
    getDetailDepartment() {
      let detailId = this.$store.state.detailId
      let req = {
        id: detailId
      }
      detailDepartment(req)
        .then(res => {
          console.log(res)
          this.totalData = res.data
          this.headerInfo.dept.id = this.totalData.parentId
          this.headerInfo.dept.name = this.totalData.parentName
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
        duration: 500
      })
    },
    //验证部门数据
    validateDeptData() {
      if (!this.totalData.name) {
        this.alterErrorMsg('请输入部门名称')
        return false
      }

      if (!this.totalData.abbName) {
        this.alterErrorMsg('请输入部门简称')
        return false
      }
      if (!this.totalData.fullDeptName) {
        this.alterErrorMsg('请输入部门全称')
        return false
      }
      if (!this.totalData.code) {
        this.alterErrorMsg('请输入部门编码')
        return false
      }
      if (this.totalData.postCode && this.totalData.postCode.length !== 6) {
        this.alterErrorMsg('请输入6位邮政编码')
        return false
      }
      if (!this.totalData.parentId) {
        this.alterErrorMsg('请选择上级部门')
        return false
      }
      return true
    },
    //保存
    saveData() {
      //新增
      delete this.totalData.delFlag
      delete this.totalData.createTime
      delete this.totalData.updateTime
      this.totalData.parentId = this.headerInfo.dept.id
      if (this.validateDeptData()) {
        console.info('orderNum', typeof Number(this.totalData.orderNum))
        if (Number(this.totalData.orderNum) >= 0) {
          saveDepartment(this.totalData)
            .then(res => {
                debugger
              getWritTypeInfo().then(
                  res => {
                      sessionStorage.setItem('writTypeInfo', JSON.stringify(res.data))
                  },
                  err => {
                  }
              )
                this.$message({
                    type: 'success',
                    message: '保存成功！',
                    duration: 500
                })
              this.backPage()
            })
            .catch(err => {
              this.$message({
                type: 'error',
                message: err,
                duration: 500
              })
              // this.backPage();
            })
        } else {
          this.$message({
            type: 'error',
            message: '排序号不能小于0'
          })
        }
      } else {
        return false
      }
    },
    handleOrg() {
      this.$store.commit('setOrgDialog')
    },
    // 选择部门
    getSelectedOrg(org) {
      this.headerInfo.dept = org
    }
  },
  created() {
    this.headerInfo.dept.id = ''
    this.headerInfo.dept.name = ''
    let flag = this.$store.state.flag
    if (flag == 'addFlag') {
      !this.getDetailDepartment()
    }
    if (flag == 'updataFlag') {
      this.getDetailDepartment()
    }
  },
  computed: {
    ...mapState(['showOrgList'])
  }
}
</script>
<style lang="less" scoped>
.content {
  background: #fff;
  padding: 8px;
  margin: 8px;
  box-sizing: border-box;
  width: calc(100% - 16px);
  padding: 30px 82px 33px;
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
}
.el-row {
  padding-bottom: 10px;
}
/deep/.el-col-2 {
  width: 13.5%;
}
/deep/.el-col-4 {
  margin-right: 10px;
  width: 18.66667%;
}
/deep/.el-col-5 {
  width: 18%;
}
/deep/.el-col-7 {
  width: 30.6%;
  margin-right: 60px;
}
/deep/.el-col-8 {
  width: 30%;
}
.required {
  width: 3px;
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
/deep/.el-tree .el-tree-node__expand-icon {
  margin-left: 5px;
}
</style>
