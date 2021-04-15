<template>
  <div>
    <component :is="inspectionCurrentComponent"></component>
  </div>
</template>

<script>
import newInspection from './newInspection/index'
import { mapState } from 'vuex'
import inspectionList from './inspectionList/index'

export default {
  name: 'onSiteInspection',
  components: {
    newInspection,
    inspectionList,
    dataId: null,
    schemeId: null
  },
  created() {
    if (this.$route.params.id) {
      alert('1')
      console.log(this.$route)
      this.$route.params = null
    }
  },
  activated() {
    if (this.$route.params.id) {
      alert('2')
      this.$route.params = null
    }
  },
  data() {
    return {
      /* buttonList: [
        {
          name: '取消',
          type: '',
          disable: false,
          fun: this.world
        },
        {
          name: '生成现场检查记录文书',
          type: 'primary',
          disable: false,
          fun: function () {
            console.log('确定')
          }
        }
      ], */
      /* searchList: [
        {
          name: '企业名称',
          codeName: 'companyName',
          type: 'text',
          value: ''
        },
        {
          name: '检查部门',
          codeName: 'examineStatus',
          type: 'select',
          url: '/api',
          value: ''
        },
        {
          name: '检查时间',
          codeName: 'checkTime',
          type: 'date',
          value: ''
        },
        {
          name: '检查人员',
          codeName: 'lawUnit',
          type: 'select',
          url: '/api',
          value: ''
        },
        {
          name: '检查来源',
          codeName: 'lawPerson',
          type: 'select',
          url: '/api',
          value: ''
        },
        {
          name: '监管行业',
          codeName: 'regIndustry',
          type: 'select',
          url: '/api',
          value: ''
        }
      ], */
      // searchDetail: null
    }
  },
  computed: {
    ...mapState(['inspectionCurrentComponent'])
  }
}
</script>

<style lang="less" scoped>
</style>
