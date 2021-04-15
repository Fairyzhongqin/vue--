<template>
  <div class="header-container">
    <div>
      <img src="@assets/imgs/aj_logo.png" />
      <div class="title">江苏省安全生产行政执法系统{{config.cityName}}</div>
    </div>
    <div class="space"></div>
    <p class="user-type">{{type === 'common' ? '执法端' : '管理端'}}</p>
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
  </div>
</template>

<script>
import { login, updatePassword, logoutSystem, checkPwd } from '@/api/login/login'
import { readMsg, getNotReadMsg, readAllMsg } from '@/api/common'
import { mapState } from 'vuex'
import websocket from '@/utils/websocket'
// import myWebsocket from "@/utils/myWebsocket";
import updatePsw from '@/pages/home/components/updatePsw'
import improvePersonal from '@/components/ImprovePersonal'
import config from '@/utils/deployConfig'
export default {
  name: 'HomeHeader',
  components: {
    updatePsw,
    improvePersonal
  },
  data() {
    return {
      config,
      userType: '',
      userName: '',
      isUpdatePwd: false,
      socket: null,
      userInfo: null,
      messageNum: 0,
      msgDialog: false,
      currPage: 1,
      type: null,
      isOriginPwd: true, // 校验原密码
      msgCurrPage: '1',
      msgTotalCount: '0',
      msgList: [],
      message: null,
      improveShow: false
    }
  },
  methods: {
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
    // 返回选择页面
    backToChoose() {
      // this.$resetVuex(
      //   JSON.parse(sessionStorage.getItem("originVuexInfo")),
      //   this.$store.state
      // );
      sessionStorage.setItem('role_permision', '')
      this.$router.push('/login')
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
      // console.log(item)
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
    }
  },
  mounted() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo')).userEntity
    this.userName = this.userInfo.nickName
  },
  created() {
    this.type = sessionStorage.getItem('role_permision').split(',')[0]
    console.log('websocketMsgNumber', this.websocketMsgNumber)
  },
  watch: {
    message: {
      handler: function(val, oldVal) {
        if (val) {
          // this.messageNum = val.totalCount;
          console.log(val)
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
.header-container {
  width: 100%;
  height: 62px;
  background-color: #1273eb;
  display: flex;
  flex-direction: row;
  img {
    height: 40px;
    width: 40px;
    margin-top: 10px;
    margin-left: 13px;
  }
  .title {
    margin-left: 11px;
    font-size: 24px;
    color: #ffffff;
    line-height: 62px;
    font-weight: bold;
    float: right;
  }
  .space {
    flex-grow: 1;
  }
  .info-tab {
    display: flex;
    flex-direction: row;
    &:hover {
      background-color: #0161cd;
    }
    .message {
      line-height: 42px;
      color: #ffffff;
      // margin-right: 42px;
      padding-right: 40px;
      font-size: 20px;
    }
  }
  .user-tab {
    min-width: 119px;
    height: 62px;
    // background-color: #0161cd;
    &:hover {
      background-color: #0161cd;
    }
    .user-info {
      margin-left: 25px;
      color: #fff;
      line-height: 40px;
      text-align: center;
      .el-icon-user-solid {
        line-height: 62px;
        font-size: 14px;
      }
    }
  }
}
.user-type {
  line-height: 30px;
  color: #ffffff;
  margin-right: 10px;
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
}
.form-button {
  /deep/ .el-form-item__content {
    margin-left: 130px !important;
  }
}
.item {
  margin-top: 10px;
  margin-right: 10px;
}
.badge-item {
  position: relative;
  top: -10px;
  left: 45px;
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
