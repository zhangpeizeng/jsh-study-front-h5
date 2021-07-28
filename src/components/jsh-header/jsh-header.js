import Vue from "vue";
import { Image, List, Popup, Field, Loading, Toast, Col, Row } from "vant";

Vue.use(Image)
  .use(List)
  .use(Popup)
  .use(Field)
  .use(Loading)
  .use(Col)
  .use(Row)
  .use(Toast);

export default {
  name: "jsh-header",
  props: ["header", "router"],
  data() {
    return {};
  },
  methods: {
    back() {
      if (this.header.backType) {
        this.$emit("leftClick");
      } else {
        this.$router.go(-1); //返回上一层
      }
    },
    //右侧点击
    rightClick() {
      this.$emit("rightClick");
    },
    //跳转到搜索页面
    toSearchPage(routeParams = "/public/search-list") {
      this.$router.push(routeParams);
    },
    //控制子组件得分类标签是否展示
    displayLabel() {
      this.$parent.fatherLabel();
    }
  },
  created() {}
};
