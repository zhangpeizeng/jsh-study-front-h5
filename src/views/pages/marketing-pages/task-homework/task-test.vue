<template>
  <div>
    <div class="top-header" style="top: 85px;position: fixed;z-index: 8;">
      <div class="tab-container">
        <div
          class="fin-status"
          @click="changeStatus(1)"
          :class="{ radio: true, active: selectStatus === 1 }"
        >
          待考
        </div>
        <div
          @click="changeStatus(2)"
          class="fin-status"
          :class="{ radio: true, active: selectStatus === 2 }"
        >
          缺考
        </div>
        <div
          @click="changeStatus(3)"
          class="fin-status"
          :class="{ radio: true, active: selectStatus === 3 }"
        >
          已考
        </div>
        <div
          @click="changeStatus(4)"
          class="fin-status"
          :class="{ radio: true, active: selectStatus === 4 }"
        >
          未达标
        </div>
      </div>
    </div>
    <testList
      :selectStatus="selectStatus"
      @getDataFromL="totalNumber"
    ></testList>
  </div>
</template>
<script>
import Vue from "vue";
import { Toast, NavBar, Cell, CellGroup, List, PullRefresh } from "vant";
import testList from "@/views/pages/marketing-pages/task-homework/test-list.vue";

Vue.use(NavBar);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(List);
Vue.use(PullRefresh);
Vue.use(Toast);
export default {
  name: "task-test",
  props: ["classId"],
  components: {
    testList
  },
  data() {
    return {
      flag: 1,
      data: "",
      count: null,
      //选中的考试状态
      selectStatus: 1
    };
  },
  methods: {
    changeStatus(val) {
      this.selectStatus = val;
    },
    tabFlag(item) {
      this.flag = item;
    },
    totalNumber(value) {
      this.$emit("testLength", value);
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
  .radio {
    font-size: 13px;
    display: inline-block;
    width: 72px;
    height: 24px;
    color: #7d7e80;
    text-align: center;
    line-height: 24px;
    background: #f5f5f5;
    border-radius: 4px;

    &.active {
      color: #2780f8;
      border-radius: 6px;
      border: 1px solid rgba(39, 128, 248, 1);
      background: url("../../../../assets/images/radio-checked-blue.png")
          no-repeat right bottom,
        rgba(239, 246, 255, 1);
      background-size: 10px 13px;
    }

    & + .radio {
      margin-right: 14px;
    }
  }
  .fin-status {
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(125, 126, 128, 1);
    background: rgba(242, 243, 245, 1);
    border-radius: 6px;
    width: 72px;
    height: 24px;
    text-align: center;
    line-height: 24px;
    margin-right: 14px;
  }
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
