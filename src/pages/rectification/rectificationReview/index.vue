<template>
  <div>
    <component :is="rectificationCurrentComponent"></component>
  </div>
</template>

<script>
import newRectification from "./newRectification";
import { mapState } from "vuex";
import rectificationList from "./rectificationList/index";

export default {
  name: "rectificationReview",
  components: {
    newRectification,
    rectificationList,
  },
  activated() {
    this.$store.dispatch("switchCompStatus", "/rectificationReview");
  },
  computed: {
    ...mapState([
      "rectificationCurrentComponent"
    ])
  }
};
</script>

<style lang="less" scoped>
</style>