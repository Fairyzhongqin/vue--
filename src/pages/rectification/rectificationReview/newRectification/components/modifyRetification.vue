<template>
  <div class="modify_rectification">
    <!-- 其实本来就只有一项 不需要 v-for 但是以防万一  -->
    <div v-for="(item,index) in selectedList" :key="index" class="inner">
      <div class="indexPosit">
        <span>{{index + 1}}、</span>
      </div>
      <div class="lineCon">
        <span>检查项目类别：</span>
        <span>{{item.discretionTypeName}}</span>
      </div>
      <div
        style="font-size:16px;color:rgba(51,51,51,1);font-weight:700; white-space:wrap"
        class="lineCon"
      >
        <span>检查内容：</span>
        <!-- I'm dead !  -->
        <span>{{item.checkItem !== null ? item.checkItem : item.checkContent}}</span>
      </div>
      <div class="lineCon">
        <span>检查描述：</span>
        <span>{{item.negativeDesc}}</span>
      </div>

      <div class="lineCon">
        <span>复查时间：</span>
        <el-date-picker
          v-model="item.reviewTime"
          type="date"
          placeholder="请选择复查时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </div>
      <div class="lineCon spec">
        <span>复查意见：</span>
        <el-input v-model="item.reviewOpinion" placeholder="请输入复查意见"></el-input>
      </div>
    </div>
    <div class="modifyRectificationBtn">
      <el-button plain @click="cancel">取消</el-button>
      <el-button type="primary" @click="remakRectificationWrit">制作复查意见书</el-button>
    </div>
  </div>
</template>

<script>
import { handleDateRef, dateFormat, getWritParams, timestampToTime } from '@/utils/util'
import { rectificationPdfModifyAndUpdate } from '@/api/rectification/index'
import { updateWrit } from '@/api/fileRelated'
export default {
  name: 'modify_rectification',
  components: {},
  data() {
    return {
      pickerOptions: {
        // 设置选择三天之前到今天的日期
        disabledDate(time) {
          let curDate = new Date().getTime()
          let three = 3 * 24 * 3600 * 1000
          let threeDays = curDate - three
          return time.getTime() > Date.now() || time.getTime() < threeDays
        }
      },
      selectedList: [], //真正选择的检查项
      selectCheckIds: '' //检查项id
    }
  },
  props: ['option', 'originProbList', 'updateInfo'],
  methods: {
    cancel() {
      this.$emit('cancelRemake')
    },
    remakRectificationWrit() {
      // 重新制作整改复查意见书 前提是先保存 时间 做处理  从标准格式转回去横杠模式
      let arrayList = JSON.parse(JSON.stringify(this.selectedList))
      arrayList.forEach(item => {
        if (item.children && item.children.length > 0) {
          item.children.forEach(innerSon => {
            innerSon.expireTime = innerSon.expireTime ? innerSon.expireTime.replace(/\//g, '-') + ' 00:00:00' : ''
            innerSon.reviewTime = timestampToTime(innerSon.reviewTime, true)
            this.selectCheckIds += innerSon.id + ',' //拼接检查项的id
          })
        } else {
          item.expireTime = item.expireTime ? item.expireTime.replace(/\//g, '-') + ' 00:00:00' : ''
          item.reviewTime = timestampToTime(item.reviewTime, true)
          this.selectCheckIds += item.id + ',' //拼接检查项的id
        }
      })

      let params = arrayList
      rectificationPdfModifyAndUpdate(params)
        .then(res => {
          // 再去重新制作文书 然后展示
          if (res.code === '0') {
            this.$emit('remakeWrit', arrayList)
          }
        })
        .catch(err => {
          throw new Error(err)
        })
    }
  },
  created() {
    // 对数据做处理
    let arrayList = JSON.parse(JSON.stringify(this.updateInfo))
    arrayList.forEach(item => {
      // has children
      if (item.children && item.children.length > 0) {
        item.children.forEach(son => {
          son.reviewTime = handleDateRef(son.reviewTime)
          this.selectedList.push(son)
        })
      } else {
        item.reviewTime = handleDateRef(item.reviewTime)
        this.selectedList.push(item)
      }
    })
  },
  watch: {}
}
</script>

<style lang="less" scoped>
.modify_rectification {
  padding: 10px;
  position: relative;
  font-size: 14px;
  color: #666666;
  .el-form-item {
    margin-bottom: 0;
  }
  .inner {
    border-bottom: 1px solid #e0e0e0;
    margin: 5px 0;
  }
  .modifyRectificationBtn {
    box-sizing: border-box;
    padding-top: 10px;
    display: flex;
    justify-content: flex-end;
  }
}
.indexPosit {
  font-size: 14px;
  color: #333;
  font-weight: 700;
  width: 50px;
  height: 50px;
  display: inline-block;
  position: absolute;
}
.lineCon {
  padding-left: 20px;
  margin-bottom: 10px;
}
.el-select {
  /deep/.el-input {
    width: 353%;
  }
}
.spec {
  color: #333;
  /deep/ .el-input {
    width: 87%;
    /deep/ .el-input__inner {
      width: 97%;
    }
  }
}
</style>