<template>
  <div class="main">
    <div class="header">
      <span>姓名：</span>
      <el-input placeholder="输入姓名" v-model="name" clearable @keyup.enter.native="query"></el-input>
      <span>证件号：</span>
      <el-input placeholder="输入证件号" v-model="code" clearable @keyup.enter.native="query"></el-input>
      <el-button type="primary" @click="query" class="query-button">搜索</el-button>
    </div>
    <el-row class="retrieval-container">
      <el-col :span="8" class="sort-container">
        <select-roletag v-if="selectByRole" :roleIndex="roleIndex" @roleChange="roleChange"></select-roletag>
        <el-tree
          ref="deptTree"
          :style="{maxHeight: selectByRole ? '332px' : '400px'}"
          :data="deptList"
          :props="defaultProps"
          node-key="id"
          highlight-current
          :default-expanded-keys="defaultExpandKey"
          :accordion="true"
          @node-click="sortNodeClick"
        >
          <div
            :class="[
                {
                  treeFather: data.child && data.child.length > 0 && data.parentId != '0', 
                  treeSon: !data.child || data.child.length === 0,
                  superFather: data.parentId == '0',
                  deptIsClick: data.isChecked
                }, 
                'tree-common'
              ]"
            slot-scope="{ node, data }"
          >{{ data.name }}</div>
        </el-tree>
      </el-col>
      <el-col :span="17" class="detail-container">
        <div
          class="detail_layout"
          v-for="(item, index) in peopleList"
          :key="index"
          :style="{background: item.selected ? '#CEE4FF' : null}"
        >
          <div class="box">
            <div class="org">
              <span class="autosizeIndexWidth">{{indexId(index)}}</span>
              <span v-if="selectNum === 1">
                <el-radio
                  :show-overflow-tooltip="true"
                  v-model="selectedOne"
                  @change="selectOne(item)"
                  :label="index"
                >{{item.nickName}}</el-radio>
              </span>
              <span v-if="minNum > 1">
                <el-checkbox
                  @change="selectPeople(item)"
                  v-model="item.checked"
                  :label="index"
                  :title="item.nickName"
                >{{item.nickName }}</el-checkbox>
              </span>
              <!--   <el-tooltip class="item" effect="dark" placement="top">
                <div slot="content">{{ item.cardId}}</div>
                     <span class="overFlowSpan">证件号：{{ item.cardId }}</span>
              </el-tooltip>-->
              <span :title="item.cardId">证件号：{{ item.cardId }}</span>
              <!-- <span>证件号：{{item.cardId || ellipsis}}</span> -->
              <span
                :title="item.mobile"
                class="overFlowSpan"
              >手机号：{{ item.mobile ? item.mobile:"暂无"}}</span>
            </div>
          </div>
          <!-- <el-divider></el-divider> -->
        </div>
        <div class="page" v-if="peopleList && peopleList.length > 0">
          <el-pagination
            layout="prev, pager, next"
            :current-page="currPage"
            :page-count="totalPage"
            @current-change="getListData"
          ></el-pagination>
        </div>
        <div v-if="!isLoading && peopleList && peopleList.length === 0" class="no-info-tip">暂无数据</div>
      </el-col>
    </el-row>

    <div class="oper-button">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" :loading="sureIsLoading" @click="sure">确定</el-button>
    </div>
  </div>
</template>

