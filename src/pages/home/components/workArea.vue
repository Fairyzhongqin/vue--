<template>
  <div>
    <list></list>
  </div>
</template>

<script>
import list from "./workAreaList";

export default {
  data() {
    return {
      showList: true,
      id: null,
      title: null,
    }
  },
  components: {
    list
  },
}
</script>

<style lang="less" scoped>

</style>