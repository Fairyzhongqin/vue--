<template>
  <div>
    <div>
      <search-bar :searchList="searchList" @searchTrigger="searchTrigger"></search-bar>
      <data-table :searchBarInfo="searchInfo"></data-table>
      <!--选择执法人员弹窗 start-->
      <div v-if="peopleVisiable">
        <el-dialog title="选择承办人" :visible.sync="peopleVisiable" width="900px" height="600px" :close-on-click-modal="false">
          <select-people @getPeople="getSelectedPeople" :selectNum="1"></select-people>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import searchBar from '@components/searchBar'
import dataTable from './component/dataTable'
import { mapState } from 'vuex'
import selectPeople from '../../onSiteInspection/newInspection/component/selectPeople'

export default {
  name: 'generalPenalties',
  components: {
    searchBar,
    dataTable,
    selectPeople
  },
  data() {
    return {
      searchList: [
        {
          name: '当事人',
          codeName: 'partyName',
          type: 'text',
          value: ''
        },
        {
          name: '立案日期',
          codeName: 'caseCrimeTime',
          type: 'date',
          url: '/api',
          value: ''
        },
        {
          name: '结案日期',
          codeName: 'caseEndTime',
          type: 'date',
          url: '/api',
          value: ''
        },
        {
          name: '承办人',
          codeName: 'udtNames',
          type: 'dialog',
          value: '',
          event: this.selectPeople
        },
        {
          name: '案件名称',
          codeName: 'caseName',
          type: 'text',
          value: ''
        },
        {
          name: '案件状态',
          codeName: 'caseStatus',
          type: 'selectFixedValue',
          clearable: true,
          value: '',
          default: [
            {
              value: '0',
              label: '待立案'
            },
            {
              value: '1',
              label: '已立案'
            },
            {
              value: '2',
              label: '已结案'
            }
          ]
        }
      ],
      peopleVisiable: false,
      searchInfo: {},
      udtIds: ''
    }
  },
  methods: {
    selectPeople() {
      // 打开选择人员弹框
      this.peopleVisiable = true
    },
    getSelectedPeople(state, val) {
      console.log('执法人员', val)
      // 选择执法人员
      if (state) {
        this.searchList[3].value = val[0]
      }
      this.peopleVisiable = false
    },
    searchTrigger(val) {
      console.info('search val', val)
      this.searchInfo = val
    }
  }
}
</script>
