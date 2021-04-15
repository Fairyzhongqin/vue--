<template>
  <div>
    <div class="search-container" v-show="shrinkStatus">
      <div class="search-bar">
        <template v-for="(searchNode, index) of searchList">
          <div :key="index" v-if="searchNode.type != 'hiddenNode'">
            <div class="search-node">
              <div class="search-name">{{ searchNode.name }}：</div>
              <div class="search-value">
                <el-input
                  v-if="searchNode.type === 'text'"
                  v-model="searchNode.value"
                  :placeholder="'请输入' + searchNode.name"
                  @keyup.enter.native="search"
                  clearable
                ></el-input>
                <sn-select
                  v-if="searchNode.type === 'select'"
                  v-model="searchNode.value"
                  :data-url="searchNode.url"
                  :requertData="searchNode.data"
                  :placeholder="'请选择' + searchNode.name"
                  :immediate="true"
                ></sn-select>
                <el-select
                  v-if="searchNode.type === 'selectFixedValue'"
                  v-model="searchNode.value"
                  :clearable="searchNode.clearable"
                  :placeholder="'请选择' + searchNode.name"
                >
                  <el-option
                    v-for="item in searchNode.default"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-date-picker
                  v-if="searchNode.type === 'date'"
                  v-model="searchNode.value"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
                <sn-dialog-select
                  v-if="searchNode.type === 'dialog'"
                  :placeholder="'请选择' + searchNode.name"
                  v-model="searchNode.value.nickName"
                  @clickHandle="searchNode.event"
                ></sn-dialog-select>
                <sn-dialog-select
                  v-if="searchNode.type === 'orgDialog'"
                  placeholder="请选择执法部门"
                  v-model="searchNode.value.name"
                  @clickHandle="searchNode.event"
                ></sn-dialog-select>
                <sn-dialog-select
                  v-if="searchNode.type === 'chooseOrg'"
                  :placeholder="'请选择' + searchNode.placeholder"
                  v-model="searchNode.value.name"
                  @clickHandle="openDialog('org', index)"
                ></sn-dialog-select>
                <sn-dialog-select
                  v-if="searchNode.type === 'choosePeople'"
                  :placeholder="'请选择' + searchNode.name"
                  v-model="searchNode.value.name"
                  @clickHandle="openDialog('people', index)"
                ></sn-dialog-select>
                <sn-dialog-select
                  v-if="searchNode.type === 'type_dialog'"
                  :placeholder="'请选择' + searchNode.name"
                  v-model="searchNode.value.value"
                  @clickHandle="searchNode.event"
                ></sn-dialog-select>
              </div>
            </div>
          </div>
        </template>
        <div class="search-button">
          <el-button type="primary" size="medium" @click="search()">搜索</el-button>
          <el-button size="medium" @click="clearValue()">重置</el-button>
        </div>
      </div>
      <div class="shrink-bar">
        <el-button type="text" class="shrink-button" @click="shrink()">
          {{ '收起搜索' }}
          <i class="el-icon-arrow-up"></i>
        </el-button>
      </div>
    </div>
    <div v-show="!shrinkStatus" class="open-bar">
      <el-button type="text" class="shrink-button" @click="shrink()">
        {{ '展开搜索' }}
        <i class="el-icon-arrow-down"></i>
      </el-button>
    </div>
    <el-dialog :title="dialogTitle" width="300px" height="570px" :visible.sync="showOrgList">
      <select-org :closeOrgDialog="closeDialog" @getOrg="getOrg"></select-org>
    </el-dialog>
    <el-dialog :title="dialogTitle" width="900px" height="600px" :visible.sync="showPeopleList">
      <select-people @getPeople="getPeople" :selectNum="1"></select-people>
    </el-dialog>
  </div>
</template>

<script>
import snSelect from '@/components/snSelect'
import snDialogSelect from '@/components/snDialogSelect'
import selectOrg from '@/pages/onSiteInspection/newInspection/component/selectOrg'
import selectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople'

