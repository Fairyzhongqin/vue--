<template>
  <div>
    <!-- <div class="name">特殊情形新增现场检查</div> -->
    <div class="data">
      <el-row>
        <el-col :span="12">
          <div class="body">
            <span>企业名称：</span>
            <span>{{tableHeadInfo.companyName}}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="body">
            <span>检查时间：</span>
            <span>{{tableHeadInfo.examineStartTime && tableHeadInfo.examineEndTime ? (tableHeadInfo.examineStartTime + ' - ' + tableHeadInfo.examineEndTime) : ''}}</span>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <div class="body">
            <span>检查场所：</span>
            <span>{{tableHeadInfo.examineSite}}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="body">
            <span>检查形式：</span>
            <span>{{tableHeadInfo.examineSourceName}}</span>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <div class="body">
            <span>执法人员：</span>
            <span>{{tableHeadInfo.executorName}}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="body">
            <span>执法部门：</span>
            <span>{{tableHeadInfo.executorDeptName}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="body">
            <span>检查方式：</span>
            <span>{{tableHeadInfo.examineTypeName}}</span>
          </div>
        </el-col>
      </el-row>
      <div class="check-inspection">
        <span>检查情况：</span>
        <span class="huanhang">{{tableHeadInfo.examineSituation}}</span>
      </div>
    </div>
    <el-dialog
      title="选择企业"
      width="990px"
      height="570px"
      :before-close="handleCom"
      :visible.sync="showComList"
    >
      <select-com :closeOrgDialog="handleCom" @getCom="getSelectedCom"></select-com>
    </el-dialog>
    <el-dialog
      title="选择执法人员"
      width="990px"
      height="570px"
      :before-close="handlePeople"
      :visible.sync="showPeopleList"
    >
      <select-people @getPeople="getSelectedPeople" :selectNum="3"></select-people>
    </el-dialog>
  </div>
</template>

<script>
import snSelect from '@components/snSelect/index'
import { mapState } from 'vuex'
import selectCom from '@/pages/onSiteInspection/newInspection/component/selectCom'
import selectOrg from '@/pages/onSiteInspection/newInspection/component/selectOrg'
import selectPeople from '@/pages/onSiteInspection/newInspection/component/selectPeople'

export default {
  name: 'inspectionHeader',
  data() {
    return {
      time: '',
      place: null,
      exampleData: null,
      // dept: {
      //   id: null,
      //   name: null,
      //   children: [],
      //   remark: null
      // },
      company: {
        id: null,
        companyName: null
      },
      people: null,
      peopleId: null,
      showPeopleList: false
    }
  },
  props: ['tableHeadInfo'],
  components: {
    snSelect,
    selectCom,
    // selectOrg,
    selectPeople
  },
  methods: {
    handleCom() {
      this.$store.commit('setComDialog')
    },
    handlePeople() {
      this.showPeopleList = !this.showPeopleList
    },
    getSelectedCom(org) {
      this.company = org
    },
    setExampleVal(val) {
      this.exampleData = val
    },
    getSelectedPeople(state, val) {
      if (state) {
        let nameList = [],
          idList = []
        val.forEach(item => {
          nameList.push(item.nickName)
          idList.push(item.id)
        })
        this.people = nameList.join(',')
        this.peopleId = idList.join(',')
        this.handlePeople()
      } else {
        this.handlePeople()
      }
    }
  },
  computed: {
    ...mapState(['showComList', 'showExample'])
  }
}
</script>

<style lang="less" scoped>
.name {
  font-size: 18px;
  font-family: 'PingFang-SC-Bold';
  font-weight: bold;
  margin: 0 0 30px;
}
.data {
  .body {
    display: flex;
    flex-direction: row;
    white-space: nowrap;
    width: 100%;
    line-height: 30px;
    margin-bottom: 8px;
    .el-input {
      /deep/ .el-icon-coffee::before {
        content: '. . .';
      }
      /deep/ .el-icon-coffee:hover {
        cursor: pointer;
      }
    }
    .long-input {
      width: 75%;
    }
    .right-input {
      width: 90%;
    }
  }
  .check-inspection {
    display: flex;
    flex-direction: row;
    white-space: nowrap;
    line-height: 30px;
  }
  .check-example {
    display: inline-block;
    padding-right: 10px;
    color: #0099ff;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}
.huanhang {
  display: inline-block;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: normal !important;
}
</style>
