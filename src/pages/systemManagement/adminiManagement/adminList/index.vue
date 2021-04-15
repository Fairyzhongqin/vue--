<template>
  <div>
    <div v-show="isDataList">
      <search-bar :searchList="searchList" @searchTrigger="setSearchData"></search-bar>
      <data-table :searchData="searchData" ref="dataList"></data-table>
    </div>
    <div v-if="isAddData">
     <add-administrator></add-administrator>
    </div>
  </div>
</template>

<script>
import searchBar from "@components/searchBar";
import dataTable from "./component/dataTable";
import addAdministrator from "../addAdministrator/index";
import { mapState } from "vuex";

export default {
  name: "adminList",
  components: {
    dataTable,
    searchBar,
    addAdministrator
  },
  data() {
    return {
      searchList: [
        {
          name: "姓名",
          codeName: "username",
          type: "text",
          value: ""
        }
      ],
      dataList: [],
      searchData: {},
      isDataList: true,
      isAddData: false
    };
  },
  methods: {
    setSearchData(val) {
      this.searchData = val;
    }
  },
  computed: {
    ...mapState(["searchListchange"])
  },
  destroyed () {
    // this.$store.commit('setsearchList',this.searchData) 
  },
  created () {
    this.searchData = this.searchListchange;
    console.log( this.searchData)
    this.searchList[0].value = this.searchData.username
  },
  watch: {
    isDataList:function(val, oldVal){
      if (val) {
        this.$refs.dataList.initPeopleList(this.searchData);
      }
    },
    // '$route': {
    //   handler: function(n, o) {
    //     alert(n)
    //   },
    //   immediate: true
    // }
  }
};
</script>