<template>
  <div class="addcheck-wrapper">
    <el-row>
      <el-col :span="3" class="search-text">查询内容：</el-col>
      <el-col :span="5">
        <el-input v-model="searchValue" placeholder="请输入内容"></el-input>
      </el-col>
      <el-col :span="3" class="search-text">法律法规：</el-col>
      <el-col :span="5">
        <sn-select
          v-model="law"
          placeholder="请选择法律法规"
          data-url="/aj/sys/sysdict/list"
          :requertData="selectData"
        ></sn-select>
      </el-col>
      <el-col :span="5" class="search-button">
        <el-button type="primary" @click="search()">搜索</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-divider></el-divider>
    </el-row>
    <el-row>
      <el-radio-group v-model="typeSelect" size="small" class="radioGroup">
        <el-radio-button label="按监管行业分类"></el-radio-button>
        <el-radio-button label="按专项检查分类"></el-radio-button>
        <el-radio-button :class="{'special': type === 'illegal'}" label="按自由裁量分类"></el-radio-button>
        <el-radio-button v-if="type !== 'illegal'" label="常用检查项"></el-radio-button>
        <el-radio-button v-if="type !== 'illegal'" label="+自定义检查内容" class="special"></el-radio-button>
      </el-radio-group>
    </el-row>
    <el-row>
      <checkType
        @check="check"
        v-bind="$attrs"
        v-on="$listeners"
        :typeSelect="typeSelect"
        :type="type"
        :searchValue="searchValue"
        :law="law"
        v-if="typeSelect!=='+自定义检查内容'"
        ref="checkType"
      ></checkType>
      <div style="padding: 15px 0;" v-else>
        <sn-add-button @buttonClick="addCustom" size="mini" text="添加"></sn-add-button>
        <!-- <sn-empty-data v-if="customCheckList.length === 0"></sn-empty-data> -->
        <div style="height:330px;overflow:auto;">
          <custom-check
            v-for="(custom, index) in customCheckList"
            :key="index"
            :index="index"
            :data="custom"
            @afterSave="afterSave"
            @deleteNode="deleteNode"
          ></custom-check>
        </div>
      </div>
    </el-row>
  </div>
</template>

<script>
import snSelect from "@/components/snSelect";
import checkType from "./checkType";
import customCheck from "./customCheck";
import snAddButton from "@/components/snAddButton";
import {getCusExamineList} from '@api/common'

export default {
  props: {
    customCheck: {
      type: Array
    },
    type: {
      type: String
    }
  },
  components: {
    snSelect,
    checkType,
    customCheck,
    snAddButton
  },
  data() {
    return {
      searchValue: "",
      law: "",
      typeSelect: "按监管行业分类",
      selectData: {
        delFlag: "0",
        isPaging: "false",
        limit: "10",
        name: "",
        page: "1",
        type: "free_lawt"
      },
      customCheckList: [], // 未保存的自定义项
      cusArrReq: { // 获取自定义检查项列表参数

      },
      cusArr: [], // 已保存的自定义项
      customAll: [] // 所有自定义项：保存与未保存的
    };
  },
  created() {
    this.initCustomCheck()
  },
  watch: {
    customCheckList: {
      handler(val, oldval) {
        console.info("添加自定义检查项",val)
        this.$emit("customCheckAdd", val);
      },
      deep: true
    }
  },
  methods: {
    initCustomCheck() {
      this.customCheckList = this.customCheck
      /* this.customAll = this.customCheck
      this.customAll.forEach(custom => {
        if (!custom.discretionId) {
          this.customCheckList.push(custom)
        } else {

        }
      }) */
    },
    check(data) {
      this.checkNum = data.length;
    },
    search() {
      this.$refs.checkType.getDetailList();
    },
    // 保存自定义检查项后 
    afterSave(index) {
      this.deleteNode(index)
      // 获取自定义检查项列表
      getCusExamineList(this.cusArrReq).then(res => {
        this.cusArr = res.data
      }).catch(err => console.ino(err))
    },
    addCustom() {
      // 自定义检查项
      const radomID = Math.floor(Math.random() * 10000 + 1);
      this.customCheckList.push({
        id: radomID,
        labelID: radomID,
        dataType: "custom",
        hasBussinessRule: "0",
        children: [],
        discretionType: "",
        discretionCode:"", // 类型 code
        discretionTypeName: "", // 类型
        examineContent: "", // 内容
        checkContent: "",
        label: "",
        checked: false
      });
    },
    deleteNode(index) {
      this.customCheckList.splice(index, 1);
    }
  }
};
</script>

<style lang="less" scoped>
.radioGroup {
  /deep/ .is-active {
    /deep/.el-radio-button__inner {
      color: #fff !important;
    }
  }
}
.addcheck-wrapper {
  padding: 8px 16px 0 16px;
  .search-text {
    height: 30px;
    line-height: 30px;
    text-align: center;
  }
  .search-button {
    height: 30px;
    line-height: 30px;
    padding-left: 16px;
  }
}
/deep/.el-radio-button__inner {
  border: 1px solid #0099ff;
  color: #0099ff !important;
  border-right: 0;
}
.special {
  /deep/.el-radio-button__inner {
    border-right: 1px solid #0099ff;
  }
}
</style>
