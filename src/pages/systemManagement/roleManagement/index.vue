<template>
  <div>
    <div v-if="!isDataList">
      <search-bar :searchList="searchList" @searchTrigger="setSearchData"></search-bar>
      <data-table :searchData="searchData" ref="dataList"></data-table>
    </div>
    <div v-if="isDataList">
      <addRoleManagement></addRoleManagement>
    </div>
  </div>
</template>

<script>
import searchBar from "@components/searchBar";
import dataTable from "./component/dataTable";
import addRoleManagement from "./addRoleManagement/index";
import { mapState } from "vuex";

export default {
  components: {
    searchBar,
    dataTable,
    addRoleManagement
  },
  data() {
    return {
      searchList: [
        {
          name: "角色名称",
          codeName: "name",
          type: "text",
          value: ""
        }
      ],
      
      searchData: {},
      dataList: []
    };
  },
  methods: {
    setSearchData(val) {
      this.searchData = val;
    }
  },
  computed: {
    ...mapState(["isDataList"])
  },
  // destroyed() {
  //   this.$store.commit("setsearchList", this.searchData);
  // },
  // created() {
  //   this.searchData = this.searchListchange;
  //   console.log(this.searchData);
  // },
  // watch: {
  //   isDataList(val, oldVal) {
  //     if (val) {
  //       this.$refs.dataList.getShowRoleList(this.searchData);
  //     }
  //   }
  // }
};
</script>