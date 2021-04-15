<template>
  <el-select
    class="select_aa"
    :value="value"
    @input="getvalue"
    ref="select"
    :placeholder="placeholder"
    @focus.once="handleCheckBox"
    :no-data-text="noDataText"
    clearable
    @blur="blur"
    :multiple="multiple"
    :disabled="disabled"
  >
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
  </el-select>
</template>

<script>
import { dropDownBoxByPost, dropDownBoxByGet } from '@/api/dropDownBox'
import { mapState } from 'vuex'
export default {
  name: 'sn-select',
  props: {
    placeholder: {
      type: String,
      default: '请选择内容'
    },
    value: [String, Number, Array],
    dataUrl: {
      // 请求地址
      type: String,
      default: '/aj/sys/sysdict/list'
    },
    requertData: {
      // post数据
      type: [Object, Number, String, Array]
    },
    immediate: {
      // 是否在加载时就请求数据，false为懒请求（点击后才请求）
      type: Boolean,
      default: false
    },
    //检查形式
    parentToChildDisabled: {
      type: Boolean
    },
    multiple: {
      // 多选
      type: Boolean,
      default: false
    },
    chooseType: {
      // 新增特殊情形现场检查专用
      type: Boolean,
      default: false
    },
    methodType: {
      type: String,
      default: 'post'
    },
    codeName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      options: [],
      noDataText: '无数据',
      disabled: false
    }
  },
  watch: {},
  created() {
    if (this.immediate) {
      this.initLoad()
    }
  },
  methods: {
    initLoad() {
      if (this.methodType == 'GET') {
        //查询dev_data表
        dropDownBoxByGet(this.dataUrl, this.requertData, this.methodType)
          .then(res => {
            this.options = res.data.map(r => {
              return { value: r.id, label: r.dataName }
            })
          })
          .catch(err => {
            this.noDataText = '数据请求出错'
          })
      } else {
        dropDownBoxByPost(this.dataUrl, this.requertData, this.methodType)
          .then(res => {
            if (this.chooseType) {
              this.options = res.page.list.filter(function(item) {
                return item.code === 'se50008' || item.code === 'se50007'
              })
            } else {
              this.options = res.page.list.map(r => {
                return { value: r.code, label: r.value }
              })
            }
            // eslint-disable-next-line handle-callback-err
          })
          .catch(err => {
            this.noDataText = '数据请求出错'
          })
      }
    },
    getvalue(value) {
      this.$emit('input', value)
      if (!this.multiple) {
        let obj = {}
        obj = this.options.find(item => {
          return item.value === value
        })
        if (obj) {
          this.$emit('getText', obj.label)
          this.$emit('getId', obj.id)
          this.$emit('getObj', obj)
        }
      } else {
        let arr = value.reduce((total, item) => {
          let obj = this.options.find(i => {
            return i.value === item
          })
          total.push(obj)
          return total
        }, [])
        this.$emit('getText', arr)
      }
    },
    handleCheckBox() {
      this.$emit('handleCheckBox', this.codeName)
      this.requestList()
    },
    requestList() {
      if (!this.immediate) {
        dropDownBoxByPost(this.dataUrl, this.requertData)
          .then(res => {
            if (this.chooseType) {
              this.options = res.page.list.filter(function(item) {
                return item.code === 'se50008' || item.code === 'se50007'
              })
            } else {
              this.options = res.page.list.map(r => {
                return { value: r.code, label: r.value }
              })
            }
            // eslint-disable-next-line handle-callback-err
          })
          .catch(err => {
            this.noDataText = '数据请求出错'
          })
      }
    },
    blur() {
      this.$emit('blur')
    }
  },
  mounted() {
    if (this.valFlag == 'checkFlag') {
      this.disabled = this.parentToChildDisabled
    } else {
      this.disabled = this.checkSource
    }
    // if(this.valFlag == ''){
    //   this.disabled = false
    // }
  },
  computed: {
    ...mapState(['valFlag', 'checkSource'])
  },
  beforeDestroy() {
    this.$store.commit('setCheckSource', false)
  }
}
</script>
<style lang="less" scoped>
</style>
