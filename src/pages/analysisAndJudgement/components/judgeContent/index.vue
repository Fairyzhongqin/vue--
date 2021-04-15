<template>
  <div class="judgeContent">
    <div class="contentWrap">
      <!-- 导航 -->
      <div style="display:flex;justify-content:space-between;">
        <ul>
          <!-- <router-link
          :to="item.src"
          class="filter-nav"
          v-for="(item,index)  in navTab"
          :key="index"
          :class="{'active':currentSort==index}"
          @click="active(index)"
        >
          <span>{{item.name}}</span>
          </router-link>-->
          <!-- <i v-if="item.icon" :class="'fa fa-'+item.icon"></i> -->
          <li
            class="filter-nav"
            v-for="(item,index)  in navTab"
            :key="index"
            @click="active(index)"
          >
            <!-- <span>{{item.name}}</span> -->
            <img :src="currentSort==index?item.imgActiveSrc:item.imgsrc" alt />
          </li>
        </ul>
        <!-- search bar -->
        <div class="searchBar" v-if="comIndex!='0'">
          <search-bar
            :searchList="searchList"
            @searchTrigger="setSearchData"
            :tabType="tabType"
            v-bind="$attrs"
            ref="searchBar"
          ></search-bar>
        </div>
      </div>
      <!-- 内容 -->
      <div class="tab-content">
        <!-- <div v-for="(m,index) in tabMain" v-show="currentSort==index" :key="index">{{m}}</div> -->
        <!-- 路由跳转的位置 -->
        <!-- <router-view></router-view> -->
        <!-- commonWrit judge -->
        <component v-bind="$attrs" v-on="$listeners" @setScroll="setScroll" :is="writComponent" ref="componentAll"></component>
      </div>
    </div>
  </div>
