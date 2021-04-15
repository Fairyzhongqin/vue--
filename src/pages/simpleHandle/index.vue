<template>
  <div>
    <search-bar :searchList="searchList" v-if="isList" @searchTrigger="setSearchData"></search-bar>
    <data-table @handleData="setStatus" v-if="isList" :searchData="searchData" ref="dataList"></data-table>
    <!--选择执法人员弹窗 start-->
    <div v-if="peopleVisiable">
      <el-dialog
        title="选择执法人员"
        :visible.sync="peopleVisiable"
        width="900px"
        height="600px"
        :close-on-click-modal="false"
      >
        <select-people @getPeople="getSelectedPeople" :selectNum="1"></select-people>
      </el-dialog>
    </div>
    <sn-page-bar v-if="!isList">
      <template slot="button">
        <el-button type="text" icon="el-icon-arrow-left" @click="backPage">返回</el-button>
      </template>
      <easy-punish :sourceId="sourceId" :headerInfo="headerInfo"></easy-punish>
    </sn-page-bar>
    <bottom-bar v-if="!isList">
      <el-button @click="close">返回</el-button>
    </bottom-bar>
    <!-- 底部栏按钮框 -->
  </div>
</template>

<script>
import searchBar from "@components/searchBar";
import bottomBar from "@/components/bottomBar";
import dataTable from "./list/dataTable";
import snPageBar from "@components/snPageBar/index";
import easyPunish from "@/pages/onSiteInspection/newInspection/component/easyPunish";
import {
  showSimpleHandleList,
  simpleHandleInfo
} from "@api/simpleHandle/index";
import selectPeople from "../onSiteInspection/newInspection/component/selectPeople";
import { mapState } from "vuex";

export default {
  name: "generalPenalties",
  components: {
    searchBar,
    bottomBar,
    dataTable,
    easyPunish,
    snPageBar,
    selectPeople
  },
  data() {
    return {
      searchList: [
        {
          name: "当事人",
          codeName: "companyName",
          type: "text",
          value: ""
        },
        {
          name: "检查日期",
          codeName: "checkTime",
          type: "date",
          value: ""
        },

        {
          name: "执法人员",
          codeName: "udtNames",
          type: "dialog",
          value: "",
          event: this.selectPeople
        }
      ],
      sourceId: null,
      headerInfo: null,
      isList: true,
      searchData: {
        companyName: "",
        udtNames: "",
        startTime: "",
        endTime: "",
      },
      dataList: [],
      peopleVisiable: false,
    };
  },
  methods: {
    selectPeople() {
      // 打开选择人员弹框
      this.peopleVisiable = true;
    },
    getSelectedPeople(state, val) {
      // 选择执法人员
      if (state) {
        this.searchList[2].value = val[0];
      }
      this.peopleVisiable = false;
    },
    setStatus: function(data) {
      this.sourceId = data.id;
      this.headerInfo = data;
      console.log("传过来当做了headerInfo", this.headerInfo);
      this.isList = false;
    },
    backPage() {
      this.isList = true;
    },
    close() {
      this.isList = true;
    },
    setSearchData(val) {
      this.searchData = val;
      console.log(val,"======")
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
      handler: function(val, oldVal) {
        if (val) {
          this.$refs.dataList.getshowSimpleHandleList(this.searchData);
        }
      }
    
  }
};
</script>