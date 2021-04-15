<template>
  <div class="inspectionHeaderWrap">
    <!-- <div class="name"
         v-show="isChange || getHeader">{{updateTitle}}</div>
    <div class="name"
         v-show="!isChange && !getHeader">{{addTitle}}</div>
    <div class="tab"
         v-show="isChange || getHeader">
      <div class="tab-title"
           @click="chooseTab('check')">现场检查</div>
      <div class="tab-title big"
           @click="chooseTab('writ')">现场检查文书</div>
    </div>-->
    <div class="data">
      <el-row>
        <el-col :span="12">
          <div class="body">
            <span>
              <span class="required" />企业名称：
            </span>
            <el-input
              class="long-input"
              v-model="headerInfo.company.companyName"
              placeholder="请选择企业"
              @focus="handleCom"
            >
              <el-button v-if="isShow" type="text" slot="suffix" @click="edit('modify')">
                <i class="el-icon-edit"></i>
              </el-button>
              <span slot="suffix" v-if="isShow">|</span>
              <span slot="suffix">
                <i class="el-icon-more" @click="handleCom"></i>
              </span>
            </el-input>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="body">
            <span>
              <span class="required" />检查时间：
            </span>
            <el-date-picker
              v-model="headerInfo.time"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="right-input"
              format="yyyy-MM-dd HH:mm"
              :picker-options="pickerOptions"
              align="right"
            ></el-date-picker>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="body">
            <span>
              <span class="required" />检查场所：
            </span>
            <el-input
              class="long-input"
              maxlength="100"
              v-model="headerInfo.place"
              placeholder="输入场所名称，如某某库房"
            ></el-input>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="body">
            <span>
              <span class="required" />检查形式：
            </span>
            <sn-select
              class="select_ccc"
              placeholder="选择检查形式"
              :data-url="'/aj/sys/sysdict/list'"
              :requertData="{type: 'source_examine'}"
              :immediate="true"
              :chooseType="isScheme"
              v-model="headerInfo.sourceName"
              @getObj="getcheckTypeName"
              :parentToChildDisabled="disabled"
            ></sn-select>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="body" @click.prevent="handlePeople">
            <span>
              <span class="required" />执法人员：
            </span>
            <el-input class="long-input" v-model="headerInfo.people" placeholder="选择>=2人">
              <i class="el-icon-more" slot="suffix"></i>
            </el-input>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="body" @click.prevent="handleOrg">
            <span>
              <span class="required" />执法部门：
            </span>
            <el-input v-model="headerInfo.dept.name" placeholder="请选择部门">
              <i class="el-icon-more" slot="suffix"></i>
            </el-input>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="body">
            <span>
              <span class="required" />检查方式：
            </span>
            <sn-select
              class="examinetype-style"
              placeholder="请选择检查方式"
              :data-url="'/aj/sys/sysdict/list'"
              :requertData="{type: 'type_examine'}"
              :immediate="true"
              v-model="headerInfo.examineType"
              @getText="getExamineTypeName"
              :parentToChildDisabled="disabled"
            ></sn-select>
          </div>
        </el-col>
      </el-row>
      <div class="check-parent">
        <div class="check-inspection">
          <span>
            <span class="required" />检查情况：
          </span>
          <el-input
            placeholder="简述检查情况"
            v-model="headerInfo.exampleData"
            type="textarea"
            :autosize="{minRows: 2}"
          ></el-input>
        </div>
        <span @click="showExample = true" class="check-example">(示例)</span>
      </div>
    </div>
    <el-dialog
      title="选择企业"
      width="990px"
      height="500px"
      top="5vh"
      :before-close="handleCom"
      :visible.sync="showComList"
      class="select-com-dialog"
    >
      <select-com :closeOrgDialog="handleCom" @getCom="getSelectedCom"></select-com>
    </el-dialog>
    <!-- 编辑企业信息 -->
    <el-dialog width="1200px" title="企业信息" top="5vh" :visible.sync="addCompDialog">
      <div class="dialog_container" v-if="addCompDialog">
        <company-form
          ref="compForm"
          :isDialog="true"
          :enterpriseId="currentEnterpriseId"
          :type="compFormType"
        ></company-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCompDialog = false">取 消</el-button>
        <el-button type="primary" @click="compSure">保 存</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="选择执法人员"
      width="900px"
      height="600px"
      top="8vh"
      :before-close="handlePeople"
      :visible.sync="showPeopleList"
    >
      <select-people @getPeople="getSelectedPeople" :minNum="2" :peopleCache="peopleCache"></select-people>
    </el-dialog>
    <el-dialog
      title="选择部门"
      width="640px"
      height="570px"
      :before-close="handleOrg"
      :visible.sync="showOrgList"
    >
      <select-org :closeOrgDialog="handleOrg" @getOrg="getSelectedOrg"></select-org>
    </el-dialog>
    <el-dialog
      title="我的示例"
      :visible.sync="showExample"
      width="660px"
      height="476px"
      class="exampleStyle"
      :before-close="handleExample"
      :close-on-click-modal="false"
    >
      <select-example @setExampleVal="setExampleVal" @handleExample="handleExample" ref="select"></select-example>
    </el-dialog>
  </div>
