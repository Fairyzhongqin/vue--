<template>
  <div>
    <div>
      <search-bar :searchList="searchList" @searchTrigger="searchTrigger"/>
      <data-table :searchBarInfo="searchInfo"/>
    </div>
  </div>
</template>

<script>
import searchBar from '@components/searchBar'
import dataTable from './dataTable'

export default {
  name: 'writTypeContent',
  components: {
    searchBar,
    dataTable
  },
  data () {
    return {
      searchList: [
        {
          name: '文书名称',
          codeName: 'name',
          type: 'text',
          value: ''
        },
        {
          name: '是否签名',
          codeName: 'userType',
          type: 'selectFixedValue',
          clearable: true,
          default: [{
            value: '1',
            label: '是'
          }, {
            value: '0',
            label: '否'
          }]
        },
        {
          name: '盖章类型',
          codeName: 'isSign',
          type: 'selectFixedValue',
          clearable: true,
          default: [{
            value: '0',
            label: '无'
          }, {
            value: '1',
            label: '加盖公章'
          }, {
            value: '2',
            label: '加盖执法章'
          }]
        },

        {
          name: '是否审核',
          codeName: 'isAudit',
          type: 'selectFixedValue',
          clearable: true,
          default: [{
            value: '0',
            label: '否'
          }, {
            value: '1',
            label: '是'
          }]
        },

        {
          name: '上传签字文书',
          codeName: 'isUpload',
          type: 'selectFixedValue',
          clearable: true,
          default: [{
            value: '0',
            label: '否'
          }, {
            value: '1',
            label: '是'
          }]
        },
        {
          name: '行政处罚模块',
          codeName: 'isPenalty',
          type: 'selectFixedValue',
          clearable: true,
          default: [{
            value: '0',
            label: '否'
          }, {
            value: '1',
            label: '是'
          },
          {
              value: 'init',
              label: '基本线'
          }
          ]
        }

      ],
      searchInfo: {
        // 列表请求参数
        name: '', // 文书名字
        userType: '', // 签名类型 0-不需要用户签名  1-需要用户签名
        isSign: '', // 加盖公章类型 0-不需要加盖公章 1-需要加盖公章 2-加盖执法章
        isAudit: '', // 是否需要审核  0-不需要  1-需要
        isUpload: '', // 是否需要上传签字文书 0-否  1-是
        isPenalty: '' // 是否是行政处罚模块的数据
      }
    }
  },
  methods: {
    searchTrigger (val) {
      this.searchInfo = val
    }
  }
}
</script>
