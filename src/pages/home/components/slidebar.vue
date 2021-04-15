
<template>

  <div class="slidebar "
       :native="false"
       wrapStyle=""
       wrapClass=""
       viewClass=""
       viewStyle=""
       noresize="false"
       tag="section">
    <el-menu router
             class="el-menu-vertical-demo"
             @select="handleSelect"
             @open="handleOpen"
             @close="handleClose"
             :collapse="isCollapse"
             :default-openeds="openIndex"
             active-text-color="#fff"
             :default-active="$route.path.replace('/','')">
      <!-- <el-scrollbar style='height:100%'> -->
      <template v-for="(item, index) in items">
        <template v-if="item.children">
          <el-submenu :index="item.url"
                      :key="item.url"
                      class="parent-menu">
            <template slot="title"
                      class="parent-title">
              <i :class="item.icon"
                 :style="{color:activeIndex == item.url ? '#0099FF':''}"></i>

              <span slot="title"
                    :class='activeIndex == item.url ? "active" :""'>{{item.title}}</span>
            </template>
            <template v-for="subItem in item.children">
              <el-submenu v-if="subItem.children"
                          :index="subItem.url"
                          :key="subItem.url"
                          class="child-menu">
                <span slot="title">{{subItem.title}}</span>
                <template v-for="treeItem in subItem.children">
                  <el-menu-item :index="treeItem.url" 
                                :key="treeItem.url">{{treeItem.title}}</el-menu-item>
                </template>
              </el-submenu>
              <el-menu-item v-else
                            :index="subItem.url"
                            :key="subItem.url">{{subItem.title}}</el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.url"
                        class="only-menu"
                        :key="item.url">
            <i :class="item.icon"></i>
            <span slot="title">{{item.title}}</span>
          </el-menu-item>
        </template>
        <span :key='index'
              v-show="openIndex.indexOf(item.index) >= 0 && lineshow"
              class='lineSlider'></span>
      </template>

      <!-- </el-scrollbar> -->
    </el-menu>
  </div>

</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Slidebar',
  data () {
    return {
      activeIndex: '',
      isCollapse: false,
      lineshow: true,
      items: [
      ],
      colorStyle: {
        color: 'red'
      }
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      this.activeIndex = keyPath[0]
    },
    handleOpen (key, keyPath) {
      this.lineshow = true
    },
    handleClose (key, keyPath) {
      this.lineshow = false
    }
  },
  mounted() {
    let treeList = JSON.parse(sessionStorage.getItem("treeList"));
    let modules = sessionStorage.getItem("role_permision");
    if(treeList && treeList.length > 0) {
      let id = modules.split(",")[0] === "common" ? "zfd001" : "gld001";
      treeList.forEach(item => {
        if(id === item.id) {
          if(id === "gld001") {
            this.items = item.children.filter(i => {
              return i.title === modules.split(",")[1];
            })
          } else {
            this.items = [...item.children]
          }
        }
      })
    }
    console.info(this.items)
  },
  computed: {
    openIndex () {
      const p = this.items.map(res => {
        if (res.children && res.children.length > 0) {
          const i = res.children.map(r => {
            if (r.children && r.children.length > 0) {
              if (r.url) {
                return r.url
              }
            } else {
              r.children = undefined
            }
          })
          if (res.url) {
            return [res.url, ...i]
          }
        } else {
          res.children = undefined
        }
      })
      return _.flatten(p)
    }
  }
}
</script>

<style lang="less">
// .el-menu-item:hover {
//   background: transparent!important;
// }
.el-submenu__title:hover {
  background: transparent !important;
}
.lineSlider {
  position: absolute;
  left: 7%;
  // top: 130px;
  display: inline-block;
  width: 80%;
  height: 1px;
  background: rgba(224, 224, 224, 1);
  opacity: 0.15;
}
.active {
  color: #fff;
}
.sidebar::-webkit-scrollbar {
  width: 4px;
}

.sidebar::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 4px;
}

.sidebar:hover::-webkit-scrollbar-thumb {
  background: hsla(0, 0%, 53%, 0.4);
}

.sidebar:hover::-webkit-scrollbar-track {
  background: hsla(0, 0%, 53%, 0.1);
}

.iconrenzhengdunpaianquanbaozhangzhibao {
  color: #9dadbd;
}
.icondaibanshixiang {
  font-size: 16px;
}
.slidebar {
  // padding: 20px 15px;
  box-shadow: inset -1px 0px 0px 0px #0000001f;
  .el-menu {
    background: rgba(46, 61, 80, 1);
  }
  .el-menu-vertical-demo {
    border-right: 0px;
    // .only-menu {
    //   // background-color: #ebeef6;
    // }
    .el-menu-item {
      // border-radius: 30px;
      height: 36px;
      line-height: 36px;
      color: rgba(255, 255, 255, 1);
      opacity: 0.6;
      // margin-top: 8px;
      // margin-bottom: 8px;
      margin-top: 4px;
      margin-bottom: 4px;
      &.is-active {
        color: #fff;
        background: linear-gradient(
          90deg,
          rgba(0, 153, 255, 1),
          rgba(18, 115, 235, 1)
        );
        opacity: 1;
      }
      &.only-menu {
        font-size: 16px;
        font-weight: bold;
      }
      &:hover {
        background-color: #ecf5ff40;
      }
    }
    .el-submenu {
      .el-submenu__title {
        // margin-top: 8px;
        // border-radius: 30px;
        // background-color: #ebeef6;
        height: 36px;
        line-height: 36px;
      }
      .el-menu-item {
        padding-left: 54px !important;
      }
    }
    .parent-menu {
      .el-submenu__title {
        font-size: 16px;
        font-weight: bold;
        color: rgba(157, 173, 189, 1);
        margin-top: 8px;
        margin-bottom: 4px;
      }
      .child-menu {
        .el-submenu__title {
          padding-left: 54px !important;
          font-size: 14px;
          font-weight: normal;
        }
        .el-menu-item {
          padding-left: 75px !important;
        }
      }
    }
  }
}
</style>
