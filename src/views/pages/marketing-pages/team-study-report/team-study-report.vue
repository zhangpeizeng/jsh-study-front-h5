<template>
  <div class="team-study-report">
    <!--        一级标题-->
    <div class="jsh-header">
      <jshHeader ref="childHeader" :header="header"></jshHeader>
    </div>
    <div class="content-box">
      <div class="screen-box">
        <div class="screen d-flex align-items-center">
          <div class="switch">
            <van-dropdown-menu active-color="#2780f8">
              <van-dropdown-item
                @change="onClick"
                v-model="activeName"
                :options="option1"
              />
            </van-dropdown-menu>
          </div>
          <div class="search">
            <van-search
              :formatter="filterEmoji"
              @search="onSearch"
              :autofocus="true"
              id="input"
              v-model="codeOrName"
              placeholder="请输入学员姓名"
            />
          </div>
        </div>
        <!--        <div class="date">当前数据截止到{{ date }}</div>-->
      </div>
      <!--        列表-->
      <div class="list-box" v-if="!isNetwork">
        <van-pull-refresh
          v-if="list.length > 0"
          v-model="isPullLoading"
          @refresh="onRefresh"
          success-text="加载成功"
        >
          <van-list
            v-model="listDataLoading"
            :finished="listDataFinished"
            @load="onLoadListData"
            finished-text="没有更多了"
            :immediate-check="false"
          >
            <div class="list">
              <div
                v-for="(item, index) in list"
                :key="index"
                class="item d-flex align-items-center justify-content-between"
              >
                <div class="des name">
                  {{ index + 1 }}.{{ item.name }}({{ item.huihuiNumber }})
                </div>
                <div class="des time">{{ item.studyTimeStr }}</div>
                <div class="des num">{{ item.courseCount }}门</div>
                <div class="des assist">
                  <img
                    @click="checkAssist(1, item.accountId)"
                    v-show="item.isPraised"
                    class="dianzan"
                    src="@/assets/images/dianzanAct.png"
                    alt=""
                  />
                  <img
                    @click="checkAssist(2, item.accountId)"
                    v-show="!item.isPraised"
                    class="dianzan"
                    src="@/assets/images/dianzan.png"
                    alt=""
                  />
                  <span style="padding-left: 6px">{{ item.likeCount }}</span>
                  <!--                    <img-->
                  <!--                            class="dianzan"-->
                  <!--                            src="@/assets/images/dianzan.png"-->
                  <!--                            alt=""-->
                  <!--                    />-->
                </div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
        <!--        列表无数据-->
        <div class="no-list" v-if="list.length === 0 && noData">
          <div style="padding-top: 40%">
            <img src="../../../../assets/images/no-search-data.png" alt="" />
          </div>
          <div style="padding-top: 10px">
            暂无排名，赶快去学习吧～
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
            <div class="refresh" @click="onRefresh()">刷新</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./team-study-report.js"></script>
<style lang="scss">
.team-study-report {
  .van-search__content {
    border-radius: 30px;
  }
  .van-dropdown-menu__title {
    font-size: 13px;
    padding-right: 14px;
  }
  .van-tabs__line {
    background: #2780f8;
  }
  .van-tab--active {
    color: #2780f8;
    font-weight: 600;
  }
  .van-dropdown-menu__bar {
    height: 28px;
    border-radius: 28px;
    background: #f2f3f5;
    box-shadow: none;
  }
  .van-pull-refresh {
    min-height: 500px;
  }
  .van-dropdown-item--down {
    top: 80px !important;
  }
  .van-search .van-cell {
    padding: 3px 8px 3px 0;
  }
  .van-search {
    padding: 10px 12px 10px 2px;
  }
}
</style>
<style scoped lang="scss">
.team-study-report {
  min-height: 100%;
  background-color: white;
  .jsh-header {
    background-color: white;
    z-index: 999;
    position: fixed;
    top: 0;
    left: 0;
    width: 100% !important;
  }
  .content-box {
    padding-top: 55px;
    .screen-box {
      position: fixed;
      width: 100%;
      top: 40px;
      background: white;
      z-index: 10;
    }
    .screen {
      .switch {
        width: 30%;
        padding: 10px;
      }
      .search {
        width: 70%;
      }
    }
    .date {
      padding: 0 15px;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #969799;
    }
    .list {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #323233;
      padding: 0 15px 10px 15px;
      .item {
        padding: 15px 0 10px 0;
        border-bottom: 0.5px solid #ebedf0;
        flex-wrap: wrap;
        .name {
          width: 42%;
        }
        .time {
          width: 25%;
        }
        .num {
          width: 15%;
        }
        .assist {
          width: 18%;
          text-align: right;
        }
      }
      .dianzan {
        width: 16px;
        height: 16px;
      }
    }
  }
  .list-box {
    padding-top: 30px;
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
