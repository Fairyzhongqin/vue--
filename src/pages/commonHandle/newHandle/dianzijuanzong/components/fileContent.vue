<template>
  <div class="jz-file-content">
    <section class="jz-file-section">
      <div v-for="num in 1" :key="num">
      </div>
    </section>

    <div slot="footer" class="jz-file-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="sure">制作电子卷宗</el-button>
    </div>
  </div>
</template>

<script>
import { getArchiveCon, createArchive } from "@/api/dossier";

export default {
  name: "fileContent",
  data() {
    return {
      archiveCon: []
    };
  },
  created() {
    this.getFileContent();
  },
  methods: {
    // 获取电子卷宗信息
    getFileContent() {
      getArchiveCon({
        penaltyId: this.$store.state.penalty.penaltyUndEntity.penaltyId
      }).then(res => {
        this.archiveCon = res.data.sort((before, after) => {
          return before.treeOrderNum - after.treeOrderNum;
        });
      });
    },
    sure() {},
    cancel() {}
  }
};
</script>

<style lang="less" scoped>
.jz-file-content {
  padding: 8px 16px;
}
.jz-file-section {
}
.jz-file-footer {
  padding: 6px 16px 6px 0;
  border: 1px solid #e0e0e0;
  background: white;
  text-align: right;
}
</style>
