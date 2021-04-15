<template>
  <div>
    <div class="create-tab-title">组织听证</div>
    <section class="doc_wrapper">
      <doc-card
        v-for="(doc, index) in docList"
        :key="index"
        :readOnly="true"
        :docData="doc"
        @previewWrit="preview"
      ></doc-card>
    </section>
    <sn-empty-data text="等待上传组织听证相关记录" v-if="docList.length===0"></sn-empty-data>

    <show-pdf
      :writName="writName"
      v-if="showPdfDialog"
      :pdfId="visibleWritId"
      @closePdf="showPdfDialog=false"
    ></show-pdf>
  </div>
</template>
<script>
import docCard from "@/components/docCard";
import ShowPdf from "@/components/showPdf";
import snEmptyData from "@/components/snEmptyData";
import { getGroDisWrit } from "@api/anjianshenli";

export default {
  name: "penaltyOrgHearing",
  components: {
    docCard,
    ShowPdf,
    snEmptyData
  },
  data() {
    return {
      componentId: "",
      visibleWritId: "", // 浏览文书的id
      showPdfDialog: false,
      docList: [], // 文书列表
      writName: ""
    };
  },
  created() {
    this.getWrits();
  },
  methods: {
    getWrits() {
      let req = {
        caseId: this.$store.state.penalty.penaltyUndEntity.penaltyId
      };
      getGroDisWrit(req).then(res => {
        this.docList = res.data.writList
      });
    },
    preview(id) {
      this.visibleWritId = id;
      this.showPdfDialog = true;
    },
    setComponentId(val) {
      this.componentId = val;
    }
  }
};
</script>
<style lang="less" scope>
.doc_wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 16px;
}
</style>
