<template>
  <div>
    <div v-if="!newRectificationShow && keepInEnterprise === true">
      <el-form :inline="true" ref="form" :model="form" label-width="100px" v-show="shrinkStatus">
        <el-form-item label="企业名称：" prop="companyName">
          <el-input
            v-model="form.companyName"
            placeholder="请输入企业名称"
            @keyup.enter.native="search"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="监管行业类别：" prop="jgfl">
          <el-select v-model="form.supervisionIndustryType" placeholder="请选择监管行业类别" clearable>
            <template v-for="item in typeList">
              <el-option :key="item.id" :label="item.dataName" :value="item.id"></el-option>
            </template>
          </el-select>
        </el-form-item>
        
        <el-form-item label="启用与否：" prop="isWork">
          <el-select v-model="form.isWork" placeholder="请选择启用与否" clearable>
            <el-option label="已启用" value="0"></el-option>
            <el-option label="已停用" value="-1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="reset('form')">重置</el-button>
        </el-form-item>
        <div class="shrink-bar">
          <el-button type="text" class="shrink-button" @click="shrink()">
            {{'收起搜索'}}
            <i class="el-icon-arrow-up"></i>
          </el-button>
        </div>
      </el-form>

      <data-table :searchData="searchData" @addOrModify="addOrModify"></data-table>
    </div>
    <div v-show="!shrinkStatus && keepInEnterprise === true " class="open-bar">
      <el-button type="text" class="shrink-button" @click="shrink()">
        {{'展开搜索'}}
        <i class="el-icon-arrow-down"></i>
      </el-button>
    </div>
    <div v-if="newRectificationShow">
      <add-enterprise :enterpriseId="enterpriseId" :type="type" />
    </div>
  </div>
</template>

<script>
import dataTable from "./components/dataTable";
import addEnterprise from "./components/addEnterprise";
import { getOptions } from "@api/enterpriseInfo/index";
import { mapState } from "vuex";
export default {
  components: {
    dataTable,
    addEnterprise
  },
  data() {
    return {
      shrinkStatus: false,
      typeList: [],
      form: {
        companyName: "",
        supervisionIndustryType: "",
        isWork: ""
      },
      searchData: {},
      type: "",
      enterpriseId: ""
    };
  },
  computed: {
    ...mapState(["newRectificationShow","keepInEnterprise"])
  },
  created() {
    this.getOption();
  },
  mounted(){
    // console.info("keepInEnterprise",this.keepInEnterprise)
  },
  methods: {
    shrink() {
      // 收起
      this.shrinkStatus = !this.shrinkStatus;
    },
    // 获取行业监管大类
    getOption() {
      getOptions({
        typeId: "zxjglb",
        parentId: -1
      }).then(res => {
        this.typeList = res.data;
      });
    },
    search() {
      console.info(this.form, "222222222");
      // if (!this.form.companyName && !this.form.jgfl && !this.form.isWork) {
      //   return;
      // }
      this.searchData = this.form;
    },
    reset(form) {
      // this.$refs[form].resetFields();
      this.searchData = {
        companyName: "",
        jgfl: "",
        isWork: ""
      };
      this.form = {
        companyName: "",
        jgfl: "",
        isWork: ""
      };
    },
    addOrModify(type, row) {
      console.log(type, row, "000");
      if (type == "modify") {
        this.enterpriseId = row.id;
      }
      this.type = type;
    }
  },
  watch: {
    form: {
      handler: function(val, oldVal) {
        this.searchData = val;
      },
      deep: true
    }
  }
};
</script>

<style lang="less" scoped>
.shrink-bar {
  text-align: end;
}
.open-bar {
  position: fixed;
  text-align: center;
  top: 111px;
  right: 11px;
  height: 25px;
  line-height: 25px;
  width: 82px;
  background-color: #66b1ff;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  z-index: 5;
  .el-button {
    height: 25px;
    color: #fff;
    padding: 0;
  }
}
/deep/ .el-form--inline {
  background-color: #fff;
  padding: 7px 0 7px 7px;
}
/deep/ .el-form-item__label {
  padding: 0;
  line-height: 30px;
}
/deep/ .el-form-item__content {
  line-height: 30px;
  min-width: 220px;
}
/deep/ .el-select {
  width: 100%;
}
/deep/ .el-form-item {
  margin: 0;
  margin-top: 8px;
}
.btns {
  width: 200px;
  margin-left: 30px;
  .el-button {
    padding: 10px 10px;
  }
}
</style>
