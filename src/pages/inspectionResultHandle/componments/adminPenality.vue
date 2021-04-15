<template>
  <div class="centerCon adminPenality">
    <div class="lineadmin">
      <el-button type="primary" @click="confirmToPunish('一般')">转一般程序行政处罚</el-button>
    </div>
    <div class="lineadmin">
      <el-button type="primary" @click="confirmToPunish('简易')">转简易程序行政处罚</el-button>
    </div>
  </div>
</template>

<script>
import { saveSimpleAdministration } from '@api/ProcessingofInspectionResult'
import { addFilingRegister } from '@/api/filingRegister'
import { mapState } from 'vuex'
import { dateFormat } from '@/utils/util'
import Bus from '@/bus'

export default {
  name: 'adminPenality',
  data() {
    return {
      showSimplePenalityVisible: false,
      simpleId: '',
      blcListDetail: [], //违法行为信息
      entity: {
        punishCompanyName: '',
        udtIds: '',
        objectType: ''
      }
    }
  },
  props: {
    selectedList: {
      type: Array
    }
  },
  mounted() {
    console.info('admin penalty')
  },
  computed: {
    ...mapState(['tableHeadInfo'])
  },
  methods: {
    confirmToPunish(val) {
      this.$confirm(`是否转入${val}行政处罚?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        // 按钮操作  start
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '转入中...'
            setTimeout(() => {
              done()
              setTimeout(() => {
                instance.confirmButtonLoading = false
              }, 300)
            }, 2000)
          } else {
            done()
          }
        }
        // 按钮操作 end
      }).then(
        () => {
          if (val === '简易') {
            this.showSimplePenality()
          } else {
            this.transpose()
          }
        },
        () => {
          console.info(this.selectedList, 'selectedList')
          console.info(this.tableHeadInfo, 'tableHeadInfo')
        }
      )
    },
    //转一般程序行政处罚
    transpose() {
      let time = this.tableHeadInfo.examineStartTime.replace(/(\/)/g, '-') + ':00'
      let penaltyUndEntity = {
        objectType: '0',
        punishCompanyId: this.tableHeadInfo.companyId,
        udtIds: this.tableHeadInfo.executorId,
        sourceId: this.tableHeadInfo.id,
        sourceType: 'examine',
        examineTime: time,
        caseSourceId: 'co001',
        suggestion: '',
        caseName: ''
      }
      let unLawfulActsHere = ''
      let blcList = this.selectedList.reduce((total, item) => {
        let arr = []
        if (item.children && item.children.length > 0) {
          arr = item.children.reduce((t, i) => {
            let dataSource = i.discretionId ? '0' : '1'
            t.push({
              discretionId: i.discId,
              dataSource,
              violateRules: i.negativeDesc,
              discretionRulesId: i.discRulesId,
              checkId: i.id
            })
            return t
          }, [])
          let source = item.discretionId ? '0' : '1'
          let info = {
            discretionId: item.discId,
            dataSource: source,
            actName: item.negativeDesc,
            checkId: item.id,
            children: arr
          }
          total.push(info)
        } else {
          let dataSource = item.discretionId ? '0' : '1'
          total.push({
            discretionId: item.discId,
            dataSource,
            actName: item.negativeDesc,
            checkId: item.id
          })
        }

        if (item.lawProvisionRule !== null) {
          penaltyUndEntity.suggestion =
            penaltyUndEntity.suggestion !== ''
              ? item.lawProvisionRule
                ? penaltyUndEntity.suggestion + `、${item.lawProvisionRule}`
                : penaltyUndEntity.suggestion
              : item.lawProvisionRule
        }

        return total
      }, [])
      // 取caseName
      blcList.forEach(item => {
        unLawfulActsHere += item.actName?item.actName.trim():''
      })
      penaltyUndEntity.suggestion =
        penaltyUndEntity.suggestion !== '' && penaltyUndEntity.suggestion
          ? `${this.tableHeadInfo.companyName}涉嫌违反${penaltyUndEntity.suggestion}，建议立案`
          : ''
      penaltyUndEntity.caseName = this.tableHeadInfo.companyName + unLawfulActsHere + '案'
      addFilingRegister({
        blcList,
        penaltyUndEntity
      }).then(
        res => {
          this.$emit('successHandle')
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        },
        err => {
          this.$message({
            message: '操作失败',
            type: 'error'
          })
        }
      )
    },
    showSimplePenality() {
      let blcList = this.selectedList.reduce((total, item) => {
        let arr = []
        if (item.children && item.children.length > 0) {
          arr = item.children.reduce((sum, i) => {
            sum.push({ checkId: i.id, isGreat: i.isGreat, checkSource: '0' })
            return sum
          }, [])
        } else {
          arr.push({
            checkId: item.id,
            isGreat: item.isGreat,
            checkSource: '0'
          })
        }
        total = [...total, ...arr]
        return total
      }, [])
      // 保存简易行政处罚
      saveSimpleAdministration({
        examineId: this.tableHeadInfo.id,
        executorDeptId: this.tableHeadInfo.executorDeptId,
        executorDeptName: this.tableHeadInfo.executorDeptName,
        executorId: this.tableHeadInfo.executorId,
        executorName: this.tableHeadInfo.executorName,
        probList: blcList,
        caseCrimeTime: this.tableHeadInfo.examineStartTime.replace('/', '-').replace('/', '-') + ':00'
      }).then(
        res => {
          // GET行政处罚-简易程序文书列表所需id
          this.simpleId = res.id
          // Bus.$emit('simplePenaltyId',res.id)
          this.$store.commit('setSimpleId', this.simpleId)
          this.$emit('successHandle')
          this.$store.commit('setShowMulitList')
          this.$store.commit('setShowSimplePenality')
        },
        err => {
          this.$message({
            message: '操作失败',
            type: 'error'
          })
          console.info('请求失败', err)
        }
      )
    }
  },
  component: {}
}
</script>

<style>
.centerCon {
  text-align: center;
}
.lineadmin {
  margin: 15px 0 0;
}
</style>