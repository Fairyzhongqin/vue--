<template>
  <div>
    <div class="content">
      <div @click="backPage" class="back-button">
        <i class="el-icon-arrow-left"></i> 返回
      </div>
      <div class="flex justify-content-space-between top-pading">
        <div class="content-list">
          <el-row>
            <el-col :span="2">角色名称：</el-col>
            <el-col :span="5">
              <el-input v-model="totalData.name" placeholder="请输入角色名称" clearable></el-input>
            </el-col>
            <el-col :span="1">备注：</el-col>
            <el-col :span="5">
              <el-input v-model="totalData.remark" placeholder="请输入备注" clearable></el-input>
            </el-col>
          </el-row>
          <el-row class="retrieval-container">
            <el-col :span="8" class="sort-container">
              <div class="branchTree">
                <span>功能权限</span>
              </div>
              <div class="branchList">
                <el-tree
                  :data="menuList"
                  show-checkbox
                  node-key="id"
                  ref="menutree"
                  default-expand-all
                  :check-strictly="strictly"
                  :props="defaultProps"
                ></el-tree>
              </div>
            </el-col>
            <el-col :span="8" class="sort-container">
              <div class="branchTree">
                <span>数据权限</span>
              </div>
              <div class="branchList">
                <el-tree
                  :data="departmentList"
                  show-checkbox
                  node-key="id"
                  ref="deptree"
                  default-expand-all
                  expand-on-click-node
                  :props="dataProps"
                ></el-tree>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <buttonGroup :buttonList="buttonList"></buttonGroup>
  </div>
</template>
<script>
import selectOrg from "../../../onSiteInspection/newInspection/component/selectOrg";
import buttonGroup from "@components/buttonGroup/index";
import { departmentTree } from "@/api/systemManagement/departmentManagement/index";
import {
  menuTree,
  saveRole,
  detailRole
} from "@/api/systemManagement/roleManagement/index";
import { mapState } from "vuex";

export default {
  components: {
    selectOrg,
    buttonGroup
  },
  data() {
    return {
      strictly:false,
      buttonList: [
        {
          name: "取消",
          type: "",
          disable: false,
          fun: this.callOf
        },
        {
          name: "保存",
          type: "primary",
          disable: false,
          fun: this.saveData
        }
      ],
      defaultProps: {
        children: "child",
        label: "name"
      },
      dataProps: {
        children: "child",
        label: "name"
      },
      totalData: {
        createTime: "",
        createUser: "",
        delFlag: 0,
        deptIdList: [],
        id: "",
        menuIdList: [],
        name: "",
        orderNum: 0,
        remark: "",
        updateTime: "",
        updateUser: ""
      },
      menuList: [],
      departmentList: [],
    };
  },
  methods: {
    //返回
    backPage() {
      this.$store.commit("setRoleManagement");
    },
    callOf() {
      this.$store.commit("setRoleManagement");
    },
    //功能权限
    getShowMenutree() {
      menuTree()
        .then(res => {
          this.menuList = res.data;
          this.menuIdListId = res.data[0].id;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //数据权限
    getShowDepartmentList() {
      departmentTree()
        .then(res => {
          this.departmentList = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //角色详情
    getdetailRole() {
      let detailId = this.$store.state.detailId;
      let req = {
        id: detailId
      };
      detailRole(req)
        .then(res => {
          console.info(res);
          this.totalData = res.data;
          this.$refs.menutree.setCheckedKeys(res.data.menuIdList);
          this.$refs.deptree.setCheckedKeys(res.data.deptIdList);
        })
        .catch(err => {
          console.log(err);
        });
    },

    //保存
    saveData() {
      //菜单数据处理
      let menuIdList = [];
      this.$refs.menutree
        .getHalfCheckedNodes()
        .concat(this.$refs.menutree.getCheckedNodes())
        .map(item => {
          console.log(item, "333333");
          menuIdList.push(item.id);
        });
      // this.$refs.menutree.getCheckedKeys().map(item => {
      //   console.log(item,'212122')
      //   menuIdList.push(item);
      // });
      this.menuIdList = menuIdList;
      // this.menuIdList = this.menuIdListDate.concat(this.menuIdListId)
      console.log(this.menuIdList);
      //部门数据处理
      let deptIdList = [];
      this.$refs.deptree.getCheckedKeys().map(item => {
        deptIdList.push(item);
      });
      this.deptIdList = deptIdList;
      this.totalData.menuIdList = this.menuIdList;
      this.totalData.deptIdList = this.deptIdList;
      // this.totalData.id = this.menuListId
      delete this.totalData.createTime;
      delete this.totalData.updateTime;
      if (this.totalData.name) {
        saveRole(this.totalData)
          .then(res => {
            this.$message({
              type: "success",
              message: "保存成功！"
            });
            this.$store.commit("setRoleManagement");
          })
          .catch(err => {
            this.$message({
              type: "error",
              message: err
            });
          });
      } else {
        this.$message({
          type: "error",
          message: "请输入角色名称！"
        });
      }
    }
  },
  created() {
    let flag = this.$store.state.flag;
    if (flag == "addFlag") {
      !this.getdetailRole();
    }
    if (flag == "updataFlag") {
      this.getdetailRole();
      this.strictly = true
      let that = this
      setTimeout(()=>{
         that.strictly = false
      },3000)
    }
    this.getShowMenutree();
    this.getShowDepartmentList();
  },
  computed: {
    ...mapState(["showOrgList"])
  }
};
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
  height: 420px;
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
.retrieval-container {
  padding-top: 15px;
  height: 320px;
  .sort-container {
    //   background-color: #eef5f9;
    overflow: auto;
    height: 100%;
    // border: 1px solid #e0e0e0;
    overflow-y: auto;
    margin-right: 10px;
  }
  .detail-container {
    overflow: auto;
    color: #222222;
    height: 100%;
    overflow-y: auto;
    .el-table /deep/ tr.headerclass {
      height: 50px !important;
      font-weight: bold;
      color: rgba(34, 34, 34, 1);
      font-size: 16px;
      font-family: PingFang SC;
    }
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
    /deep/.el-tree {
      background: #eef5f9;
    }
  }
  .branchList {
    background-color: #eef5f9;
    height: 100%;
    /deep/ .el-tree {
      background-color: #eef5f9;
    }
  }
  .branchTree {
    // width: 334px;
    height: 50px;
    line-height: 50px;
    background: rgba(227, 238, 246, 1);
    span {
      width: 80px;
      height: 16px;
      display: block;
      padding-left: 15px;
      font-size: 16px;
      font-weight: bold;
      color: rgba(34, 34, 34, 1);
    }
  }
  /deep/.el-tree-node__content > .el-checkbox {
    margin-right: 10px;
  }
}
/deep/.el-col-1 {
  width: 5.16667%;
}
.el-col-5 {
  margin-right: 48px;
}
/deep/.el-tree .el-tree-node__expand-icon {
  margin-left: 12px;
}
</style>
