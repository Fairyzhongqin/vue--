<template>
  <el-dialog
    :title="title"
    width="400px"
    height="400px"
    :visible.sync="isUpdatePwd"
    :before-close="cancel"
    :close-on-click-modal="false"
    :modal-append-to-body="false"
  >
    <p class="first_msg" v-if="this.source === 'login'">
      初始密码默认123456，首次登录请修改密码!<br /><span>(密码必须包含大小写字母、数字、特殊字符中的三个,且长度不小于八位)</span>
    </p>
    <!-- 首次登录系统用户名为姓名全拼，若重名，用户名为姓名全拼刚+上报执法证号后2位 -->
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" v-if="isUpdatePwd">
      <el-form-item label="" prop="oldPwd">
        <div slot="label" class="slot_label">原密码</div>
        <!-- <el-input type="password" style="display:none;width:0;height:0;" name="syPwd"/> -->
        <el-input
          type="password"
          v-model="ruleForm.oldPwd"
          @blur="checkPasswd"
          autocomplete="off"
          name="syPwd"
          class="origin-pwd"
          :class="isOriginPwd ? 'is-origin-pwd' : 'not-origin-pwd'"
        ></el-input>
      </el-form-item>
      <el-form-item label="" prop="newPwd">
        <div slot="label" class="slot_label">新密码</div>
        <el-input type="password" v-model="ruleForm.newPwd" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="" prop="confirmPwd">
        <div slot="label" class="slot_label">确认密码</div>
        <el-input type="password" v-model="ruleForm.confirmPwd" autocomplete="off"></el-input>
      </el-form-item>
      <div style="padding: 0 0 20px 95px">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { login, updatePassword, logoutSystem, checkPwd } from '@/api/login/login'
import { savePsw, delPsw } from '@/utils/auth'
export default {
  props: {
    isUpdatePwd: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '修改密码'
    },
    source: {
      type: String,
      default: ''
    },
    rememberPsw: {
      type: Boolean,
      default: true
    },
    username: {
      type: String,
      default: ''
    }
  },
  data() {
    let validateNewPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.newPwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        oldPwd: '',
        newPwd: '',
        confirmPwd: ''
      },
      rules: {
        oldPwd: [{ required: true, trigger: 'blur', message: '请输入原密码' }],
        newPwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          // (?=.*?[0-9])(?=.*?[a-z])
          // { pattern: /^[0-9a-zA-Z]{8,}$/, message: "密码必须包含字母、数字，并且不少于8位"}
          {
            pattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\\W_]+$)[a-zA-Z0-9\W_]{8,}$/,
            message: '字母、数字、特殊字符的组合，且不少于八位'
          }
        ],
        confirmPwd: [{ validator: validateNewPwd, trigger: 'blur', required: true }]
      },
      isOriginPwd: true // 校验原密码
    }
  },
  methods: {
    // 取消修改密码
    cancel() {
      this.resetPwd()
      this.$emit('close')
    },
    // 修改密码数据初始化
    resetPwd() {
      this.ruleForm.oldPwd = ''
      this.ruleForm.newPwd = ''
      this.ruleForm.confirmPwd = ''
    },
    checkPasswd() {
      if (!this.ruleForm.oldPwd || this.ruleForm.oldPwd === '') return
      checkPwd({
        checkPsw: this.ruleForm.oldPwd
      }).then(res => {
        this.isOriginPwd = res.data
        if (!res.data) {
          this.$message({
            message: '原密码输入错误',
            type: 'error'
          })
        }
      })
    },
    // 修改密码提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isOriginPwd) {
            this.$emit('close')
            updatePassword({
              newPsw: this.ruleForm.confirmPwd,
              oldPsw: this.ruleForm.oldPwd
            }).then(
              res => {
                // res.token
                let token = res.data
                if (this.rememberPsw) {
                  savePsw(this.username, this.ruleForm.confirmPwd)

                  this.$emit('updateForgetPsw', this.ruleForm.confirmPwd)
                } else {
                  delPsw(this.username)
                }
                this.$confirm('修改成功', '提示', {
                  confirmButtonText: '确定',
                  type: 'success '
                })
                  .then(() => {
                    if (this.source === 'login') {
                      this.$emit('updateInfo', token)
                    } else {
                      this.resetPwd()
                      localStorage.clear()
                      this.$router.push('/')
                    }
                  })
                  .catch(() => {
                    if (this.source === 'login') {
                      this.$emit('updateInfo', token)
                    } else {
                      this.resetPwd()
                      localStorage.clear()
                      this.$router.push('/')
                    }
                  })
              },
              err => {
                // 密码规则错误
                this.$alert(err, '修改密码失败', {
                  confirmButtonText: '确定'
                })
                this.resetPwd()
              }
            )
          } else {
            this.$message({
              message: '原密码输入错误',
              type: 'error'
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
p.first_msg {
  margin: 0;
  font-weight: bold;
  padding-left: 33px;
  font-size: 14px;
  padding-bottom: 10px;
  span {
    font-weight: normal;
    font-size: 12px;
    color: #f56c6c;
  }
}
.demo-ruleForm {
  padding-left: 25px;
  /* /deep/ .origin-pwd {
  } */
  /deep/ .not-origin-pwd {
    .el-input__inner {
      border-color: #f56c6c;
    }
    .el-input__suffix {
      .el-input__validateIcon {
        color: #f56c6c;
      }
      .el-icon-circle-check {
        &::before {
          content: '\e78d';
        }
      }
    }
  }
  /deep/ .is-origin-pwd {
    .el-input__suffix {
      .el-icon-circle-check {
        &::before {
          content: '\e720';
        }
      }
    }
  }
}
/deep/ .el-dialog .el-dialog__body {
  padding-right: 60px;
  padding-top: 20px;
  padding-bottom: 5px;
}
</style>
