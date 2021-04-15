<template>
  <div class="login-wrap">
    <div class="bac"></div>
    <div class="login">
      <div class="login-bac"></div>
      <div class="demo-ruleForm">
        <div class="login-icon" v-show="!isSuccessLogin">
          <span class="login-icon-text big">江苏省安全生产行政执法</span>
          <span class="login-icon-text small">管理系统</span>
        </div>
        <div class="login-input" v-show="!isSuccessLogin">
          <div class="login-input-title">
            用户登录
            <div class="bule_xian"></div>
          </div>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
            <el-form-item prop="username" :show-message="false">
              <el-input v-model="ruleForm.username" clearable>
                <i class="el-icon-s-custom" slot="prefix"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="password" :show-message="false">
              <el-input
                type="password"
                v-model="ruleForm.password"
                clearable
                @keyup.enter.native="submitForm('ruleForm')"
              >
                <i class="el-icon-lock" slot="prefix"></i>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-checkbox>记住密码</el-checkbox>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-show="isSuccessLogin" class="choose-role">
          <span class="el-icon-arrow-left back font-color" @click="back">返回</span>
          <div class="title font-color">
            {{ !isCommon && !isManager ? "选择角色" : null }}
            {{ isCommon && !isManager ? "执法端" : null }}
            {{ !isCommon && isManager ? "管理端" : null}}
            <div class="xian"></div>
          </div>
          <div class="choose-content" v-show="!isCommon && !isManager">
            <div
              class="choose-content-manage bac-img choose-box-size is-choose"
              @click="makeChoice('admin')"
            >
              <div class="font-color content-name">管理端</div>
            </div>
            <div
              class="choose-content-common bac-img choose-box-size is-choose"
              @click="makeChoice('common')"
            >
              <div class="font-color content-name">执法端</div>
            </div>
          </div>
          <div class="choose-content" v-show="isCommon && !isManager">
            <div
              class="choose-content-check bac-img choose-box-size is-choose"
              @click="makeChoice('common')"
            >
              <div class="font-color content-sub-name">执法检查</div>
            </div>
            <div
              class="choose-content-punish bac-img choose-box-size is-choose"
              @click="makeChoice('common')"
            >
              <div class="font-color content-sub-name">行政处罚</div>
            </div>
          </div>
          <div class="choose-content special-1" v-show="!isCommon && isManager">
            <div
              class="choose-content-audit bac-img choose-box-size is-choose"
              @click="makeChoice('admin', '审核审批')"
            >
              <div class="font-color content-sub-name">审核审批</div>
            </div>
            <div
              class="choose-content-lawaudit bac-img choose-box-size is-choose"
              @click="makeChoice('admin', '法制审核')"
            >
              <div class="font-color content-sub-name">法制审核</div>
            </div>
            <div
              class="choose-content-group bac-img choose-box-size is-choose"
              @click="makeChoice('admin', '集体讨论')"
            >
              <div class="font-color content-sub-name">集体讨论</div>
            </div>
            <div
              class="choose-content-listen bac-img choose-box-size is-choose"
              @click="makeChoice('admin', '组织听证')"
            >
              <div class="font-color content-sub-name">组织听证</div>
            </div>
          </div>
          <div class="choose-content special-2" v-show="!isCommon && isManager">
            <div
              class="choose-content-knowledge bac-img choose-box-size is-choose"
              @click="makeChoice('admin', '执法知识库')"
            >
              <div class="font-color content-sub-name">执法知识库</div>
            </div>
            <div
              class="choose-content-company bac-img choose-box-size is-choose"
              @click="makeChoice('admin', '企业信息')"
            >
              <div class="font-color content-sub-name">企业信息</div>
            </div>
            <div
              class="choose-content-judge bac-img choose-box-size is-choose"
              @click="makeChoice('admin', '分析研判')"
            >
              <div class="font-color content-sub-name">分析研判</div>
            </div>
            <div
              class="choose-content-system bac-img choose-box-size is-choose"
              @click="makeChoice('admin', '系统管理')"
            >
              <div class="font-color content-sub-name">系统管理</div>
            </div>
          </div>
        </div>
        <div></div>
      </div>
      <div class="login-bac"></div>
    </div>
    <div class="bac">
      <div class="copyright">CopyRight @2018 STATE ADMINISTRATION OF WORK SAFETY ALL Rights Reserved</div>
    </div>
  </div>
