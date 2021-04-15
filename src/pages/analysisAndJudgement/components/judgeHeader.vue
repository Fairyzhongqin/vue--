<template>
  <div>
    <div class="judgeHeaderInner">
      <!-- logo -->
      <div class="innerMiddle">
        <div class="logoWrap">
          <h2 class="title">
            <p>江苏省安全生产行政执法系统{{config.cityName}}</p>
          </h2>
        </div>
      </div>
      <!-- 功能 -->
      <div class="innerRight">
        <!-- start -->
        <p class="user-type">管理端</p>
        <div class="info-tab">
          <el-tooltip class="item" effect="light" placement="bottom" popper-class="popper-style">
            <div class="message">
              <el-badge :value="websocketMsgNumber" class="badge-item" :max="999"></el-badge>
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
        </div>
        <div class="user-tab">
          <el-tooltip class="item" effect="light" placement="bottom" popper-class="popper-style">
            <div class="user-info">
              <i class="iconfont iconguanliyuan"></i>
              {{userName}}
            </div>
            <div slot="content">
              <div class="tooltip-content">
                <div class="el-icon-lock first-child" @click="isUpdatePwd=true">
                  <span class="text">修改密码</span>
                </div>
                <div class="el-icon-edit-outline first-child" @click="improveShow=true">
                  <span class="text">完善信息</span>
                </div>
                <div class="el-icon-top first-child" @click="backToChoose">
                  <span class="text">返回上一级</span>
                </div>
                <div class="el-icon-switch-button" @click="quitSystem">
                  <span class="text">退出系统</span>
                </div>
              </div>
            </div>
          </el-tooltip>
        </div>
        <update-psw :isUpdatePwd="isUpdatePwd" @close="isUpdatePwd=false"></update-psw>
        <el-dialog
          title="消息列表"
          width="800px"
          height="500px"
          class="dialog-type"
          :visible.sync="msgDialog"
          :close-on-click-modal="false"
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
        <improve-personal v-if="improveShow" @cancel="improveShow=false"></improve-personal>
        <!-- end -->
      </div>
    </div>
  </div>
</template>

<script>
import { login, updatePassword, logoutSystem, checkPwd } from '@/api/login/login'
import { readMsg, getNotReadMsg, readAllMsg } from '@/api/common'
import { mapState } from 'vuex'
import websocket from '@/utils/websocket'
import updatePsw from '@/pages/home/components/updatePsw'
import improvePersonal from '@/components/ImprovePersonal'
import config from '@/utils/deployConfig'
export default {
  name: 'judgeHeader',
  components: {
    improvePersonal,
    updatePsw
  },
  data() {
    return {
      config,
      userName: '', //登录者
      userType: '', //
      userInfo: null, //登录信息
      type: '', //执法 还是管理
      isUpdatePwd: false, //修改密码弹窗
      improveShow: false, //完善信息弹窗
      msgDialog: false, //消息列表弹窗
      isOriginPwd: true, // 校验原密码
      msgList: [], //消息列表数据
      msgCurrPage: '', //消息页码
      msgTotalCount: '', //消息总数
      msgDialog: false //消息弹窗
    }
  },
  methods: {
    // 返回选择页面
    backToChoose() {
      sessionStorage.setItem('role_permision', '')
      this.$router.push('/login')
    },
    // 退出系统
    quitSystem() {
      try {
        this.websocketObj.closeWs()
      } catch (err) {
        console.log(err)
      }
      logoutSystem()
        .then(res => {
          this.$resetVuex(JSON.parse(sessionStorage.getItem('originVuexInfo')), this.$store.state)
          localStorage.clear()
          sessionStorage.clear()
          this.$store.commit('DESTROY_WEBSOCKET')
          this.$router.push('/login')
        })
        .catch(err => {
          this.$resetVuex(JSON.parse(sessionStorage.getItem('originVuexInfo')), this.$store.state)
          localStorage.clear()
          sessionStorage.clear()
          this.$store.commit('DESTROY_WEBSOCKET')
          this.$router.push('/login')
        })
    },
    // 一键已读
    readAllMessage() {
      readAllMsg().then(() => {
        this.showMoreMsg()
      })
    },
    // 查看消息
    seeDetail(item) {
      console.log(item)
      readMsg({ msgId: item.id }).then(res => {
        console.log(res, '0000000000')
        this.showMoreMsg()
      })
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
    // 下一页的时候
    queryMsgForPage(val) {
      this.msgCurrPage = val
      this.showMoreMsg()
    }
  },
  created() {
    this.type = sessionStorage.getItem('role_permision').split(',')[0]
  },
  mounted() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo')).userEntity
    this.userName = this.userInfo.nickName
  },
  computed: {
    ...mapState(['websocketObj', 'websocketMsgNumber', 'websocketMsg'])
  }
}
</script>

