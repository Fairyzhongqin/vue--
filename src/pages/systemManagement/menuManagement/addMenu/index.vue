<template>
  <div>
    <div class="content">
      <div @click="backPage" class="back-button">
        <i class="el-icon-arrow-left"></i> 返回
      </div>
      <div class="flex justify-content-space-between top-pading">
        <div class="content-list">
          <el-row>
            <el-col :span="2">类型：</el-col>
            <el-col :span="6">
              <el-radio-group v-model="totalData.type">
                <el-radio :label="0">目录</el-radio>
                <el-radio :label="1">菜单</el-radio>
                <el-radio :label="2">按钮</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">
              <span class="required" />菜单名称：
            </el-col>
            <el-col :span="6">
              <el-input v-model="totalData.name" placeholder="菜单名称或者按钮名称" clearable></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">上级菜单：</el-col>
            <el-col :span="6">
              <el-input
                v-model="totalData.parentName"
                placeholder="选择菜单"
                style="width:100%"
                readonly
                @focus="handleMenu"
              >
                <i class="el-icon-more" slot="suffix" @click="handleMenu"></i>
              </el-input>
              <el-dialog title="选择菜单" width="300px" :visible.sync="dialogVisible" top="8vh">
                <el-tree
                  class="tree"
                  :data="menuList"
                  show-checkbox
                  default-expand-all
                  :default-checked-keys="defaultParentId"
                  node-key="id"
                  ref="tree"
                  highlight-current
                  :props="defaultProps"
                  :expand-on-click-node="false"
                  check-strictly
                  @check-change="handleClick"
                ></el-tree>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="sure">确 定</el-button>
                </span>
              </el-dialog>
            </el-col>
          </el-row>

          <el-row v-if="this.totalData.type == '1'">
            <el-col :span="2">菜单URL：</el-col>
            <el-col :span="6">
              <el-input v-model="totalData.url" placeholder="菜单URL" clearable></el-input>
            </el-col>
          </el-row>
          <el-row v-if="this.totalData.type == '1' || this.totalData.type == '2'">
            <el-col :span="2">授权标识：</el-col>
            <el-col :span="6">
              <el-input v-model="totalData.perms" placeholder="授权标识" clearable></el-input>
            </el-col>
          </el-row>

          <el-row v-if="this.totalData.type == '0' || this.totalData.type == '1'">
            <el-col :span="2">排序号：</el-col>
            <el-col :span="6">
              <el-input v-model="totalData.orderNum" placeholder="排序号" clearable></el-input>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col :span="2">状态：</el-col>
            <el-col :span="6">
              <el-radio-group v-model="totalData.delFlag">
                <el-radio label="-1">禁用</el-radio>
                <el-radio label="0">正常</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>-->
          <el-row v-if="this.totalData.type == '0' || this.totalData.type == '1'">
            <el-col :span="2">图标：</el-col>
            <el-col :span="6">
              <el-input v-model="totalData.icon" placeholder="菜单图标" clearable></el-input>
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
import {
  saveMenu,
  detailMenu,
  menuTree
} from "@/api/systemManagement/menuManagement/index";
import buttonGroup from "@components/buttonGroup/index";
import { mapState } from "vuex";
export default {
  components: {
    buttonGroup
  },
  data() {
    return {
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
      defaultParentId: [],
      totalData: {
        type: 0
        // delFlag: "0"
      },
      defaultProps: {
        children: "child",
        label: "name"
      },
      menuList: [],
      dialogVisible: false
    };
  },
  methods: {
    //返回
    backPage() {
      this.$store.commit("setMenu");
    },
    //取消
    callOf() {
      this.$store.commit("setMenu");
    },
    //选择菜单
    handleMenu() {
      this.dialogVisible = true;
      this.getShowMenutree();
    },
    //菜单树
    getShowMenutree() {
      menuTree()
        .then(res => {
          this.menuList = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //处理菜单树只能单选
    handleClick(data, checked, node) {
      if (checked) {
        this.$refs.tree.setCheckedNodes([data]);
      }
    },
    //保存选中菜单项
    sure() {
      this.dialogVisible = false;
      //菜单数据处理
      let menuIdList = [];
      this.$refs.tree.getCheckedNodes().map(item => {
        menuIdList.push(item);
        console.log(item);
      });
      this.menuIdList = menuIdList;
      this.totalData.parentName = this.menuIdList[0].name;
      this.totalData.parentId = this.menuIdList[0].id;
    },
    //菜单详情
    getDetailMenu() {
      let detailId = this.$store.state.detailId;
      let req = {
        id: detailId
      };
      detailMenu(req)
        .then(res => {
          console.log(res);
          this.totalData = res.data;
          this.defaultParentId.push(res.data.parentId);
          console.log(this.totalData, "3231213121");
        })
        .catch(err => {
          console.log(err);
        });
    },

    //保存
    saveData() {
      //新增
      delete this.totalData.createTime;
      delete this.totalData.updateTime;
      if (this.totalData.name) {
        if (Number(this.totalData.orderNum) >= 0 || this.totalData.orderNum == null) {
          saveMenu(this.totalData)
            .then(res => {
              this.$message({
                type: "success",
                message: "保存成功！"
              });
              this.$store.commit("setMenu");
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
            message: "排序号不能小于0"
          });
        }
      } else {
        this.$message({
          type: "error",
          message: "请输入菜单名称！"
        });
      }
    }
  },
  created() {
    let flag = this.$store.state.flag;
    if (flag == "addFlag") {
      !this.getDetailMenu();
    }
    if (flag == "updataFlag") {
      this.getDetailMenu();
    }
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
  height: 400px;
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
/deep/.el-dialog__wrapper .el-dialog__header {
  padding: 10px 15px;
}
.el-row {
  padding-bottom: 8px;
}
/deep/.el-col-2 {
  width: 13.5%;
}
/deep/.el-tree {
  margin-top: 10px;
  margin-left: 20px;
  height: 100%;
}
/deep/.el-tree-node__content > .el-checkbox {
  margin-right: 10px;
}
// /deep/.el-tree-node__content > .el-tree-node__expand-icon {
//   padding: 12px;
// }
/deep/.el-tree-node__content {
  height: 20px;
}
.required {
  width: 3px;
  display: inline-block;
  height: 1em;
  // position: relative;
}
.required:before {
  // position: absolute;
  content: "*";
  color: rgb(245, 108, 108);
  margin-left: -5px;
  margin-top: -7px;
  transform: translate(0, -1px);
  vertical-align: middle;
  font-size: 12px;
  height: 100%;
}
/deep/.el-dialog__body {
  height: 522px;
  overflow: auto;
}
</style>
