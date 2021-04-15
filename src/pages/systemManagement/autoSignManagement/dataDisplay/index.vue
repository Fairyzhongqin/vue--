<template>
  <div>
    <div>
      <search-bar :searchList="searchList" @searchTrigger="searchTrigger"/>
      <data-table :searchBarInfo="searchInfo"/>
    </div>
  </div>
</template>

<script>
import searchBar from '@components/searchBar'
import dataTable from './dataTable'

export default {
  name: 'AutoSignContent',
  components: {
    searchBar,
    dataTable
  },
  data () {
    return {
      searchList: [
        {
          name: '部门编码',
          codeName: 'code',
          type: 'text',
          value: ''
        },
      ],
      searchInfo: {
        // 列表请求参数
        code: '', // 部门编码
      }
    }
  },
  methods: {
    searchTrigger (val) {
      this.searchInfo = val
    }
  }
}
</script>
