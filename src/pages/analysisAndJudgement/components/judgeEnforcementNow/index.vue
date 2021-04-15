<template>
  <div class="judgeEnforcementNow">
    <div class="judgeMapLeft">
      <div class="mapTitle">
        <a class="topTitle" @click="listChange(-1)">{{ mapProvinceName}}</a>
        <span class="arrow" v-if="curArea!='江苏省'">></span>
        <span class="subMapTitle" v-if="curArea!='江苏省'">{{subMapTitle}}</span>
      </div>
      <!-- 地图 -->
      <div id="map" :style="{height:'67vh',width:'100%'}" ref="myEchart"></div>
    </div>
    <div class="judgeRight">
      <div class="rightDetail">
        <!-- 右上的数量 -->
        <div class="detailInfo" v-for="(item,index)  in detailInfoList" :key="index">
          <span>{{item.itemName}}:</span>
          <a
            @click="showModalDetail(item.item,item.itemName,perm)"
            :class="{'click-perm':perm&&item.item!='6'&&item.item!='7'}"
          >{{parseInt(item.num)}}</a>
        </div>
      </div>
      <div class="rightTable">
        <!-- 导航 -->
        <ul>
          <li
            class="rightTableTab"
            v-for="(item,index)  in navTabList"
            :key="index"
            :class="{'active':currentSort==index}"
            @click="activeChange(index)"
          >
            <span>{{item.name}}</span>
          </li>
        </ul>
        <!-- 内容 -->
        <div class="rightTableTab-content">
          <component
            v-bind="$attrs"
            v-on="$listeners"
            :is="writComponent"
            ref="nowTotalCom"
            :recieveCode="deptCode"
          ></component>
        </div>
      </div>
    </div>
    <!--展示列表弹窗 start-->
    <div v-if="modalVisiable" class="dialog-container">
      <el-dialog
        :title="modalTitle"
        :visible.sync="modalVisiable"
        width="1078px"
        height="600px"
        :close-on-click-modal="false"
      >
        <component
          :is="modalCom"
          :startTime="sTime1"
          :endTime="eTime1"
          :tabletype="inspectType"
          :deptcode="selectDeptCode"
        ></component>
      </el-dialog>
    </div>
  </div>
</template>
<script>
require('echarts/map/js/china')
require('echarts/map/js/province/jiangsu')
//引入地图离线文件
// import jiangsu from 'echarts/map/js/province/jiangsu'
import jiangsu from '../../../../../static/echarts-mapJson/geometryProvince/32.json'
import nanjing from '../../../../../static/echarts-mapJson/geometryCouties/2.json'
import wuxi from '../../../../../static/echarts-mapJson/geometryCouties/320200.json'
import xuzhou from '../../../../../static/echarts-mapJson/geometryCouties/320300.json'
import changzhou from '../../../../../static/echarts-mapJson/geometryCouties/320400.json'
import suzhou from '../../../../../static/echarts-mapJson/geometryCouties/320500.json'
import nantong from '../../../../../static/echarts-mapJson/geometryCouties/320600.json'
import lianyungang from '../../../../../static/echarts-mapJson/geometryCouties/320700.json'
import huaian from '../../../../../static/echarts-mapJson/geometryCouties/320800.json'
import yancheng from '../../../../../static/echarts-mapJson/geometryCouties/320900.json'
import yangzhou from '../../../../../static/echarts-mapJson/geometryCouties/321000.json'
import zhenjiang from '../../../../../static/echarts-mapJson/geometryCouties/321100.json'
import taizhou from '../../../../../static/echarts-mapJson/geometryCouties/321200.json'
import suqian from '../../../../../static/echarts-mapJson/geometryCouties/321300.json'

