<template>
  <div class="comp_browse animated" :class="animateClass">
    <header>
      <h2>综合浏览</h2>
      <!-- el-dialog__close el-icon el-icon-close -->
      <i class="el-dialog__close el-icon el-icon-close" @click="closeFrame"></i>
    </header>
    <section>
      <aside v-loading="menuLoading" element-loading-text="正在加载综合浏览菜单" element-loading-spinner="el-icon-loading" element-loading-background="#EEF5F9">
        <compre-menu :currentMenuId="currentMenuId" v-bind="$attrs" :menuData="menuData" @changeItem="changeItem"></compre-menu>
      </aside>
      <content v-loading="menuLoading" element-loading-text="正在加载案件信息">
        <div class="caseInfo">
          <ul class="clearfix">
            <li>
              <p><span>{{undEntity.objectType === '1' ? '当事人' : '当事人'}}：</span>{{ undEntity.objectType === '1' ? undEntity.punishPersonName : undEntity.companyName || '暂无' }}</p>
            </li>
            <li>
              <p><span>检查时间：</span>{{ undEntity.examineTime }}</p>
            </li>
            <li v-if="undEntity.caseName">
              <p><span>案件名称：</span>{{ undEntity.caseName }}</p>
            </li>
            <li v-if="undEntity.caseCrimeTime">
              <p><span>立案时间：</span>{{ undEntity.caseCrimeTime }}</p>
            </li>
          </ul>
        </div>
        <!-- 业务组件 -->
        <business-lay v-if="pIdFinish" ref="businessComp" :planExamineId="planExamineId"></business-lay>
        <p class="copyright">Copyright © 2019 All Rights Reserved</p>
        <!-- <footer>
          
        </footer> -->
      </content>
    </section>
  </div>
</template>

<script>
import { queryCompreTreeInfo } from '@/api/comprehensiveBrowse'
import compreMenu from './compreMenu'
import businessLay from './businessLay'
import { getFilingRegister } from '@/api/filingRegister/index'
export default {
  components: {
    compreMenu,
    businessLay
  },
  props: {
    workAreaId: {
      type: String,
      default: ''
    },
    inspectId: {
      type: String,
      default: ''
    },
    planExamineId: {
      type: String,
      default: ''
    },
    // 废弃
    nowMenu: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      menuData: [],
      undEntity: {
        companyName: '',
        examineTime: '',
        caseName: '',
        caseCrimeTime: ''
      },
      currentMenuId: '',
      pIdFinish: false,
      animateClass: 'slideInUp',
      menuLoading: true
    }
  },
  created() {
    this.getTreeList()
  },
  methods: {
    getTreeList() {
      let _req = {}
      if (this.workAreaId) {
        _req.requestId = this.workAreaId
        _req.type = '4'
      } else if (this.inspectId) {
        _req.penaltyId = this.inspectId
        _req.type = '3'
        this.pIdFinish = true // 有penalty直接让他显示
      } else {
        _req.penaltyId = this.$store.state.penalty.penaltyUndEntity.penaltyId
        this.pIdFinish = true // 有penalty直接让他显示
      }
      queryCompreTreeInfo(_req).then(res => {
        if (res.code === '0') {
          this.menuLoading = false
          this.menuData = res.treeList
          // res.treeList[0].child[0].color = 0;
          if (res.undEntity) {
            this.undEntity = res.undEntity
          } else {
            this.undEntity = {
              companyName: res.examineEntity.companyName || '',
              examineTime: res.examineEntity.examineStartTime,
              caseName: '',
              caseCrimeTime: ''
            }
          }
          
          // res.treeList
          let _nowMenu = ''
          // this.currentMenuId GET
          let _item = null

          res.treeList.map(i => {
            if (i.child) {
              i.child.map(j => {
                if (j.color !== 0) {
                  _nowMenu = _nowMenu || j.id
                  _item = _item || j
                }
              })
            }
          })
          this.currentMenuId = _nowMenu

          if (this.workAreaId && res.undEntity) {
            getFilingRegister({
              penalty: this.undEntity.penaltyId
            }).then(res => {
              this.$store.commit('setPenalty', res.data)
              this.pIdFinish = true
              this.changeItem(_item)
            })
          } if (this.workAreaId && res.examineEntity) {
            
            this.pIdFinish = true
            this.changeItem(_item)
          } else {
            this.changeItem(_item)
          }
        }
      })
    },
    closeFrame() {
      this.$emit('closeFrame')
      this.$store.commit('setCompreComponent', {
        treeCode: ''
      })
    },
    changeItem(item) {
      if (!item) {
        return
      }
      this.$nextTick(() => {
        this.$refs['businessComp'].initInfo(item)
      })
    }
  }
}
</script>

<style lang="less" scoped>
ul,
li,
p {
  margin: 0;
  padding: 0;
  list-style: none;
}
.comp_browse {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  background: white;
  > header {
    height: 40px;
    border-bottom: #e0e0e0 1px solid;
    h2 {
      height: 30px;
      line-height: 30px;
      padding-top: 10px;
      color: #333333;
      margin: 0;
      padding-left: 16px;
      font-size: 16px;
    }
    .el-icon {
      position: absolute;
      right: 24px;
      top: 9px;
      font-size: 24px;
      color: #666666;
      cursor: pointer;
    }
  }
  > section {
    display: flex;
    justify-content: space-between;
    height: calc(100% - 40px);
    aside {
      width: 246px;
      overflow-y: scroll;
      border-right: 1px solid #e0e0e0;
    }
    aside::-webkit-scrollbar {
      width: 10px;
      border: none;
    }
    aside::-webkit-scrollbar-thumb {
      background: rgba(91, 108, 130, 0.1);
      border-radius: 4px;
      width: 7px;
      border: none;
      margin-right: 3px;
    }
    aside:hover::-webkit-scrollbar-thumb {
      background: rgba(91, 108, 130, 0.3);
    }
    content {
      width: calc(100% - 246px);
      position: relative;
      background-color: #ebeef6;
      overflow-y: scroll;
      padding-bottom: 43px;
      &::-webkit-scrollbar,
      content::-webkit-scrollbar {
        width: 10px;
        border: none;
      }
      &::-webkit-scrollbar-thumb,
      content::-webkit-scrollbar-thumb {
        background: rgba(91, 108, 130, 0.1);
        border-radius: 4px;
        width: 7px;
        border: none;
        margin-right: 3px;
      }
      &:hover::-webkit-scrollbar-thumb,
      content:hover::-webkit-scrollbar-thumb {
        background: rgba(91, 108, 130, 0.3);
      }
      .caseInfo {
        background-color: #ffffff;
        border-bottom: 1px solid #e0e0e0;
        ul {
          padding-top: 10px;
          li {
            float: left;
            width: 50%;
            padding-left: 16px;
            box-sizing: border-box;
            p {
              font-size: 14px;
              color: #333333;
              line-height: 30px;
              span {
                padding-right: 12px;
              }
            }
          }
        }
      }
      p.copyright {
        text-align: center;
        line-height: 46px;
        color: rgba(187, 187, 187, 1);
        font-size: 14px;
        font-weight: 500;
        position: fixed;
        // bottom: 42px;
        width: 100%;
      }
      footer {
        position: fixed;
        width: 100%;
        height: 30px;
        bottom: 0;
        padding: 6px 0;
        margin: 0 auto;
        background: #fff;
        text-align: center;
        border-top: 1px solid #e0e0e0;
        z-index: 9;
      }
    }
  }
}
</style>
