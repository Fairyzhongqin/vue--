<template>
  <div class="body">
    <div>
      <el-table
        :data="tableData"
        border
        fit
        :default-sort="{prop: 'date', order: 'descending'}"
        header-row-class-name="header" 
      >
        <el-table-column prop="num" width="50"></el-table-column>
        <el-table-column prop="name" label="企业名称" width="150"></el-table-column>
        <el-table-column prop="time" label="检查时间"  sortable></el-table-column>
        <el-table-column prop="source" label="检查来源"></el-table-column>
        <el-table-column prop="stop" label="是否停产" sortable></el-table-column>
        <el-table-column prop="danger" label="整改时限" width="150" sortable></el-table-column>
        <el-table-column prop="people" label="检查人员"></el-table-column>
        <el-table-column prop="book" label="签字文书">
          <template slot-scope="scope">
            <i
              class="el-icon-paperclip"
              v-show="scope.row.book"
              style="color: #0099FF; width: 18px; height: 16px"
            ></i>
            <span v-show="!scope.row.book">--</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="450">
          <template slot-scope="scope">
            <span class="button-color">查看</span>
            <span class="button-color" v-show="!scope.row.canLook">修改</span>
            <span class="button-color" v-show="scope.row.canLook" >查看</span>
            <span class="button-del-color">删除</span>
            <span class="button-color">查看文书</span>
            
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination :total="1000" :current-page="2" layout="total, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "dataTable",
  data() {
    return {
      tableData: [
        {
          num: 1,
          name: "hello",
          time: "2019/08/19 14:30",
          source: "aaa",
          stop:"32321",
          danger: "bbb",
          people: "ccc",
          book: true,
          canLook: false
        },
        {
          num: 2,
          name: "hello",
          time: "2019/08/19 14:30",
          source: "aaa",
          stop:"32321",
          danger: "bbb",
          people: "ccc",
          book: true,
          canLook: false
        },
        {
          num: 3,
          name: "hello",
          time: "2019/08/19 14:30",
          source: "aaa",
          stop:"32321",
          danger: "bbb",
          people: "ccc",
          book: true,
          canLook: false
        },
        {
          num: 4,
          name: "hello",
          time: "2019/08/19 14:30",
          source: "aaa",
          stop:"32321",
          danger: "bbb",
          people: "ccc",
          book: true,
          canLook: false
        },
        {
          num: 5,
          name: "hello",
          time: "2019/08/19 14:30",
          source: "aaa",
          stop:"32321",
          danger: "bbb",
          people: "ccc",
          book: false,
          canLook: false
        },
      ]
    };
  },
  methods: {

  },
};
</script>


<style lang="less" scoped>
.body {
  padding: 8px 8px 0;
  div:first-child {
    background: #ffffff;
    padding: 16px 16px 0;
    border-radius: 8px;
    .el-table--border {
      border-radius: 8px;
    }
    /deep/ .is-leaf {
      background: #e3eef6;
    }
    .pagination {
      display: flex;
      flex-direction: row-reverse;
    }
    .check-button {
      padding: 9px 15px;
      height: 30px;
      line-height: 12px;
      width: 111px;
      margin-bottom: 16px;
    }
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
    }
  }
}
</style>