import xcjc from './components/xcjcTable'
import ybxzcf from './components/ybxzcfTable'
import { getHomePageData } from '@/api/manageSystem/index.js'
import dangeExamineNum from '../../analysisCommon/detail/dangeExamineNum'
import inspectEnterpriseNum from '../../analysisCommon/detail/inspectEnterpriseNum'
import unincorporateNum from '../../analysisCommon/detail/unincorporateNum'
import { dateFormat } from '@/utils/util.js'
export default {
  name: 'judgeEnforcementNow',
  components: {
    xcjc,
    ybxzcf,
    dangeExamineNum,
    inspectEnterpriseNum,
    unincorporateNum
  },
  data() {
    //使用name映射地图json文件
    return {
      detailInfoList: [],
      detailInfoListTemp: [
        { item: '0', itemName: '检查方案数', num: '0.00' },
        { item: '1', itemName: '实际检查企业数', num: '0.00' },
        { item: '2', itemName: '发现隐患数', num: '0.00' },
        { item: '3', itemName: '复查企业数', num: '0.00' },
        { item: '4', itemName: '立案总数', num: '0.00' },
        { item: '5', itemName: '结案数', num: '0.00' },
        { item: '6', itemName: '处罚决定数', num: '0.00' },
        { item: '7', itemName: '罚款总额', num: '0.00' }
      ],
      // navTabList
      navTabList: [
        {
          name: '现场检查数',
          value: '现场检查'
        },
        {
          name: '一般行政处罚数',
          value: '一般行政处罚'
        }
      ],
      // active index
      currentSort: 0, //默认选中第一个tab
      writComponent: 'xcjc', //当前组件
      comIndex: '0', //组件索引
      mapProvinceName: '江苏省', //展示在上面的上一级的地域省级名称
      jsonMap: {
        江苏省: jiangsu,
        南京市: nanjing,
        苏州市: suzhou,
        无锡市: wuxi,
        常州市: changzhou,
        徐州市: xuzhou,
        淮安市: huaian,
        宿迁市: suqian,
        泰州市: taizhou,
        扬州市: yangzhou,
        镇江市: zhenjiang,
        连云港市: lianyungang,
        盐城市: yancheng,
        南通市: nantong
      },
      itemsList: [
        {
          name: '南京市'
        },
        {
          name: '苏州市'
        },
        {
          name: '无锡市'
        },
        {
          name: '常州市'
        },
        {
          name: '徐州市'
        },
        {
          name: '淮安市'
        },
        {
          name: '宿迁市'
        },
        {
          name: '泰州市'
        },
        {
          name: '南通市'
        },
        {
          name: '连云港市'
        },
        {
          name: '盐城市'
        },
        {
          name: '镇江市'
        }
      ],
      itemSort: -1, //选取市级时的依据
      subMapTitle: '南京市', //选取的市级
      totalCountData: [], //统计数据
      curArea: '江苏省',
      curAreaData: null,
      deptCode: '',
      mychart: null,
      typelist: {
        '0': { tabletype: 'jcfas', com: 'dangeExamineNum' },
        '1': { tabletype: 'sjjcqys', com: 'inspectEnterpriseNum' },
        '2': { tabletype: 'fxyhs', com: 'dangeExamineNum' },
        '3': { tabletype: 'fcqys', com: 'inspectEnterpriseNum' },
        '4': { tabletype: 'lazs', com: 'unincorporateNum' },
        '5': { tabletype: 'jas', com: 'unincorporateNum' }
      },
      sTime1: '',
      eTime1: '',
      modalVisiable: false,
      modalTitle: '',
      inspectType: '',
      selectDeptCode: '',
      modalCom: '',
      perm: false //点击权限
    }
  },
  methods: {
    getTotalCountData() {
      console.info('取统计数据', this.$refs)
      // console.info('取统计数据', this.$refs.nowTotalCom.getList('320200', '2019-01-01 00:00:00', '2020-01-01 00:00:00'))
    },
    listChange(index) {
      if (index == -1) {
        this.itemSort = -1
        this.changeMap('江苏省')
      } else {
        this.itemSort = index
        this.subMapTitle = this.itemsList[index].name
        this.changeMap(this.subMapTitle)
      }
    },
    // 点击事件
    activeChange(index) {
      this.currentSort = index
      // 点击切换组件
      console.info('两者切换的index', index)
      this.comIndex = index.toString()
      switch (this.comIndex) {
        case '0':
          this.writComponent = 'xcjc'
          break
        case '1':
          this.writComponent = 'ybxzcf'
          break
        default:
          return
      }
    },
    // 取地图
    changeMap(_data, geoIndex) {
      // let _firstChildId = this.jsonMap[_data].features[0].properties.id
      // if (_firstChildId.length > 6) {
      //   alert('你大儿子没法下探了')
      //   return
      // }
      this.$set(this, 'curArea', _data)
      //从点击的那个区块中获取id 用来给表格传值
      if (_data == '江苏省') {
        this.deptCode = '32'
        this.getList()
      } else if (this.jsonMap[_data]) {
        this.deptCode = this.curAreaData.features[geoIndex].properties.id
        this.getList()
      } else {
        this.deptCode = this.curAreaData.features[geoIndex].properties.id
        this.getList()
        return
      }
      //存储当前地图的所有区块
      this.curAreaData = this.jsonMap[_data]

      //给data塞随机数，用来随机颜色
      var setDatas = []
      this.curAreaData.features.forEach(cur => {
        setDatas.push({
          name: cur.properties.name,
          value: Math.floor(Math.random() * 10)
        })
      })

      //重新设置地图
      $echarts.registerMap(_data, this.jsonMap[_data])
      if (_data !== '江苏省') {
        this.subMapTitle = _data
      }
      let option = {
        backgroundColor: 'transparent', //设置背景颜色
        visualMap: {
          min: 0,
          max: 10,
          show: false,
          inRange: {
            color: ['#65C3FA', '#19A6E3', '#5294B2', '#2C6BA7']
          }
        },
        //配置属性
        series: [
          {
            name: '数量',
            type: 'map',
            mapType: _data, //地图范围
            roam: true,
            zoom: 1.2,
            scaleLimit: {
              min: 0.7,
              max: 2
            },
            label: {
              normal: {
                show: true, //省份名称
                textStyle: {
                  color: '#ffffff'
                } //省份标签字体颜色 正常情况
              },
              emphasis: {
                show: false, //选中后样式
                textStyle: {
                  color: '#ffffff'
                } //省份标签字体颜色 选中样式
              }
            },
            // 页面展示数据
            data: setDatas
          }
        ]
      }

      var count = 0
      var curr = count % 34
      this.myChart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0 // 因为只有一组数据，所以此处应为0 就是第一组下标
      })
      this.myChart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0, // 因为只有一组数据，所以此处应为0 就是第一组下标
        dataIndex: curr
      })
      // function start
      let Province = ''
      this.myChart.setOption(option, true)
      //获取随机数
      function randomData() {
        return Math.round(Math.random() * (12 - 1) + 1)
      }
    },
    getList() {
      this.loading = true
      let d = new Date()
      this.sTime1 = dateFormat(d, 'yyyy-mm-dd') + ' 00:00:00'
      this.eTime1 = dateFormat(d, 'yyyy-mm-dd') + ' 23:59:59'
      getHomePageData({
        deptCode: this.deptCode,
        startTime: this.sTime1,
        endTime: this.eTime1
      })
        .then(res => {
          this.loading = false
          if (res.code === '0' && res.data[res.data.length - 1].data.length > 0) {
            this.detailInfoList = res.data[res.data.length - 1].data
            this.perm = res.data[res.data.length - 1].perm
          } else {
            this.detailInfoList = this.detailInfoListTemp
          }
        })
        .catch(err => {
          this.loading = false
          this.detailInfoList = this.detailInfoListTemp
          this.perm = false
          throw new Error(err)
        })
    },
    //根据点击的类目加载组件
    showModalDetail(item, name, perm) {
      if (perm && item != '6' && item != '7') {
        this.modalCom = this.typelist[item].com
        this.modalVisiable = true
        this.inspectType = this.typelist[item].tabletype
        this.selectDeptCode = this.deptCode
        this.modalTitle = name
      }
    }
  },
  created() {},
  mounted() {
    this.detailInfoList = this.detailInfoListTemp
    //地图初始化
    this.myChart = $echarts.init(document.getElementById('map'))
    this.myChart.on('click', params => {
      this.changeMap(params.name, params.dataIndex)
    })
    window.addEventListener('resize', () => {
      this.myChart.resize()
    })
    // 取地图
    this.changeMap('江苏省')
  }
}
</script>
<style lang="less" scoped>
.judgeEnforcementNow {
  width: 100%;
  // height: 630px;
  height: 78vh;
  overflow: overlay;
  display: flex;
  justify-content: space-between;

  /*竖项滚动条样式*/
  &::-webkit-scrollbar {
    width: 6px;
    height: 72px;
    background: transparent;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(91, 108, 130, 1);
    background: rgba(91, 108, 130, 1);
  }

  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(91, 108, 130, 1);
    border-radius: 0;
    background: transparent;
  }
  .judgeMapLeft {
    width: 49.2%;
    min-height: 590px;
    // background: rgba(62, 82, 118, 1);
    background-image: url('~@/assets/imgs/map_bg.png');
    border-radius: 8px;

    .mapTitle {
      margin: 0 auto;
      margin-top: 6px;
      width: 80%;
      text-align: center;
      height: 52px;
      line-height: 52px;
      background: rgba(23, 47, 91, 1);
      opacity: 0.8;

      .topTitle {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        text-decoration: underline;
        cursor: pointer;
        color: rgba(255, 255, 255, 1);
      }

      .arrow {
        color: #fff;
      }

      .subMapTitle {
        color: #fff;
        text-decoration: underline;
      }
    }
  }

  .judgeRight {
    width: 50.2%;
    min-height: 590px;
    display: flex;
    flex-direction: column;

    .rightDetail {
      width: 100%;
      height: 10vh;
      min-height: 90px;
      margin-bottom: 1.3vh;
      background: rgba(46, 67, 106, 1);
      border-radius: 8px;
      padding: 10px 0px;

      .detailInfo {
        width: 32%;
        height: 30px;
        display: inline-block;
        margin-top: 2px;
        box-sizing: border-box;
        padding-left: 30px;

        span {
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(255, 255, 255, 1);
        }
        .click-perm {
          text-decoration: underline;
          color: rgba(2, 204, 255, 1);
          cursor: pointer;
        }
        a {
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 500;
          line-height: 30px;
          color: white;
        }
      }
    }

    .rightTable {
      width: 100%;
      // height: 485px;
      height: 64.6vh;
      min-height: 470px;
      // overflow-y: scroll;
      background: rgba(46, 67, 106, 1);
      border-radius: 8px;
      box-sizing: border-box;
      padding: 18px 14px;

      ul {
        margin: 0;
        margin-bottom: 5px;
        padding-left: 0;
      }

      .rightTableTab {
        list-style-type: none;
        display: inline-block;
        width: auto;
        height: 30px;
        box-sizing: border-box;
        padding: 3px 8px;
        margin-right: 10px;
        border-radius: 8px;
        width: 150px;
        text-align: center;

        &:hover {
          cursor: pointer;
        }

        span {
          font-size: 16px;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(153, 228, 252, 1);
        }
      }

      .active {
        color: #fff;
        background: url(~@/assets/imgs/btn/btn_fakuan_click.png) no-repeat;
        background-size: 100%;
      }
    }
  }
  /deep/.dialog-container {
    .el-dialog__wrapper {
      .el-dialog {
        background: #2e436a;
        .el-dialog__header {
          border-bottom: 1px solid #4e5878;
          .el-dialog__title {
            color: #ffffff;
          }
        }
      }
    }
  }
}
</style>