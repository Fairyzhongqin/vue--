<template>
  <div>
    <component :is="currentComponent"></component>
  </div>
</template>

<script>
import generalPenalties from "./generalPenalties/index"
import newFilingRegister from "./newFilingRegister/index"
import newHandle from "./newHandle/index"
import { mapState } from "vuex";

export default {
  name:"commonHandle",
  components: {
    generalPenalties,
    newFilingRegister,
    newHandle
  },
  data() {
    return {
      // searchList: [
      //   {
      //     name: "案件名称",
      //     codeName: "companyName",
      //     type: "text",
      //     value: ""
      //   },
      //   {
      //     name: "案件状态",
      //     codeName: "examineStatus",
      //     type: "select",
      //     url: "/api",
      //     value: ""
      //   },
      //   {
      //     name: "案由",
      //     codeName: "checkTime",
      //     type: "select",
      //     value: ""
      //   },
      //   {
      //     name: "案件来源",
      //     codeName: "lawUnit",
      //     type: "select",
      //     url: "/api",
      //     value: ""
      //   },
      //   {
      //     name: "承办人",
      //     codeName: "lawPerson",
      //     type: "select",
      //     url: "/api",
      //     value: ""
      //   },
      //   {
      //     name: "立案时间",
      //     codeName: "regIndustry",
      //     type: "date",
      //     url: "/api",
      //     value: ""
      //   }
      // ]
    };
  },
  activated() {
    this.$store.dispatch("switchCompStatus", "/commonHandle");
  },
  methods: {
  },
  computed: {
  ...mapState(["currentComponent"])
  }
};
</script>

<style lang="less" scoped>
</style>
