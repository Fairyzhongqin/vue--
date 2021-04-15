<template>
  <div>
    <div v-show="isDataList">
      <search-bar :searchList="searchList" @searchTrigger="setSearchData"></search-bar>
      <data-table
        ref="dataList"
        :searchData="searchData"
        @showDetail="getDetailId"
        @updateInfo="updateInfo"
      ></data-table>
      <!--选择执法人员弹窗 start-->
      <div v-if="peopleVisiable">
        <el-dialog
          title="选择检查人员"
          :visible.sync="peopleVisiable"
          width="900px"
          height="600px"
          :close-on-click-modal="false"
        >
          <select-people @getPeople="getSelectedPeople" :selectNum="1"></select-people>
        </el-dialog>
      </div>
    </div>
    <div v-if="!isDataList && !isDataUpdate">
      <see-inspection
        :detailInfo="detailInfo"
        @backPage="backToList"
        :isInspectionDetail="inspectionDetail"
      ></see-inspection>
    </div>
    <div v-if="isDataUpdate">
      <new-inspection :dataId="sourceId" @backPage="closeUpdate" :schemeId="schemeId"></new-inspection>
    </div>
  </div>
</template>

<script>
import searchBar from '@components/searchBar'
import dataTable from './component/dataTable'
import seeInspection from '../seeInspection/index'
import newInspection from '../newInspection/index'
import { getInspectionDetail } from '@api/onSiteInspection/index'
import { mapState } from 'vuex'
import selectPeople from '../../onSiteInspection/newInspection/component/selectPeople'
import Bus from './../../../bus/index'

export default {
  name: 'inspectionList',
  components: {
    searchBar,
    dataTable,
    seeInspection,
    newInspection,
    selectPeople
  },
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
        },
        {
          name: '检查人员',
          codeName: 'executor',
          type: 'dialog',
          value: '',
          event: this.selectPeople
        }
      ],
      schemeId: null,
      searchData: {
        companyName: '',
        executorId: '',
        examineSourceCode: '',
        examineType: '',
        startTime: '',
        endTime: '',
        limit: '10',
        page: '1'
      },
      dataList: [],
      currentPage: '1',
      detailInfo: null,
      isDataList: true, // 展示现场检查列表页面
      isDataDetail: false, // 展示现场检查详情页面
      isDataUpdate: false, // 展示现场检查修改页面
      sourceId: null,
      peopleVisiable: false,
      inspectionDetail: false
    }
  },
  methods: {
    selectPeople() {
      // 打开选择人员弹框
      this.peopleVisiable = true
    },
    getChange(val) {
      console.log(this.test)
    },
    setSearchData(val) {
      console.info('setSearchData==examineType', val)
      this.searchData = val
    },
    getDetailId(id) {
      this.inspectionDetail = true
      getInspectionDetail({
        id
      }).then(res => {
        this.isDataList = false
        this.isDataDetail = true
        console.log('现场检查记录res', res)
        this.detailInfo = res.data
      })
    },
    backToList() {
      this.inspectionDetail = false
      this.isDataList = true
      this.isDataDetail = false
    },
    updateInfo(id, planId) {
      this.isDataUpdate = true
      this.isDataList = false
      this.sourceId = id
      this.schemeId = planId
    },
    closeUpdate() {
      this.isDataUpdate = false
      this.isDataList = true
    },
    getSelectedPeople(state, val) {
      // 选择执法人员
      if (state) {
        this.searchList[4].value = val[0]
      }
      this.peopleVisiable = false
    }
  },
  watch: {
    isDataList: {
      handler: function(val, oldVal) {
        if (val) {
          this.$refs.dataList.getInspectinList(this.searchData)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