</template>
<script>
import {
  login,
  ajsyssysmenulist,
  logoutSystem,
  getWritTypeInfo
} from "@/api/login/login";
import { mapState } from "vuex";
import { commomRoutes, adminAuditRoutes } from "@/router/index";
import security from "@/utils/security.js"
export default {
  data() {
    return {
      ruleForm: {
        username: "", // 账号
        password: "" // 密码
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入账号",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      },
      isManager: false,
      isCommon: false,
      isSuccessLogin: false,
      projectTreeList: null
    };
  },
  methods: {
    // 登录
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.login();
        } else {
          // console.log("error submit!!");
          return false;
        }
      });
    },
    // 登录验证
    login() {
      security();
      const Modulus =
        "b19fc22fbac53ab403ef51d1bfa74cfc16c11078b97f99905b8d1b8a0035178f2f1169b5ff9e9a65d696eb42811534ff721c9a0f72e57b6a3fb5b2265aef506ddfc65a31ce170f86741aa350cb66480c59b46e2832815654edb083ea8039f89d5a7c60ef26796518ca5f5e491a5b274b4ed7fbff69a324b7d06e37af93de2de1";
      const private_exponent = "10001";
      RSAUtils.setMaxDigits(200);
      let key = new RSAUtils.getKeyPair(private_exponent, "", Modulus);
      console.info(key);
      var reversedPwd = this.ruleForm.password
        .split("")
        .reverse()
        .join("");
      console.info(reversedPwd);
      let encrypedPwd = RSAUtils.encryptedString(key, reversedPwd);
      console.info(this.ruleForm.password, encrypedPwd);
      let req = {
        username: this.ruleForm.username, // 账号
        encryptPassword: encrypedPwd // 密码
      };
      login(req)
        .then(res => {
          if (res.code === "0") {
            this.isSuccessLogin = true;
            getWritTypeInfo().then(
              res => {
                sessionStorage.setItem(
                  "writTypeInfo",
                  JSON.stringify(res.data)
                );
                sessionStorage.setItem(
                  "originVuexInfo",
                  JSON.stringify(this.$store.state)
                );
              },
              err => {
                sessionStorage.setItem(
                  "originVuexInfo",
                  JSON.stringify(this.$store.state)
                );
              }
            );
          }
        })
        .catch(err => {
          this.$message({
            message: err && err !== "" ? err : "账号/密码不正确",
            type: "error"
          });
        });
    },
    // 返回
    back() {
      if (this.isSuccessLogin) {
        if (this.isManager && !this.isCommon) {
          this.isManager = false;
          return;
        }
        if (this.isCommon && !this.isManager) {
          this.isCommon = false;
          return;
        }
        if (!this.isCommon && !this.isManager) {
          logoutSystem().then(
            res => {
              this.$resetVuex(
                JSON.parse(sessionStorage.getItem("originVuexInfo")),
                this.$store.state
              );
              localStorage.clear();
              sessionStorage.clear();
              this.isSuccessLogin = false;
            },
            err => {
              this.$resetVuex(
                JSON.parse(sessionStorage.getItem("originVuexInfo")),
                this.$store.state
              );
              localStorage.clear();
              sessionStorage.clear();
              this.isSuccessLogin = false;
            }
          );
        }
      }
    },
    // 选择进入的模块
    makeChoice(val, name) {
      console.log(val, name);
      this.projectTreeList = JSON.parse(sessionStorage.getItem("treeList"));
      if (!this.isPermision()) {
        this.noPermisionTips();
        return;
      }
      if (val === "common") {
        if (this.isCommon) {
          this.$router.push("/content");
          sessionStorage.setItem("role_permision", `common,${name}`);
        } else {
          if (!this.isPermision({ id: "zfd001" })) {
            this.noPermisionTips();
            return;
          }
          this.isCommon = true;
          this.isManager = false;
        }
      } else if (val === "admin") {
        if (this.isManager) {
          if (!this.isPermision({ id: "gld001", name })) {
            this.noPermisionTips();
            return;
          }
          // this.$router.push("/adminWork")
          let treeList = JSON.parse(sessionStorage.getItem("treeList"));
          let adminPart = null;
          treeList.some((item, index) => {
            adminPart = item;
            return item.title === "管理端";
          });
          console.log(adminPart);
          let path = "";
          if (
            adminPart &&
            adminPart.children &&
            adminPart.children.length > 0
          ) {
            adminPart.children.some((item, index) => {
              path =
                item.children && item.children.length > 0
                  ? `/${item.children[0].url}`
                  : `/${item.url}`;
              return item.title === name;
            });
          }
          this.$router.push(path);
          console.info("path===>",path)
          // switch (name) {
          //   case "系统管理":
          //     // path = 4
          //     this.$router.push("/adminiManagement");
          //     break;
          //   case "分析研判":
          //     this.$router.push("/login");
          //     break;
          //   case "企业信息":
          //     this.$router.push("/enterpriseInfo");
          //     break;
          //   case "执法知识库":
          //     this.$router.push("/discretionaryContent");
          //     break;
          //   case "组织听证":
          //     this.$router.push("/penatlyHear");
          //     break;
          //   case "集体讨论":
          //     this.$router.push("/groupDiscussion");
          //     break;
          //   case "审核审批":
          //     this.$router.push("/todoTask");
          //     break;
          // }
          sessionStorage.setItem("role_permision", `admin,${name}`);
        } else {
          if (!this.isPermision({ id: "gld001" })) {
            this.noPermisionTips();
            return;
          }
          this.isManager = true;
          this.isCommon = false;
        }
      }
    },
    // 没有权限的提示
    noPermisionTips() {
      this.$message({
        type: "error",
        message: "没有权限"
      });
    },
    // 判断是否有进入的权限
    isPermision(params) {
      if (this.projectTreeList.length === 0) {
        return false;
      }
      if (!params) return true;
      let index = -1;
      let result = this.projectTreeList.some((item, i) => {
        index = i;
        return item.id === params.id;
      });
      if (result) {
        if (!params.name) return true;
        let childResult = this.projectTreeList[index].children.some(item => {
          return item.title === params.name;
        });
        return childResult;
      } else {
        return result;
      }
    },
    async getRouterList() {
      const res = await ajsyssysmenulist({
        isPaging: "false",
        limit: "10",
        name: "菜单管理",
        page: "1"
      });
      console.log(res, "452796");
      // this.$router.push('/');
    }
  },
  created() {
    let token = localStorage.getItem("token");
    let flag = sessionStorage.getItem("token");
    if (token && flag) {
      this.isSuccessLogin = true;
    }
  }
};
</script>
<style lang="less" scope>
.login-wrap {
  width: 100%;
  height: 100%;
  background: url("../../assets/imgs/img_above_bg.png") no-repeat;
  background-size: 100% 100%;
  min-height: 575px;
}
.bac {
  height: 30%;
  width: 100%;
  background: rgba(13, 35, 114, 0.7);
}
.login {
  display: flex;
  flex-direction: row;
  height: 40%;
  min-height: 300px;
  /deep/.login-bac {
    width: 17.5%;
    background: rgba(13, 35, 114, 0.7);
  }
  .demo-ruleForm {
    display: flex;
    flex-direction: row;
    width: 65%;
    min-height: 300px;
    box-shadow: 0px 0px 43px 0px rgba(7, 23, 71, 1);
    .login-input {
      width: 40%;
      height: 100%;
      background-color: #ffffff;
      .login-input-title {
        font-size: 26px;
        line-height: 14px;
        color: #333333;
        text-align: center;
        padding-top: 12%;
        margin-bottom: 35px;
      }
      .el-form {
        /deep/.el-form-item {
          padding: 0 12%;
          margin-bottom: 0;
          /deep/ .el-button {
            width: 100%;
          }
        }
      }
    }
    .login-icon {
      width: 60%;
      height: 100%;
      background: url("../../assets/imgs/login_logo.png") no-repeat;
      background-size: 80px 80px;
      background-position: 7% 7%;
      .login-icon-text {
        display: block;
        color: #ffffff;
        margin-top: 110px;
        margin-left: 7%;
      }
      .big {
        font-size: 32px;
      }
      .small {
        margin-top: 5px;
        font-size: 24px;
      }
    }
  }
}

