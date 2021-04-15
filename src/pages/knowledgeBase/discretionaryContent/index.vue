<template>
  <div>
    <component :is="currDiscreComp"></component>
  </div>
</template>

<script>
import { mapState } from "vuex";
import dataDisplay from './dataDisplay'
import addDiscretionary from './addDiscretionary';

export default {
  name:"discretion",
  components: {
    dataDisplay,
    addDiscretionary
  },
  data() {
    return {
      discId:""
    };
  },
  methods: {
    // 从列表组件传值
    /*getDiscDetail(id) {
      console.log("修改的时候传的id",info);
      this.discId = id;
    }*/
  },
  computed: {
      ...mapState(['currDiscreComp'])
  }
};
</script>

<style lang="less" scoped>
</style>
