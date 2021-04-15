<template>
  <div>
    <component :is="inspectionResultComponent"></component>
  </div>
</template>

<script>
import isList from "./list/index";
import inspectionResult from "./inspectionResult";
import isDetail from "@/pages/onSiteInspection/seeInspection/index";
import previousRecords from "./inspectionResult/previousRecords/index"

import { mapState } from "vuex";
import { getExamineInfo } from "@api/ProcessingofInspectionResult/index.js";

export default {
  name: "inspectionResultHandle",
  components: {
    isList,
    inspectionResult,
    isDetail,
    previousRecords
  },
  data() {
    return {
      dataInfo: null,
      isShowDetail: false
    };
  },
  activated() {
    this.$store.dispatch("switchCompStatus", "/inspectionResultHandle");
  },
  methods: {
    changeVisiable(data) {
      this.modelShow = data;
    },
    changeView(name) {
      this.modelShow = name;
    },
    setSourceId(id) {
      getExamineInfo({
        id: id
      }).then(res => {
        this.dataInfo = res.data;
        if (this.inspectionResultComponent === "isDetail") {
          this.isShowDetail = true;
        }
      });
    }
  },
  computed: {
    ...mapState(["inspectionResultComponent"])
  }
};
</script>

<style lang="less">
</style>