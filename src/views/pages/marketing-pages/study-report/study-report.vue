<template>
  <div class="study-report">
    <!--        头部框-->
    <div class="jsh-header">
      <div class="header">
        <div style="padding-top: 5px" class="left">
          <van-icon
            @click="backTo()"
            size="5vw"
            color="#227EF7"
            name="arrow-left"
          />
        </div>
        <div @click="showConsole">学习报告</div>
        <div class="right1" @click="goTeam()">
          <div>
            <img
              style="width: 22px;height: 20px;padding-top:5px;"
              src="../../../../assets/images/team-icon.png"
              alt=""
            />
            <span style="position: absolute;right: 10px;top: 25%">团队</span>
          </div>
        </div>
      </div>
    </div>
    <!--    规则说明-->
    <div v-if="!isNetwork" @click="openRule()" class="rule-des">规则说明</div>
    <!--    学习报告生成的遮罩-->
    <div v-if="!isCreated && !isNetwork" class="mask">
      <div class="pic">
        <span class="pic2">
          <img src="../../../../assets/images/cun1.gif" alt="" />
        </span>
      </div>
      <div>学习报告生成中，请耐心等待…</div>
    </div>
    <div
      v-if="!isNetwork"
      class="content"
      :style="{ backgroundImage: studyReportImg }"
    >
      <div class="content-text">
        <div>{{ data.studyReportContent }}</div>
        <div class="line"></div>
      </div>
      <div class="detail-box">
        <!--        <div>-->
        <!--          <van-cell-group>-->
        <!--            <van-field-->
        <!--              v-model="value"-->
        <!--              label="文本"-->
        <!--              placeholder="请输入链接地址"-->
        <!--            />-->
        <!--          </van-cell-group>-->
        <!--          <van-button type="primary" @click="goBenDi">确认</van-button>-->
        <!--        </div>-->
        <div
          v-if="
            (studyTerminalCode === '1' && data.gmCode) ||
              (studyTerminalCode !== '1' &&
                data.companyCode &&
                data.departmentCode)
          "
          class="list-title d-flex align-items-center justify-content-between"
        >
          <div>
            你本周学习勤奋榜<span class="ranking"
              >排名<span v-if="rownum">{{ rownum }}</span
              ><span v-else>-</span></span
            >
          </div>
          <div class="look" @click="goTeamList()">去查看</div>
        </div>
        <div>
          <van-tabs @click="onClick" v-model="activeName">
            <van-tab title="近30天" name="1" />
            <van-tab title="上月" name="2" />
            <van-tab title="累计" name="3" />
          </van-tabs>
        </div>
        <div
          class="item-detail d-flex align-items-center justify-content-between"
        >
          <div class="item">
            <div>累计学习课程</div>
            <div class="number">
              <span class="num">{{ data.learnedNum }}</span
              >门
            </div>
            <!--            <div class="number-two">-->
            <!--              <span>待学习10门</span>-->
            <!--              </div>-->
            <img
              class="tag"
              src="../../../../assets/images/add-course.png"
              alt=""
            />
          </div>
          <div class="item study-time">
            <div>累计学习时长</div>
            <div class="number">
              <span class="num">{{ handleHour(data.learnedTime) }}</span
              >时<span class="num">{{ handleMin(data.learnedTime) }}</span
              >分
            </div>
            <div class="number-two">
              <span>累计学习{{ data.learnedDay }}天</span>
            </div>
            <img
              class="tag"
              src="../../../../assets/images/add-time.png"
              alt=""
            />
          </div>
          <div class="item" style="background: #FFF9FA;">
            <div>累计提交作业</div>
            <div class="number">
              <span class="num">{{ data.submitHomeWorkNum }}</span
              >个
            </div>
            <div class="number-new">
              <span>合格率{{ data.homeWorkPassRate }}%</span>
            </div>
            <!--            <div class="number-two">-->
            <!--              <span>待提10个</span>-->
            <!--            </div>-->
            <img
              class="tag"
              src="../../../../assets/images/add-homework.png"
              alt=""
            />
          </div>
          <div class="item" style="background: #FFFDF7;">
            <div>累计提交考试</div>
            <div class="number">
              <span class="num">{{ data.submitExamNum }}</span
              >个
            </div>
            <div class="number-test">
              <span>达标率{{ data.examPassRate }}%</span>
            </div>
            <!--            <div class="number-two">-->
            <!--              <span>待考10个</span>-->
            <!--            </div>-->
            <img
              class="tag"
              src="../../../../assets/images/add-test.png"
              alt=""
            />
          </div>
        </div>
        <div @click="openShare()" class="share">
          分享我的学习报告
        </div>
        <!--        <div class="data-time">当前数据截止到{{ date }}</div>-->
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
    <JshShare :qrCode="qrCode" ref="jshShare" />
  </div>
