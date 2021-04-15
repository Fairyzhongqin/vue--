<template>
  <div :class="{'sn-add-button': size === 'normal', 'sn-add-button-mini': size === 'mini'}"
       @click.prevent="buttonClick()">+ {{text}}</div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '新增'
    },
    size: {
      type: String,
      default: 'normal'
    }
  },
  methods: {
    buttonClick () {
      this.$emit('buttonClick')
    }
  }
}
</script>

<style lang="less" scoped>
.sn-add-button {
  height: 46px;
  width: 100%;
  line-height: 46px;
  text-align: center;
  color: #0099ff;
  background-color: #eef5f9;
  cursor: pointer;
  &:hover {
    background-color: #d5eefd;
  }
}
.sn-add-button-mini {
  height: 32px;
  width: 100%;
  line-height: 32px;
  text-align: center;
  color: #0099ff;
  background-color: #eef5f9;
  cursor: pointer;
  &:hover {
    background-color: #d5eefd;
  }
}
</style>
