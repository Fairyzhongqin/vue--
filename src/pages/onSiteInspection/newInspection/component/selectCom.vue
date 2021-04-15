<template>
  <div>
    <div class="main" v-show="isShowList">
      <div class="header">
        <span>企业名称：</span>
        <el-input placeholder="输入企业名称" v-model="name" clearable @keyup.enter.native="search"></el-input>
        <span>信用代码：</span>
        <el-input placeholder="输入信用代码" v-model="code" clearable @keyup.enter.native="search"></el-input>
        <span>监管行业类别：</span>
        <sn-select
          placeholder="请选择监管行业类别"
          v-model="supervisionIndustryType"
          :data-url="'/aj/sys/devdata/listByType'"
          :requertData="{typeId:'zxjglb',parentId: -1 }"
          :immediate="true"
          :chooseType="true"
          :methodType="'GET'"
        ></sn-select>
        <el-button type="primary" @click="search">搜索</el-button>
      </div>
      <div class="add-button">
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="compFormShow('add')"
        >新增企业</el-button>
        <a
              class="external-link"
              href="http://www.jsgsj.gov.cn:58888/ecipplatform/login.jsp"
              target="_blank"
            >国家企业信用信息公示系统（江苏）</a>
      </div>
      <el-row class="retrieval-container">
        <el-col :span="8" class="sort-container">
          <el-tree
            :data="locationList"
            :props="defaultProps"
            node-key="id"
            :default-expanded-keys="defaultExpandKeys"
            :accordion="true"
            @node-click="sortNodeClick"
          >
            <div
              :class="[
                {
                  treeFather: data.child && data.child.length > 0 && data.parentId != '-1',
                  treeSon: !data.child || data.child.length === 0,
                  superFather: data.parentId == '-1',
                  deptIsClick: data.isChecked
                },
                'tree-common'
              ]"
              slot-scope="{ node, data }"
            >{{ data.dataName }}</div>
          </el-tree>
        </el-col>
        <el-col :span="17" class="detail-container">
          <div v-if="orgList && orgList.length > 0">
            <div
              v-for="(item, index) in orgList"
              :key="index"
              :style="{background: item.selected ? '#CEE4FF' : null}"
            >
              <div class="box">
                <div class="org">
                  <span>{{indexId(index)}}</span>
                  <span v-if="!selectNum">
                    <el-radio
                      v-model="selectedOrg"
                      @change="selectOrg(index)"
                      :label="index"
                      :class="!item.selected ? 'special-radio' : 'special-radio-selected'"
                    >{{item.companyName}}</el-radio>
                  </span>
                  <span v-if="selectNum && selectNum > 1 ">
                    <el-checkbox
                      @change="getSelectedCom(item)"
                      v-model="item.selected"
                    >{{item.companyName}}</el-checkbox>
                  </span>
                </div>
                <div class="oper" v-show="item.selected">
                  <span @click="compFormShow('modify', item, 'disabled')">简介</span>
                  <!-- <span @click="compFormShow('modify', item)">编辑</span> -->
                </div>
              </div>
              <el-divider></el-divider>
            </div>
            <div class="page">
              <el-pagination
                layout="prev, pager, next,jumper"
                :current-page="currPage"
                :page-count="totalPage"
                @current-change="getListData"
              ></el-pagination>
            </div>
          </div>
          <div v-if="!isLoading && orgList && orgList.length === 0" class="no-info-tip">暂无数据</div>
        </el-col>
      </el-row>
      <div class="oper-button">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="sure">确定</el-button>
      </div>
    </div>
    <new-com v-if="!isShowList"></new-com>
    <el-dialog
      :title="compFormType==='add'?'新增企业':'企业信息'"
      width="1200px"
      :visible.sync="addCompDialog"
      append-to-body
    >
      <div class="dialog_container" v-if="addCompDialog">
        <company-form
          ref="compForm"
          :isDialog="true"
          :type="compFormType"
          :enterpriseId="currentEnterpriseId"
          :isDisabled="isDisabled"
          @backPage="returnComp"
        ></company-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCompDialog=false">关闭</el-button>
        <el-button v-if="!isDisabled" type="primary" @click="compSure">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import snSelect from '@components/snSelect/index'
