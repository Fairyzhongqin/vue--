<template>
  <div class="main">
    <el-row class="retrieval-container">
      <el-tree v-if="isCheck"
        ref="treeType"
        :data="data"
        :props="defaultProps"
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="checkeds"
        show-checkbox
      ></el-tree>
      <el-tree v-if="!isCheck"
        ref="treeType"
        :data="data"
        :props="defaultProps"
        node-key="id"
        :default-checked-keys="checkeds"
        :default-expand-all="true"
      ></el-tree>
    </el-row>
    <div class="oper-button">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="sure">确定</el-button>
    </div>
  </div>
</template>

<script>
  import {showDict} from "@api/systemManagement/discretionManagement";

  export default {
    props: {
      chooseType: {
        type: String
      },
      isCheck: {
        type: Boolean
      },
      specialVal: {
        type: Array
      }
    },
    data() {
      return {
        data: [],
        multipleSelection:[],
        defaultProps: {
          children: "child",
          label: "value"
        },
        checkeds: []
      }

    },
    created() {
      this.getTypeAction()
      this.checkeds = this.specialVal
    },
    methods: {
      // 字典表详情
      getTypeAction() {
        let type;
        if(this.chooseType=='tradeType'){
          type={type: "discretion_class"};
        }else{
          type={type: "special_class"};
        }
        showDict(type)
          .then(res => {
            this.data = res.data
            console.log(res)
          }).catch(err => {
          console.log(err)
        })
      },
      // 确定取消
      sure() {
        var val;
        if(this.isCheck){
          val =this.$refs['treeType'].getCheckedNodes();
        }else{
          val = this.$refs['treeType'].getCurrentNode();
        }

        this.$emit("getType", val,this.chooseType);
        this.$emit("closeDialog", this.chooseType);
      },
      close() {
        this.$emit("closeDialog", this.chooseType);
      },
    },

  }
</script>
<style lang="less" scoped>
  .main {
    padding: 8px 16px 0;
    .retrieval-container {
      height: 392px;
      background-color: #eef5f9;
      border: 1px solid #e0e0e0;
      overflow-y: auto;
    }
    .oper-button {
      display: flex;
      justify-content: flex-end;
      padding: 6px 0;
    }
  }
</style>
