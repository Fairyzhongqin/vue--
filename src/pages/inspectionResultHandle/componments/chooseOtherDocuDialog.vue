<template>
  <ul>
    <li @click="fun(listItem)" v-for="(listItem, index) in listStep" :key="index" class="lis">+ {{ listItem.content }}</li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      listStep: [
        { content: '询问通知书', type: 'XWTZS' },
        { content: '询问笔录', type: 'XWBL' },
        { content: '抽样取证凭证', type: 'CYQZPZ' },
        { content: '勘验笔录', type: 'KYBL' },
        { content: '先行登记保存证据审批表', type: 'XXDJBCZJSPB' },
        { content: '先行登记保存证据通知书', type: 'XXDJBCZJTZS' },
        { content: '先行登记保存证据处理审批表', type: 'XXDJBCZJCLSPB' },
        { content: '先行登记保存证据处理决定书', type: 'XXDJBCZJCLJDS' },
        { content: "非职责范围安全问题移交单", type: 'FZZAQWTYJD' }
        // { content: "图片文书", type: '' },
      ]
    }
  },
  methods: {
    fun(data) {
      this.$emit('showDiag', data.content, data.type)
    }
  }
}
</script>

<style lang="less" scoped>
ul {
  padding: 0 23px 0 15px;
}
li {
  list-style: none;
}
.lis {
  margin-bottom: 22px;
  cursor: pointer;
}
.lis:hover {
  color: rgba(0, 153, 255, 1);
}
</style>
