<template>
  <div>
    <div>
      <search-bar :searchList="searchList" @searchTrigger="searchTrigger" :collspan="collspan"></search-bar>
      <data-table :searchBarInfo="searchInfo" @enterAddDiscretion="enterAddDiscretion"></data-table>
    </div>
    <el-dialog title="选择监管行业分类" width="660px" :visible.sync="showTrade">
      <!-- 中间内容部分 -->
      <select-type :chooseType="'tradeType'" :isCheck="false" @closeDialog="closeDialog" @getType="getTradeSelected"></select-type>
    </el-dialog>
    <el-dialog title="选择专项检查分类" width="660px" :visible.sync="showSpecial">
      <!-- 中间内容部分 -->
      <select-type :chooseType="'specialType'" :isCheck="false" @closeDialog="closeDialog" @getType="getSpecialSelected"></select-type>
    </el-dialog>
  </div>
</template>

<script>
import searchBar from '@components/searchBar'
import dataTable from './dataTable'
import selectType from '../components/selectType'

export default {
  name: 'discretionaryContent',
  components: {
    searchBar,
    dataTable,
    selectType
  },
  data() {
    return {
      searchList: [
        {
          name: '违法行为',
          codeName: 'unlawfulAct',
          type: 'text',
          value: ''
        },
        {
          name: '自由裁量分类',
          codeName: 'discretionTypeCode',
          type: 'select',
          url: '/aj/sys/sysdict/list',
          value: '',
          data: {
            type: 'free_court'
          }
        },
        {
          name: '法律条例',
          codeName: 'lawCode',
          type: 'select',
          url: '/aj/sys/sysdict/list',
          value: '',
          data: {
            type: 'free_lawt'
          }
        },
        {
          name: '监管行业类别',
          codeName: 'tradeName',
          type: 'type_dialog',
          value: '',
          event: this.handleTradeDialog
        },
        {
          name: '专项检查分类',
          codeName: 'specialName',
          type: 'type_dialog',
          value: '',
          event: this.handleSpecialDialog
        },
        {
          name: '自由裁量编号',
          codeName: 'discretionCode',
          type: 'text',
          value: ''
        }
      ],
      searchInfo: {
        // 列表请求参数
        discretionTypeCode: '', // 自由裁量分类
        tradeCode: '', // 监管行业分类
        specialCode: '', // 专项检查分类
        lawCode: '', // 法律条款
        limit: '10', // 分页大小
        page: '1', // 页数
        unlawfulAct: '' // 违法行为
      },
      showTrade: false,
      showSpecial: false,
      collspan: false
    }
  },
  created() {
    if(this.$store.state.currDiscreSearchInfo) {
      this.collspan = true
        this.searchInfo = this.$store.state.currDiscreSearchInfo
        this.searchList.map(item => {
          for (let key in this.searchInfo) {
            if (item.type === 'type_dialog') {
                if (item.codeName === key) {
                item.value = {
                  value: String(this.searchInfo[key])
                }
              }
            } else {
              if (item.codeName === key) {
                item.value = String(this.searchInfo[key])
              }
            }

          }
        })

    }
  },
  methods: {
    enterAddDiscretion(id = '', currPage) {
      this.$store.commit('setCurrDiscreComp', {
        component: 'addDiscretionary'
      })
      this.searchInfo.page = currPage
      this.$store.commit('setCurrDiscreSearchInfo', this.searchInfo)
      this.$store.commit('setDiscId', {
        discId: id
      })
    },
    searchTrigger(val) {
      if (val.tradeName) {
        val.tradeCode = val.tradeName.code
        val.tradeName = val.tradeName.value
      }
      if (val.specialName) {
        val.specialCode = val.specialName.code
        val.specialName = val.specialName.value
      }
      this.searchInfo = val
      console.info('searchTrigger', this.searchInfo)
    },
    handleTradeDialog() {
      this.showTrade = true
    },
    handleSpecialDialog() {
      this.showSpecial = true
    },
    closeDialog(val) {
      if (val == 'tradeType') {
        this.showTrade = false
      } else if (val == 'specialType') {
        this.showSpecial = false
      }
    },
    getTradeSelected(val) {
      this.searchList[3].value = val 
    },
    getSpecialSelected(val) {
      this.searchList[4].value = val
    }
  }
}
</script>
