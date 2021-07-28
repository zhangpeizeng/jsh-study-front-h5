<template>
  <div>
    <pkWallList></pkWallList>
  </div>
</template>
<script>
import Vue from "vue";
import { Toast, NavBar, Cell, CellGroup, List, PullRefresh } from "vant";
import pkWallList from "@/views/pages/marketing-pages/task-homework/pk-wall-list.vue";

Vue.use(NavBar);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(List);
Vue.use(PullRefresh);
Vue.use(Toast);
export default {
  name: "task-pk",
  props: ["classId"],
  components: {
    pkWallList
  },
  data() {
    return {
      flag: 1,
      data: "",
      count: null
    };
  },
  methods: {
    tabFlag(item) {
      this.flag = item;
    },
    totalNumber(val) {
      this.count = val;
    },
    workTotal(value) {
      this.$emit("length", value + this.count);
    }
  }
};
</script>
<style lang="scss" scoped>
.top-header {
  background-color: #ffffff;
  width: 100%;
  line-height: 34px;
  padding: 9px 15px;

  .tab-container {
    display: flex;
    align-items: center;

    .test {
      flex: 1;
      text-align: center;
      border-radius: 17.5px 0px 0px 17.5px;
      border: 1px solid rgba(34, 126, 247, 1);
      color: #227ef7;
    }
    .homework {
      flex: 1;
      text-align: center;
      border: 1px solid rgba(34, 126, 247, 1);
      border-left: 0;
      border-right: 0;
      color: #227ef7;
    }

    .pkwall {
      flex: 1;
      text-align: center;
      border-radius: 0px 50px 50px 0px;
      border: 1px solid rgba(34, 126, 247, 1);
      color: #227ef7;
    }
  }
}
</style>
