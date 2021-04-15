<template>
  <div>
    <div v-show="!inspectionHandleadMeasuresisShow">
      <search-bar :searchList="searchList"></search-bar>
      <table-box :tableData="tableData"></table-box>
    </div>
    <div v-show="inspectionHandleadMeasuresisShow">
      <dialog-box></dialog-box>
    </div>
  </div>
</template>

<script>
import searchBar from '@/components/searchBar/index';
import tableBox from './component/table';
import dialogBox from './component/dialog';
import {mapState} from 'vuex';

export default {
  components: {
    searchBar,
    tableBox,
    dialogBox
  },
  computed: {
    ...mapState([
      'inspectionHandleadMeasuresisShow'
    ])
  },
  data() {
    return {
      searchList: [
        {
          name: "企业名称",
          codeName: "companyName",
          type: "text",
          value: ""
        },
        {
          name: "检查部门",
          codeName: "examineStatus",
          type: "select",
          url: "/api",
          value: ""
        },
        {
          name: "检查时间",
          codeName: "checkTime",
          type: "date",
          value: ""
        },
        {
          name: "检查人员",
          codeName: "lawUnit",
          type: "select",
          url: "/api",
          value: ""
        },
        {
          name: "检查来源",
          codeName: "lawPerson",
          type: "select",
          url: "/api",
          value: ""
        },
        {
          name: "监管行业",
          codeName: "regIndustry",
          type: "select",
          url: "/api",
          value: ""
        }
      ],
      tableData: [
        {
          name: '123456',
          time: '2019/08/22 15:24:10',
          num: 1
        }
      ],
    }
  },
};
</script>

<style lang="less" scoped>
</style>