</template>
<script>
import jrzf from '../judgeEnforcementNow/index' //今日执法
import zfjcqktj from '../ZFJCQKTJ/index' //执法检查情况统计(部门)
import penaltyInspByClass from '../penaltyInspByClass/index' //执法检查情况统计(监管部门)
import aqsc from '../seasonAnalysis/index' //安全生产执法工作季度统计表
import aytj from '../statisticsOfCauseOfAction/index' //案由统计
import searchBar from './components/searchBar'
export default {
  name: 'judgeContent',
  components: {
    jrzf,
    zfjcqktj,
    penaltyInspByClass,
    aqsc,
    aytj,
    searchBar
  },
  data() {
    return {
      // tab
      navTab: [
        {
          name: '今日执法',
          value: '今日执法',
          src: '/lawEnforcementToday ',
          imgsrc: require('@/assets/imgs/btn/btn_jrzf.png'),
          imgActiveSrc: require('../../../../assets/imgs/btn/btn_active_jrzf.png')
        },
        {
          name: '执法检查情况统计（部门）',
          value: '执法检查情况统计（部门）',
          src: '/statisticsOfLawEnforcementInspection',
          imgsrc: require('../../../../assets/imgs/btn/btn_byDept.png'),
          imgActiveSrc: require('../../../../assets/imgs/btn/btn_active_byDept.png')
        },
        {
          name: '执法检查情况统计（监管行业）',
          value: '执法检查情况统计（监管行业）',
          src: '/statisticsOfLawEnforcementInspection',
          imgsrc: require('../../../../assets/imgs/btn/btn_byClass.png'),
          imgActiveSrc: require('../../../../assets/imgs/btn/btn_active_byClass.png')
        },
        {
          name: '安全生产执法工作季度统计表',
          value: '安全生产执法工作季度统计表',
          src: '/quarterlyStatisticsOfWorkSafetyLawEnforcement',
          imgsrc: require('../../../../assets/imgs/btn/btn_bySeason.png'),
          imgActiveSrc: require('../../../../assets/imgs/btn/btn_active_bySeason.png')
        },
        {
          name: '案由统计',
          value: '案由统计',
          src: '/statisticsOfCauseOfAction',
          imgsrc: require('../../../../assets/imgs/btn/btn_caseReason.png'),
          imgActiveSrc: require('../../../../assets/imgs/btn/btn_active_caseReason.png')
        }
      ],
      // active index
      currentSort: 0, //默认选中第一个tab
      writComponent: 'jrzf', //当前组件
      comIndex: '0', //组件索引
      // search bar
      searchList: [
        {
          name: '搜索时间',
          codeName: 'lifaTime',
          type: 'date',
          url: '/api',
          value: ''
        }
      ],
      height: void 0,
      tabType: 'jrzf'
    }
  },
  methods: {
    // 点击事件
    active(index) {
      this.currentSort = index
      // 点击切换组件
      console.info('此时的index', index)
      this.comIndex = index.toString()
      switch (this.comIndex) {
        case '0':
          this.writComponent = 'jrzf'
          this.tabType = 'jrzf'
          break
        case '1':
          this.writComponent = 'zfjcqktj'
          this.tabType = 'zfjcqktj'
          break
        case '2':
          this.writComponent = 'penaltyInspByClass'
          this.tabType = 'penaltyInspByClass'
          break
        case '3':
          this.writComponent = 'aqsc'
          this.tabType = 'aqsc'
          break
        case '4':
          this.writComponent = 'aytj'
          this.tabType = 'aytj'
          break
        default:
          return
      }
    },
    // setSearchData
    setSearchData(startTime, endTime) {
      console.info('setSearchData', startTime, endTime)
      if (this.tabType === 'aytj') {
        this.$refs.componentAll.getAYTJList('', startTime, endTime)
      } else if (this.tabType === 'zfjcqktj') {
        this.$refs.componentAll.getList('', startTime, endTime)
      } else if (this.tabType === 'aqsc') {
        this.$refs.componentAll.getList('', startTime, endTime)
      } else if (this.tabType === 'penaltyInspByClass') {
        this.$refs.componentAll.getList('', startTime, endTime)
      }
    },
    setScroll() {
      let outer = document.getElementsByClassName('wrapper-hooker')[0]
      let body = document.getElementsByClassName('el-table__body')[0]
      let header = document.getElementsByClassName('el-table__header')[0]
      if (outer.clientHeight < body.clientHeight+header.clientHeight) {
        this.height = '72vh'
      } else {
        this.height = void 0
      }
    }
  },
  created() {},
  mounted() {}
}
</script>
<style lang="less" scoped>
.judgeContent {
  height: 100%;

  .contentWrap {
    width: 99%;
    margin: 0 auto;
    // border: 1px solid red;
    margin-top: 20px;

    .tab-content {
      height: 100%;
    }

    ul {
      height: 40px;
      line-height: 40px;
      padding-left: 0;
      display: inline-block;
      margin: 0px 0px;

      .filter-nav {
        display: inline-block;
        height: 30px;
        width: auto;
        margin-right: 8px;
        list-style-type: none;
        line-height: 30px;
        background: transparent;
        color: #fff;
        text-shadow: 2px 2px 4px #000000;
        text-decoration: none;

        // background: linear-gradient(0deg, rgba(46, 61, 80, 1) 0%, rgba(29, 45, 66, 1) 100%);
        span {
          height: 100%;
          width: auto;
          line-height: 30px;
          box-sizing: border-box;
          // padding: 9px 7px 8px 8px;
          display: inline-block;
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
          line-height: 16px;
          padding: 0 8px 0 9px;
        }

        &:hover {
          cursor: pointer;
        }
      }
    }

    .searchBar {
      height: 40px;
      line-height: 32px;
      display: inline-block;
      box-sizing: border-box;
      padding-left: 10px;
    }

    // &::after {
    //   content: '';
    //   clear: both;
    //   height: 0;
    //   visibility: hidden;
    //   overflow: hidden;
    //   display: block;
    // }
  }
}
</style>