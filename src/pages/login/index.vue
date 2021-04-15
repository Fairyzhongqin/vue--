<template>
  <div class="login_lay">
    <h2 :class="styleType!==0?'small':''">江苏省安全生产行政执法系统{{config.cityName}}</h2>
    <div class="login_userInfo" :class="styleType!==0?'userInfo_show':''">
      <el-tooltip
        class="message-item"
        effect="light"
        placement="bottom"
        popper-class="popper-style"
      >
        <div class="messages">
          <el-badge :value="websocketMsgNumber" class="badge-items" :max="999"></el-badge>
          <i class="el-icon-message-solid"></i>
        </div>
        <div slot="content">
          <div class="tooltip-content">
            <div>{{ websocketMsg && websocketMsg.list && websocketMsg.list.length > 0 ? websocketMsg.list[0].message : "暂无消息" }}</div>
            <span
              @click="showMoreMsg"
              class="msg-button"
              v-if="websocketMsg && websocketMsg.list && websocketMsg.list.length > 0"
            >查看更多</span>
          </div>
        </div>
      </el-tooltip>
      <p>
        <i class="iconfont iconguanliyuan"></i>
        {{userName}}
      </p>
    </div>
    <div v-if="boxShow.login" class="login_warp" :class="styleType!==0?'login_hide1':''">
      <div class="login_box white_box">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-input
            v-model="ruleForm.username"
            clearable
            @change="usernameChange"
            @keyup.enter.native="submitForm"
          >
            <i class="el-icon-s-custom" slot="prefix"></i>
          </el-input>
          <el-input
            type="password"
            v-model="ruleForm.password"
            clearable
            @keyup.enter.native="submitForm"
          >
            <i class="el-icon-lock" slot="prefix"></i>
          </el-input>

          <el-checkbox v-model="rememberPsw">记住密码</el-checkbox>
          <el-button type="primary" @click="submitForm" :loading="loginLoading">登 录</el-button>
        </el-form>
      </div>
    </div>
    <div
      v-if="boxShow.role"
      class="role_selection_warp"
      :class="[styleType===1?'role_show1':'',styleType===21||styleType===22?'role_hide2':'']"
    >
      <div class="role_box white_box">
        <div class="back_btn" @click="backToLogin">
          <img :src="require('@/assets/imgs/login/loginout.png')" alt />退出登录
        </div>
        <h3>选择角色</h3>
        <div
          :class="authentication('执法端')?'':'grey'"
          class="person person1"
          @click="makeChoice('common');$store.dispatch('delAllViews');$store.dispatch('switchCompStatus','all')"
        >
          <img :style="{width:'120px'}" :src="require('@/assets/imgs/login/person1.png')" alt />
          <p>现场执法</p>
        </div>
        <div
          :class="authentication('管理端')?'':'grey'"
          class="person person2"
          @click="makeChoice('admin');$store.dispatch('delAllViews');$store.dispatch('switchCompStatus','all')"
        >
          <img :src="require('@/assets/imgs/login/person2.png')" alt />
          <p>执法管理</p>
        </div>
      </div>
    </div>

    <div v-if="boxShow.work" class="work_warp" :class="styleType==21?'work_show21':''">
      <div class="work_box white_box">
        <div class="back_btn" @click="backToRole">
          <img :src="require('@/assets/imgs/login/return.png')" alt />选择角色
        </div>
        <h3>现场执法</h3>
        <div class="work_btns">
          <div
            class="icon_box"
            :class="authentication('执法检查')?'':'grey'"
            @click="makeChoice('common', '执法检查')"
          >
            <img :src="require('@/assets/imgs/login/icon1.png')" alt />
            <p>执法检查</p>
          </div>
          <div
            class="icon_box"
            :class="authentication('行政处罚')?'':'grey'"
            @click="makeChoice('common', '行政处罚')"
          >
            <img :src="require('@/assets/imgs/login/icon2.png')" alt />
            <p>行政处罚</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="boxShow.admin" class="admin_warp" :class="styleType===22?'admin_show22':''">
      <div class="admin_box white_box">
        <div class="back_btn" @click="toStyleType(1)">
          <img :src="require('@/assets/imgs/login/return.png')" alt />选择角色
        </div>
        <h3>执法管理</h3>
        <div class="admin_btns">
          <div
            class="icon_box"
            :class="authentication('执法计划')?'':'grey'"
            @click="makeChoice('admin', '执法计划')"
          >
            <img :src="require('@/assets/imgs/login/icon3.png')" alt />
            <p>执法计划</p>
          </div>
          <div
            class="icon_box"
            :class="authentication('审核审批')?'':'grey'"
            @click="makeChoice('admin', '审核审批')"
          >
            <img :src="require('@/assets/imgs/login/icon4.png')" alt />
            <p>审核审批</p>
          </div>
          <div
            class="icon_box"
            :class="authentication('法制审核')?'':'grey'"
            @click="makeChoice('admin', '法制审核')"
          >
            <img :src="require('@/assets/imgs/login/icon5.png')" alt />
            <p>法制审核</p>
          </div>
          <div
            class="icon_box"
            :class="authentication('集体讨论')?'':'grey'"
            @click="makeChoice('admin', '集体讨论')"
          >
            <img :src="require('@/assets/imgs/login/icon6.png')" alt />
            <p>集体讨论</p>
          </div>
          <div
            class="icon_box"
            :class="authentication('组织听证')?'':'grey'"
            @click="makeChoice('admin', '组织听证')"
          >
            <img :src="require('@/assets/imgs/login/icon7.png')" alt />
            <p>组织听证</p>
          </div>
          <div
            class="icon_box"
            :class="authentication('执法知识库')?'':'grey'"
            @click="makeChoice('admin', '执法知识库')"
          >
            <img :src="require('@/assets/imgs/login/icon8.png')" alt />
            <p>执法知识库</p>
          </div>
          <div
            class="icon_box"
            :class="authentication('企业信息')?'':'grey'"
            @click="makeChoice('admin', '企业信息')"
          >
            <img :src="require('@/assets/imgs/login/icon9.png')" alt />
            <p>企业信息</p>
          </div>
          <div
            class="icon_box"
            :class="authentication('分析研判')?'':'grey'"
            @click="makeChoice('admin', '分析研判')"
          >
            <img :src="require('@/assets/imgs/login/icon10.png')" alt />
            <p>分析研判</p>
          </div>
          <div
            class="icon_box"
            :class="authentication('系统管理')?'':'grey'"
            @click="makeChoice('admin', '系统管理')"
          >
            <img :src="require('@/assets/imgs/login/icon11.png')" alt />
            <p>系统管理</p>
          </div>
        </div>
      </div>
    </div>
    <div class="halo"></div>
    <div class="dots"></div>
    <div class="line line1"></div>
    <div class="line line2"></div>
    <div class="line line3"></div>
    <div class="line line4"></div>
    <p class="copy_right">CopyRight @2020 STATE ADMINISTRATION OF WORK SAFETY ALL Rights Reserved</p>
    <p v-if="styleType===0" class="first_user_msg">用户名为姓名全拼(若重名加执法证号后两位)，首次登录密码:123456</p>
    <el-dialog
      title="消息列表"
      width="800px"
      height="500px"
      class="dialog-type"
      :visible.sync="msgDialog"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
    >
      <el-button @click="readAllMessage" type="primary" class="read-all-msg-btn">一键已读</el-button>
      <div class="msg-table-body">
        <el-table
          :data="msgList"
          border
          fit
          row-class-name="lineheight"
          :default-sort="{prop: 'date', order: 'descending'}"
          header-row-class-name="headerclass"
          v-if="msgDialog"
        >
          <el-table-column type="index" min-width="20" label=" " :index="dataIndex"></el-table-column>
          <el-table-column prop="message" min-width="190" label="消息内容">
            <template slot-scope="scope">{{ scope.row.message}}</template>
          </el-table-column>

          <el-table-column label="操作" min-width="40">
            <template slot-scope="scope">
              <el-button type="primary" class="shortBut" @click="seeDetail(scope.row)">
                <!-- {{scope.row.isRead == "0" ? "未读" : "已读"}} -->
                已读
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="msg-table-page-number">
        <el-pagination
          :page-size="10"
          :pager-count="5"
          layout="prev, pager, next"
          :total="msgTotalCount"
          @current-change="queryMsgForPage"
        ></el-pagination>
      </div>
    </el-dialog>
    <update-psw
      :isUpdatePwd="isUpdatePwd"
      :rememberPsw="rememberPsw"
      :username="ruleForm.username"
      @close="isUpdatePwd=false"
      @updateForgetPsw="updateForgetPsw"
      title="初始化密码"
      source="login"
      @updateInfo="updateInfo"
    ></update-psw>
    <improve-personal v-if="improveShow" @cancel="improveShow=false" source="login"></improve-personal>
  </div>
