<template>
  <div>
    <div v-show="isDataList">
      <search-bar :searchList="searchList" @searchTrigger="setSearchData"></search-bar>
      <data-table :searchData="searchData" ref="dataList"></data-table>
    </div>
    <div v-if="isDataUpdate">
      <new-rectification></new-rectification>
    </div>
  </div>
</template>

<script>
import searchBar from "@components/searchBar";
import dataTable from "./component/dataTable";
import newRectification from "../newRectification/index";
import { mapState } from "vuex";

export default {
  name: "rectificationList",
  components: {
    dataTable,
    newRectification,
    searchBar
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
          name: "复查人员",
          codeName: "reviewName",
          type: "choosePeople",
          value: {}
        }
      ],
      dataList: [],
      searchData: {},
      sourceId: null,
      detailInfo: null,
      isDataList: true, //展示整改复查列表页面
      isDataUpdate: false // 展示整改复查页面
    };
  },
  methods: {
    setSearchData(val) {
      this.searchData = {
        companyName: val.companyName,
        executorId: val.reviewName.id
      };
    }
  },
  computed: {
    ...mapState(["searchListchange"])
  },
  destroyed() {
    this.$store.commit("setsearchList", this.searchData);
  },
  created() {
    this.searchData = this.searchListchange;
    this.searchList[0].value = this.searchData.companyName;
  },
  watch: {
    isDataList: function(val, oldVal) {
      if (val) {
        this.$refs.dataList.getshowRectificationReviewList(this.searchData);
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>