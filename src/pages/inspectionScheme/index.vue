<template>
  <div class="inspection-scheme-container" :class="{'need-margin': modelShow !== 'isList'}">
    <component :is="modelShow" :param="param" @changeView="changeView"></component>
  </div>
</template>

<script>
import isList from './list'
import isCreate from './create'
import isView from './view'
import patchDoc from './patchDoc'

export default {
  name: 'inspectionScheme',
  components: {
    isList,
    isCreate,
    isView,
    patchDoc
  },
  data() {
    return {
      modelShow: 'isList',
      param: '' // 传递参数 一般在 修改 和 查看 时用到
    }
  },
  methods: {
    changeVisiable(data) {
      this.modelShow = data
    },
    changeView(name, val) {
      this.modelShow = name
      if (val) {
        this.param = val
      } else {
        this.param = ''
      }
    }
  },
  watch: {
    modelShow: {
      handler: function(val, oldVal) {
        // 返回列表没有数据 是因为没有watch到数据刷新 只需要watch到刷新就可以了 此watch不可删除
      },
      deep: true
    }
  }
}
</script>

<style lang="less">
.inspection-scheme-container {
  &.need-margin {
    &:first-child {
      margin-bottom: 60px;
    }
  }
}
</style>