</template>

<script>
import { login, ajsyssysmenulist, logoutSystem, getWritTypeInfo } from '@/api/login/login'
import { getPsw, savePsw, delPsw } from '@/utils/auth'
import { mapState } from 'vuex'
import { commomRoutes, adminAuditRoutes } from '@/router/index'

import { readMsg, getNotReadMsg, readAllMsg } from '@/api/common'
import websocket from '@/utils/websocket'
import updatePsw from '@/pages/home/components/updatePsw'
import improvePersonal from '@/components/ImprovePersonal'
import config from '@/utils/deployConfig'
export default {
  components: {
    updatePsw,
    improvePersonal
  },
  data() {
    return {
      config,
      improveShow: false,
      ruleForm: {
        username: '', // 账号
        password: '' // 密码
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ]
      },
      styleType: null, // 为什么默认是null呢？为了防止返回的时候显示登录穿帮
      boxShow: {
        login: true,
        role: false,
        work: false,
        admin: false
      },
      clickable: true,
      isSuccessLogin: false,
      projectTreeList: null,
      userName: '',
      rememberPsw: true,
      messageNum: 0,
      socket: null,
      userInfo: null,
      messageDetail: null,
      msgCurrPage: '1',
      msgTotalCount: '0',
      msgList: [],
      msgDialog: false,
      currPage: 1,
      message: null,
      isUpdatePwd: false,
      improveShow: false,
      myTreeArr: [],
      loginLoading: false
    }
  },
  created() {
    let token = localStorage.getItem('token')
    let flag = sessionStorage.getItem('token')
    if (token && flag) {
      this.isSuccessLogin = true
      this.toStyleType(1)
      this.userName = JSON.parse(localStorage.getItem('userInfo')).userEntity.nickName
    } else {
      this.styleType = 0
    }
    if (this.websocketObj) {
      this.message = this.websocketObj.msg
    }
    this.loadGray()

    if (sessionStorage.getItem('isCompletion') === '0') {
      this.needCompletion()
    }
  },
  methods: {
    updateForgetPsw(psw) {
      this.ruleForm.password = psw
    },
    usernameChange(value) {
      let psw = getPsw(value)
      if (psw) {
        this.ruleForm.password = psw
      }
    },
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.login()
        } else {
          return false
        }
      })
    },
    // 登录验证
    login() {
      this.loginLoading = true
      const Modulus =
        'b19fc22fbac53ab403ef51d1bfa74cfc16c11078b97f99905b8d1b8a0035178f2f1169b5ff9e9a65d696eb42811534ff721c9a0f72e57b6a3fb5b2265aef506ddfc65a31ce170f86741aa350cb66480c59b46e2832815654edb083ea8039f89d5a7c60ef26796518ca5f5e491a5b274b4ed7fbff69a324b7d06e37af93de2de1'
      const private_exponent = '10001'
      RSAUtils.setMaxDigits(200)
      let key = new RSAUtils.getKeyPair(private_exponent, '', Modulus)
      var reversedPwd = this.ruleForm.password
        .split('')
        .reverse()
        .join('')
      let encrypedPwd = RSAUtils.encryptedString(key, reversedPwd)
      let req = {
        username: this.ruleForm.username, // 账号
        encryptPassword: encrypedPwd // 密码
      }
      login(req)
        .then(res => {
          if (res.code === '0') {
            this.loginLoading = false


            this.$store.commit('SET_TOKEN', res.data.token)
            localStorage.setItem('token', res.data.token)
            sessionStorage.setItem('token', res.data.token)
            if (res.user.userEntity.needPswUpt === '0') {
              sessionStorage.setItem('isCompletion', '0')
              this.needUpdatePsw()
              return
            }

            this.afterLogin()

            this.loadGray() // 该置灰的置灰

            if (res.user.userEntity.isCompletion === '0') {
              sessionStorage.setItem('isCompletion', '0')
              this.needCompletion()
            }
          }
        })
        .catch(err => {
          this.loginLoading = false
          this.$message({
            message: err && err !== '' ? err : '账号/密码不正确',
            type: 'error'
          })
        })
    },
    afterLogin() {
      this.isSuccessLogin = true
      if (this.websocketObj == null) {
        this.$store.commit('CREAT_WEBSOCKET')
        console.info('index login', this.websocketObj)
      }
      getWritTypeInfo().then(
        res => {
          sessionStorage.setItem('writTypeInfo', JSON.stringify(res.data))
          sessionStorage.setItem('originVuexInfo', JSON.stringify(this.$store.state))
        },
        err => {
          sessionStorage.setItem('originVuexInfo', JSON.stringify(this.$store.state))
        }
      )
      this.toStyleType(1)
      this.userName = JSON.parse(localStorage.getItem('userInfo')).userEntity.nickName
      if (this.rememberPsw) {
        savePsw(this.ruleForm.username, this.ruleForm.password)
      } else {
        delPsw(this.ruleForm.username)
      }
    },
    needUpdatePsw() {
      this.isUpdatePwd = true
      // return
    },
    needCompletion() {
      this.improveShow = true
    },
    updateInfo(token) {
      this.$store.commit('SET_TOKEN', token)
      localStorage.setItem('token', token)
      sessionStorage.setItem('token', token)
      // this.ruleForm.password = ''
      this.afterLogin()
      this.loadGray()
      this.improveShow = true
    },
    loadGray() {
      let tree = JSON.parse(sessionStorage.getItem('treeList'))
      let arr = []
      if (tree.length) {
        tree.map(i => {
          arr.push(i.title)
          if (i.children.length) {
            i.children.map(j => {
              arr.push(j.title)
            })
          }
        })
      }

      this.myTreeArr = arr
    },
    backToLogin() {
      // 返回登录状态
      // 登出
      try {
        this.websocketObj.closeWs()
      } catch (err) {
        console.log(err)
      }
      logoutSystem().then(
        res => {
          this.$resetVuex(JSON.parse(sessionStorage.getItem('originVuexInfo')), this.$store.state)
          localStorage.clear()
          sessionStorage.clear()
          this.isSuccessLogin = false
          this.toStyleType(0)
          this.$store.commit('DESTROY_WEBSOCKET')
        },
        err => {
          this.$resetVuex(JSON.parse(sessionStorage.getItem('originVuexInfo')), this.$store.state)
          localStorage.clear()
          sessionStorage.clear()
          this.isSuccessLogin = false
          this.toStyleType(0)
          this.$store.commit('DESTROY_WEBSOCKET')
        }
      )
    },
    backToRole() {
      // 返回选择人员状态
      this.toStyleType(1)
    },
    makeChoice(val, name) {
      console.info('几个小项', val, name)
      this.projectTreeList = JSON.parse(sessionStorage.getItem('treeList'))
      if (!this.isPermision()) {
        this.noPermisionTips()
        return
      }
      if (val === 'common') {
        if (name) {
          this.$router.push('/content')
          sessionStorage.setItem('role_permision', `common,${name}`)
        } else {
          if (!this.isPermision({ id: 'zfd001' })) {
            this.noPermisionTips()
            return
          }
          this.toStyleType(21)
        }
      } else {
        if (name) {
          if (!this.isPermision({ id: 'gld001', name })) {
            this.noPermisionTips()
            return
          }

          let treeList = JSON.parse(sessionStorage.getItem('treeList'))
          let adminPart = null
          treeList.some((item, index) => {
            adminPart = item
            return item.title === '管理端'
          })

          let path = ''
          if (adminPart && adminPart.children && adminPart.children.length > 0) {
            adminPart.children.some((item, index) => {
              path = item.children && item.children.length > 0 ? `/${item.children[0].url}` : `/${item.url}`
              return item.title === name
            })
          }
          // this.$router.push(path)
          console.info('此时的path', path)
          if (path === '/分析研判') {
            // this.$message({
            //   type: 'success',
            //   message: '分析研判'
            // })
            this.$router.push('/judge')
          } else {
            console.info('else==>', path)
            this.$router.push(path)
          }

          sessionStorage.setItem('role_permision', `admin,${name}`)
        } else {
          if (!this.isPermision({ id: 'gld001' })) {
            this.noPermisionTips()
            return
          }
          this.toStyleType(22)
        }
      }
    },
    // 没有权限的提示
    noPermisionTips() {
      this.$message({
        type: 'error',
        message: '没有权限'
      })
    },
    // 判断是否有进入的权限
    isPermision(params) {
      if (this.projectTreeList.length === 0) {
        return false
      }
      if (!params) return true
      let index = -1
      let result = this.projectTreeList.some((item, i) => {
        index = i
        return item.id === params.id
      })
      if (result) {
        if (!params.name) return true
        let childResult = this.projectTreeList[index].children.some(item => {
          return item.title === params.name
        })
        return childResult
      } else {
        return result
      }
    },
    toStyleType(type) {
      if (!this.clickable) {
        return
      }
      this.clickable = false
      let flag = type === 0 ? 'login' : type === 1 ? 'role' : type === 21 ? 'work' : type === 22 ? 'admin' : ''
      this.boxShow[flag] = true
      setTimeout(() => {
        this.styleType = type
        setTimeout(() => {
          for (let key in this.boxShow) {
            if (key !== flag) {
              this.boxShow[key] = false
            }
          }
          this.clickable = true
        }, 500)
      }, 0)
    },
    queryMsgForPage(val) {
      this.msgCurrPage = val
      this.showMoreMsg()
    },
    // 展示更多未读消息
    showMoreMsg() {
      getNotReadMsg({
        limit: '10',
        page: this.msgCurrPage.toString()
      }).then(res => {
        if (res.page.list) {
          this.msgCurrPage = res.page.currPage
          this.msgTotalCount = res.page.totalCount
          this.msgList = res.page.list
          this.msgDialog = true
        }
        if (res.page.list && res.page.list.length == 0 && Number(this.msgCurrPage) > 1) {
          this.msgCurrPage = Number(this.msgCurrPage) - 1
          this.showMoreMsg()
        }
      })
    },
    // 未读消息序号
    dataIndex(val) {
      return (this.currPage - 1) * 10 + val + 1
    },
    // 查看消息
    seeDetail(item) {
      console.log(item)
      readMsg({ msgId: item.id }).then(res => {
        console.log(res, '0000000000')
        // this.messageDetail.list = this.messageDetail.list.reduce(
        //   (total, msg) => {
        //     if (msg.id !== item.id) {
        //       total.push(msg);
        //     }
        //     return total;
        //   },
        //   []
        // );
        this.showMoreMsg()
      })
    },
    readAllMessage() {
      readAllMsg().then(() => {
        console.log('hello')
        this.showMoreMsg()
      })
    },
    authentication(name) {
      if (this.myTreeArr.indexOf(name) === -1) {
        return false
      }
      return true
    }
  },
  watch: {
    message: {
      handler: function(val, oldVal) {
        if (val) {
          this.messageNum = val.totalPage
          this.$store.commit('SET_WEBSOCKET_MSG_NUMBER', this.messageNum)
        }
      },
      deep: true
    },
    websocketObj: {
      handler: function(val, oldVal) {
        if (val && oldVal == null) {
          val.createWs()
        }
        if (val) {
          this.message = val.msg
          this.$store.commit('SET_WEBSOCKET_MSG', this.message)
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapState(['websocketObj', 'websocketMsgNumber', 'websocketMsg'])
  }
}
</script>

<style lang="less" scoped>
h2,
p {
  padding: 0;
  margin: 0;
}
.login_lay {
  width: 100%;
  height: 100%;
  background-image: url(../../assets/imgs/login/bg.png);
  background-size: 100% 100%;
  position: relative;
  perspective: 1000px;
  h2 {
    position: absolute;
    top: 26vh;
    left: 50%;
    transform: translate(-50%);
    font-size: 52px;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
    text-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
    white-space: nowrap;
    transition-property: all;
    transition-duration: 0.5s;
    &.small {
      left: 1%;
      top: 1vh;
      font-size: 24px;
      transform: translate(0);
      font-weight: normal;
    }
  }

  .dialog-type {
    overflow: auto;
    /deep/ .el-dialog {
      height: 600px;
      margin-top: 5vh !important;
      .el-dialog__body {
        padding-left: 10px;
        padding-right: 10px;
        height: 91%;
        overflow: auto;
        position: relative;
        .msg-table-body {
          height: 93%;
          width: 100%;
          overflow: auto;
        }
        .msg-table-page-number {
          border-top: 1px solid #e0e0e0;
          height: 5%;
          text-align: right;
          padding-top: 2px;
        }
        .read-all-msg-btn {
          position: absolute;
          bottom: 0;
          left: 10px;
          z-index: 100;
        }
      }
    }
  }
  .login_userInfo {
    position: absolute;
    color: #fff;
    right: -200px;
    top: 18px;
    font-size: 14px;
    transition-property: all;
    transition-duration: 0.5s;
    .messages {
      line-height: 30px;
      color: #ffffff;
      // margin-right: 42px;
      padding-right: 10px;
      font-size: 20px;
      margin-right: 20px;
    }
    .badge-items {
      position: absolute;
      top: -10px;
      left: 15px;
      /deep/.el-badge__content {
        height: 18px;
        width: 26px;
        padding: 0 2px;
        display: inline-block !important;
      }
    }
    .message-item {
      float: left;
      position: relative;
    }
    &.userInfo_show {
      right: 24px;
    }
    p {
      float: left;
      position: relative;
      &:first-child {
        padding-right: 60px;
        cursor: pointer;
        span {
          display: inline-block;
          position: absolute;
          line-height: 12px;
          padding: 5px;
          border-radius: 10px;
          background: #fe0000;
          color: #ffffff;
          left: 10px;
          top: -5px;
        }
      }
      i.el-icon-message-solid {
        font-size: 20px;
        margin-top: 5px;
      }
      i.iconfont {
        font-size: 24px;
        line-height: 20px;
        margin-right: 5px;
        transform: translateY(4px);
        display: inline-block;
      }
    }
  }
  .white_box {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 4px;
    box-shadow: 0 16px 4px 0 rgba(0, 0, 0, 0.1);
  }
  // 登录
  .login_warp {
    width: 100%;
    position: absolute;
    top: 40vh;
    transition-property: all;
    transition-duration: 0.5s;
    transform-origin: center bottom;
    &.login_hide1 {
      transform: rotateX(-90deg);
      opacity: 0;
    }
    .login_box {
      width: 752px;
      height: 88px;
      margin: 0 auto;
      position: relative;
      perspective: 500px;
      padding: 28px 24px;
      box-sizing: border-box;
      &:before {
        content: '';
        position: absolute;
        width: 99%;
        height: 30px;
        background: rgba(226, 234, 245, 1);
        opacity: 0.6;
        left: 0.5%;
        top: -30px;
        transform-origin: center bottom;
        transform: rotateX(70deg);
      }
      /deep/.el-input {
        width: 230px;
        margin-right: 5px;
        span.el-input__prefix {
          color: #1273eb;
          line-height: 30px;
          padding-left: 10px;
        }
        input.el-input__inner {
          padding-left: 40px;
        }
      }
      /deep/label.el-checkbox {
        .el-checkbox__input {
          .el-checkbox__inner {
            width: 20px;
            height: 20px;
            &:after {
              left: 5px;
              height: 12px;
              width: 6px;
            }
          }
        }
      }
      /deep/.el-button {
        margin-left: 12px;
        width: 120px;
        border-color: transparent;
        background-color: rgba(18, 115, 235, 1);
        box-shadow: 0px 1px 0px 0px rgba(0, 99, 221, 1), 0px -1px 0px 0px rgba(36, 127, 239, 1);
        &.is-loading {
          border: none;
        }
        .el-icon-loading {
          line-height: 0;
        }
      }
    }
  }
  // 选择人员
  .role_selection_warp {
    width: 100%;
    position: absolute;
    top: 26vh;
    transition-property: all;
    transition-duration: 0.5s;
    transform: rotateX(90deg);
    transform-origin: center 20%;
    opacity: 0;
    &.role_show1 {
      transform: rotateX(0);
      opacity: 1;
    }
    &.role_hide2 {
      transform: rotateX(-90deg);
      opacity: 0;
    }
    .role_box {
      width: 790px;
      height: 298px;
      margin: 0 auto;
      position: relative;
      perspective: 800px;
      box-sizing: border-box;
      &:before {
        content: '';
        position: absolute;
        width: 99%;
        height: 50px;
        background: rgba(226, 234, 245, 1);
        opacity: 0.6;
        left: 0.5%;
        top: -50px;
        transform-origin: center bottom;
        transform: rotateX(70deg);
      }
      .back_btn {
        cursor: pointer;
        position: absolute;
        left: 12px;
        top: 12px;
        background-color: #1273eb;
        width: 104px;
        height: 28px;
        line-height: 28px;
        box-shadow: 0px 5px 8px #6caeff;
        border-radius: 14px;
        color: white;
        text-align: center;
        &:hover {
          background-color: #2284fe;
        }
        > img {
          vertical-align: middle;
          margin-right: 6px;
        }
      }
      h3 {
        width: 80px;
        height: 35px;
        line-height: 35px;
        color: #222;
        font-weight: bold;
        font-size: 18px;
        position: relative;
        margin: 0 auto;
        text-align: center;
        &:after {
          content: '';
          background-color: #1273eb;
          height: 4px;
          width: 24px;
          position: absolute;
          left: 50%;
          top: 35px;
          transform: translate(-50%);
        }
      }
      .person {
        position: absolute;
        top: 40px;
        width: 220px;
        height: 240px;
        border-radius: 4px;
        text-align: center;
        padding-top: 20px;
        box-sizing: border-box;
        cursor: pointer;
        background-image: url(../../assets/imgs/login/round.png);
        background-size: 112px 98px;
        background-position: center 100px;
        background-repeat: no-repeat;
        > img {
          width: 140px;
          height: 144px;
        }
        > p {
          padding-top: 36px;
          font-size: 16px;
          font-weight: 500;
        }
        &:hover {
          background-color: #fff;
          > img {
            transform: scale(1.1) translateY(-10px);
          }
          > p {
            transform: scale(1.1);
            font-weight: bold;
          }
        }
        &.person1 {
          left: 120px;
        }
        &.person2 {
          right: 120px;
        }
      }
    }
  }

  // 执法端
  .work_warp {
    width: 100%;
    position: absolute;
    top: 23vh;
    transition-property: all;
    transition-duration: 0.5s;
    transform: rotateX(90deg);
    transform-origin: center 20%;
    opacity: 0;
    &.work_show21 {
      transform: rotateX(0);
      opacity: 1;
    }
    .work_box {
      width: 790px;
      height: 288px;
      margin: 0 auto;
      perspective: 800px;
      box-sizing: border-box;
      &:before {
        content: '';
        position: absolute;
        width: 99%;
        height: 50px;
        background: rgba(226, 234, 245, 1);
        opacity: 0.6;
        left: 0.5%;
        top: -50px;
        transform-origin: center bottom;
        transform: rotateX(70deg);
      }
      .back_btn {
        cursor: pointer;
        position: absolute;
        left: 12px;
        top: 12px;
        background-color: #1273eb;
        width: 104px;
        height: 28px;
        line-height: 28px;
        box-shadow: 0px 5px 8px #6caeff;
        border-radius: 14px;
        color: white;
        text-align: center;
        &:hover {
          background-color: #2284fe;
        }
        > img {
          vertical-align: middle;
          margin-right: 6px;
        }
      }
      h3 {
        width: 80px;
        height: 35px;
        line-height: 35px;
        color: #222;
        font-weight: bold;
        font-size: 18px;
        position: relative;
        margin: 0 auto;
        text-align: center;
        &:after {
          content: '';
          background-color: #1273eb;
          height: 4px;
          width: 24px;
          position: absolute;
          left: 50%;
          top: 35px;
          transform: translate(-50%);
        }
      }
      .work_btns {
        display: flex;
        justify-content: space-between;
        padding: 47px 250px 0;
      }
    }
  }

  // 管理端
  .admin_warp {
    width: 100%;
    position: absolute;
    top: 23vh;
    transition-property: all;
    transition-duration: 0.5s;
    transform: rotateX(90deg);
    transform-origin: center 20%;
    opacity: 0;
    &.admin_show22 {
      transform: rotateX(0);
      opacity: 1;
    }
    .admin_box {
      width: 790px;
      height: 368px;
      margin: 0 auto;
      perspective: 800px;
      box-sizing: border-box;
      &:before {
        content: '';
        position: absolute;
        width: 99%;
        height: 50px;
        background: rgba(226, 234, 245, 1);
        opacity: 0.6;
        left: 0.5%;
        top: -50px;
        transform-origin: center bottom;
        transform: rotateX(70deg);
      }
      .back_btn {
        cursor: pointer;
        position: absolute;
        left: 12px;
        top: 12px;
        background-color: #1273eb;
        width: 104px;
        height: 28px;
        line-height: 28px;
        box-shadow: 0px 5px 8px #6caeff;
        border-radius: 14px;
        color: white;
        text-align: center;
        &:hover {
          background-color: #2284fe;
        }
        > img {
          vertical-align: middle;
          margin-right: 6px;
        }
      }
      h3 {
        width: 80px;
        height: 35px;
        line-height: 35px;
        color: #222;
        font-weight: bold;
        font-size: 18px;
        position: relative;
        margin: 0 auto;
        text-align: center;
        &:after {
          content: '';
          background-color: #1273eb;
          height: 4px;
          width: 24px;
          position: absolute;
          left: 50%;
          top: 35px;
          transform: translate(-50%);
        }
      }
      .admin_btns {
        text-align: center;
        padding-top: 16px;
        .icon_box {
          display: inline-block;
          margin: 15px 35px;
        }
        // 信融啊，你切的图要是一般高就好了呀
        .icon_box:nth-child(2) {
          img {
            margin-bottom: 3px;
          }
        }
        .icon_box:nth-child(3) {
          img {
            margin-bottom: 14px;
          }
        }
        .icon_box:nth-child(5) {
          img {
            margin-bottom: 10px;
          }
        }
        .icon_box:nth-child(8) {
          img {
            margin-bottom: 4px;
          }
        }
        .icon_box:nth-child(9) {
          img {
            margin-bottom: 5px;
          }
        }
      }
    }
  }
  // 置灰
  .grey {
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    filter: grey;
    filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
  }
  // 选择入口图标集
  .icon_box {
    width: 84px;
    height: 115px;
    padding-top: 8px;
    box-sizing: border-box;
    background-image: url(../../assets/imgs/login/box.png);
    background-size: 84px 84px;
    background-repeat: no-repeat;
    text-align: center;
    cursor: pointer;
    transition-duration: 0.4s;
    &:hover {
      transform: scale(1.1);
      img {
        transform: translateY(-8px);
      }
      p {
        transform: translateY(-5px) scale(1.2);
      }
    }
    img {
      transition-duration: 0.5s;
    }
    p {
      transition-duration: 0.5s;
      font-size: 16px;
      font-weight: 500;
      color: rgba(34, 34, 34, 1);
      padding-top: 10px;
    }
  }
  // 光晕
  .halo {
    z-index: -1;
    width: 80vw;
    height: 16vw;
    background-image: url(../../assets/imgs/login/halo.png);
    background-size: 100% 100%;
    position: absolute;
    left: 10vw;
    top: 40vh;
    transform-origin: 40% center;
    transition-delay: 1s;
    animation: halohuang 15s infinite;
  }
  // 小星星们
  .dots {
    z-index: -1;
    width: 73.64vw;
    height: 10vh;
    background-image: url(../../assets/imgs/login/dots.png);
    background-size: 100% 100%;
    position: absolute;
    left: 17.3vw;
    bottom: 15vh;
    animation: dotsshan 3s infinite;
  }
  // 上天
  .line {
    position: absolute;
    width: 18px;
    z-index: -1;
    background-size: 100% 100%;
    top: 100vh;
    animation: linefei 2s infinite;
  }
  .line1 {
    height: 159px;
    background-image: url(../../assets/imgs/login/line1.png);
    left: 10vw;
    animation-delay: 1s;
  }
  .line2 {
    height: 109px;
    background-image: url(../../assets/imgs/login/line2.png);
    left: 34vw;
    animation-delay: 1.2s;
  }
  .line3 {
    height: 159px;
    background-image: url(../../assets/imgs/login/line1.png);
    right: 12vw;
    animation-delay: 0.4s;
  }
  .line4 {
    height: 109px;
    background-image: url(../../assets/imgs/login/line2.png);
    right: 42vw;
    animation-delay: 2s;
  }
  p.copy_right {
    font-size: 13px;
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 35px;
    position: fixed;
    left: 50%;
    bottom: 0;
    transform: translate(-50%);
  }
  p.first_user_msg {
    font-size: 14px;
    font-weight: bold;
    color: #fff;
    line-height: 35px;
    position: fixed;
    left: 15px;
    top: 0;
  }
}
.tooltip-content {
  display: flex;
  flex-direction: column;
  max-width: 90vw;
  .first-child {
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e0e0e0;
  }
  .text {
    display: inline-block;
    margin-left: 5px;
    line-height: 20px;
    font-size: 14px;
    color: #333333;
    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }
  .el-icon-lock {
    color: #9dadbd;
  }
  .el-icon-top {
    color: #9dadbd;
  }
  .el-icon-switch-button {
    color: #9dadbd;
  }
  .msg-button {
    // width: 100px;
    display: inline-block;
    width: 70px;
    height: 20px;
    border-radius: 5px;
    line-height: 20px;
    text-align: center;
    border: 1px solid #999999;
    margin: auto;
    margin-top: 10px;
    &:hover {
      cursor: pointer;
    }
  }
}

@keyframes halohuang {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(30deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
@keyframes dotsshan {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.1;
  }
  100% {
    opacity: 1;
  }
}
@keyframes linefei {
  0% {
    top: 100vh;
  }
  100% {
    top: -20vh;
  }
}
</style>
