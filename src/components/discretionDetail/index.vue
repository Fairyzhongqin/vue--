<template>
  <div>
    <!-- 违法行为 -->
    <div>
      <span>违法行为：</span>
      <pre>{{ detail.unLawfulActs }}</pre>
    </div>
    <br />
    <!-- 法律规定 -->
    <div>
      <span>法律规定：</span>
      <pre>{{ detail.lawDetail }}</pre>
    </div>
    <br />
    <!-- 处罚依据 -->
    <div>
      <span>处罚依据：</span>
      <pre>{{ detail.punishmentBasis }}</pre>
    </div>
    <br />
    <div>
      <span>处罚档次：</span>
      <pre>{{ detail.levelContent }} </pre>
    </div>
    <br />
    <!-- 裁量幅度 -->
    <div>
      <span>裁量幅度：</span>
      <pre>{{ detail.discretionRangeContent }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  name: 'discretionDetail',
  props: ['detail'],
  data() {
    return {}
  },
  created() {},
  methods: {}
}
</script>

<style lang="less" scoped>
pre {
  overflow: hidden;
  white-space: pre-line;
  margin-top: 4px;
  margin-bottom: 0;
}
span {
  font-weight: 900;
}
</style>
