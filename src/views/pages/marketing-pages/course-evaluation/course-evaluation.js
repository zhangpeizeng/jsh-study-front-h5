import Vue from "vue";
import { CloudMarketing } from "@/request";
import JSH from "@/core";
import jshHeader from "@/components/jsh-header/jsh-header.vue";
import {
  Field,
  CellGroup,
  Search,
  Card,
  Button,
  Uploader,
  ActionSheet,
  Switch,
  Popup,
  Loading,
  Overlay,
  ImagePreview,
  Sticky,
  Circle,
  Tab,
  Image as VanImage,
  Tabs,
  Rate,
  List,
  Toast
} from "vant";

Vue.use(Field);
Vue.use(CellGroup)
  .use(Search)
  .use(Rate)
  .use(List)
  .use(Card)
  .use(VanImage)
  .use(Tab)
  .use(Tabs)
  .use(Uploader)
  .use(Popup)
  .use(ActionSheet)
  .use(Sticky)
  .use(Switch)
  .use(ImagePreview)
  .use(Toast)
  .use(Loading)
  .use(Circle)
  .use(Overlay)
  .use(Button);

export default {
  name: "courseEvaluation",
  components: {
    jshHeader
  },
  data() {
    return {
      header: {
        title: "课程评价"
      },
      rate: 0,
      yuanRate: 0,
      tableList: [],
      //上拉加载状态结束
      finished: false,
      //上拉加载状态
      isFinished: false,
      //下拉刷新状态
      isRefresh: false,
      pageNum: 1,
      id: "",
      type: false
    };
  },
  methods: {
    gernerateId: function(index) {
      return "company_" + index;
    },
    //上拉加载
    onLoad() {
      this.isFinished = true;
      this.pageNum += 1;
      setTimeout(() => {
        this.getReviewList(2);
      }, 200);
    },
    //下拉刷新
    onRefresh() {
      this.pageNum = 1;
      this.isFinished = false;
      this.finished = false;
      this.getReviewList(1);
      this.isFinished = true;
    },
    // 获取列表数据
    getReviewList(type) {
      const that = this;
      if (type != 1 && type != 2) {
        that.ht.$emit("loading", true);
      }
      JSH.request({
        url: CloudMarketing.listappreviews,
        method: "post",
        params: {
          pageNum: that.pageNum,
          pageSize: 10,
          baseId: that.id
        },
        success(data) {
          if (data.success) {
            if (data.data.pages <= that.pageNum) {
              that.finished = true;
            } else {
              that.isFinished = false;
            }
            that.ht.$emit("loading", false);
            if (data.data.reviewList) {
              if (type == 1) {
                that.isRefresh = false;
                that.tableList = data.data.reviewList;
              } else if (type == 2) {
                that.tableList = [...that.tableList, ...data.data.reviewList];
              } else {
                that.tableList = data.data.reviewList;
                if (that.type) {
                  Toast("发布成功");
                }
              }
            }
            that.tableList.forEach(item => {
              item.isClick = true;
              item.isShow = false;
            });
            setTimeout(() => {
              that.tableList.forEach((item, index) => {
                let o = document.getElementById("company_" + index);
                if (!o) {
                  item.iswidth = false;
                  return;
                }
                let w = o.clientWidth || o.offsetWidth;
                if (w > 299) {
                  item.iswidth = true;
                } else {
                  item.iswidth = false;
                }
              });
            }, 1500);
            that.yuanRate = Number(data.data.averageGrade).toFixed(1);
            that.rate = that.getStarNum(data.data.averageGrade);
            that.header.title = "课程评价(" + data.data.total + ")";
          } else {
            Toast(data.errorMsg);
            setTimeout(() => {
              that.ht.$emit("loading", false);
            }, 1000);
          }
        },
        error(e) {
          console.log(e);
          that.ht.$emit("loading", false);
          Toast("接口异常");
        }
      });
    },
    /**
     * 是否展示公司提示信息
     * @param index
     */
    checkTip(index) {
      this.tableList.forEach((item, i) => {
        if (index !== i) {
          item.isShow = false;
        }
      });
      if (this.tableList[index].isShow) {
        this.tableList[index].isShow = false;
      } else {
        this.tableList[index].isShow = true;
      }
      this.$forceUpdate();
    },
    likeClick(item, index) {
      if (item.isClick) {
        this.tableList[index].isClick = false;
        // 取消点赞
        if (item.likeStatus == 0) {
          this.tableList[index].likeStatus = 1;
          this.tableList[index].likeNum -= 1;
          this.like(2, index, item);
        } else {
          // 点赞
          this.tableList[index].likeStatus = 0;
          this.tableList[index].likeNum += 1;
          this.like(1, index, item);
        }
      }
    },
    // 点赞
    like(type, index, item) {
      const that = this;
      JSH.request({
        url: CloudMarketing.addreviewslike,
        method: "post",
        params: {
          status: type,
          reviewId: item.reviewId
        },
        success(data) {
          if (data.success) {
            if (data.data) {
              that.tableList[index].isClick = true;
            }
          } else {
            Toast(data.errorMsg);
          }
        },
        error(e) {
          console.log(e);
          Toast("接口异常");
        }
      });
    },
    // 获取平均星星数量
    getStarNum(nums) {
      const num = Number(nums);
      if (num <= 1) {
        return 1;
      }
      if (num > 1 && num <= 2) {
        return 2;
      }
      if (num > 2 && num <= 3) {
        return 3;
      }
      if (num > 3 && num <= 4) {
        return 4;
      }
      if (num > 4 && num <= 5) {
        return 5;
      }
    }
  },

  created() {
    const owner = this;
    this.id = this.$route.query.id;
    if (this.$route.query.type) {
      this.type = true;
    }
    this.getReviewList();
    document.addEventListener(
      "click",
      function() {
        owner.tableList.forEach(item => {
          item.isShow = false;
        });
        owner.$forceUpdate();
      },
      false
    );
  }
};
