<template>
  <div class="container">
    <jshHeader :header="header"></jshHeader>
    <van-popup
      v-model="showDetailRongyu"
      style="background-color: transparent;overflow-y: visible"
    >
      <div class="rongyucontainer">
        <div class="rongyupop" style="text-align: center">
          <van-image
            width="65px"
            height="65px"
            fit="cover"
            :src="xunzhangpop.medalTypeUrl"
          >
          </van-image>
          <!--                <img  alt="">-->
        </div>
        <div class="namelesson" style="text-align: center">
          <span>{{ xunzhangpop.medalName }}</span>
        </div>
        <div class="namelesson" style="text-align: left">
          <span>
            <span v-if="xunzhangpop.coursesType === '2'" style="color: #909399"
              >[直播]</span
            >
            <span v-if="xunzhangpop.coursesType === '3'" style="color: #909399"
              >[研讨]</span
            >
            <span v-if="xunzhangpop.coursesType === '4'" style="color: #909399"
              >[系列]</span
            >
            {{ xunzhangpop.courseName }}
          </span>
        </div>
        <div class="teacher" style="">
          <span> 讲师：{{ xunzhangpop.lecturerName }} </span>
        </div>
        <div class="timeac">
          <span> 获得时间：{{ xunzhangpop.medalDate | filtertime }} </span>
        </div>
      </div>
      <div class="close">
        <img
          src="../../../../assets/images/xx.png"
          alt=""
          @click="closePopT()"
        />
      </div>
    </van-popup>
    <van-popup
      v-model="showDetail"
      style="background-color: transparent;overflow-y: visible"
    >
      <div class="imgPop" style="width: 100%">
        <van-image
          height="265px"
          width="100%"
          fit="cover"
          :src="zhengshupop.certificateUrl"
        >
        </van-image>
        <!--            <img class="bigim" :src="zhengshupop.certificateUrl" alt="" style="width: 100%">-->
      </div>
      <div class="introu">
        <!--        <div class="name">-->
        <!--          <span> 证书名称：{{ zhengshupop.certificateName }} </span>-->
        <!--        </div>-->
        <div
          v-for="(item, index) in zhengshupop.certificateAttributes"
          :key="index"
          class="nameclass"
        >
          <span> {{ item.attributeTypeName }}: </span>
          <span
            :key="index1"
            v-for="(item1, index1) in item.certificateAttributeDtos"
          >
            {{ item1.attributeName }}
          </span>
        </div>
        <div class="nameclass">
          <span>
            <span v-if="zhengshupop.type === 1">课程名称：</span>
            <span v-else>班级名称：</span>
            <span v-if="zhengshupop.courseType === '2'" style="color: #909399"
              >[直播]</span
            >
            <span v-if="zhengshupop.courseType === '3'" style="color: #909399"
              >[研讨]</span
            >
            <span v-if="zhengshupop.courseType === '4'" style="color: #909399"
              >[系列]</span
            >
            {{ zhengshupop.courseName }}
          </span>
        </div>
        <div class="teachername">
          <span> 讲师：{{ zhengshupop.lecturerName }} </span>
        </div>
        <div class="time">
          <span>
            获得时间：{{ zhengshupop.certificateDate | filtertime }}
          </span>
        </div>
        <div class="sub" @click="download(zhengshupop.certificateUrl)">
          <span>
            下载证书
          </span>
        </div>
      </div>
      <div class="close">
        <img
          src="../../../../assets/images/xx.png"
          alt=""
          @click="closePop()"
        />
      </div>
    </van-popup>
    <div class="header" style="position: fixed;z-index: 10" v-if="!nonet">
      <div class="zhshu" @click="changeTab(1)">
        <span
          :style="{
            color: tab === 1 ? 'rgba(50,50,51,1)' : 'rgba(100,101,102,1)',
            fontWeight: tab === 1 ? '500' : '400'
          }"
        >
          证书
        </span>
        <div class="lineBlue" v-show="tab === 1"></div>
      </div>
      <div class="xunzha" @click="changeTab(2)">
        <span
          :style="{
            color: tab === 2 ? 'rgba(50,50,51,1)' : 'rgba(100,101,102,1)',
            fontWeight: tab === 2 ? '500' : '400'
          }"
        >
          勋章
        </span>
        <div class="lineBlue" v-show="tab === 2"></div>
      </div>
    </div>
    <van-pull-refresh
      v-model="isPullLoading"
      @refresh="onRefresh"
      success-text="加载成功"
    >
      <van-list
        v-model="listDataLoading"
        :finished="listDataFinished"
        :finished-text="finishedText"
        @load="onLoadListData"
      >
        <div class="body" v-if="tab === 1 && !errorOne && !nonet">
          <div class="maylist d-flex" style="flex-wrap: wrap">
            <div v-for="(item, index) in listZs" :key="index">
              <van-image
                :src="item.certificateUrl"
                @click="showIt(item)"
                fit="cover"
                width="167px"
                height="117px"
              >
              </van-image>
            </div>
          </div>
        </div>
        <div class="body1" v-if="tab === 2 && !errorTwo && !nonet">
          <div
            style="background-color: white;margin-left: 15px;border-radius: 10px;width: 345px"
            :class="{ borderBlue: errorTwoFF }"
          >
            <div class="maylist d-flex" style="flex-wrap: wrap">
              <div
                class="xunzhenItem"
                @click="showDetailRongyuIt(item)"
                v-for="(item, index) in listXz"
                :key="index"
                style="text-align: center"
              >
                <van-image
                  width="54px"
                  height="54px"
                  fit="cover"
                  :src="item.medalTypeUrl"
                >
                </van-image>
                <div
                  class="fs-14"
                  style="color:rgba(50,50,51,1);padding-top: 10px"
                >
                  {{ item.medalName }}
                </div>
                <div>
                  <span
                    class="fs-12"
                    v-if="item.coursesType === '2'"
                    style="color: #909399"
                    >[直播]</span
                  >
                  <span
                    class="fs-12"
                    v-if="item.coursesType === '3'"
                    style="color: #909399"
                    >[研讨]</span
                  >
                  <span
                    class="fs-12"
                    v-if="item.coursesType === '4'"
                    style="color: #909399"
                    >[系列]</span
                  >
                  <span class="fs-12" style="color: #7D7E80">{{
                    item.courseName | filterName
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-list>
      <div
        v-if="errorOne"
        class="text-center"
        style="padding-top: 203px;height:500px"
      >
        <img
          src="../../../../assets/images/no-search-data.png"
          alt=""
          style="width:67px;height: 49px"
        />
        <div class="color-999 fs-13" style="">还没有数据哦~</div>
      </div>
      <div
        v-if="errorTwo"
        class="text-center"
        style="padding-top: 203px;height:500px"
      >
        <img
          src="../../../../assets/images/no-search-data.png"
          alt=""
          style="width:67px;height: 49px"
        />
        <div class="color-999 fs-13" style="">还没有数据哦~</div>
      </div>
      <div
        v-if="nonet"
        class="text-center"
        style="padding-top: 203px;height: 750px;background-color: white"
      >
        <img
          src="../../../../assets/images/network.png"
          alt=""
          style="width:100px;height: 70px"
        />
        <div class="fs-14" style="margin-top: 30px;color: #646566">
          网络请求失败
        </div>
        <div class="fs-12" style="margin-top: 8px;color: #969799">
          请检查您的网络，重新加载试试吧
        </div>
        <div class="flush" @click="shuaxin">刷新</div>
      </div>
    </van-pull-refresh>
  </div>
</template>
<script>
import { NavBar, List, PullRefresh, Toast, Dialog, Popup } from "vant";
import Vue from "vue";
import jshHeader from "@/components/jsh-header/jsh-header.vue";
import JSH from "@/core";
import CloudMarketing from "../../../../request/interface/cloud-marketing";

Vue.use(NavBar);
Vue.use(List);
Vue.use(Toast);
Vue.use(PullRefresh);
Vue.use(Popup);
Vue.use(Dialog);
export default {
  name: "honor",
  data() {
    return {
      // 下拉刷新loading
      isPullLoading: false,
      // 上拉加载loading
      listDataLoading: false,
      // 上拉加载数据完成
      listDataFinished: false,
      finishedText: "",
      tab: 1,
      showDetail: false,
      // 证书列表 跟 荣誉的列表 需要请求的数据不一样
      pageSize: 20,
      // 证书的分页
      zsList: 0,
      // 勋章的分页
      xuzList: 0,
      page: 0,
      // 证书列表
      imgList: [
        {
          certificateUrl:
            "http://img.yilihuo.com/group1/M00/33/25/oYYBAF2uqM6AWI9sAADpvDDy7L8486.png",
          certificateName: "我的结e业证书我的结业证书我的结业",
          courseName: "5G时代的全国直播运营课程全国直播运营课程超出换行",
          lecturerName: "路劲噢鞥",
          certificeteDate: "20202-33-33"
        },
        {
          certificateUrl:
            "http://img.yilihuo.com/group1/M00/33/25/oYYBAF2uqM6AWI9sAADpvDDy7L8486.png",
          certificateName: "我的结业证书我的结业证书我的结业",
          courseName: "5G时代的全国直播运营课程全国直播运营课程超出换行",
          lecturerName: "张力",
          certificeteDate: "20202-33-33"
        },
        {
          certificateUrl:
            "http://img.yilihuo.com/group1/M00/33/25/oYYBAF2uqM6AWI9sAADpvDDy7L8486.png",
          certificateName: "我的结业证书我的结业证书我的结业",
          courseName: "5G时代的全国直播运营课程全国直播运营课程超出换行",
          lecturerName: "刘金鹏",
          certificeteDate: "20202-33-33"
        }
      ],
      xunzhang: [
        {
          medalTypeUrl: "string",
          courseName: "string",
          lecturerName: "string",
          medalDate: "2020-05-12T06:23:24.455Z"
        },
        {
          medalTypeUrl: "string",
          courseName: "string",
          lecturerName: "string",
          medalDate: "2020-05-12T06:23:24.455Z"
        },
        {
          medalTypeUrl: "string",
          courseName: "string",
          lecturerName: "string",
          medalDate: "2020-05-12T06:23:24.455Z"
        },
        {
          medalTypeUrl: "string",
          courseName: "string",
          lecturerName: "string",
          medalDate: "2020-05-12T06:23:24.455Z"
        }
      ],
      img: "",
      showDetailRongyu: false,
      imgeRong: "",
      nameRong: "",
      teacherRong: "",
      timeRong: "",
      listZs: [],
      listXz: [],
      zhengshupop: "",
      xunzhangpop: "",
      header: {
        title: "荣誉"
      },
      nodata: false,
      isIos: true,
      errorTwoFF: false,
      errorOne: false, //证书缺省页
      errorTwo: false, //荣耀缺省页
      nonet: false
    };
  },
  components: {
    jshHeader
  },
  created() {
    const owner = this;
    // owner.$loading.show(2000);
    owner.ht.$emit("loading", true);
    const u = navigator.userAgent;
    const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isiOS) {
      //    ios
      this.isIos = true;
      console.log("ios");
    } else {
      this.isIos = false;
      console.log("android");
    }
  },
  methods: {
    shuaxin() {
      this.onRefresh();
    },
    download(value) {
      console.log("下载图片");
      // var a = document.createElement("a");
      // a.download = name || "pic";
      // a.href = value;
      // a.click();
      const owner = this;
      if (owner.isIos) {
        //    苹果系统的跳转方法
        //ios调用方式  nativeRoute是具体的方法名,
        if (window.webkit && window.webkit.messageHandlers) {
          window.webkit.messageHandlers.downloadImg.postMessage(value);
        }
      } else {
        //安卓调用方式  nativeRoute是具体的方法名,
        if (window.collegeNative) {
          window.collegeNative.downloadImg(value);
        }
      }
    },
    changeTab(value) {
      const that = this;
      that.tab = value;
      that.ht.$emit("loading", true);
      that.finishedText = "";
      that.listDataLoading = false;
      that.errorOne = false;
      that.errorTwo = false;
      if (value === 1) {
        //    证书 证书 20
        that.pageSize = 20;
      } else {
        that.pageSize = 30;
      }
      that.finishedText = "";
      that.$forceUpdate();
      that.searchList(1, data => {
        that.listDataLoading = false;
        if (that.tab === 1) {
          that.listZs = data.data.list;
        }
        if (that.tab === 2) {
          that.listXz = data.data.list;
          console.log(data.data.list, "ajsdhfjkhsadkfjh");
        }
      });
    },
    showIt(value) {
      const that = this;
      that.showDetail = true;
      console.log("点的我吗");
      console.log(value);
      that.zhengshupop = value;
    },
    closePop() {
      const that = this;
      that.showDetail = false;
    },
    closePopT() {
      this.showDetailRongyu = false;
    },
    showDetailRongyuIt(item) {
      const that = this;
      that.showDetailRongyu = true;
      that.xunzhangpop = item;
      console.log(item, "5555555555555555");
    },
    onRefresh() {
      const owner = this;
      owner.searchList(1, data => {
        owner.isPullLoading = false;
        if (owner.tab === 1) {
          owner.listZs = data.data.list;
        }
        if (owner.tab === 2) {
          owner.listXz = data.data.list;
        }
      });
    },
    // 上拉加载
    onLoadListData() {
      const owner = this;
      let page = null;
      if (owner.tab === 1) {
        // page = owner.zsList;
      } else if (owner.tab === 2) {
        page = owner.xuzList;
      }
      owner.searchList(page + 1, data => {
        owner.listDataLoading = false;
        // 重新处理数组
        if (owner.tab === 1) {
          console.log(data);
          owner.listZs = data.data.list;
        }
        if (owner.tab === 2) {
          owner.listXz = owner.listXz.concat(data.data.list);
        }
        // owner.list=data.data.list;
      });
    },
    searchList(page, callback) {
      const that = this;
      that.nonet = false;
      const param = {
        pageNum: page,
        pageSize: that.pageSize
      };
      // 证书列表
      if (that.tab === 1) {
        JSH.request({
          url: CloudMarketing.honorlist,
          method: "post",
          params: param,
          success(data) {
            if (data.success) {
              if (!data.data) {
                // that.$loading.hide();
                that.ht.$emit("loading", false);
                // console.log("1");
                that.isPullLoading = false;
              } else {
                that.ht.$emit("loading", false);
                callback(data);
                if (page === 1 && data.data.list.length === 0) {
                  that.errorOne = true;
                  that.errorTwo = false;
                  that.finishedText = "";
                  that.$forceUpdate();
                } else {
                  that.errorOne = false;
                  that.$forceUpdate();
                }
                Toast.clear();
                // 赋值分页
                that.zsList = page;
                // 数据是否加载完成
                that.listDataFinished = true;
                if (that.tab === 1 && that.errorOne) {
                  that.finishedText = "";
                } else {
                  that.finishedText = "没有更多了";
                }
              }
            } else {
              that.$toast.clear();
              that.ht.$emit("loading", false);
              that.$toast(data.errorMsg);
            }
          },
          error() {
            console.log("是不是进窝了");
            that.ht.$emit("loading", false);
            that.isPullLoading = false;
            that.listDataLoading = false;
            that.listDataFinished = true;
            that.finishedText = "";
            that.nonet = true;
            that.errorOne = false;
            that.errorTwo = false;
            console.log(that.finishedText);
          }
        });
      }
      // 荣誉列表
      if (that.tab === 2) {
        JSH.request({
          url: CloudMarketing.xunzahng,
          method: "post",
          params: param,
          success(data) {
            if (data.success) {
              that.ht.$emit("loading", false);
              if (!data.data) {
                that.isPullLoading = false;
              } else {
                // that.loadingOk = true;
                // if (page === 1 && data.data.list.length === 0) {
                //     that.errorTwo = true; //点赞缺省;
                // } else {
                //     that.errorTwo = false;
                //     console.log("1111", page);
                // }
                Toast.clear();
                callback(data);
                // 赋值分页
                if (page === 1 && data.data.list.length === 0) {
                  that.errorTwo = true; //点赞缺省;
                  that.errorOne = false;
                  that.errorTwoFF = false;
                } else {
                  that.errorTwoFF = true;
                  that.errorTwo = false;
                }
                that.xuzList = page;
                // 数据是否加载完成
                that.listDataFinished = data.data.list.length === 0;
                if (that.tab === 2 && that.errorTwo) {
                  that.finishedText = "";
                } else {
                  that.finishedText = "没有更多了";
                }
                // if (that.tab === 2 && that.errorTwo) {
                //     that.finishedText = "";
                // } else {
                //     that.finishedText = "没有更多了";
                // }
              }
            } else {
              that.$toast.clear();
              that.ht.$emit("loading", false);
              that.$toast(data.errorMsg);
            }
          },
          error() {
            console.log("是不是进窝了");
            that.$toast.clear();
            that.ht.$emit("loading", false);
            that.isPullLoading = false;
            that.listDataLoading = false;
            that.listDataFinished = true;
            that.finishedText = "";
            that.nonet = true;
            that.errorOne = false;
            that.errorTwo = false;
            // that.loadingOk = true;
            // that.nonet = true;
            // that.errorOne = false;
            // that.errorTwo = false;
            // // that.showYiChange = true;
            // that.isPullLoading = false;
            // that.listDataLoading = false;
            // that.listDataFinished = true;
            // that.finishedText = "";
          }
        });
      }
    }
  },
  filters: {
    filterName(value) {
      if (value && value.length > 7) {
        return value.slice(0, 6) + "...";
      } else {
        return value;
      }
      //
    },
    filtertime(value) {
      let time = new Date(value);
      let year = time.getFullYear();
      let month =
        time.getMonth() + 1 < 10
          ? "0" + (time.getMonth() + 1)
          : time.getMonth() + 1;
      let date = time.getDate();
      // let hours = time.getHours();
      // let minutes = time.getMinutes();
      // minutes = minutes < 10 ? "0" + minutes : minutes;
      if (date < 10) {
        date = "0" + date;
      }
      return year + "-" + month + "-" + date + " ";
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  background: #f2f3f5;

  .header {
    background: white;
    width: 100%;
    display: flex;

    div {
      flex: 1;
      text-align: center;
      height: 44px;
      line-height: 44px;
      position: relative;

      div {
        position: absolute;
        width: 40px;
        height: 3px;
        background: rgba(39, 128, 248, 1);
        border-radius: 1.5px;
        left: 39%;
        bottom: 1px;
      }

      span {
        font-size: 14px;
      }
    }
  }

  .body {
    padding: 10px 15px;

    .maylist {
      padding-top: 15px;
      margin-top: 45px;
      padding-left: 10px;
      /*.fffd {*/
      /*  margin-left: 5px;*/
      /*}*/
      img {
        width: 167px;
        height: 117px;
      }
    }
  }

  .body1 {
    .maylist {
      /*min-height: 550px;*/
      margin-top: 65px;
      background-color: white;
      /*padding-left: 6%;*/
      /*padding-bottom: 15px;*/
      /*width: 345px;*/
      border-radius: 10px;

      .xunzhenItem {
        width: 30%;
        margin-right: 2px;
        margin-top: 15px;
      }
    }

    img {
      width: 54px;
      height: 54px;
    }
  }
}

.imgPop {
  width: 100%;
  background-color: white;

  .bigim {
    height: 265px;
    width: 100%;
  }
}

.introu {
  padding: 15px;
  background: white;

  .name {
    span {
      color: #323233;
      font-size: 14px;
      font-weight: 500;
    }
  }

  .nameclass {
    margin-top: 15px;

    span {
      color: #646566;
      font-size: 14px;
      font-weight: 400;
    }
  }

  .teachername {
    margin-top: 10px;

    span {
      color: #7d7e80;
      font-size: 13px;
    }
  }

  .time {
    margin-top: 10px;

    span {
      color: #969799;
      font-size: 12px;
    }
  }

  .sub {
    text-align: center;
    line-height: 44px;
    width: 345px;
    border-radius: 50px;
    height: 44px;
    margin: 20px auto 0 auto;
    background: rgba(34, 126, 247, 1);

    span {
      font-size: 15px;
      color: white;
      font-weight: 500;
    }
  }
}

.close {
  margin-top: 15px;
  text-align: center;

  img {
    width: 40px;
    height: 40px;
  }
}

.van-popup {
  width: 100%;
  margin-top: 0px;
  background-color: rgba(0, 0, 0, 0.7);
  /*background-color: rgba(0,0,0,.7);*/
}

.rongyucontainer {
  margin-left: 47px;
  margin-right: 47px;
  border-radius: 4px;
  padding: 20px;
  background-color: white;

  .rongyupop {
    text-align: center;

    img {
      width: 65px;
      height: 65px;
    }
  }

  .namelesson {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    text-align: left;
    margin-top: 20px;

    span {
      font-size: 13px;
      color: #323233;
    }
  }

  .teacher {
    margin-top: 20px;

    span {
      font-size: 13px;
      color: #7d7e80;
    }
  }

  .timeac {
    margin-top: 20px;

    span {
      font-size: 12px;
      color: #969799;
    }
  }
}

.borderBlue {
  padding-bottom: 15px;
  min-height: 550px;
  padding-left: 6%;
}

.flush {
  width: 100px;
  height: 30px;
  border-radius: 15px;
  border: 1px solid rgba(39, 128, 248, 1);
  margin: 0 auto;
  color: #2780f8;
  font-size: 14px;
  line-height: 30px;
  margin-top: 30px;
}

/*width:80px;*/
/*height:6px;*/
/*background:rgba(39,128,248,1);*/
/*border-radius:3px;*/
</style>
