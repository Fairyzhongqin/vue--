<template>
  <div>
    <div v-if="isList">
      <search-bar :searchList="searchList" @searchTrigger="setSearchData"></search-bar>
      <data-table :searchData="searchData" @getSourceId="setSourceId" ref="dataList"></data-table>
    </div>
    <div v-if="isDetailPage">
      <is-detail :detailInfo="detailInfo" @backPage="backPage"></is-detail>
    </div>
  </div>
</template>

<script>
import searchBar from '@components/searchBar'
import dataTable from './components/dataTable'
import inspectionResult from '../inspectionResult/index'
import isDetail from '../../onSiteInspection/seeInspection/index'

import { getExamineInfo } from '@api/ProcessingofInspectionResult/index.js'
import { mapState, mapGetters } from 'vuex'

export default {
  data() {
    return {
      searchList: [
        {
          name: '企业名称',
          codeName: 'companyName',
          type: 'text',
          value: ''
        },
        {
          name: '检查时间',
          codeName: 'checkTime',
          type: 'date',
          value: ''
        },
        {
          name: '检查形式',
          codeName: 'examineSourceCode',
          type: 'select',
          url: '/aj/sys/sysdict/list',
          data: { type: 'source_examine' },
          value: ''
        },
        {
          name: '检查方式',
          codeName: 'examineType',
          type: 'select',
          url: '/aj/sys/sysdict/list',
          data: { type: 'type_examine' },
          value: ''
        }
      ],
      dataList: [],
      searchData: {
        companyName: '',
        examineType: '',
        examineSourceCode: '',
        startTime: '',
        endTime: '',
        limit: '10',
        page: '1'
      },
      sourceId: null,
      isList: true,
      isDetailPage: false,
      isPreviousRecords: false,
      detailInfo: null
    }
  },
  // beforeDestroy(){
  //       this.$store.commit('setsearchList',this.searchList)
  //       console.log(this.searchList)
  // },
  // created() {
  //   this.searchList = this.searchListchange;
  //   console.log(this.searchListchange);

  // },
  // computed: {
  //   ...mapState(["searchListchange"])
  // },
  components: {
    searchBar,
    dataTable,
    inspectionResult,
    isDetail
  },
  methods: {
    setSearchData(val) {
      this.searchData = val
    },
    setSourceId(id) {
      getExamineInfo({
        id: id
      }).then(res => {
        // console.log("取到了sourceID",res)
        this.isList = false
        this.isDetailPage = true
        this.detailInfo = res.data
      })
    },
    backPage() {
      this.isList = true
      this.isDetailPage = false
    }
  }
  // computed: {
  //   ...mapState(["searchListchange"])
  // },
  // watch: {
  //   isList: function(val, oldVal) {
  //     if (val) {
  //       this.$refs.dataList.getlistOfsiteinspection(this.searchData);
  //     }
  //   }
  // },
  // destroyed() {
  //   this.$store.commit("setsearchList", this.searchData);
  // },
  // created() {
  //   this.searchData = this.searchListchange;
  //   // console.log(this.searchData)
  //   this.searchList[0].value = this.searchData.companyName;
  // }
}
</script>

<style lang='less' scoped>
</style>
