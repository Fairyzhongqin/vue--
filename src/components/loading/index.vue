<template>
  <div :class="{'loading1': mode==='mode1', 'loading2': mode==='mode2'}"></div>
</template>

<script>
export default {
  props: {
    mode: {
      type: String,
      default: 'mode1'
    }
  },
  name: 'Loading'
}
</script>

<style scoped>
.loading1 {
  background: url("../../assets/imgs/Spinner-1s-200px.svg") center center
    no-repeat #fff;
  width: 100px;
  height: 100px;
  z-index: 1000;
}
.loading2 {
  background-color: rgba(0, 0, 0, 0.267);
  background: url("~@/assets/imgs/Loading.png");
  width: 100%;
  height: 100%;
}
</style>
