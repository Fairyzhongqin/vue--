<template>
  <div class="writ_lay">
    <div class="doc-container">
      <template v-if="docList.length">
        <doc-card 
          v-for="(docItem, index) of docList"
          :key="index"
          :docData="docItem"
          readOnly
          @previewWrit="preview">
        </doc-card>
      </template>
      <sn-empty-data text="暂无文书" v-if="!docList.length"></sn-empty-data>
    </div>
    <show-pdf
      :pdfId="visibleWritId"
      :writName="writName"
      v-if="showPdf"
      @closePdf="closePdf"></show-pdf>
  </div>
</template>

<script>
import docCard from "@/components/docCard";
import { getWritInfo, getWritByTree } from "@/api/fileRelated";
import ShowPdf from "@/components/showPdf";
import snEmptyData from "@/components/snEmptyData";
export default {
  components: {
    snEmptyData,
    ShowPdf,
    docCard
  },
  props: {
    writListType: {
      type: String,
      default: ''
    },
    sourceInfo: {
      type: Object
    }
  },
  data() {
    return {
      docList: [],
      writName: '',
      showPdf: false
    }
  },
  created() {
    console.info(this.sourceInfo)
    this.initList()
    // getWritInfo({
    //   sourceId: this.sourceId,
    //   type: "ZGFCYJS"
    // }).then(res => {
    //   if (res.data !== null) {
    //     this.docList = res.data;
    //   }
    // });
  },
  methods: {
    initList() {
      getWritByTree({
        dataId: this.sourceInfo.dataId,
        id: this.sourceInfo.id
      }).then(res => {
        if (res.code === '0') {
          this.docList = res.data
        }
      })
    },
    // 纯粹浏览文书
    preview(id, title, status) {
      if (status) this.buttonList = status;
      this.writName = title;
      this.showPdf = true;
      this.visibleWritId = id;
    },
    closePdf() {
      this.showPdf = false
    }
  },
  watch: {
    sourceInfo: {
      handler: function(val, oldVal) {
        this.initList();
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.writ_lay {
  .doc-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .doc-card {
      margin-bottom: 18px;
    }
  }
}

</style>