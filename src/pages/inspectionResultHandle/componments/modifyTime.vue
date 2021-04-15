<template>
  <div class="modify_time">
    <div class="indexPosit">{{ indexKey + 1 }}、</div>
    <div class="lineCon">
      <span>检查项目类别：</span>
      <span>{{ selectedList.discretionTypeName }}</span>
    </div>
    <div style="font-size:16px;color:rgba(51,51,51,1);font-weight:700; white-space:wrap" class="lineCon">
      <span>检查内容：</span>
      <!-- I'm dead !  -->
      <span>{{ selectedList.checkItem !== null ? selectedList.checkItem : selectedList.checkContent }}</span>
    </div>
    <div class="lineCon">
      <span>检查描述：</span>
      <span>{{ selectedList.negativeDesc }}</span>
    </div>

    <!-- <div class="lineCon spec">modifyTimeForm
      <span>整改要求：</span>
      <el-input v-model="request"></el-input>
    </div>
    <div class="lineCon">
      <span>整改时限：</span>
      <el-date-picker
        v-model="time"
        type="date"
        placeholder="选择整改期限"
        value-format="yyyy-MM-dd HH:mm:ss"
        :picker-options="pickerOptions"
      ></el-date-picker>
    </div>-->
    <el-form
      style="padding-left: 16px"
      :model="modifyTimeForm"
      :rules="modifyTimeRules"
      ref="modifyTimeForm"
      :show-message="false"
      label-width="110px"
    >
      <el-form-item prop="request" label="">
        <div slot="label" class="slot_label">整改要求</div>
        <el-input v-model="modifyTimeForm.request" style="width:70%;" placeholder="请输入整改要求"></el-input>
      </el-form-item>
      <el-form-item prop="time" label="">
        <div slot="label" class="slot_label">整改时限</div>
        <el-date-picker
          v-model="modifyTimeForm.time"
          type="date"
          :disabled="from === 'rectify'"
          placeholder="选择整改期限"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getFirstErrMsg } from '@/utils/util'
export default {
  name: 'modify_time',
  data() {
    return {
      modifyTimeForm: {
        request: '',
        time: null
      },
      modifyTimeRules: {
        request: [{ required: true, trigger: 'blur', message: '请输入整改要求' }],
        time: [{ required: true, trigger: 'change', message: '请选择整改时限' }]
      },
      // 禁止选择当前时间之前的检查时间
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  props: {
    selectedList: {
      type: Object
    },
    indexKey: {
      type: Number
    },
    from: {
      // rectify 来自整改复查模块
      type: String
    }
  },
  methods: {
    //子组件校验，传递到父组件
    validateForm() {
      // getFirstErrMsg
      let flag = null
      this.$refs['modifyTimeForm'].validate((valid, obj) => {
        if (valid) {
          flag = false
        } else {
          flag = getFirstErrMsg(obj)
        }
      })
      return flag
    }
  },
  created() {
    console.log('props==selectedList', this.selectedList)
    this.modifyTimeForm.request = this.selectedList.rectifyDemand
    if (this.from === 'rectify') {
      this.modifyTimeForm.time = this.selectedList.notQuaExpireTime ? this.selectedList.notQuaExpireTime.split('/').join('-') : null
    } else {
      this.modifyTimeForm.time = this.selectedList.rectifyTime ? this.selectedList.rectifyTime.split('/').join('-') : null
    }
  },
  watch: {
    'modifyTimeForm.time': {
      handler: function(val, oldVal) {
        if (oldVal == null && val !== null) {
          this.$emit('changeTime', this.modifyTimeForm.time)
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
.modify_time {
  padding: 0 0px;
  position: relative;
  margin-top: 11px;
  font-size: 14px;
  color: #666666;
  .el-form-item {
    margin-bottom: 0;
  }
}
.indexPosit {
  position: absolute;
  top: 0px;
  font-size: 14px;
  color: #333;
  font-weight: 700;
}
.lineCon {
  padding-left: 20px;
  margin-bottom: 10px;
}
.el-select {
  /deep/.el-input {
    width: 353%;
  }
}
.spec {
  color: #333;
  /deep/ .el-input {
    width: 87%;
    /deep/ .el-input__inner {
      width: 97%;
    }
  }
}
</style>
