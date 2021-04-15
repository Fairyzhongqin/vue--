<template>
  <div class="compre_menu_lay">
    <ul v-if="menuData.length">
      <li v-for="(firstFloor, index) in menuData" :key="index">
        <p>{{firstFloor.treeName}}</p>
        <ul v-if="firstFloor.child">
          <li v-for="(secondFloor, index2) in firstFloor.child" :key="index2">
            <!-- <p :class="[!secondFloor.child&&secondFloor.color?'canAct':'',!secondFloor.child&&!secondFloor.color?'gray':'',secondFloor.id===currentId?'active':'']" @click="!secondFloor.child&&secondFloor.color?handleMenu(secondFloor):null"> -->
            <p :class="[!secondFloor.child&&secondFloor.color?'canAct':'',!secondFloor.color?'gray':'',secondFloor.id===currentId?'active':'']" @click="!secondFloor.child&&secondFloor.color?handleMenu(secondFloor):null">
            <!-- <p :class="[!secondFloor.child&&secondFloor.color?'canAct':'',!secondFloor.child&&!secondFloor.color?'gray':'',secondFloor.id===currentId?'active':'']" @click="handleMenu(secondFloor)"> -->
              <i :class="secondFloor.treeCode"></i>
              <span>{{secondFloor.treeName}}</span>
            </p>
            <ul v-if="secondFloor.child">
              <li v-for="(thirdFloor, index3) in secondFloor.child" :key="index3">
                <p :class="[thirdFloor.color?'canAct':'gray',thirdFloor.id===currentId?'active':'']" @click="thirdFloor.color?handleMenu(thirdFloor):null">
                <!-- <p :class="[thirdFloor.color?'canAct':'gray',thirdFloor.id===currentId?'active':'']" @click="handleMenu(thirdFloor)"> -->
                  <span>{{thirdFloor.treeName}}</span>
                </p>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    menuData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    currentMenuId: {
      type: String
    }
  },
  data() {
    return {
      currentId: ''
    }
  },
  created() {
    console.info(this.currentMenuId)
    this.currentId = this.currentMenuId
  },
  methods: {
    handleMenu(item) {
      this.currentId = item.id
      this.$emit('changeItem', item)
    }
  },
  watch: {
    currentMenuId(val) {
      this.currentId = val
    }
  }
};
</script>

<style lang="less" scoped>
.compre_menu_lay {
  ul,
  li,
  p {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  > ul {
    line-height: 32px;
    width: 228px;
    padding-left: 8px;
    padding-bottom: 25px;
    // 一级
    > li {
      > p {
        padding-left: 9px;
        font-size: 14px;
        font-weight: 500;
      }
      > ul {
        // 二级
        line-height: 45px;
        > li {
          p.canAct {
            margin-right: 10px;
            border-radius: 4px;
            color: #1273EB;
            cursor: pointer;
            span {
              // text-decoration: underline;
              border-bottom: 1px solid #1273EB;
            }
            &:hover,&.active {
              background-color: #0099ff;
              color: #fff;
              span {
                border-bottom: 1px solid #fff;
              }
            }
          }
          p.gray {
            color: #999999;
            i {
              -webkit-filter: grayscale(100%);
              -moz-filter: grayscale(100%);
              -ms-filter: grayscale(100%);
              -o-filter: grayscale(100%);
              filter: grayscale(100%);
              filter: gray;
              filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
            }
            span {
              text-decoration: none;
            }
          }
          > p {
            padding-left: 9px;
            font-size: 16px;
            i {
              display: inline-block;
              width: 21px;
              height: 24px;
              background-image: url(../../assets/imgs/caseHandle/1.png);
              background-size: 100% 100%;
              margin-right: 20px;
              transform: translateY(7px);
              &.jcfa {
                // background-image: url(../../assets/imgs/caseHandle/1.png);
              }
              &.xcjc {
                // background-image: url(../../assets/imgs/caseHandle/1.png);
              }
              &.jcjgxl {
                // background-image: url(../../assets/imgs/caseHandle/1.png);
              }
              &.zgfc {
                // background-image: url(../../assets/imgs/caseHandle/1.png);
              }
              &.zgfcyq {
                // background-image: url(../../assets/imgs/caseHandle/1.png);
              }
              &.ajsp {
                background-image: url(../../assets/imgs/caseHandle/1.png);
              }
              &.ajdc {
                background-image: url(../../assets/imgs/caseHandle/2a.png);
              }
              &.ajsl {
                background-image: url(../../assets/imgs/caseHandle/3a.png);
              }
              &.cfjd {
                background-image: url(../../assets/imgs/caseHandle/4a.png);
              }
              &.jasp {
                background-image: url(../../assets/imgs/caseHandle/9a.png);
              }
              &.ajyq {
                background-image: url(../../assets/imgs/caseHandle/10a.png);
              }
              &.xzqz {
                background-image: url(../../assets/imgs/caseHandle/5a.png);
              }
              &.ajys {
                background-image: url(../../assets/imgs/caseHandle/6a.png);
              }
              &.ajzz {
                background-image: url(../../assets/imgs/caseHandle/11a.png);
              }
            }
          }
          > ul {
            line-height: 32px;
            > li {
              > p {
                padding-left: 66px;
              }
            }
          }
        }
      }
    }
  }
}
</style>