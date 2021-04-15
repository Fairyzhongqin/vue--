<template>
  <div class="node-item-container" :class="nodeType !== 'parent'?'flex flex-row':''">
    <div class="flex flex-row" style="width:100%">
      <div v-if="nodeType === 'parent'" style="width: 100px;">检查内容：</div>
      <div style="width:100%">
        <div v-if="!editStatus" class="text">
          <span v-if="nodeType !== 'parent'" class="numCirle">{{index+1}}</span>
          {{textCache}}
          <span
            class="button-bar flex flex-row"
            :class="{'button-parent': nodeType === 'parent' && !hasChild}"
            v-if="(!(nodeType === 'parent' && hasChild)) && !view"
          >
            <el-button type="text" v-show="editStatus" @click="save()">保存</el-button>
            <el-button type="text" v-show="editStatus" @click="cancel()">取消</el-button>
            <el-button type="text" v-show="!editStatus" @click="edit()">修改</el-button>
            <el-button type="text" style="color:#FF4B3D;" v-show="!editStatus" @click="del()">删除</el-button>
          </span>
        </div>
        <el-input
          v-else
          v-model="textCache"
          maxlength="200"
          type="textarea"
          @blur="save()"
          @input="change"
          ref="gain"
          :autosize="{ minRows: 1, maxRows: 3 }"
        ></el-input>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    nodeText: {
      type: String,
      default: ''
    },
    nodeType: {
      type: String,
      default: 'parent'
    },
    hasChild: {
      type: Boolean,
      default: true
    },
    index: {
      type: Number,
      default: 1
    },
    node: {
      type: [Array, Object]
    },
    view: {
      // true为仅查看 仅查看则隐藏按钮
      type: Boolean,
      default: false
    }
  },
  components: {},
  data() {
    return {
      editStatus: false,
      textCache: '',
      circleNumber: ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮', '⑯', '⑰', '⑱', '⑲', '⑳']
    }
  },
  created() {},
  mounted() {
    // this.$listeners.getEditMethods();
  },
  computed: {},
  watch: {
    nodeText: {
      handler: function(val, oldval) {
        this.textCache = val
      },
      immediate: true
    }
  },
  methods: {
    //修改
    edit() {
      this.editStatus = true
      this.$nextTick(() => {
        this.$refs.gain.focus()
      })
    },
    save() {
      // this.$emit("editNode", this.node, this.textCache);
      this.editStatus = false
    },
    change(msg) {
      this.textCache = msg
      this.$emit('editNode', this.node, this.textCache)
    },
    cancel() {
      this.editStatus = false
    },
    del() {
      let obj = {}
      obj.item = this.node
      obj.sonIndex = this.nodeType == 'child' ? this.index : null
      obj.fatherIndex = this.$parent.indexShow
      this.$emit('deleteNode', obj)
    }
  }
}
</script>

<style lang='less' scoped>
.node-item-container {
  line-height: 30px;
  .text {
    margin-right: 18px;
  }
  .button-bar {
    min-width: 80px;
    float: right;
  }
  .button-parent {
    text-align: right;
  }
  .numCirle {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid rgba(51, 51, 51, 1);
    text-align: center;
    line-height: 20px;
    margin-right: 3px;
  }
}
</style>
