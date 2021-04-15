<template>
  <div class="warper">
    <div class="box">
      <el-table :data="data" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}" border highlight-current-row @current-change="checketOne">
        <el-table-column prop="num" label="序号" width="70"></el-table-column>
        <el-table-column prop="name" label="企业名称" min-width="200"></el-table-column>
        <el-table-column prop="time" label="检查时间" min-width="120" sortable></el-table-column>
        <el-table-column prop="time" label="检查来源" min-width="120"></el-table-column>
        <el-table-column prop="time" label="检查人员" min-width="150"></el-table-column>
        <el-table-column prop="time" label="签字文书" min-width="100"></el-table-column>
        <el-table-column prop="time" label="操作" min-width="300">
          <template>
            <span class="button-color" @click="lookIt">查看</span>
            <span class="button-color">处置</span>
            <span class="button-color">修改</span>
            <span class="button-del-color">删除</span>
            <span class="button-color">查看文书</span>
            <span class="button-color">制作其他文书</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="paginationBox">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page.sync="currentPage" :page-size="pageSize" layout="total, prev, pager, next, jumper"
          :total="totalPage">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      tableData: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      data() {
        return this.tableData
      }
    },
    data() {
      return {
        currentPage: 1, // 页码
        totalPage: 1000, // 总条数
        pageSize: 10, // 每页条数

      }
    },
    methods: {
      handleSizeChange() { // 每页条数
      },
      handleCurrentChange() { // 页码变化
      },
      checketOne(val) {
        console.log(val);
      },
      lookIt() {
        this.$store.commit('setInspectionHandleadMeasuresisShow');
      }

    },
  }

</script>
<style lang="less" scope>
  .warper {
    padding: 8px;
    box-sizing: border-box;

    .box {
      background: #fff;
      border-radius: 8px;
      padding: 16px;
      box-sizing: border-box;

      div:first-child {
        /deep/ .is-leaf {
          background: #e3eef6;
        }
      }
    }

    .paginationBox {
      padding: 8px 22px 49px 0;
      text-align: right;
    }

    .button-color {
      color: #0099ff;

      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }

      &::after {
        content: "";
        width: 8px;
        display: inline-block;
        font-size: 0px;
      }
    }

    .button-del-color {
      color: #ff3030;

      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }

      &::after {
        content: "";
        width: 8px;
        display: inline-block;
        font-size: 0px;
      }
    }
  }

</style>
