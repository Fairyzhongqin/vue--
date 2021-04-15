<template>
  <div>
    <div v-if="!isDataList">
      <data-table :searchData="searchData"></data-table>
    </div>
    <div v-if="isDataList">
      <add-menu></add-menu>
    </div>
  </div>
</template>

<script>
import dataTable from "./component/dataTable";
import addMenu from './addMenu/index'
import { mapState } from "vuex";

export default {
  components: {
    dataTable,
    addMenu
  },
  data() {
    return {
     searchData:{}
    };
  },
  methods: {
   
  },
  computed: {
     ...mapState(['isDataList']) 
  },
};
</script>