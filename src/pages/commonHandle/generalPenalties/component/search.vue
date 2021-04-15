<template>
  <div class="body">
    <el-row type="flex" :gutter="20">
      <el-col :span="6">
        案件名称:
        <el-input type="text" placeholder="请输入案件名称" v-model="name" clearable></el-input>
      </el-col>
      <el-col :span="6">
        案件状态:
        <el-select placeholder="请选择案件状态" v-model="state"></el-select>
      </el-col>
       <el-col :span="6">
        案由:
        <el-select placeholder="请选择案由" v-model="action"></el-select>
      </el-col>
       <el-col :span="6">
        案件来源:
        <el-select placeholder="请选择案件来源" v-model="source"></el-select>
      </el-col>
       <el-col :span="6" v-if="isShow">
        承办人:
        <el-input placeholder="请输入承办人" v-model="people"></el-input>
      </el-col>

      <el-col :span="6">
        立案时间:
        <el-date-picker  v-model="time" type="datetime" align="center"></el-date-picker>
      </el-col>

      <el-col :span="6" v-if="!isShow" class="search-button">
        <el-button type="primary">搜索</el-button>
        <el-button>重置</el-button>
        <span @click.stop="changeState" class="float-right down">展开搜索</span>
      </el-col>
    </el-row>
    
    <el-row type="flex" :gutter="20" v-if="isShow">
      <el-col :span="12" class="search-button">
        <el-button type="primary">搜索</el-button>
        <el-button>重置</el-button>
        <span @click.stop="changeState" class="float-right up">收起搜索</span>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'

export default {
  name: "search",
  data() {
    return {
      name: "",
      state: "",
      action:"",
      source:"",
      time: "",
      people: "",
      type: "",
    };
  },
  mounted() {
  },
  methods: {
    changeState: function() {
      this.$store.commit("changeSearchState")
    }
  },
  computed: {
    ...mapState([
      "isShow"
    ]),
  }
};
</script>

<style lang="less" scoped>
.body {
  padding: 12px 16px 12px 31px;
  background: #ffffff;
  .el-row:first-child {
    margin-bottom: 8px;
    .el-input {
      width: 75%;
    }
  }
  .el-select {
    width: 75%;
  }
  .search-button {
    line-height: 40px;
    .float-right {
      float: right;
      color: #0099ff;
    }
    .down {
      &::after {
        content: ">>";
        display: inline-block;
        position: relative;
        left: 20px;
        top: 10px;
        width: 5px;
        height: 5px;
        transform: rotate(90deg);
      }
    }
    .up {
      &::after {
        content: '>>';
        display: inline-block;
        position: relative;
        left: -10px;
        top: 25px;
        width: 5px;
        height: 5px;
        transform: rotate(-90deg)
      }
    }
  }
}
</style>