</template>

<script src="./study-report.js"></script>
<style lang="scss">
.study-report {
  .van-tabs__line {
    background: #2780f8;
  }
  .van-tab--active {
    color: #2780f8;
    font-weight: 600;
  }
  .van-tabs__nav--line {
    border-radius: 10px;
  }
}
</style>
<style scoped lang="scss">
.study-report {
  height: 100%;
  .rule-des {
    position: fixed;
    right: 0;
    top: 15%;
    width: 18px;
    text-align: center;
    padding: 5px 0;
    background: linear-gradient(180deg, #f5f7fa 0%, #ebeef5 100%);
    box-shadow: -1px 0px 5px 2px #393939;
    border-radius: 3px 0px 0px 3px;
    color: #646566;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    z-index: 999;
  }
  .jsh-header {
    background-color: white;
    z-index: 1002;
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
  .mask {
    position: fixed;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.7);
    padding-top: 60%;
    text-align: center;
    color: white;
    z-index: 1001;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    .pic {
      padding-bottom: 20px;
      .pic2 {
        display: inline-block;
        width: 80px;
        height: 80px;
        overflow: hidden;
        border-radius: 10px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .content {
    position: relative;
    padding: 10px;
    width: 100%;
    height: 100%;
    /*background-image: url(../../../../assets/images/study-report.png);*/
    /*background-size: 100% 100%;*/
    background-repeat: no-repeat;
    background-size: cover;
    -webkit-background-size: cover;
    -o-background-size: cover;
    background-position: center 0;
    min-height: 100%;
    .content-text {
      padding-top: 65px;
      padding-left: 20px;
      font-size: 28px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
      .line {
        margin-top: 17px;
        width: 62px;
        height: 5px;
        background: #ffffff;
      }
    }
    .detail-box {
      position: absolute;
      bottom: 1%;
      left: 2%;
      width: 96%;
      padding-bottom: 5px;
      /*height: 445px;*/
      background-color: white;
      box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      .list-title {
        padding: 12px 10px;
        background: #eff6ff;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #323233;
        border-radius: 10px 10px 0 0;
        .ranking {
          color: #2780f8;
          font-weight: 600;
        }
        .look {
          font-size: 13px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
          background: #2780f8;
          border-radius: 44px;
          padding: 5px 10px;
        }
      }
    }
  }
  .item-detail {
    padding: 10px 10px 0 10px;
    flex-wrap: wrap;
    .item {
      position: relative;
      padding: 21px 0;
      width: 48%;
      text-align: center;
      background: #f5f9ff;
      border-radius: 10px;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #646566;
      margin-bottom: 10px;
      .number {
        padding: 5px 0 5px 0;
        .num {
          font-size: 24px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #2780f8;
        }
      }
      .number-two {
        span {
          font-size: 13px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #969799;
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #dcdfe6;
          padding: 1px 5px;
          display: inline-block;
        }
      }
      .number-new {
        margin-bottom: 5px;
        span {
          font-size: 13px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #cf908c;
          border-radius: 20px;
          padding: 1px 5px;
          background: #fff0ef;
          border: 1px solid #e7c1be;
          display: inline-block;
        }
      }
      .number-test {
        margin-bottom: 5px;
        span {
          font-size: 13px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #b1a07a;
          border-radius: 20px;
          padding: 1px 5px;
          background: #fff8e8;
          border: 1px solid #e9dab9;
          display: inline-block;
        }
      }
      .tag {
        width: 34px;
        height: 37px;
        position: absolute;
        right: 0;
        bottom: 0;
      }
    }
    .study-time {
      padding: 10px 0;
      background: #f7fff9;
    }
  }
  .share {
    background: #2780f8;
    border-radius: 44px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    text-align: center;
    padding: 16px 0;
    margin: 0 10px;
  }
  .data-time {
    text-align: center;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #969799;
    padding-top: 3px;
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