<script>
import snSelect from '@components/snSelect/index'
import { getOrgList, getPeopleList, getAswPeopleList } from '@/api/onSiteInspection/index'
import { Throttle } from '@/utils/util'
import Bus from '@/bus'
import selectRoletag from './selectRoletag'
export default {
  name: 'selectPeople',
  components: {
    snSelect,
    selectRoletag
  },
  props: {
    // 单选，传值为1
    selectNum: {
      type: Number
    },
    // 多选，和单选的传值选择一个
    minNum: {
      type: Number
    },
    // 已选择的人员备份，作回显用
    peopleCache: {
      type: Array,
      required: false
    },
    // 确认按钮正在加载
    sureIsLoading: {
      type: Boolean,
      default: false
    },
    // 可按角色筛选
    selectByRole: {
      type: Boolean,
      default: false
    }
  },
  filters: {
    ellipsis(value) {
      if (!value) return ''
      if (value.length > 8) {
        return value.slice(0, 8) + '...'
      }
      return value
    }
  },
  data() {
    return {
      defaultExpandKey: [], //树形默认展开节点
      deptList: [],
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      peopleList: [],
      name: null, // 查询条件：姓名
      code: null, // 查询条件：证件号
      currPage: 1,
      pageSize: 10,
      totalPage: 0,
      selectedPeople: [],
      selectPeopleList: new Map(),
      selectedDeptId: '',
      selectedOne: null,
      deptCode: null,
      isLoading: true,
      roleIndex: 0 //  0 不限角色 1 案审委人员
    }
  },
  methods: {
    indexId(index) {
      return (this.currPage - 1) * this.pageSize + index + 1
    },
    // 根据不同部门id查询相应部门下的人员列表
    sortNodeClick(org) {
      // org.act = true
      // debugger
      this.roleIndex = 0
      this.deptCode = org.code
      this.selectedDeptId = org.id
      this.initPeopleList('1')
      this.selectedOne = null
    },
    // 获取案审委人员列表
    roleChange(index){
      this.roleIndex = index
      this.deptCode = ''
      this.selectedDeptId = ''
      this.initPeopleList('1')
      this.selectedOne = null
      this.$refs.deptTree.setCurrentKey(null)
      // getAswPeopleList
    },
    query() {
      // this.deptCode = '' // 
      this.initPeopleList('1', 'query')
    },
    // 获取部门数据list
    initOrgList(data = {}) {
      getOrgList(data).then(res => {
        this.defaultExpandKey.push(res.data[0].id)
        this.deptList = res.data
      })
    },
    selectOne(item) {
      console.info(this.selectedOne)
      this.selectedPeople.splice(0, 1)
      this.selectedPeople.push(item)
      this.setPeopleCache(this.selectedPeople)
      // console.log("选中了", this.selectedPeople);
      Bus.$emit('selectedPeople', this.selectedPeople)
    },
    // 获取人员列表
    initPeopleList(page, type) {
      this.selectedOne = null
      // console.log(page, type, this.selectedDeptId);
      if (this.roleIndex === 0) {
        getPeopleList({
          // cardId: type ? this.code : '',
          cardId: this.code,
          // deptId: type ? "" : this.selectedDeptId,
          isPaging: 'true',
          page: page,
          limit: '10',
          // username: type ? this.name : '',
          username: this.name,
          deptCode: this.deptCode,
          status: '1'
        }).then(res => {
          this.showPeopleList(res)
        })
      } else {
        getAswPeopleList({
          // cardId: type ? this.code : '',
          cardId: this.code,
          // deptId: type ? "" : this.selectedDeptId,
          isPaging: 'true',
          page: page,
          limit: '10',
          // username: type ? this.name : '',
          username: this.name,
          // deptCode: this.deptCode,
          status: '1'
        }).then(res => {
          this.showPeopleList(res)
        })
      }


      
    },
    // 由于涉及到两个接口的回调，抽出来
    showPeopleList(res) {
      // console.log("获取人员列表的res", res);
      this.isLoading = false
      res.page.list.forEach(item => {
        item.checked = false
      })
      let _cacheOnceFlag = false // 单选只赋值一次
      this.peopleList =
        res.page.list && res.page.list.length > 0
          ? res.page.list.reduce((total, item, index) => {
              if (this.selectNum !== 1) {
                item.checked = this.selectedPeopleIdCache ? (this.selectedPeopleIdCache.indexOf(item.id) !== -1 ? true : false) : false
                if (!item.checked) {
                  // 切换页码时保存的选项，组件内保存
                }
              } else {
                if (!_cacheOnceFlag) {
                  if (this.selectedPeopleIdCache && this.selectedPeopleIdCache.indexOf(item.id) !== -1) {
                    this.selectedOne = index
                    _cacheOnceFlag = true
                  }
                  
                }
              }
              total.push(item)
              return total
            }, [])
          : []
      console.info(this.selectedOne)
      console.log(this.peopleList)
      // this.peopleList = res.page.list;
      this.currPage = res.page.currPage
      this.totalPage = res.page.totalPage
    },

    getListData(val) {
      const dataList = this.selectPeopleList.get(this.selectedDeptId + val)
      if (dataList) {
        this.currPage = val
        this.peopleList = dataList.children
        this.totalPage = dataList.totalPage
      } else {
        this.initPeopleList(`${val}`, true)
      }
    },
    // 取消按钮点击事件
    close() {
      // this.$store.commit("setPeopleDialog");
      this.$emit('getPeople', false)
    },
    // 确定按钮点击事件
    sure: Throttle(function() {
      let _arr = []
      this.selectedPeople.map((item, index) => {
        if (_arr.indexOf(item.id) !== -1) {
          //重复了
          this.selectedPeople.splice(index, 1)
        } else {
          _arr.push(item.id)
        }
      })
      if (
        (this.minNum && this.minNum > 1 && this.selectedPeople.length < this.minNum) ||
        (this.selectNum && this.selectNum === 1 && this.selectedPeople.length === 0)
      ) {
        let msg = `请至少选择${this.selectNum && this.selectNum === 1 ? 1 : this.minNum}人`
        this.$message({
          showClose: true,
          message: msg,
          type: 'error'
        })
      } else {
        this.$emit('getPeople', true, this.selectedPeople)
      }
      // this.$store.commit("setPeopleDialog");
    }, 1000),
    // 人员选择回显
    selectPeople(val) {
      if (!val.checked) {
        this.selectedPeople = this.selectedPeople.filter(item => {
          return item.id !== val.id
        })
      }
      if (val.checked) {
        this.selectedPeople.push(val)
      }
      this.setPeopleCache(this.selectedPeople)
    },
    setPeopleCache(_peopleCache) {
      this.selectedPeopleIdCache =
        _peopleCache && _peopleCache.length > 0
          ? _peopleCache.reduce((total, item) => {
              total += item.id + ','
              return total
            }, '')
          : null
      this.selectedPeople = _peopleCache && _peopleCache.length > 0 ? JSON.parse(JSON.stringify(_peopleCache)) : []
    }
  },
  mounted() {
    this.initOrgList({ isPaging: 'false' })
    this.setPeopleCache(this.peopleCache)
    this.initPeopleList()
  },
  watch: {
    peopleCache(newName) {
      this.setPeopleCache(newName)
      this.initPeopleList()
    },
    deep: true
  }
}
</script>