import { getComList, getLocation } from '@/api/onSiteInspection/index'
import companyForm from '@/pages/enterpriseInfo/components/companyForm'
export default {
  name: 'selectCom',
  components: {
    snSelect,
    companyForm
  },
  props: {
    comCache: {
      type: Array,
      required: false,
      default: () => {
        return []
      }
    },
    closeOrgDialog: {
      type: Function
    },
    selectNum: {
      type: Number
    }
  },
  data() {
    return {
      compFormType: '', // 选择企业弹框的类型
      isDisabled: false,
      // 默认展开节点
      addCompDialog: false,
      defaultExpandKeys: [],
      locationList: [],
      defaultProps: {
        children: 'child',
        label: 'dataName'
      },
      field: '', // 监管行业类别
      name: null, // 查询条件：企业名字
      code: null, // 查询条件：信用代码
      supervisionIndustryType: null, // 查询条件：信用代码
      orgList: [],
      currPage: 1,
      pageSize: 10,
      totalPage: 0,
      selectedOrg: null,
      radioSelectedOrg: null,
      isShowList: true,
      selectedOrgList: [],
      isWork: '0', // 企业状态： 0 正常，-1 禁用
      isLoading: true,
      currentEnterpriseId: ''
    }
  },
  methods: {
    indexId(index) {
      return (this.currPage - 1) * this.pageSize + index + 1
    },
    // 根据每一级地区查询该地区下的企业列表
    sortNodeClick(location) {
      if (!location.child) {
        this.initOrgList({ regionId: location.id })
      } else {
        this.initOrgList({ regionId: location.id })
      }
    },
    // 获取相应地区的企业列表
    initOrgList(data = {}) {
      this.isLoading = true
      let that = this
      getComList(data).then(res => {
        let ids = []
        /* this.comCache.forEach(item => {
          ids.push(item.id)
        }) */
        res.page.list.forEach((item, index) => {
          if (that.radioSelectedOrg && that.radioSelectedOrg.id == item.id) {
            that.selectedOrg = index
          }
          if (that.selectNum > 1 && ids.indexOf(item.id) >= 0) {
            item.selected = true
          } else {
            item.selected = false
          }
        })
        this.orgList = res.page.list
        this.totalPage = res.page.totalPage
        this.currPage = res.page.currPage
        this.isLoading = false
      })
    },
    // 根据分页请求不同页数的数据
    getListData(e) {
      this.initOrgList({
        limit: '10',
        page: `${e}`,
        companyCode: this.code,
        companyName: this.name,
        supervisionIndustryType: this.supervisionIndustryType,
        isWork: this.isWork
      })
    },
    // 选择企业
    selectOrg(e) {
      this.orgList.forEach(item => {
        item.selected = false
      })
      this.orgList[e].selected = true
      this.radioSelectedOrg = this.orgList[e]
      // this.setSeletedComs([this.radioSelectedOrg])
    },
    // 模糊查询
    search() {
      this.initOrgList({
        limit: '10',
        page: '1',
        companyCode: this.code,
        companyName: this.name,
        supervisionIndustryType: this.supervisionIndustryType,
        isWork: this.isWork
      })
    },
    // 点击确定按钮事件
    sure() {
      if (this.selectNum && this.selectNum > 1) {
        this.$emit('getCom', this.selectedOrgList)
        console.info('点击确定后选择的企业', this.selectedOrgList)
      } else {
        this.$emit('getCom', this.orgList[this.selectedOrg])
      }
      this.closeOrgDialog()
    },
    close() {
      this.closeOrgDialog()
    },
    // 获取地区数据list
    initLocationList() {
      getLocation().then(res => {
        // 默认展开
        console.log('地区list', res)
        this.defaultExpandKeys.push(res.data[0].id)
        this.locationList = res.data
      })
    },
    // 新增企业按钮点击事件
    compFormShow(type, item, isDisabled) {
      if (isDisabled) {
        this.isDisabled = true
      } else {
        this.isDisabled = false
      }
      this.$store.commit('setNewRectificationShow', true)
      this.compFormType = type
      if (this.compFormType === 'modify') {
        this.currentEnterpriseId = item.id
      } else {
        this.currentEnterpriseId = ''
      }
      this.addCompDialog = true
    },
    getSelectedCom(val) {
      if (val.selected) {
        this.selectedOrgList.push(val)
        // this.comCache.push(val)
      } else {
        let index = -1, cacheInd = -1
        this.selectedOrgList.some((item, i) => {
          index = i
          return (item.id = val.id)
        })
        this.selectedOrgList.splice(index, 1)
        /* this.comCache.some((item, i) => {
          cacheInd = i
          return (item.id = val.id)
        })
        this.comCache.splice(cacheInd, 1) */
      }
    },
    /* // 处理选择企业的回显
    setSeletedComs(comArr) {
      let ids = []
      comArr.forEach(item => {
        ids.push(item.id)
      })
      this.orgList.forEach(item => {
        if (this.selectNum > 1 && ids.indexOf(item.id) >= 0) {
          item.selected = true
        } else {
          item.selected = false
        }
      })
    }, */
    // 展示所选择的监管行业类别
    setField(field) {
      this.field = field
    },
    returnComp() {
      this.addCompDialog = false
    },
    compSure() {
      this.$refs.compForm.saveOrUpdate()
    }
  },
  mounted() {
    this.initLocationList()
    /* if (this.selectNum === 1) {
      this.radioSelectedOrg = this.comCache[0]
    } else {
      this.selectedOrgList = JSON.parse(JSON.stringify(this.comCache))
      this.selectedOrgList.forEach(val => {
        val.selected = true
      })
    } */
    this.initOrgList({ isWork: '0' })
  }
}
</script>

