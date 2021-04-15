<template>
  <div>
    <div v-if="isDataList">
      <searchBar
        :searchList="searchList"
        @searchTrigger="setSearchData"
      />
      <DataTable :searchData="searchData" ref="dataList" />
    </div>
    <div v-if="isDataUpdate" class="isDataUpdate">
      <NewInnerReview />
    </div>
  </div>
</template>
<script>
import searchBar from "@components/searchBar";
import DataTable from "./components/DataTable";
import NewInnerReview from "../newInnerReview/index";
import { mapState } from "vuex";
export default {
  name: "innerReviewListWrapper",
  components: {
    DataTable,
    searchBar,
    NewInnerReview
  },
  data() {
    return {
      isDataList: true, //列表页面
      isDataUpdate: false, //详情 复查  页面
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
      searchData: {} //搜索数据
    };
  },
  methods: {
    setSearchData(val) {
      // console.info("搜索的时候传的值", val);
      this.searchData = {
        companyName: val.companyName,
        executorId: val.reviewName.id
      };
      this.$refs.dataList.getListData(this.searchData);
    }
  },
  computed: {
    ...mapState(["innerReviewComponent"])
  },
  watch: {
    innerReviewComponent: {
      handler: function(val, oldVal) {
        if (val) {
          // console.info("监听搜索数据", val);
          this.$refs.dataList.getListData(this.searchData);
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>
.isDataUpdate {
  font-size: 40px;
  color: red;
}
</style>