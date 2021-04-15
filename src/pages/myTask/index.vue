<template>
  <div>
    <task-list :path="path" @showCheck="showCheck" v-if="showList"></task-list>
    <check v-if="!showList" :item="item" @backPage="showCheck" :seeDetail="seeDetail"></check>
  </div>
</template>

<script>
import taskList from "./taskList";
import check from "@/pages/home/components/workAreaCheck";

export default {
  components: {
    taskList,
    check
  },
  data() {
    return {
      path: null,
      item: null,
      showList: true,
      seeDetail: null, // true为详情，false为处置
    };
  },
  created() {
    this.path = this.$route.fullPath.indexOf("done") !== -1 ? "done" : "todo";
  },
  methods: {
    showCheck(item, flag) {
      if (item) {
        this.item = item;
        this.showList = false;
        this.seeDetail = flag;
      } else {
        if(flag) {
          this.path = "done"
        } else {
          this.path = "todo"
        }
        this.showList = true;
        this.seeDetail = false;
      }
    }
  },
  watch: {
    $route(to, from) {
      console.log(to, from, 'hellowjoijiowjewo')
      this.showList = true;
      if(to.fullPath === '/doneTask') {
        this.path = "done"
      }
      if(to.fullPath === '/todoTask') {
        this.path = "todo"
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>