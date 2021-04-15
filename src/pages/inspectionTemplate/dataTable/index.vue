<template>
  <div>
    <div>
      <search-bar :searchList="searchList" @searchTrigger="searchTrigger"></search-bar>
      <data-table :searchBarInfo="searchInfo" v-bind="$attrs" v-on="$listeners"></data-table>
    </div>
  </div>
</template>

<script>
import searchBar from '@components/searchBar'
import dataTable from '../components/dataTable'
import { mapState } from 'vuex'

export default {
  name: 'generalPenalties',
  components: {
    searchBar,
    dataTable
  },
  data() {
    return {
      searchList: [
        {
          name: '模板名称',
          codeName: 'tempName',
          type: 'text',
          value: ''
        }
      ],
      searchInfo: {},
    }
  },
  methods: {
    searchTrigger(val) {
      this.searchInfo = val
    }
  }
}
</script>