</template>

<script>
import selectExample from '@components/selectExample'
import snSelect from '@components/snSelect/index'
import { mapState } from 'vuex'
import selectCom from './selectCom'
import selectOrg from './selectOrg'
import selectPeople from './selectPeople'
import companyForm from '@/pages/enterpriseInfo/components/companyForm'

export default {
  name: 'inspectionHeader',
  props: {
    isChanged: {
      type: Boolean,
      required: true
    },
    getHeader: {
      type: Object,
      required: false
    },
    schemeId: {
      required: true
    }
  },
  data() {
    return {
      headerInfo: {
        time: null, // 检查时间
        place: null, // 检查场所
        exampleData: null, // 检查情况样例
        // 检查部门
        dept: {
          id: null,
          name: null,
          children: [],
          remark: null
        },
        // 检查企业
        company: {
          id: null,
          companyName: null
        },
        people: null, // 执法人员
        peopleId: null, // 执法人员id
        source: null, // 检查形式
        sourceName: null, // 检查形式
        examineType: '', //检查方式code
        examineTypeName: '' //检查方式name
      },
      // 禁止选择当前时间之前的检查时间
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      showPeopleList: false, // 选择执法人员弹出框开关
      isChange: false, // 是否处于修改状态
      addTitle: '特殊情形新增现场检查记录',
      updateTitle: '修改现场检查记录',
      peopleCardId: null,
      peopleCache: [],
      showExample: false,
      checkTypeId: null,
      addCompDialog: false,
      disabled: true,
      isShow: false //企业选择编辑控制
    }
  },
  components: {
    selectExample,
    snSelect,
    selectCom,
    selectOrg,
    selectPeople,
    companyForm
  },
  methods: {
    //编辑企业
    edit(type) {
      //打开编辑企业信息框
      this.compFormType = type
      if (this.compFormType === 'modify') {
        this.currentEnterpriseId = this.headerInfo.company.id
      } else {
        this.currentEnterpriseId = ''
      }
      this.addCompDialog = true
    },
    //编辑企业信息保存
    compSure() {
      this.$refs.compForm.saveOrUpdate()
      this.addCompDialog = false
    },
    // 控制选择企业弹出框是否显示
    handleCom() {
      this.$store.commit('setComDialog')
    },
    handleOrg() {
      this.$store.commit('setOrgDialog')
    },
    // 控制检查情况样例弹出框是否显示
    handleExample() {
      // if (this.$refs.select) {
      //   this.$refs.select.close();
      // }else{
      //   this.$store.commit("setExampleDialog");
      // }
      this.showExample = false
    },
    // 控制选择人员弹出框是否显示
    handlePeople() {
      this.showPeopleList = !this.showPeopleList
    },
    // 选择部门
    getSelectedOrg(org) {
      this.headerInfo.dept = org
    },
    // 获取选择的企业
    getSelectedCom(org) {
      this.headerInfo.company = org
    },
    // 获取选择的检查情况样例
    setExampleVal(val) {
      this.headerInfo.exampleData = val
    },
    // 获取执法人员
    getSelectedPeople(state, val) {
      if (state) {
        let nameList = [],
          idList = [],
          cardId = []
        this.peopleCache = val
        val.forEach((item, index) => {
          nameList.push(item.nickName)
          idList.push(item.id)
          cardId.push(item.cardId)
        })
        this.headerInfo.people = nameList.join(',')
        this.headerInfo.peopleId = idList.join(',')
        this.peopleCardId = cardId.join(',')
      }
      this.handlePeople()
    },
    // 切换tab栏
    chooseTab(val) {
      if (val === 'check') {
        this.$emit('chooseTab', 'check')
      } else {
        this.$emit('chooseTab', 'writ')
      }
    },
    // 切换检查形式
    getcheckTypeName(val) {
      this.headerInfo.source = val.code
      this.headerInfo.sourceName = val.value
    },
    getExamineTypeName(val) {
      this.headerInfo.examineTypeName = val
    }
  },
  computed: {
    ...mapState(['showComList', 'showOrgList']),
    isScheme() {
      return !this.schemeId || this.schemeId === ''
    }
  },
  watch: {
    headerInfo: {
      handler: function(val, oldVal) {
        if (val.company.companyName) {
          this.isShow = true
        }
        if (this.isChange) {
          this.$parent.$parent.detailIsChanged = true
          this.$store.commit('setNewInspectionCanOper', false)
        }
      },
      deep: true
    },
    isChanged: {
      handler: function(val, oldVal) {
        this.isChange = val
      },
      deep: true
    },
    getHeader: {
      handler: function(val, oldVal) {
        this.isChange = false
        this.headerInfo = JSON.parse(JSON.stringify(val))
        this.peopleCache = this.headerInfo.peopleId
          ? this.headerInfo.peopleId.split(',').reduce((total, item, index) => {
              total.push({
                id: item,
                nickName: this.headerInfo.people.split('，')[index]
              })
              return total
            }, [])
          : []
        const that = this
        setTimeout(() => {
          that.isChange = true
        }, 100)
      },
      deep: true
    }
  },
  created() {
    let tempDept = JSON.parse(localStorage.getItem('userInfo'))
    this.headerInfo.dept.id = tempDept.sysDeptEntity.id
    this.headerInfo.dept.name = tempDept.sysDeptEntity.name
  },
  destroyed() {
    ;(this.valFlag = ''), this.$store.commit('setCheckFlag', this.valFlag)
  }
}
</script>