<style lang="less" scoped>
// @import '~@/assets/css/animated.css';
.main {
  padding: 8px 16px 0;
  .header {
    display: flex;
    flex-direction: row;
    span {
      display: inline-block;
      line-height: 30px;
    }
    .el-input {
      width: 180px;
      margin-right: 24px;
    }
    .el-button {
      width: 58px;
      height: 30px;
      line-height: 0;
      padding: 0;
    }
    .el-select {
      margin-right: 24px;
    }
  }
  .retrieval-container {
    height: 400px;
    .sort-container {
      background-color: #eef5f9;
      overflow: auto;
      height: 100%;
      border: 1px solid #e0e0e0;
      overflow-y: auto;
    }
    .detail-container {
      overflow: auto;
      color: #222222;
      border: 1px solid #e0e0e0;
      height: 100%;
      overflow-y: auto;
      .box {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .org {
          margin-left: 16px;
          height: 35px;
          line-height: 35px;
          word-break: break-all;
          span {
            color: #222222;
            display: inline-block;
          }
          span:nth-of-type(1) {
            min-width: 30px;
          }
          /deep/.special-radio {
            .el-radio__input .el-radio__inner {
              background: #ffffff;
              border-color: #606266;
            }
            .el-radio__label {
              color: #606266;
            }
          }
          /deep/ .special-radio-selected {
            .el-radio__input .el-radio__inner {
              background: #409eff;
              border-color: #409eff;
            }
            .el-radio__label {
              color: #409eff;
            }
          }
        }
        .oper {
          padding-right: 22px;
          height: 35px;
          line-height: 35px;
          span {
            cursor: pointer;
            color: #0099ff;
            font-size: 14px;
            &:last-child {
              color: #1cc19c;
            }
          }
        }
      }
      .el-divider--horizontal {
        margin: 0;
      }
      .page {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        .el-pagination {
          position: none;
        }
      }
    }
  }
  .add-button {
    padding: 12px 0 8px;
    .el-button {
      /deep/ .el-icon-circle-plus-outline {
        line-height: 0;
      }
    }
  }
  .oper-button {
    display: flex;
    justify-content: flex-end;
    padding: 6px 0;
  }
  /deep/.el-col-17 {
    width: 64%;
  }
  // 分页 jumper
  /deep/.el-pagination__editor.el-input .el-input__inner {
    height: 24px;
  }
}
/deep/.el-col-8 {
  width: 36%;
}
.no-info-tip {
  text-align: center;
  font-size: 14px;
  margin-top: 20%;
  color: #999999;
}
.dialog_container {
  height: 500px;
  overflow-y: scroll;
}
.external-link {
  float: right;
  line-height: 30px;
  margin-right: 5px;
}
</style>
