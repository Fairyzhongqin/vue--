<template>
  <div class="business_lay">
    <h3>{{titleName}}详情</h3>
    <div class="bussinessLayWrap">
      <component
        :is="currentCompreComponent"
        :param="jcfaParam"
        :detailInfo="xcjcParam"
        :zgfcId="zgfcId"
        :writListType="writListType"
        :sourceInfo="sourceInfo"
        :isInspectionDetail="isInspectionDetail"
        :currCom="currCom"
        forBrowse
      ></component>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import jcfa from '@/pages/inspectionScheme/view'
import xcjc from '@/pages/onSiteInspection/seeInspection'
import jcjgxl from '@/pages/onSiteInspection/seeInspection'
// import zgfc from "@/pages/rectification/innerReview/newInnerReview"

import ajsp from '@/pages/commonHandle/newHandle/lianshenpi'
import ajdc from '@/pages/commonHandle/newHandle/anjiandiaocha'
import cfcl from '@/pages/commonHandle/newHandle/anjianshenli/components/penaltyDiscretion'
import ajdcbg from '@/pages/commonHandle/newHandle/anjianshenli/components/investigationReport'
import cfgz from '@/pages/commonHandle/newHandle/anjianshenli/components/administrativeNotification'
import zztz from '@/pages/commonHandle/newHandle/anjianshenli/components/penaltyOrgHearing'
import fzsh from '@/pages/commonHandle/newHandle/anjianshenli/components/departmentAudit'
import jttl from '@/pages/commonHandle/newHandle/anjianshenli/components/groupDiscussion'
import cfjd from '@/pages/commonHandle/newHandle/chufashishi/components/decisionPunishment'
import fkdzx from '@/pages/commonHandle/newHandle/chufashishi/components/executionPunishment'
import jasp from '@/pages/commonHandle/newHandle/jieanshenpi'
import ajyq from '@/pages/commonHandle/newHandle/anjianyanqi'
import xzqz from '@/pages/commonHandle/newHandle/xingzhengqiangzhi'
import ajys from '@/pages/commonHandle/newHandle/anjianyison'
import ajzz from '@/pages/commonHandle/newHandle/anjianzhongzhi'
import dzjz from '@/pages/commonHandle/newHandle/dianzijuanzong'

import writList from '@/pages/comprehensiveBrowse/writList'

import { getInspectionDetail } from '@api/onSiteInspection/index'
export default {
  components: {
    ajsp,
    ajdc,
    cfcl,
    ajdcbg,
    cfgz,
    zztz,
    fzsh,
    jttl,
    cfjd,
    fkdzx,
    jasp,
    ajyq,
    xzqz,
    ajys,
    ajzz,
    dzjz,
    jcfa,
    xcjc,
    jcjgxl,
    writList
    // zgfc
  },
  data() {
    return {
      titleName: '',
      jcfaParam: '',
      xcjcParam: '',
      zgfcId: '',
      crit: {}, // 处罚裁量记录
      writListType: '',
      sourceInfo: {},
      isInspectionDetail: false, //现场检查 结果处理
      currCom: ''// 集体讨论1、2次
    }
  },
  props: {
    planExamineId: {
      type: String,
      default: ''
    }
  },
  created() {},
  methods: {
    initInfo(val) {
      console.info(val.dataId)
      this.titleName = val.treeName
      this.jcfaParam = val.dataId
      this.zgfcId = val.dataId
      // this.xcjcParam =
      if (val.treeCode === 'xcjc' || val.treeCode === 'jcjgxl') {
        getInspectionDetail({
          id: val.dataId
        }).then(res => {
          console.info('see inspection', res)
          this.xcjcParam = res.data
          this.isInspectionDetail = val.treeCode === 'xcjc'
          this.$store.commit('setCompreComponent', val)
        })
      } else if (val.treeCode === 'jcfa') {
        // this.jcfaParam = this.planExamineId
        this.$store.commit('setCompreComponent', val)
      } else if (val.treeCode === 'zgfc' || val.treeCode === 'yqzgsqsp' || val.treeCode === 'yqzgfc') {
        this.writListType = val.treeCode
        this.sourceInfo = val
        this.$store.commit('setCompreComponent', {
          treeCode: 'writList'
        })
      } else if (val.treeCode === 'jttl' || val.treeCode === 'jttl2') {
        if (val.treeCode === 'jttl') {
          this.currCom = 'groupDiscussion'
          this.$store.commit('setCompreComponent', val)
        } else {
          this.currCom = ''
          this.$store.commit('setCompreComponent', {
            treeCode: 'jttl'
          })
        }
      } else {
        this.$store.commit('setCompreComponent', val)
      }
    }
  },
  computed: {
    ...mapState(['currentCompreComponent'])
  }
}
</script>

<style lang="less" scoped>
.business_lay {
  background-color: #ffffff;
  border: 1px solid rgba(221, 221, 221, 1);
  box-shadow: 0px 2px 4px 0px rgba(220, 229, 230, 1);
  border-radius: 8px;
  padding: 16px;
  margin: 8px;
  h3 {
    margin: 0;
    padding: 0;
    line-height: 17px;
    padding-bottom: 19px;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    font-size: 18px;
  }
  .bussinessLayWrap {
    position: relative;
    .button {
      position: absolute;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: center;
      width: 100%;
      background: #ffffff;
      line-height: 52px;
      height: 52px;
      z-index: 1;
      left: 0;
      bottom: 0;
    }
  }
}
</style>