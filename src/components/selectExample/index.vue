<template>
  <div>
    <el-tabs tab-position="left"
             class="item-is-left"
             @tab-click="tab">
        <el-tab-pane v-for="(item,index) in editableTabs"
                     :key="index">
          <div slot="label"
               @click="getInfo(item)">
            <i class="el-icon-date"></i>
            <span class="hidden">{{item.exampleName}}</span>
            <!-- <div></div> -->
            <el-button style="margin-left: 6px "
                       type="text"
                       @click.stop="removeTab(item)"
                       v-if="indexq==index">×</el-button>
          </div>
          <div style="padding: 12px"
               contenteditable="true"
               @click="updateContent(index)"
               :ref="index">{{item.exampleContent}}</div>
        </el-tab-pane>
      <el-tab-pane v-if="showPane">
        <div slot="label">
          <el-input v-model="input"
                    class="inputStyle"
                    maxlength="50"></el-input>
          <span @click="remove">×</span>
        </div>
        <el-input type="textarea"
                  class="inputStyle"
                  placeholder=" 请输入检查情况示例，以后您可以直接使用该示例"
                  v-model="textarea"
                  maxlength="500"></el-input>
      </el-tab-pane>
    </el-tabs>
    <span slot="footer"
          class="dialog-footer">
      <div>
        <el-button type="text"
                   @click="add">+新增示例</el-button>
      </div>
      <div>
        <el-button @click="close">取 消</el-button>
        <el-button type="primary"
                   @click="save">保 存</el-button>
        <el-button type="primary"
                   @click="use">使用此示例</el-button>
      </div>
    </span>
  </div>
</template>
<script>
import {
  examplelabelList,
  examplelabelSave,
  examplelabelDelete
} from "@api/fileRelated";
export default {
  props: {
    type: { // 来自哪个模块： penalty 一般行政处罚
      type: String
    }
  },
  data () {
    return {
      indexq: "",
      saveContent: "", //选中的值  要传给使用示例
      editableTabs: [],
      input: "示例命名",
      textarea: "",
      showButton: false,
      showPane: false,
      order: null,
    };
  },
  created () {
    this.getList();
  },
  methods: {
    updateContent (index) {
      this.order = index;
    },
    remove () {
      // this.showPane=false;
      this.cancel();
    },
    //取消
    cancel () {
      this.showPane = false;
      this.input = "示例命名";
      this.textarea = "";
    },
    close () {
      this.showPane = false;
      this.input = "示例命名";
      this.textarea = "";
      this.$emit("handleExample");
    },
    getInfo (item) {
      this.saveContent = item && item.exampleContent ? item.exampleContent : "";
    },
    contentChange (index) {
      console.log("sjbfjksk", index)
    },
    tab (tab, event) {
      this.indexq = tab.paneName;
      this.getInfo(this.editableTabs[this.indexq]);
    },
    getList () {
      let type = this.type === 'penalty' ? '1' : '0'
      examplelabelList({ type: type }).then(res => {
        console.log(res.data, '88888888888', this.editableTabs);
        this.editableTabs = res.data;
      });
    },
    //添加
    add () {
      this.showPane = true;
      this.order = null;
      this.textarea = sessionStorage.setItem("textExample", this.textarea);
      console.log("this.textarea", this.textarea);
    },
    //保存
    save () {
      let id = null;
      let userId = null;
      console.log(this.order, '999999999999', this.$refs)
      if (this.order !== null || this.showPane) {
        if (this.order !== null) {
          this.textarea = this.$refs[this.order][0].innerHTML;
          id = this.editableTabs[this.order].id;
          userId = this.editableTabs[this.order].userId;
          this.input = this.editableTabs[this.order].exampleName;
        }
        let exampleLabel = {
          exampleContent: this.textarea,
          exampleName: this.input,
          exampleType: this.type === 'penalty' ? '1' : '0',
          id, userId
        };
        // hack 新增后立即使用不生效的问题
        this.saveContent = exampleLabel.exampleContent;
        if (this.textarea && this.textarea !== "") {
          examplelabelSave(exampleLabel).then(res => {
            this.getList();
            this.input = "示例命名";
            this.textarea = "";
            this.showPane = false;
            this.order = null;
          });
        }
      }
    },
    //删除
    removeTab (item) {
      let id = item.id;
      examplelabelDelete({ id })
        .then(res => {
          this.getList();
        })
        .catch(err => {
          console.log(err);
        });
    },
    //使用此示例
    use () {
      console.log("使用中的saveContent", this.saveContent);
      this.$emit(
        "setExampleVal",
        this.saveContent
          ? this.saveContent
          : this.editableTabs[0].exampleContent
      );
      this.close();
    }
  }
};
</script>

<style lang="less" scoped>
/deep/.el-tabs--left .el-tabs__item.is-left {
  text-align: left;
}
.item-is-left {
  display: grid;
  grid-template-columns: 30% 70%;
  height: 270px;
  /deep/ .el-tabs__header {
    background: rgba(238, 245, 249, 1);
  }
  /deep/ .el-tab-pane {
    height: 100%;
  }
  /deep/ .el-tabs__active-bar {
    left: 0;
  }
  /deep/ .el-tabs__item.is-active {
    background: #fff;
  }
}
.hidden {
  display: inline-block;
  line-height: 1;
  width: 106px;
  height: 13px;
  // overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.inputStyle {
  height: 100%;
  /deep/ .el-textarea__inner {
    border: 0;
    height: 100%;
  }
}
.dialog-footer {
  display: flex;
  justify-content: space-between;
  padding-right: 16px;
  /* padding-left:16px;  */
  border-top: 1px solid #e0e0e0;
  padding-top: 10px;
  margin-left: 16px;
  /* margin-top: 30px; */
}
/deep/.el-tabs--left .el-tabs__nav-wrap.is-left{
  margin:0px;
  padding:0px;
}
/deep/.el-tabs__header{
  overflow-y:auto; 
}
/deep/.el-tabs__nav-wrap .is-scrollable .is-left{
 display: initial;
}
/deep/.el-tabs__nav-prev{
  display: none;
}
/deep/.el-tabs__nav-next{
  display: none;
}
/deep/.el-tabs__nav-scroll{
  overflow-y: auto
}
/deep/.el-tabs--left, .el-tabs--right{
  overflow: auto
}
</style>