.choose-role {
  width: 100%;
  position: relative;
  .font-color {
    color: #ffffff;
  }
  .title {
    width: 100%;
    text-align: center;
    font-size: 18px;
    line-height: 39px;
  }
  .back {
    position: absolute;
    left: 18px;
    top: 16px;
    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }
  .choose-content {
    display: flex;
    flex-direction: row;
    padding-top: 40px;
    justify-content: space-around;
    .choose-content-common {
      background: url("~@/assets/imgs/矢量智能对象.png") no-repeat top -25% left
        50%;
    }
    .choose-content-manage {
      background: url("~@/assets/imgs/manage.png") no-repeat top -25% left 50%;
    }
    .choose-content-check {
      background: url("~@/assets/imgs/lawCheck.png") no-repeat top 20% left 50%;
    }
    .choose-content-punish {
      background: url("~@/assets/imgs/punish.png") no-repeat top 20% left 50%;
    }
    .choose-content-audit {
      background: url("~@/assets/imgs/audit.png") no-repeat top 20% left 50%;
    }
    .choose-content-lawaudit {
      background: url("~@/assets/imgs/lawaudit.png") no-repeat top 20% left 50%;
    }
    .choose-content-group {
      background: url("~@/assets/imgs/group.png") no-repeat top 20% left 50%;
    }
    .choose-content-listen {
      background: url("~@/assets/imgs/listen.png") no-repeat top 20% left 50%;
    }
    .choose-content-knowledge {
      background: url("~@/assets/imgs/knowledge.png") no-repeat top 20% left 50%;
    }
    .choose-content-company {
      background: url("~@/assets/imgs/company.png") no-repeat top 20% left 50%;
    }
    .choose-content-judge {
      background: url("~@/assets/imgs/judge.png") no-repeat top 20% left 50%;
    }
    .choose-content-system {
      background: url("~@/assets/imgs/system.png") no-repeat top 20% left 50%;
    }
  }
  .special-1 {
    padding-top: 10px;
  }
  .special-2 {
    padding-top: 5px;
  }
  .bac-img {
    background-size: 50% 50%;
  }
  .choose-box-size {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: 180px;
    height: 115px;
  }
  .is-choose {
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
  .content-name {
    text-align: center;
    margin-top: 10px;
  }
  .content-sub-name {
    text-align: center;
    // padding-bottom: 30px;
  }
}
.copyright {
  text-align: center;
  font-family: PingFang SC;
  font-weight: 500;
  padding-top: 110px;
  font-size: 12px;
  color: rgba(255, 255, 255, 1);
  opacity: 0.5;
}
.xian {
  width: 24px;
  height: 4px;
  background: rgba(148, 178, 255, 1);
  margin: 0 auto;
}
.bule_xian {
  width: 102px;
  height: 6px;
  background: rgba(148, 178, 255, 1);
  margin: 0 auto;
}

</style>
