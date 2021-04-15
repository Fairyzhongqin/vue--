<template>
  <div>
    <div v-show="!inspectionHandleosMeasuresisShow">
      <search-bar :searchList="searchList" @searchTrigger="searchData"></search-bar>
      <table-box :tableData="tableData"></table-box>
    </div>
    <div v-show="inspectionHandleosMeasuresisShow">
      <on-scene-care></on-scene-care>
    </div>
  </div>
</template>

<script>
  import searchBar from "@components/searchBar";
  import tableBox from './component/table';
  import onSceneCare from './component/onSceneCare';
  import buttonGroup from "@components/buttonGroup/index";
  import { mapState } from "vuex";
  export default {
    components: {
      searchBar,
      tableBox,
      onSceneCare
    },
    data() {
      return {
        searchList: [{
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
            num: 1,
            name: '111',
            time: '2019-11-20'
          }
        ],
        
      }
    },
    computed: {
      ...mapState([
        'inspectionHandleosMeasuresisShow'
      ])
    },
    created() {
      console.log(this.inspectionHandleosMeasuresisShow)
    },
    methods: {
      searchData() { // 点击搜索
        console.log(this.searchList)
      },

    }
  };

</script>

<style lang="less" scoped>

</style>
