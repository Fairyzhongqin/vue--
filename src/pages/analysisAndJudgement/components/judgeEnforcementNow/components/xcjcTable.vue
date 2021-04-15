<template>
  <div class="judgeNowtable">
    <el-table :data="tableData" border style="width: 100%" v-loading="loading" row-key="deptCode" lazy
      :tree-props="{children: 'children', hasChildren: 'isHasChild'}" stripe>
      <el-table-column prop="deptName" label="所属区域" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="0" label="检查方案数" align="center"></el-table-column>
      <el-table-column prop="1" label="检查企业数" align="center"></el-table-column>
      <el-table-column prop="2" label="发现隐患数" align="center"></el-table-column>
      <el-table-column prop="3" label="复查企业数" align="center"></el-table-column>
    </el-table>
  </div>
</template>
<script>
  import { getHomePageData } from '@/api/manageSystem/index.js'
  import { debounce } from '@/utils/util.js'
  export default {
    name: 'judgeNowtable',
    props: ["recieveCode"],
    data() {
      return {
        // 现场检查数据
        tableData: [],
        startTime: '',
        endTime: '',
        loading: false
      }
    },
    methods: {
      getList(deptCode, startTime, endTime) {
        this.loading = true
        getHomePageData({
          deptCode: deptCode,
          startTime: startTime,
          endTime: endTime
        })
          .then(res => {
            this.loading = false
            console.info('现场检查tab数据', res)
            if (res.code === '0') {
              res.data.map(item => {
                item.isHasChild = item.isHasChild === true
                item.data.map(i => {
                  item[i.item] = i.num
                })
              })
              this.tableData = res.data
              // this.loading = false
            }
          })
          .catch(err => {
            this.loading = false
            this.tableData = [];
            throw new Error(err)
          })
      },
      load(tree, treeNode, resolve) {
        getHomePageData({
          deptCode: tree.deptCode,
          startTime: this.startTime,
          endTime: this.endTime
        }).then(res => {
          if (res.code === '0') {
            res.data.map(item => {
              item.isHasChild = item.isHasChild === '1'
              // 只取num
              item.data.map(i => {
                item[i.item] = i.num
              })
            })
            resolve(res.data)
          }
        })
      }
    },
    watch: {
      recieveCode: function (newVal) {
        this.debouncedGetList(newVal);
      }
    },
    created() {
      this.debouncedGetList = debounce(this.getList, 500);
      // this.getList('3202')
      this.debouncedGetList(this.recieveCode);
    }
  }
</script>
<style lang="less" scoped>
  .judgeNowtable {
    width: auto;
    height: 420px;
    overflow-y: auto;

    // 滚动条
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    /deep/.el-table {
      border-radius: 0;

      .el-loading-mask {
        background-color: transparent;
      }
    }

    /deep/.el-table,
    .el-table__expanded-cell {
      background-color: transparent;
    }

    /deep/.el-table td {
      border-bottom: none;
    }

    /deep/.el-table--border td {
      border-right: none;
    }

    /deep/.el-table .el-table__header thead .is-leaf {
      background: rgba(46, 67, 106, 1);
    }

    /deep/ .el-table tr {
      background-color: rgba(46, 67, 106, 1);
    }

    /deep/.el-table--striped .el-table__body tr.el-table__row--striped td {
      background: rgba(29, 49, 87, 1);
    }

    // rgba(78,88,120,1)
    /deep/.el-table--border th {
      border-right: none;
    }

    /deep/.el-table--border,
    .el-table--group {
      border: 1px solid rgba(78, 88, 120, 1);
    }

    /deep/.el-table--border::after {
      height: 0;
    }

    /deep/.el-table--border th {
      border-bottom: 1px solid rgba(78, 88, 120, 1);
    }

    /deep/.el-table::before {
      height: 0;
    }

    // 头部字
    /deep/.el-table thead {
      font-size: 18px;
      font-family: PingFang SC;
      color: rgba(255, 255, 255, 1);
      line-height: 24px;
    }

    // 表格字
    /deep/.el-table .cell {
      color: #fff;
    }

    // highlight color background:rgba(9,26,57,1);
    /* 用来设置当前页面element全局table 选中某行时的背景色*/
    /deep/.el-table__body tr.current-row>td {
      background-color: rgba(9, 26, 57, 1) !important;
      /* color: #f19944; */
      /* 设置文字颜色，可以选择不设置 */
    }

    /* 用来设置当前页面element全局table 鼠标移入某行时的背景色*/
    /deep/.el-table--enable-row-hover .el-table__body tr:hover>td {
      background-color: rgba(9, 26, 57, 1);
      color: #fff;
      /* 设置文字颜色，可以选择不设置 */
    }
  }
</style>