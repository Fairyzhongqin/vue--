<template>
  <div class="main">
    <div class="header">
      <span>姓名：</span>
      <el-input placeholder="输入姓名" v-model="name"></el-input>
      <span>证件号：</span>
      <el-input placeholder="输入证件号" v-model="code"></el-input>
      <el-button type="primary" @click="query">查询</el-button>
    </div>
    <el-row class="retrieval-container">
      <el-col :span="8" class="sort-container">
        <el-tree
          :data="deptList"
          :props="defaultProps"
          node-key="id"
          :default-expand-all="false"
          :accordion="true"
          @node-click="sortNodeClick"
        ></el-tree>
      </el-col>
      <el-col :span="16" class="detail-container">
        <div
          v-for="(item, index) in peopleList"
          :key="index"
          :style="{background: item.selected ? '#CEE4FF' : null}"
        >
          <div class="box">
            <div class="org">
              <span>{{index + 1}}</span>
              <span>
                <el-checkbox
                  @change="selectPeople(item)"
                  v-model="item.checked"
                  :label="index"
                >{{item.nickName}}</el-checkbox>
              </span>
            </div>
          </div>
          <el-divider></el-divider>
        </div>
        <div class="page">
          <el-pagination
            layout="prev, pager, next"
            :current-page="currPage"
            :page-count="totalPage"
            @current-change="getListData"
          ></el-pagination>
        </div>
      </el-col>
    </el-row>
    <div class="oper-button">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="sure">确定</el-button>
    </div>
  </div>
</template>

<script>
import snSelect from "@components/snSelect/index";
import { saveRectificationReview } from "@/api/rectification/index";
import { getOrgList, getPeopleList } from "@/api/onSiteInspection/index";

export default {
  name: "selectPeople",
  components: {
    snSelect
  },
  props: {
    selectNum: {
      type: Number,
      required: true
    },
    parentToChild: {
      type: String
    }
  },
  data() {
    return {
      deptList: [],
      defaultProps: {
        children: "child",
        label: "name"
      },
      info: {
        id: this.parentToChild,
        reviewNameId: ""
      },
      peopleList: [],
      name: null, // 查询条件：姓名
      code: null, // 查询条件：证件号
      currPage: 1,
      pageSize: 10,
      totalPage: 0,
      selectedPeople: [],
      selectPeopleList: new Map(),
      selectedDeptId: ""
    };
  },
  methods: {
    // 根据不同部门id查询相应部门下的人员列表
    sortNodeClick(org) {
      if (!org.child || (org.child && org.child.length === 0)) {
        let peopleList = this.selectPeopleList.get(org.id + 1);
        this.selectedDeptId = org.id;
        if (peopleList) {
          this.peopleList = peopleList.children;
          this.currPage = peopleList.currPage;
          this.totalPage = peopleList.totalPage;
        } else {
          this.initPeopleList("1");
        }
      }
    },
    query() {
      this.initPeopleList("1", "query");
    },
    // 获取部门数据list
    initOrgList(data = {}) {
      getOrgList(data).then(res => {
        this.deptList = res.data;
      });
    },
    // 获取人员列表
    initPeopleList(page) {
      getPeopleList({
        cardId: this.code,
        deptId: this.selectedDeptId,
        isPaging: "true",
        page: page,
        limit: "2",
        username: this.name
      }).then(res => {
        res.page.list.forEach(item => {
          item.checked = false;
        });
        this.peopleList = res.page.list;
        this.currPage = res.page.currPage;
        this.totalPage = res.page.totalPage;
      });
    },
    getListData(val) {
      let dataList = this.selectPeopleList.get(this.selectedDeptId + val);
      if (dataList) {
        this.currPage = val;
        this.peopleList = dataList.children;
        this.totalPage = dataList.totalPage;
      } else {
        this.initPeopleList(`${val}`);
      }
    },
    // 取消按钮点击事件
    close() {
      // this.$store.commit("setPeopleDialog");
      this.$emit("getPeople", false);
    },
    // 确定按钮点击事件
    sure() {
      let arr = [];
      console.log(this.selectedPeople);
      this.selectedPeople.map(item => {
        if (item.id) {
          arr.push(item.id);
          this.info.reviewNameId = arr.join(",");
        }
      });

      this.$emit("getPeople", true, this.selectedPeople);
      // this.$store.commit("setNewRectificationShow");
    },
    // 人员选择回显
    selectPeople(val) {
      let dataList = this.selectPeopleList.get(
          this.selectedDeptId + this.currPage
        ),
        id = this.selectedDeptId + this.currPage;
      if (!val.checked) {
        this.selectPeopleList.set(id, {
          children: this.peopleList,
          currPage: this.currPage,
          totalPage: this.totalPage
        });
        let flag = dataList.children.some(item => {
          return item.checked === true;
        });
        if (!flag) {
          this.selectPeopleList.delete(id);
        }
        let num = -1;
        this.selectedPeople.some((item, index) => {
          num = index;
          return item.id === val.id;
        });
        this.selectedPeople.splice(num, 1);
      }
      if (val.checked) {
        this.selectPeopleList.set(id, {
          children: this.peopleList,
          currPage: this.currPage,
          totalPage: this.totalPage
        });
        if (this.selectedPeople.length > 0) {
          this.selectedPeople[0].checked = false;
        }
        this.selectedPeople = [val];
        console.log(this.selectedPeople);
      }
    }
  },
  mounted() {
    this.initOrgList({ isPaging: "false" });
    // console.log(this.selectPeopleList, "=======");
  }
};
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
    height: 392px;
    .sort-container {
      background-color: rgba(238, 245, 249, 1);
      // background-color: #eef5f9;
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
          height: 42px;
          line-height: 42px;
          word-break: break-all;
          .el-divider--horizontal {
            margin: 0;
          }
          span {
            color: #222222;
            display: inline-block;
          }
          span:nth-of-type(1) {
            width: 30px;
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
  // tree node
  // .el-tree-node.is-current > .el-tree-node__content {
  //   background-color: red !important;
  // }
}
</style>