<style lang="less" scoped>
.main {
  padding: 8px 16px 0;
  .header {
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
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
    height: 404px;
    .sort-container {
      background-color: #eef5f9;
      // overflow: auto;
      height: 100%;
      border: 1px solid #e0e0e0;
      // overflow-y: auto;
      // padding-left: 10px;
      /deep/.el-tree {
        overflow-y: auto;
        max-height: 332px;
        .el-tree-node__content {
          height: 40px;
          line-height: 42px;
          .tree-common {
            line-height: 42px;
          }
        }
        &::-webkit-scrollbar {
          width: 10px;
          border: none;
        }
        &::-webkit-scrollbar-thumb {
          background: rgba(91, 108, 130, 0.1);
          border-radius: 4px;
          width: 7px;
          border: none;
          margin-right: 3px;
        }
        &:hover::-webkit-scrollbar-thumb {
          background: rgba(91, 108, 130, 0.3);
        }
      }

    }
    .detail-container {
      overflow: auto;
      color: #222222;
      border: 1px solid #e0e0e0;
      height: 100%;
      overflow-y: auto;
      .detail_layout {
        &:nth-child(even){
          background-color: #F4F8FA;
        }
        &:nth-child(odd){
          background-color: #FFF;
        }
      }

      .box {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        border-bottom: 1px solid #ccc;
        height: 36px;
        line-height: 36px;
        // &:nth-child(2n){
        //   background-color: #F4F8FA;
        // }
        .org {
          margin-left: 16px;
          height: 36px;
          line-height: 36px;
          word-break: break-all;
          display: flex;
          justify-content: space-around;
          .autosizeIndexWidth {
            width: 23px;
            display: inline-block;
          }
          /deep/.el-checkbox__inner {
            // border-radius: 50% !important;
          }
          /deep/.el-checkbox__input.is-checked + .el-checkbox__label {
            color: #222222;
          }
          span {
            color: #222222;
            display: inline-block;
            margin-right: 5px;
          }
          /*  span:nth-of-type(1) {
            width: 20px;
          } */
          span:nth-of-type(2) {
            width: 130px;
            overflow: hidden;
            cursor: pointer;
          }
          span:nth-of-type(3) {
            width: 200px;
            overflow: hidden;
            cursor: pointer;
          }
        }
        .oper {
          padding-right: 22px;
          line-height: 42px;
        }
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
  .overFlowSpan {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
  }
  /deep/.el-col-8 {
    width: 36%;
  }
}
.no-info-tip {
  text-align: center;
  font-size: 14px;
  margin-top: 20%;
  color: #999999;
}
/deep/.el-divider--horizontal {
  margin: 6px 0;
}
/deep/.el-tree .el-tree-node__expand-icon {
  min-width: 12px;
  min-height: 12px;
  line-height: 12px;
  border-radius: 4px;
  margin-left: 16px;
}
/deep/.el-icon-loading{
  line-height: 0
}
/deep/.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
  background: #fff;
  border-top: 1px solid #E0E0E0;
  border-bottom: 1px solid #E0E0E0;
  border-left: 4px solid #0099FF;
}
</style>