<style lang="less" scoped>
.judgeHeaderInner {
  * {
    padding: 0;
    margin: 0;
  }
  width: 100%;
  height: 49px;
  background: #1e2d41;
  position: relative;
  .innerMiddle {
    width: 60%;
    background-image: url('~@/assets/imgs/aotu.png');
    background-position: center;
    margin: 0 auto;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    .logoWrap {
      width: 60%;
      margin: 0 auto;
      box-sizing: border-box;
      text-align: center;
      h2.title {
        font-family: PingFang SC;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        vertical-align: middle;
        padding-left: 50px;
        p {
          position: relative;
          line-height: 49px;
          font-size: 24px;
          display: inline;
          &:before {
            content: '';
            position: absolute;
            width: 40px;
            height: 40px;
            left: -50px;
            top: -4px;
            background: url(../../../assets/imgs/aj_logo.png);
            background-size: 100% 100%;
          }
        }
        i img {
          width: 40px;
          height: 40px;
          margin-right: 5px;
          vertical-align: middle;
        }
      }
    }
  }
  .innerRight {
    color: #fff;
    display: flex;
    position: absolute;
    right: 40px;
    top: 0;
    .user-type {
      line-height: 60px;
      color: #ffffff;
      margin-right: 10px;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
    }
    .info-tab {
      display: flex;
      flex-direction: row;
      &:hover {
        // background-color: #0161cd;
        background: linear-gradient(#0161cd, #0161cd) left top, linear-gradient(#0161cd, #0161cd) left top, linear-gradient(#0161cd, #0161cd) right top,
          linear-gradient(#0161cd, #0161cd) right top, linear-gradient(#0161cd, #0161cd) left bottom, linear-gradient(#0161cd, #0161cd) left bottom,
          linear-gradient(#0161cd, #0161cd) right bottom, linear-gradient(#0161cd, #0161cd) right bottom;
        background-repeat: no-repeat;
        background-size: 20px 4px, 4px 20px;
      }
      .item {
        margin-top: 10px;
        margin-right: 10px;
      }
      .message {
        line-height: 42px;
        color: #ffffff;
        // margin-right: 42px;
        padding-right: 40px;
        font-size: 20px;
        .badge-item {
          position: relative;
          top: -10px;
          left: 45px;
        }
      }
    }
    .user-tab {
      min-width: 119px;
      height: 100%;
      // background-color: #0161cd;
      &:hover {
        // #00faff 天蓝色
        // background-color: #0161cd;
        background: linear-gradient(#0161cd, #0161cd) left top, linear-gradient(#0161cd, #0161cd) left top, linear-gradient(#0161cd, #0161cd) right top,
          linear-gradient(#0161cd, #0161cd) right top, linear-gradient(#0161cd, #0161cd) left bottom, linear-gradient(#0161cd, #0161cd) left bottom,
          linear-gradient(#0161cd, #0161cd) right bottom, linear-gradient(#0161cd, #0161cd) right bottom;
        background-repeat: no-repeat;
        background-size: 20px 4px, 4px 20px;
      }
      .user-info {
        margin-left: 15px;
        color: #fff;
        line-height: 60px;
        text-align: center;
        .el-icon-user-solid {
          line-height: 62px;
          font-size: 14px;
        }
      }
    }
  }
}
// tooltip
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
}
// msg btn
.msg-button {
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
.dialog-type {
  overflow: auto;
  /deep/ .el-dialog {
    height: 600px;
    margin-top: 5vh !important;
    .el-dialog__body {
      padding-left: 10px;
      padding-right: 10px;
      height: 87%;
      position: relative;
      .msg-table-body {
        height: 94%;
        width: 100%;
        overflow: auto;
      }
      .msg-table-page-number {
        border-top: 1px solid #e0e0e0;
        height: 5%;
        text-align: right;
        padding-top: 20px;
      }
      .read-all-msg-btn {
        position: absolute;
        bottom: -20px;
        left: 10px;
        z-index: 100;
      }
    }
  }
}
</style>
