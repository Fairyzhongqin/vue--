<template>
  <div class="tag-container">
    <div class="shrink">
      <div class="shrink-button" @click="collChange()">
        <i class="iconfont iconshousuo"></i>
      </div>
    </div>

    <div id="tags-view-container" class="tags-view-container">
      <scroll-pane ref="scrollPane" class="tags-view-wrapper">
        <router-link
          v-for="tag in visitedViews"
          ref="tag"
          :key="tag.path"
          :class="isActive(tag)?'active':''"
          :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
          tag="span"
          class="tags-view-item"
          @click.middle.native="closeSelectedTag(tag)"
          @contextmenu.prevent.native="openMenu(tag,$event)"
        >
          <i class="iconfont iconzhuye" v-if="tag.title=='工作台'"></i>
          {{ tag.title }}
          <span
            v-if="!tag.meta.affix"
            class="el-icon-close"
            @click.prevent.stop="closeSelectedTag(tag)"
          />
        </router-link>
      </scroll-pane>
      <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
        <li @click="refreshSelectedTag(selectedTag)">刷新</li>
        <li
          v-if="!(selectedTag.meta&&selectedTag.meta.affix)"
          @click="closeSelectedTag(selectedTag)"
        >关闭</li>
        <li @click="closeOthersTags">关闭其它</li>
        <li @click="closeAllTags(selectedTag)">关闭所有</li>
      </ul>
    </div>
  </div>
</template>

<script>
import ScrollPane from "./ScrollPane";
import bus from "@/bus/index";
import { mapState } from "vuex";

export default {
  components: { ScrollPane },
  name: "TagsView",
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: []
    };
  },
  computed: {
    ...mapState(["addDictionaryInfo"]),
    visitedViews() {
      const tags = this.$store.state.visitedViews;
      let type = sessionStorage.getItem("role_permision") ? sessionStorage.getItem("role_permision").split(",")[0] : null;
      if (type === "common") {
        if (tags.length > 0) {
          if (tags[0].name !== "工作台") {
            tags.unshift({
              fullPath: "/content",
              name: "工作台",
              path: "/content",
              title: "工作台",
              meta: { keepAlive: true, affix: true }
            });
          }
        }
      }
      if (type === 'admin') {
        if (tags.length > 0) {
          if (tags[0].name === "工作台") {
            tags.shift()
          }
        }
      }
      return tags;
    },
    routes() {
      return this.$store.state.routes;
    }
  },
  watch: {
    $route() {
      this.addTags();
      if (this.$refs.tag) {
        this.moveToCurrentTag();
      }
    },
    visible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    },
    addDictionaryInfo: {
      handler: function(val, oldVal) {
        if (val) {
          this.closeSelectedTag(val);
        }
      }
    }
  },
  mounted() {
    this.initTags();
    this.addTags();
  },
  methods: {
    collChange() {
      this.$emit("collChange");
      bus.$emit("collChange");
    },
    isActive(route) {
      return route.path === this.$route.path;
    },
    filterAffixTags(routes, basePath = "/content") {
      let tags = [];
      routes.forEach(route => {
        if (route.meta && route.meta.affix) {
          const tagPath = path.resolve(basePath, route.path);
          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta }
          });
        }
        if (route.children) {
          const tempTags = this.filterAffixTags(route.children, route.path);
          if (tempTags.length >= 1) {
            tags = [...tags, ...tempTags];
          }
        }
      });
      return tags;
    },
    initTags() {
      const affixTags = (this.affixTags = this.filterAffixTags(this.routes));

      for (const tag of affixTags) {
        // Must have tag name
        if (tag.name) {
          this.$store.dispatch("addVisitedView", tag);
        }
      }
    },
    addTags() {
      const { name } = this.$route;
      if (name) {
        this.$store.dispatch("addView", this.$route);
      }
      return false;
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag;
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag);
            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch("updateVisitedView", this.$route);
            }
            break;
          }
        }
      });
    },
    refreshSelectedTag(view) {
      this.$store.dispatch("delCachedView", view).then(() => {
        const { fullPath } = view;
        this.$nextTick(() => {
          this.$router.replace({
            path: fullPath
          });
        });
      });
    },
    closeSelectedTag(view) {
      this.$store.dispatch("delView", view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          this.toLastView(visitedViews, view);
        }
      });
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag);
      this.$store.dispatch("delOthersViews", this.selectedTag).then(() => {
        this.moveToCurrentTag();
      });
    },
    closeAllTags(view) {
      this.$store.dispatch("delAllViews").then(({ visitedViews }) => {
        if (this.affixTags.some(tag => tag.path === view.path)) {
          return;
        }
        this.toLastView(visitedViews, view);
      });
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0];
      if (latestView) {
        this.$router.push(latestView);
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === "Dashboard") {
          // to reload home page
          this.$router.replace({ path: "/redirect" + view.fullPath });
        } else {
          this.$router.push("/login");
        }
      }
    },
    openMenu(tag, e) {
      const menuMinWidth = 105;
      const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
      const offsetWidth = this.$el.offsetWidth; // container width
      const maxLeft = offsetWidth - menuMinWidth; // left boundary
      const left = e.clientX; // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft;
      } else {
        this.left = left;
      }

      this.top = e.clientY;
      this.visible = true;
      this.selectedTag = tag;
    },
    closeMenu() {
      this.visible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.iconshousuo {
  font-size: 20px;
}
.tag-container {
  width: 100%;
  height: 52px;
  background-color: #fff;
  display: flex;
  flex-direction: row;
  box-shadow: inset 0 -1px 0 0 rgba(0, 0, 0, 0.12);
  .shrink {
    padding-top: 10px;
    padding-left: 17px;
    .shrink-button {
      width: 32px;
      height: 32px;
      font-size: 20px;
      color: #1273eb;
      background-color: #ebeef6;
      text-align: center;
      line-height: 32px;
      cursor: pointer;
    }
  }

  .tags-view-container {
    height: 52px;
    width: 100%;
    .tags-view-wrapper {
      .tags-view-item {
        display: inline-block;
        position: relative;
        cursor: pointer;
        height: 52px;
        line-height: 52px;
        //box-shadow: inset 0px -3px 0px #0099ff;
        //background: #fff;
        padding: 0 8px;
        font-size: 14px;
        margin-right: 35px;
        color: #666666;
        &:first-of-type {
          margin-left: 35px;
        }
        &:last-of-type {
          margin-right: 15px;
        }
        &.active {
          background-color: #fff;
          color: #0099ff;
          border-bottom-color: #0099ff;
          box-shadow: inset 0px -3px 0px #0099ff;
          .el-icon-close {
            background-color: #0099ff;
          }
        }
        .el-icon-close {
          position: absolute;
          right: -15px;
          top: 40%;
          border-radius: 50%;
          background-color: #dbdfe2;
          color: #fff;
          width: 14px;
          height: 14px;
          font-weight: bold;
          text-align: center;
          line-height: 14px;
          font-size: 12px;
        }
      }
    }
    .contextmenu {
      margin: 0;
      background: #fff;
      z-index: 3000;
      position: absolute;
      list-style-type: none;
      padding: 5px 0;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      color: #333;
      box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
      li {
        margin: 0;
        padding: 7px 16px;
        cursor: pointer;
        &:hover {
          background: #eee;
        }
      }
    }
  }
}
</style>
