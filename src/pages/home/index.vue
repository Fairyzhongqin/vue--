<template>
  <div style="height:100%">
    <el-container style="height:100%">
      <el-header>
        <home-header></home-header>
      </el-header>
      <el-container style="calc(100% - 60px)">
        <transition name="collpase">
          <el-aside
            class="aside-container topnav_box"
            v-show="collStatus"
            style="width: 14%; height: calc(100vh - 60px); -ms-overflow-y: auto;background: #2e3d50;"
          >
            <slidebar></slidebar>
          </el-aside>
        </transition>
        <el-container class="tag" style="height:100%">
          <el-header class="tag-container">
            <tags-view @collChange="collChange"></tags-view>
          </el-header>
          <el-main class="main-container">
            <keep-alive :include="visitedViews">
              <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <!-- <router-view v-if="!$route.meta.keepAlive"></router-view> -->

            <!-- <div class="footer" :style="{bottom: inspectionWordButtonIsShow ? '70px' : '20px'}">Copyright © 2019 All Rights Reserved</div> -->
            <!-- <div class="footer-button"
                 v-if="inspectionWordButtonIsShow">
              <el-button>取消</el-button>
              <el-button>保存</el-button>
              <el-button>制作现场检查文书</el-button>
              <el-button>制作其他文书</el-button>
            </div>-->
            <work-area v-if="!$route.meta.keepAlive && !isAdmin"></work-area>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import HomeHeader from "./components/homeHeader";
import TagsView from "./components/tagsView";
import Slidebar from "./components/slidebar";
import workArea from "./components/workArea";

import { mapState } from "vuex";

export default {
  name: "home",
  components: {
    HomeHeader,
    TagsView,
    Slidebar,
    workArea
  },
  data: function() {
    return {
      url: require("@assets/imgs/aj_logo.png")
    };
  },
  computed: {
    ...mapState(["inspectionWordButtonIsShow", "collStatus"]),
    visitedViews() {
      let include = "";
      this.$store.state.visitedViews.map(res => {
        include =
          include + (include === "" ? "" : ",") + res.path.replace("/", "");
      });
      return include;
    },
    isAdmin() {
      return sessionStorage.getItem("role_permision").split(",")[0] === "admin";
    }
  },
  mounted: function() {
    this.initScroll();
  },
  watch: {
    '$route': {
      handler: function(n, o) {
        this.$store.commit('setsearchList', {})
        this.$store.commit('setCurrDiscreSearchInfo', {})
      },
      immediate: true
    }
  },
  methods: {
    getInfo: function() {
      const that = this;
      that.$http
        .get("/test")
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    collChange() {
      this.$store.commit("SET_COLL_STATUS");
    },
    // 监听页面滚动以实现流程小节点sticky效果
    initScroll() {
      let scrollDom = document.querySelector(".main-container");
      this.$store.commit('updScrollTop', 0)
      scrollDom.addEventListener('scroll', this.scrollPage)
    },
    scrollPage(event) {
      this.$store.commit('updScrollTop', event.target.scrollTop)
    }
  }
};
</script>

<style lang="less" scoped>
.topnav_box::-webkit-scrollbar    // 滚动条整体部分

 {
  width: 5px;
  height: 10px;

  background-color: #b5b1b1;
}
.topnav_box::-webkit-scrollbar-track       //scroll轨道背景
 {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: black;
}

.topnav_box::-webkit-scrollbar-thumb  //滚动条中能上下移动的小块
 {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #b5b1b1;
}
.tag-container {
  height: 52px !important;
  //box-shadow:0px 1px 0px 0px rgba(224,224,224,1);
}
.aside-container {
  padding-right: 1px;
  box-shadow: inset -1px 0px 0px 0px #0000001f;
  z-index: 2;
}
@media screen and (max-width: 1366px) {
  .aside-container {
    width: 220px !important;
  }
}
.el-main.main-container {
  width: 100%;
  height: calc(100vh - 112px);
  background-color: #ebeef6;
  position: relative;
  padding: 0;
  min-width: 1024px;
}
.footer {
  width: calc(100% - 40px);
  text-align: center;
  color: #bbbbbb;
  font-size: 14px;
  position: absolute;
  // bottom: 20px;
}

.footer-button {
  margin-top: 10px;
  position: fixed;
  bottom: 20px;
  left: 50%;
}

.collpase-enter-active {
  transition: all 0.3s ease;
  width: 220px;
}
.collpase-leave-active {
  transition: all 0.3s ease;
  width: 0;
}
.collpase-enter,
.collpase-leave-to {
  width: 0;
}

.tag {
  width: 86%;
}
</style>
