<template>
  <el-select
    :placeholder="placeholder"
     ref = "select"
     clearable
    :value="value"
    @input="getvalue"
    @blur="blur">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'value-select',
  props: {
    placeholder: {
      type: String,
      default: '请选择内容'
    },
    value: [String, Number, Array],
    options: {
      type: [Object, Array]
    }
  },
  methods: {
    getvalue (value) {
      this.$emit('input', value)
    },
    blur () {
      this.$emit('blur')
    }
  }
}
</script>
