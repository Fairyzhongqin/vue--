<template>
  <div>
    <div class="by_role">
      <h3><img src="~@/assets/imgs/role.svg" />选择角色</h3>
      <ul>
        <li v-for="(tag, index) in list" :key="index" :class="actIndex === index ? 'act' : ''" @click="clickHandle(index)">
          <p>{{tag.label}}</p>
          <i class="el-icon-check"></i>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    roleIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      list: [{
        label: '不限角色',
        code: '0'
      },{
        label: '案审委',
        code: '1'
      }],
      actIndex: 0
    }
  },
  methods: {
    clickHandle(index) {
      this.actIndex = index
      this.$emit('roleChange', index)
    }
  },
  watch: {
    roleIndex: {
      handler: function(val, oldVal) {
        console.info(val)
        this.actIndex = val
      }
    }
  }
}
</script>

<style lang="less" scoped>
.by_role {
  padding-left: 16px;
  h3 {
    img {
      width: 23px;
      height: auto;
      vertical-align: middle;
      margin-right: 5px;
    }
    color: #333333;
    font-size: 14px;
    font-weight: normal;
    margin: 0;
    line-height: 40px;
  }
  ul,
  li {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  ul {
    display: flex;
    animation: all 1s;
    margin-bottom: 7px;
    li {
      margin-right: 15px;
      height: 20px;
      line-height: 20px;
      border: 1px solid #e0e0e0;
      width: 90px;
      color: #333333;
      font-size: 14px;
      background: #ffffff;
      position: relative;
      text-align: center;
      cursor: pointer;
      &.act {
        color: #0099ff;
        border-color: #0099ff;
        &:after {
          content: '';
          width: 0;
          height: 0;
          position: absolute;
          right: 0;
          bottom: 0;
          border-bottom: 15px solid #0099ff;
          border-left: 15px solid transparent;
        }
        p {
          transform: translate(-5px);
        }
        i.el-icon-check {
          display: block;
        }
      }
      p {
        margin: 0;
      }
      i.el-icon-check {
        display: none;
        position: absolute;
        right: -2px;
        bottom: -3px;
        color: #fff;
        z-index: 1;
        transform: scale(0.8);
      }
    }
  }
}
</style>
