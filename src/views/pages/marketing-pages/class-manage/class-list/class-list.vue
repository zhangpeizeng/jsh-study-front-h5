<template>
  <div class="class-list" style="height: 100%">
    <div v-if="pageType === 2">
      <!--        头部搜索框-->
      <div class="jsh-header1">
        <div class="header">
          <div style="padding-top: 5px" class="left">
            <van-icon
              @click="back"
              size="5vw"
              color="#227EF7"
              name="arrow-left"
            />
          </div>
          <div @click="needFocus()" id="btn"></div>
          <van-search
            @click="displayHistory()"
            :formatter="filterEmoji"
            @search="searchList"
            @focus="onFocus"
            :autofocus="true"
            id="input"
            v-model="codeOrName"
            placeholder="课程名称/分类/讲师/型号"
          />
          <div class="right1" @click="cancle()">搜索</div>
        </div>
      </div>
      <div id="viewbottom"></div>
      <!--    历史搜索-->
      <div v-if="showHistory" class="history-search">
        <div class="d-flex justify-content-between align-items-center">
          <div class="search-title">历史搜索</div>
          <div @click="clearHistory()">
            <img
              style="width: 18px; height: 18px"
              src="@/assets/images/delete.png"
              alt=""
            />
          </div>
        </div>
        <div
          v-if="history.length === 0"
          style="text-align: center; padding-top: 35px"
        >
          <img
            style="width: 34px; height: 26px; vertical-align: middle"
            src="@/assets/images/no-search-data.png"
            alt=""
          />
          <span
            style="
              color: rgba(153, 153, 153, 1);
              font-size: 13px;
              vertical-align: middle;
              padding-left: 5px;
            "
            >暂无搜索历史</span
          >
        </div>
        <div class="search-content">
          <div
            @click="historyItem(item)"
            v-for="(item, index) in history"
            :key="index"
            class="detail"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="pageType === 1">
      <div
        @click="isLabel = false"
        v-show="isLabel"
        style="
          height: 100%;
          width: 100%;
          position: fixed;
          background: #000000;
          opacity: 0.5;
          z-index: 1000;
        "
      ></div>
      <!--        一级标题-->
      <div class="jsh-header">
        <jshHeader ref="childHeader" :header="header"></jshHeader>
      </div>
      <div
        v-show="isLabel"
        class="top-header"
        style="top: 42px; position: fixed; z-index: 1001"
      >
        <div class="tab-title d-flex align-items-center">
          <div class="tab-item selectBlue">
            <span style="vertical-align: middle">状态 </span>
            <span class="triangle-up" />
          </div>
        </div>
        <div class="tab-container">
          <div
            class="fin-status"
            @click="changeCourseStatus(SEARCH_TYPE.UNLIMITED)"
            :class="{
              radio: true,
              active: selectCourseStatus === SEARCH_TYPE.UNLIMITED
            }"
          >
            不限
          </div>
          <div
            @click="changeCourseStatus(SEARCH_TYPE.LEARNING)"
            class="fin-status"
            :class="{
              radio: true,
              active: selectCourseStatus === SEARCH_TYPE.LEARNING
            }"
          >
            正在学
          </div>
          <div
            @click="changeCourseStatus(SEARCH_TYPE.NOT_JOINED)"
            class="fin-status"
            :class="{
              radio: true,
              active: selectCourseStatus === SEARCH_TYPE.NOT_JOINED
            }"
          >
            未加入
          </div>
          <div
            @click="changeCourseStatus(SEARCH_TYPE.FINISHED)"
            class="fin-status"
            :class="{
              radio: true,
              active: selectCourseStatus === SEARCH_TYPE.FINISHED
            }"
          >
            已学完
          </div>
        </div>
      </div>
    </div>
    <class-list-content
      :pageType="pageType"
      :classList="classList"
      :isNetwork="isNetwork"
      :noData="noData"
      :isPullLoading="isPullLoading"
      :selectCourseStatus="selectCourseStatus"
      @onRefresh="onRefresh"
    >
    </class-list-content>
  </div>
</template>

<script src="./class-list.js"></script>

<style scoped lang="scss">
.jsh-header {
  background-color: white;
  z-index: 1002;
  position: fixed;
  top: 0;
  left: 0;
  width: 100% !important;
}
.top-header {
  background-color: #ffffff;
  width: 100%;
  line-height: 34px;
  /*padding: 9px 15px;*/
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
      background: url("../../../../../assets/images/radio-checked-blue.png")
          no-repeat right bottom,
        rgba(239, 246, 255, 1);
      background-size: 10px 13px;
    }

    & + .radio {
      margin-right: 14px;
    }
  }
  .fin-status {
    margin-top: 5px;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(125, 126, 128, 1);
    background: rgba(242, 243, 245, 1);
    border-radius: 6px;
    width: 20%;
    height: 24px;
    text-align: center;
    line-height: 24px;
    margin-right: 14px;
  }
  .tab-container {
    padding: 15px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;

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
  .tab-title {
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #323233;
    padding: 5px 0;
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1);
    .tab-item {
      width: 30%;
      text-align: center;
    }
    .selectBlue {
      color: #2283e2;
    }
    .triangle-up {
      vertical-align: middle;
      display: inline-block;
      width: 0;
      height: 0;
      border-left: 3px solid transparent;
      border-right: 3px solid transparent;
      border-bottom: 4px solid #2780f8;
    }
    .triangle-down {
      vertical-align: middle;
      display: inline-block;
      width: 0;
      height: 0;
      border-left: 3px solid transparent;
      border-right: 3px solid transparent;
      border-top: 4px solid #dcdee0;
    }
  }
}
.jsh-header1 {
  background-color: white;
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

    .van-search {
      width: 72%;
      padding: 10px 0px;
    }

    .van-search__content {
      border-radius: 30px;
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

    .right {
      padding: 0 15px 0 8px;
      font-size: 14px;
      color: #666666;
    }

    .right1 {
      padding: 0 15px 0 8px;
      font-size: 16px;
      color: rgba(39, 128, 248, 1);
      font-family: PingFangSC-Regular, PingFang SC;
    }
  }
}
.history-search {
  height: 100%;
  padding: 60px 15px 15px 15px;
  background-color: white;

  .search-title {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(50, 50, 51, 1);
    padding-bottom: 15px;
  }

  .search-content {
    /*height: 150px;*/
    /*overflow: hidden;*/
    /*background-color: red;*/
    margin-bottom: 40px;
    /*padding-bottom: 10px;*/

    .detail {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-right: 15px;
      margin-bottom: 16px;
      display: inline-block;
      border-radius: 30px;
      border: 1px solid rgba(220, 222, 224, 1);
      padding: 5px 10px;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(144, 147, 153, 1);
    }
  }
}
</style>
<style lang="scss">
.padd {
  padding-right: 30px;
  padding-left: 30px;
}
.van-count-down {
  color: #ffffff;
  font-size: 10px !important;
  padding-left: 3px;
  line-height: 10px;
}

.class-list {
  .activeHeight {
    padding-top: 120px !important;
  }
  .van-pull-refresh {
    min-height: 100%;
    padding-top: 60px;
  }
}
</style>
