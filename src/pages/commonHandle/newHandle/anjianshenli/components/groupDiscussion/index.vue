<template>
  <div class="groupDiscussion">
    <div class="create-tab-title">集体讨论（可选）</div>
    <section class="doc_wrapper">
      <doc-card v-for="(doc, index) in docList" :key="index" :docData="doc" :readOnly="true" @previewWrit="preview"></doc-card>
    </section>
    <sn-empty-data text="等待法规处人员上传讨论结果" v-if="docList.length === 0"></sn-empty-data>

    <show-pdf :writName="'集体讨论记录'" v-if="showPdfDialog" :pdfId="visibleWritId" @closePdf="showPdfDialog = false"></show-pdf>
  </div>
</template>
<script>
import docCard from '@/components/docCard'
import ShowPdf from '@/components/showPdf'
import snEmptyData from '@/components/snEmptyData'
import { getWritInfo } from '@api/fileRelated'

export default {
  name: 'groupDiscussionIndex',
  components: {
    docCard,
    ShowPdf,
    snEmptyData
  },
  props: ['currCom'],
  data() {
    return {
      componentId: '',
      visibleWritId: '', // 浏览文书的id
      showPdfDialog: false,
      docList: [] // 文书列表
    }
  },
  created() {
    this.getWrits()
  },
  methods: {
    getWrits() {
      let req = {
        sourceId: this.$store.state.penalty.penaltyUndEntity.penaltyId,
        type: this.currCom === 'groupDiscussion' ? 'XXCFJTTLJL' : 'XXCFJTTLJL2'
      }
      getWritInfo(req)
        .then(res => {
          this.docList = res.data
        })
        .catch(err => console.info(err))
    },
    preview(id) {
      this.visibleWritId = id
      this.showPdfDialog = true
    },
    setComponentId(val) {
      this.componentId = val
    }
  },
  watch: {
    currCom: function(nv, ov) {
      this.getWrits()
    }
  }
}
</script>
<style lang="less" scope>
.groupDiscussion {
  .doc_wrapper {
    display: grid;
    grid-template-columns: 45% 45%;
    justify-content: space-between;
    margin-top: 16px;
  }
}
</style>
