<template>
  <div>
    <jshHeader :header="header"></jshHeader>
    <div id="imgBac">
      <iframe
        :src="url"
        :style="{ height: '95vh', width: '100%' }"
        frameborder="0"
        border="0"
      ></iframe>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { NavBar, Cell, CellGroup, Search, Tab, Tabs, Icon, Toast } from "vant";
import jshHeader from "@/components/jsh-header/jsh-header.vue";

Vue.use(NavBar);
Vue.use(Cell);
Vue.use(CellGroup)
  .use(Search)
  .use(Tab)
  .use(Toast)
  .use(Icon)
  .use(Tabs);

export default {
  name: "exam-questions",
  components: {
    jshHeader
  },
  data() {
    return {
      url: "",
      header: {
        title: "考试"
      },
      height: 0
    };
  },
  methods: {
    // 获取可视高度
    getClientHeight() {
      return {
        width:
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth,
        height:
          window.innerHeight ||
          document.documentElement.clientHeight ||
          document.body.clientHeight
      };
    }
  },
  created() {
    this.url = this.$route.query.testUrl;
  }
};
</script>

<style lang="scss" scoped></style>
