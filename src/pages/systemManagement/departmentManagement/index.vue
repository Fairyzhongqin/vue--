<template>
  <div>
    <div v-if="!isDataList">
      <data-table :searchData="searchData"></data-table>
    </div>
    <div v-if="isDataList">
      <add-department></add-department>
    </div>
  </div>
</template>

<script>
import dataTable from "./component/dataTable";
import addDepartment from './addDepartment/index'
import { mapState } from "vuex";

export default {
//   name: "adminList",
  components: {
    dataTable,
    addDepartment
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