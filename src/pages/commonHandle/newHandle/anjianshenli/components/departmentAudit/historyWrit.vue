<template>
  <div>
    <div class="create-tab-title history-writ">未审核通过文书记录</div>
    <div class="doc-container">
      <template v-if="docList.length !== 0">
        <doc-card
          v-for="(docItem, index) of docList"
          :key="index"
          :docData="docItem"
          :isRecalled="isRecalled"
          :processVersion="processVersion"
          :readOnly="forBrowse"
          @previewWrit="preview"
        ></doc-card>

          <!-- @previewWrit="preview" -->
      </template>

      <sn-empty-data v-if="docList.length === 0" text="暂无未审核通过的法制审核意见书"></sn-empty-data>
    </div>
  </div>
</template>

<script>
import snEmptyData from '@/components/snEmptyData'
import docCard from '@/components/docCard/index'
export default {
  props: {
    docList: {
      type: Array
    },
    forBrowse: {
      type: Boolean,
      default: false
    },
    isRecalled: {
      type: String,
      default: '0'
    },
    processVersion: {
      type: Number,
      default: 0
    }
  },
  components: {
    snEmptyData,
    docCard
  },
  methods: {
    preview(id) {
      this.$emit('previewWrit',id)
    }
  }
}
</script>

<style lang="less" scope>
.history-writ {
  margin-top: 20px;
}
// 卡片区域
.doc-container {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  flex-wrap: wrap;
  padding-top: 16px;

  .doc-card {
    margin-bottom: 18px;
  }
}
</style>
