<template>
  <div>
    <component :is="componentId"></component>
  </div>
</template>
<script>
import closingCase from './closingCase'; //
import previewCase from './previewCase';
export default {
  components: {
    closingCase,
    previewCase,
  },
  data() {
    return {
      componentId: 'closingCase'
    }
  },
  methods: {
    setComponentId(val) {
      this.componentId = val;
    }
  }
}
</script>
<style lang="less" scoped>
  
</style>