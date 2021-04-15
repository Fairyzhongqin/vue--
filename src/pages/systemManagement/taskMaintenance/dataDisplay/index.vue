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
    name: 'taskContent',
    components: {
      searchBar,
      dataTable
    },
    data () {
      return {
        searchList: [],
        searchInfo: {}
      }
    },
    methods: {
      searchTrigger (val) {
        this.searchInfo = val
      }
    }
  }
</script>