export default {
  components: {
    snSelect,
    snDialogSelect,
    selectOrg,
    selectPeople
  },
  props: {
    searchList: {
      default: () => [
        {
          name: '企业名称',
          codeName: 'companyName',
          type: 'text',
          value: ''
        },
        {
          name: '审核状态',
          codeName: 'examineStatus',
          type: 'select',
          url: '/api',
          value: ''
        },
        {
          name: '检查时间',
          codeName: 'checkTime',
          type: 'date',
          value: ''
        },
        {
          name: '执法单位',
          codeName: 'lawUnit',
          type: 'select',
          url: '/api',
          value: ''
        },
        {
          name: '执法人员',
          codeName: 'lawPerson',
          type: 'select',
          url: '/api',
          value: ''
        },
        {
          name: '监管行业',
          codeName: 'regIndustry',
          type: 'select',
          url: '/api',
          value: ''
        },
        {
          name: '检查来源',
          codeName: 'checkSource',
          type: 'select',
          url: '/api',
          value: ''
        },
        {
          name: '检查方式',
          codeName: 'checkWay',
          type: 'select',
          url: '/api',
          value: ''
        }
      ]
    },
    collspan: {
      // 搜索条件收缩状态 true为展开
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      sliceArray: [], // 切割后的数组
      shrinkStatus: this.collspan, // 搜索条件收缩状态 true为展开
      queryData: {
        limit: 10,
        page: 1
      },
      showOrgList: false, // 选择部门
      showPeopleList: false, // 选择人员
      searchIndex: -1,
      dialogTitle: ''
    }
  },
  created() {
    this.sliceArray = this.searchList
  },
  methods: {
    handleCheckBox() {
      // 下拉选择框点击事件
      // this.getQueryList();
    },
    // getQueryList() {
    //   showQueryList(this.queryData)
    //     .then(res => {
    //       console.log(res);
    //     })
    //     .catch(err => {
    //       this.noDataText = "数据请求出错";
    //     });
    // },
    shrink() {
      // 收起
      this.shrinkStatus = !this.shrinkStatus
    },
    clearValue() {
      // 清空
      this.sliceArray.map(res => {
        let result = null
        if (res.value instanceof Array) {
          result = []
        } else if (res.value instanceof Object) {
          result = {}
        } else {
          result = ''
        }
        this.$set(res, 'value', result)
      })
      // console.info("searchbar", this.sliceArray);
      // this.$emit("searchTrigger", this.sliceArray);
      this.search()
    },
    search() {
      const obj = {}
      _.flatten(this.sliceArray).map(res => {
        obj[res.codeName] = res.value
      })
      this.$emit('searchTrigger', obj)
    },
    // 打开选择部门页面
    openDialog(val, index) {
      let name = `show${val.replace(val.charAt(0), val.charAt(0).toUpperCase())}List`
      this.dialogTitle = `选择${this.sliceArray[index].name}`
      this[name] = true
      this.searchIndex = index
    },
    // 关闭选择页面
    closeDialog() {
      this.showOrgList = false
      this.showPeopleList = false
    },
    // 选择部门
    getOrg(val) {
      // console.log(val);
      this.sliceArray[this.searchIndex].value.name = val.name
      this.sliceArray[this.searchIndex].value.id = val.id
      this.search()
    },
    // 选择人员
    getPeople(state, val) {
      if (!state) {
        this.showPeopleList = false
      } else {
        this.sliceArray[this.searchIndex].value.name = val[0].nickName
        this.sliceArray[this.searchIndex].value.id = val[0].id
        this.showPeopleList = false
        this.search()
      }
    }
  },
  watch: {
    searchList: {
      handler: function(newVal, oldVal) {
        this.search()
      },
      deep: true
    }
  }
}
</script>

<style lang="less">
.search-container {
  color: #333333;
  // width: 100%;
  background-color: #fff;
  font-size: 14px;
  display: flex;
  flex-direction: row;
  box-shadow: 0 1px 1px 0px #cccccc52;
  position: relative;
  // padding: 12px 0 0 30px;
  .search-bar {
    flex: 1;
    display: flex;
    flex-flow: row wrap;
    padding: 7px 27px;
    // padding: 7px 0 7px 7px;

    .el-col {
      height: 40px;
    }
    .item-title {
      text-align: center;
      line-height: 40px;
    }
    .item-value {
      line-height: 40px;
      .el-input__inner {
        height: 30px;
        line-height: 30px;
      }
      .el-input__icon {
        line-height: 30px;
      }
      .el-range__icon {
        line-height: 30px;
      }
      .el-input {
        width: 60% !important;
      }
      .el-select {
        width: 95%;
        .el-input {
          width: 100%;
        }
      }
      .el-date-editor {
        width: 95%;
        min-width: 260px;
        padding: 0px 10px;
        .el-range-separator {
          line-height: 30px;
          text-align: center;
        }
        /deep/.el-range__close-icon {
          line-height: 22px;
        }
      }
    }

    .search-node {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-top: 6px;
      .search-name {
        // min-width: 100px;
        height: 30px;
        line-height: 30px;
        text-align: left;
        // margin-left: 10px;
      }
      .search-value {
        min-width: 197px;
        height: 30px;
        line-height: 30px;
        margin-right: 10px;
        text-align: right;
        .el-select {
          width: 100%;
        }
        .el-input__inner {
          height: 30px;
          line-height: 30px;
          .el-range__icon {
            line-height: 24px;
          }
          .el-range-separator {
            width: 14px;
            line-height: 24px;
          }
        }
        .el-date-editor {
          width: 197px;
          min-width: 260px;
          .el-range__close-icon {
            line-height: 24px;
          }
        }
      }
    }
    .search-button {
      float: left;
      height: 40px;
      line-height: 40px;
      padding-left: 12px;
      width: 250px;
      margin-left: 20px;
      // margin-left: 30px;
      .el-button {
        width: 58px;
        &.el-button--medium {
          padding: 10px 10px;
        }
      }
    }
  }

  .shrink-bar {
    width: 91px;
    position: absolute;
    right: 0;
    bottom: 0;
    .shrink-button {
      position: absolute;
      left: 0px;
      bottom: 1px;
      padding: 0;
    }
  }
}

.open-bar {
  position: fixed;
  text-align: center;
  top: 111px;
  right: 11px;
  height: 20px;
  line-height: 20px;
  width: 82px;
  background-color: #66b1ff;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  z-index: 5;
  .el-button {
    height: 20px;
    color: #fff;
    padding: 0;
  }
}
/deep/.el-date-editor .el-range__close-icon {
  line-height: 24px;
}
// .el-input {
//   /deep/ .el-input__inner {
//     // padding: 0 8px;
//     // width: 84%;
//   }
// }
</style>