<style lang="less" scoped>
.inspectionHeaderWrap {
  // 覆盖继承的全局样式
  /deep/.el-textarea {
    margin-top: 0;
  }
  .exampleStyle {
    /deep/ .dialog-footer {
      padding-bottom: 10px;
    }
  }
  /deep/ .el-textarea__inner {
    resize: none;
  }
  .select_ccc {
    /deep/ .el-input__inner {
      height: 30px !important;
    }
  }

  // 1920全屏的时候
  @media screen and (min-width: 1920px) {
    .examinetype-style {
      /deep/.data .body .el-select[data-v-39da06ef] {
        width: 90%;
      }
      /deep/ .el-input__inner {
        width: 88%;
      }
      /deep/ .el-input__inner {
        height: 30px !important;
      }
      /deep/.el-input__suffix {
        position: absolute;
        right: 78px;
        // 在左边的菜单呈关闭状态时  right的值应该为104 可继续优化
        top: 0;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
      }
    }
  }
  // 1244 以下的屏幕
  @media screen and (max-width: 1244px) {
    .examinetype-style {
      /deep/.data .body .el-select[data-v-39da06ef] {
        width: 90%;
      }
      /deep/ .el-input__inner {
        width: 95%;
      }
      /deep/ .el-input__inner {
        height: 30px !important;
      }
      /deep/.el-input__suffix {
        position: absolute;
        right: 22px;
        top: 0;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
      }
    }
  }
  // 1245 -1320 之间的屏幕
  @media screen and (min-width: 1245px) and (max-width: 1320px) {
    .examinetype-style {
      /deep/.data .body .el-select[data-v-39da06ef] {
        width: 90%;
      }
      /deep/ .el-input__inner {
        width: 94%;
      }
      /deep/ .el-input__inner {
        height: 30px !important;
      }
      /deep/.el-input__suffix {
        position: absolute;
        right: 25px;
        top: 0;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
      }
    }
  }
  // 1321-1366 1370-1919 之间的屏幕
  @media screen and (min-width: 1321px) and (max-width: 1373px) {
    .examinetype-style {
      /deep/.data .body .el-select[data-v-39da06ef] {
        width: 90%;
      }
      /deep/ .el-input__inner {
        width: 93%;
      }
      /deep/ .el-input__inner {
        height: 30px !important;
      }
      /deep/.el-input__suffix {
        position: absolute;
        right: 34px;
        top: 0;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
      }
    }
  }
  // 1374-1577 之间的屏幕
  @media screen and (min-width: 1374px) and (max-width: 1577px) {
    .examinetype-style {
      /deep/.data .body .el-select[data-v-39da06ef] {
        width: 90%;
      }
      /deep/ .el-input__inner {
        width: 91%;
      }
      /deep/ .el-input__inner {
        height: 30px !important;
      }
      /deep/.el-input__suffix {
        position: absolute;
        right: 48px;
        top: 0;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
      }
    }
  }
  // 1577 - 1919
  @media screen and (min-width: 1578px) and (max-width: 1919px) {
    .examinetype-style {
      width: 88%;
      /deep/ .el-input__inner {
        width: 89%;
      }
      /deep/ .el-input__inner {
        height: 30px !important;
      }
      /deep/.el-input__suffix {
        position: absolute;
        right: 70px;
        top: 0;
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
      }
    }
  }

  .name {
    font-size: 18px;
    font-family: 'PingFang-SC-Bold';
    font-weight: bold;
    margin: 0 0 30px;
  }
  .tab {
    display: flex;
    flex-direction: row;
    margin-bottom: 16px;
    border-bottom: 1px solid #e0e0e0;
    .tab-title {
      border: 1px solid #e0e0e0;
      border-radius: 5px;
      border-bottom: none;
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
      width: 75px;
      margin-right: 10px;
      margin-bottom: -1px;
      height: 35px;
      line-height: 35px;
      text-align: center;
      color: #0099ff;
      background-color: #ffffff;
      &:hover {
        cursor: pointer;
      }
    }
    .big {
      width: 105px;
      background-color: #e0e0e0;
    }
  }
  .data {
    margin-top: 30px;
    .body {
      display: flex;
      flex-direction: row;
      white-space: nowrap;
      width: 100%;
      line-height: 30px;
      margin-bottom: 8px;
      .el-input {
        /deep/ .el-icon-coffee::before {
          content: '. . .';
        }
        /deep/ .el-icon-coffee:hover {
          cursor: pointer;
        }
      }
      .el-select {
        width: 100%;
      }
      .long-input {
        width: 80%;
      }
      .right-input {
        width: 90%;
      }
      .el-input__inner {
        height: 30px;
        line-height: 30px;
        /deep/ .el-range__icon {
          line-height: 22px;
        }
        /deep/ .el-range-separator {
          line-height: 22px;
        }
        /deep/ .el-range__close-icon {
          line-height: 22px;
        }
      }
    }
    .check-parent {
      position: relative;
      .check-inspection {
        display: flex;
        flex-direction: row;
        white-space: nowrap;
        line-height: 30px;
        .el-textarea {
          white-space: pre-wrap;
        }
      }
      .check-example {
        display: inline-block;
        position: absolute;
        top: 25px;
        left: 0;
        padding-right: 10px;
        color: #0099ff;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
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
    margin-left: -10px;
    margin-top: -7px;
    transform: translate(0, -1px);
    vertical-align: middle;
    font-size: 12px;
    height: 100%;
  }
  .dialog_container {
    height: 500px;
    overflow-y: scroll;
    .select-com-dialog {
      /deep/ .el-dialog {
        margin-top: 5vh !important;
      }
    }
  }
  /deep/.el-icon-edit {
    line-height: 0px;
  }
  /deep/.el-icon-more {
    width: 18px;
  }
}
</style>
