<template>
  <div id="areaTree">
    <div class="tree-box">
      <div class="zTreeDemoBackground left">
        <ul
          id="treeDemo"
          class="ztree"
        ></ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "zTree",
  props: {
      treeData: Array
  },
  data: function() {
    return {
      setting: {
        data: {
          simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "pId",
            rootPId: 0
          }
        },
        view: {
          fontCss: {
            'color': '#333333'
          }
        }
      },
    };
  },
  mounted() {
    $.fn.zTree.init($("#treeDemo"), this.setting, this.treeData);
    this.expandAll();
  },
  methods: {
    freshArea: function() {
      $.fn.zTree.init($("#treeDemo"), this.setting, this.treeData);
    },
    expandAll() {//展开所有节点
      let zTree = $.fn.zTree.getZTreeObj("treeDemo");
      zTree.expandAll(true);
    }
  }
};
</script>

<style lang="less">
#areaTree {
  margin-bottom: 5px;
}
</style>