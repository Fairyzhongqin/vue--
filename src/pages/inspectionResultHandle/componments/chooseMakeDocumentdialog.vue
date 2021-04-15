<template>
  <ul>
    <li
      v-for="(listItem, listIndex) in listStep"
      :key="listIndex"
      class="lis"
      @click="toShow(listItem)"
    >+ {{ listItem.content }}</li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      listStep: [
        { content: '行政强制审批表', type: 'XZQZSPB' },
        { content: '当事人陈述申辩笔录', type: 'DSRCSSBBL' },
        { content: '查封扣押决定书', type: 'CFKYJDS' },
        { content: '查封扣押（场所、设施、财物）清单', type: 'CFKYQD' },
        { content: '延长查封扣押期限决定书', type: 'YCCFKYQXJDS' },
        { content: '查封扣押处理决定书', type: 'CFKYCLJDS' },
        { content: '停止供电（供应民用爆炸物品）通知书', type: 'TZGDTZS' },
        { content: '停止供电（供应民用爆炸物品）决定书', type: 'TZGDJDS' },
        { content: '恢复供电（供应民用爆炸物品）通知书', type: 'HFGDTZS' }
        /*   { content: "先行登记保存证据审批表", type: "XXDJBCZJSPB"},
        { content: "先行登记保存证据通知书", type: "XXDJBCZJTZS" }, */
        // { content: "先行登记保存证据处理审批表", type: "XXDJBCZJCLSPB"},
        // { content: "先行登记保存处理决定书", type: "XXDJBCZJCLJDS" }
      ]
    }
  },
  methods: {
    toShow(data) {
      this.$emit('showDiag', data.content, data.type)
    }
  }
}
</script>

<style lang="less" scoped>
ul {
  padding-left: 15px;
}
li {
  list-style: none;
  cursor: pointer;
}
.lis {
  margin: 18px 0;
}
.lis:hover {
  color: rgba(0, 153, 255, 1);
}
</style>
