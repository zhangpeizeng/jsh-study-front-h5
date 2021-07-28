<template>
  <div class="study-list">
    <!--        头部框-->
    <div class="jsh-header">
      <div class="header">
        <div style="padding-top: 5px" class="left">
          <van-icon
            @click="backTo()"
            size="5vw"
            color="#ffffff"
            name="arrow-left"
          />
        </div>
      </div>
    </div>
    <!--    规则说明-->
    <div v-if="!isNetwork" @click="openRule()" class="rule-des">规则说明</div>
    <div v-if="!isNetwork">
      <div class="content-title">
        <div class="study-word">
          <img src="@/assets/images/study-word.png" alt="" />
        </div>
        <!--        <div class="now-data">当前数据截止到{{ date }}</div>-->
      </div>
      <div class="content-box">
        <div class="trophy">
          <img src="@/assets/images/trophy.png" alt="" />
        </div>
        <van-sticky :offset-top="35">
          <div
            style="padding-top: 10px;position: relative;background: white;border-radius: 8px;overflow: hidden"
          >
            <van-tabs @click="onClick" v-model="activeName">
              <van-tab title="周榜" name="1" />
              <van-tab title="月榜" name="2" />
            </van-tabs>
          </div>
        </van-sticky>
        <div class="ranking">
          你当前<span
            :class="{ rankRes: studyReportContent }"
            style="color: #F42755;display: inline-block;position: relative"
            >排名<span v-if="rownum">{{ rownum }}</span
            ><span v-else>-</span></span
          >，学习时长{{ studyTimeStr }}
          <div>
            <span v-show="studyReportContent" class="content">{{
              studyReportContent
            }}</span>
          </div>
        </div>
        <div class="list-box">
          <div
            v-for="(item, index) in studyReportRankingList"
            :key="index"
            class="item d-flex align-items-center justify-content-between"
          >
            <div class="d-flex align-items-center des">
              <div class="pic">
                <img
                  v-if="index === 0"
                  src="@/assets/images/gold-medal.png"
                  alt=""
                />
                <img
                  v-else-if="index === 1"
                  src="@/assets/images/medal-silver.png"
                  alt=""
                />
                <img
                  v-else-if="index === 2"
                  src="@/assets/images/medal-bronze.png"
                  alt=""
                />
                <span v-else>{{ index + 1 }}</span>
              </div>
              <div>
                <div class="company">{{ item.name }}</div>
                <div class="department">
                  {{ item.companyAbbreviation }}
                  <span
                    v-show="
                      item.companyAbbreviation && item.departmentAbbreviation
                    "
                    >-</span
                  >
                  {{ item.departmentAbbreviation }}
                </div>
              </div>
            </div>
            <div :class="{ time2: index < 3 }" class="time">
              {{ item.studyTimeStr }}
            </div>
          </div>
          <!--        列表无数据-->
          <div
            class="no-list"
            v-if="studyReportRankingList.length === 0 && noData"
          >
            <div style="padding-top: 6%">
              <img src="../../../../assets/images/no-search-data.png" alt="" />
            </div>
            <div style="padding-top: 10px">
              暂无排名，赶快去学习吧～
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--        网络有问题展示-->
    <div class="no-network" v-else-if="isNetwork">
      <div>
        <div class="set">
          <div style="padding-top: 30%">
            <img src="../../../../assets/images/network.png" alt="" />
          </div>
          <div style="padding-top: 30px;color: #646566;font-size: 14px">
            网络请求失败
          </div>
          <div style="padding-top: 10px">请检查您的网络，重新加载试试吧</div>
          <div class="refresh" @click="studyReport()">刷新</div>
        </div>
      </div>
    </div>
    <div style="height: 5px"></div>
  </div>
</template>

<script src="./study-list.js"></script>
<style lang="scss">
.study-list {
  .van-sticky--fixed {
    margin: 0 15px;
  }
}
</style>
<style scoped lang="scss">
.study-list {
  width: 100%;
  min-height: 100%;
  background-image: url(../../../../assets/images/study-list.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  min-height: 100%;
  .rule-des {
    position: fixed;
    right: 0;
    top: 10%;
    width: 18px;
    text-align: center;
    padding: 5px 0;
    color: #ffeff2;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    background: linear-gradient(90deg, #fe7b30 0%, #fb0929 100%);
    box-shadow: -1px 0px 5px 2px #e90e33;
    z-index: 999;
  }
  .jsh-header {
    background: #f42755;
    z-index: 999;
    position: fixed;
    top: 0;
    left: 0;
    width: 100% !important;
    .header {
      display: flex;
      justify-content: space-between;
      height: 44px;
      line-height: 44px;
      font-size: 17px;
      position: relative;

      .title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
        width: 270px;
        height: 44px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
      }
      .primary {
        background: #1bb5f1;
        color: #fff;
        border: 0;
      }

      .danger {
        background: #ef4f4f;
        color: #fff;
        border: 0;
      }

      .left {
        padding: 0 8px 0 15px;
        font-size: 14px;
        color: #333;
      }
      .right1 {
        padding-right: 10px;
        font-size: 12px;
        color: #323233;
        text-align: center;
      }
    }
  }
  .content-title {
    padding-top: 70px;
    .study-word {
      text-align: center;
      width: 100%;
      img {
        width: 249px;
        height: 47px;
      }
    }
    .now-data {
      padding-top: 8px;
      text-align: center;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      opacity: 0.8;
    }
  }
  .content-box {
    position: relative;
    background: white;
    margin: 40% 15px 15px 15px;
    min-height: 500px;
    border-radius: 8px;
    .trophy {
      pointer-events: none;
      position: absolute;
      width: 100%;
      top: -175px;
      left: 0%;
      z-index: 8;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .ranking {
      position: relative;
      text-align: center;
      padding-top: 10px;
      font-size: 13px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #323233;
      .content {
        color: #f42755;
        display: inline-block;
        background: #ffe3de;
        margin: 10px 10px 0 10px;
        font-size: 13px;
        padding: 6px 12px;
        border-radius: 30px;
      }
      .rankRes:before {
        content: "";
        color: #ffe3de;
        position: absolute;
        bottom: -11px;
        left: 30%;
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 8px solid #ffe3de;
      }
    }
    .list-box {
      min-height: 100px;
      padding: 10px 10px 0 10px;
      .item {
        padding: 12px 0;
        border-bottom: 0.5px solid #ebeef5;
        .des {
          width: 70%;
        }
        .pic {
          width: 15%;
          text-align: center;
          padding-right: 10px;
          img {
            width: 22px;
            height: 34px;
          }
        }
        .company {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 600;
          color: #323233;
        }
        .department {
          font-size: 13px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #323233;
          padding-top: 5px;
        }
        .time {
          font-size: 14px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #323233;
        }
        .time2 {
          color: #f53557;
        }
      }
    }
  }
  .no-list {
    z-index: 1;
    text-align: center;
    background-color: white;

    img {
      width: 67px;
      height: 49px;
    }

    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
  }
  .no-network {
    z-index: 1;
    top: 0%;
    padding-top: 83px;
    text-align: center;
    position: fixed;
    width: 100%;
    height: 100%;
    background: white;

    .refresh {
      display: inline-block;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(39, 128, 248, 1);
      margin-top: 30px;
      padding: 7px 35px;
      border-radius: 40px;
      border: 1px solid #2780f8;
    }

    img {
      width: 100px;
      height: 70px;
    }

    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(150, 151, 153, 1);
  }
}
</style>
