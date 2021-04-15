<template>
  <div class="main">
    <el-row class="retrieval-container">
      <div class="select-org-body">
        <el-tree
          :data="data"
          :props="defaultProps"
          node-key="id"
          :default-expand-all="false"
          @node-click="sortNodeClick"
          :accordion="true"
          :default-expanded-keys="defaultDept"
          :expand-on-click-node="false"
          class="select-check-only"
        >
          <div
            :class="[
                {
                  treeFather: data.child && data.child.length > 0, 
                  treeSon: !data.child || data.child.length === 0,
                  deptIsClick: data.isChecked
                }, 
                'tree-common'
              ]"
            slot-scope="{ node, data }"
          >{{ data.name }}</div>
        </el-tree>
      </div>
    </el-row>
    <div class="oper-button">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="sure">确定</el-button>
    </div>
  </div>
</template>

<script>
import snSelect from '@components/snSelect/index'
import { getOrgList } from '@/api/onSiteInspection/index'

export default {
  name: 'selectOrg',
  components: {
    snSelect
  },
  props: {
    closeOrgDialog: {
      type: Function
    }
  },
  data() {
    return {
      data: [],
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      selectedOrg: null,
      defaultDept: [],
      deptInfo: {}
    }
  },
  methods: {
    sortNodeClick(val) {
      this.searchDeptId(null, this.data)
      val.isChecked = true
      let indexList = this.searchDeptId(val.id, this.data)
      console.log(indexList, '9999999999999')
      let data = null
      if (indexList && indexList.length > 0) {
        indexList.forEach(item => {
          data = data ? data.child[item] : this.data[item]
        })
        data.isChecked = true
      }
      this.selectedOrg = val
    },
    // 获取部门数据list
    initOrgList(data = {}) {
      getOrgList(data).then(res => {
        this.data = res.data
        console.log(this.data, '看一下部门数据')
        this.findDefaultDept(res.data)
      })
    },
    sure() {
      if (this.selectedOrg && this.selectedOrg !== '') {
        this.$emit('getOrg', this.selectedOrg)
        this.closeOrgDialog()
      } else {
        this.$message({
          message: '请选择部门',
          type: 'warning'
        })
      }
    },
    close() {
      this.closeOrgDialog()
    },
    findDefaultDept(tree = []) {
      if (this.defaultDept && this.defaultDept.length > 0) return
      for (let i = 0; i < tree.length; i += 1) {
        if (tree[i].id == this.deptInfo.parentId) {
          this.defaultDept = [tree[i].id]
          tree[i].child.some(item => {
            console.log(item, '+=======')
            if (item.id == this.deptInfo.id) {
              this.$set(item, 'isChecked', true)
            }
            return item.id === this.deptInfo.id
          })
          return
        }
        if (tree[i].child && tree[i].child.length > 0) {
          this.findDefaultDept(tree[i].child)
        }
      }
    },
    searchDeptId(id, arr) {
      let indexArr = []
      let tempIndex = null
      let result = arr.some((item, index) => {
        this.$set(item, 'isChecked', false)
        tempIndex = index
        if (item.id === id) {
          return true
        } else {
          if (item.child && item.child.length > 0) {
            let tempResult = this.searchDeptId(id, item.child)
            if (tempResult) {
              indexArr = [...tempResult]
              return true
            } else {
              return false
            }
          } else {
            return item.id === id
          }
        }
      })
      if (result) {
        indexArr.unshift(tempIndex)
        return indexArr
      } else {
        return null
      }
    }
  },
  mounted() {
    this.initOrgList({ isPaging: 'false' })
    this.deptInfo = this.$store.state.OrgData
  }
}
</script>

<style lang="less" scoped>
.main {
  .retrieval-container {
    margin: 8px 16px 0;
    height: 392px;
    background-color: #eef5f9;
    border-bottom: 1px solid #e0e0e0;
    overflow: hidden;
    .select-org-body {
      overflow-y: auto;
      overflow-x: hidden;
      width: 103%;
      height: 100%;
      .deptIsClick {
        // background-color: #CEE4FF;
        &::after {
          content: '';
          display: block;
          position: absolute;
          top: 10px;
          right: 15px;
          width: 18px;
          height: 9px;
          border-left: 1px solid #0099ff;
          border-bottom: 1px solid #0099ff;
          transform: rotate(-45deg);
        }
      }
    }
  }
  .oper-button {
    display: flex;
    justify-content: flex-end;
    padding: 6px 16px;
  }
}
.select-check-only {
  /deep/ .el-tree-node {
    position: relative;
    .el-tree-node__content {
      height: 37px;
      border-top: 1px solid #e0e0e0;
      .tree-common {
        line-height: 37px;
      }
    }
  }
}
</style>