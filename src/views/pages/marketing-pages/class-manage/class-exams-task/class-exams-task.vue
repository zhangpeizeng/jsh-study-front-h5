<template>
  <div class="class-exams-list class-task-list" style="height: 100%">
    <!--        一级标题-->
    <div class="jsh-header">
      <jshHeader ref="childHeader" :header="header"></jshHeader>
    </div>
    <div
      style="position: fixed; top: 44px; left: 0; right: 0; z-index: 99"
      v-if="pageType !== 3"
    >
      <van-tabs
        :lazy-render="false"
        v-model="examType"
        color="#2780F8"
        :line-width="80"
      >
        <van-tab
          :name="1"
          tab-class="tab-class"
          tab-active-class="active"
          :title="
            pageType === 1
              ? `班级考试(${summaryData.classExamSum || 0})`
              : `班级作业(${summaryData.classHomeworkSum || 0})`
          "
          :dot="
            !!(pageType === 1
              ? summaryData.classWaitExamFlag
              : summaryData.classWaitSubmitFlag)
          "
        ></van-tab>
        <van-tab
          :name="2"
          tab-class="tab-class"
          tab-active-class="active"
          :title="
            pageType === 1
              ? `课程考试(${summaryData.courseExamSum || 0})`
              : `课程作业(${summaryData.courseHomeworkSum || 0})`
          "
          :dot="
            !!(pageType === 1
              ? summaryData.courseWaitExamFlag
              : summaryData.courseWaitSubmitFlag)
          "
        ></van-tab>
      </van-tabs>
    </div>
    <div
      class="top-header"
      style="top: 85px; position: fixed; z-index: 8"
      v-if="pageType !== 3"
    >
      <div class="tab-container">
        <div
          @click="changeSearchType(1)"
          class="fin-status"
          :class="{ radio: true, active: searchType === 1 }"
        >
          {{ pageType === 1 ? "待考" : "待提" }}
        </div>
        <div
          @click="changeSearchType(2)"
          class="fin-status"
          :class="{ radio: true, active: searchType === 2 }"
        >
          {{ pageType === 1 ? "缺考" : "未提" }}
        </div>
        <div
          @click="changeSearchType(3)"
          class="fin-status"
          :class="{ radio: true, active: searchType === 3 }"
        >
          {{ pageType === 1 ? "已考" : "已提" }}
        </div>
        <div
          @click="changeSearchType(4)"
          class="fin-status"
          :class="{ radio: true, active: searchType === 4 }"
        >
          {{ pageType === 1 ? "未达标" : "不合格" }}
        </div>
      </div>
    </div>
    <div v-if="isModifyAssignment">
      <jobSubmit @submit="submitHomeWork" ref="submit"></jobSubmit>
    </div>
    <div
      :class="{ listPadding: pageType !== 3 }"
      style="padding-top: 15px; height: 100%"
    >
      <van-pull-refresh
        v-model="isPullLoading"
        @refresh="onRefresh"
        class="pull-warp"
        success-text="加载成功"
        style="height: 100%"
      >
        <van-list
          v-model="listDataLoading"
          :finished="listDataFinished"
          :finished-text="tableList.length > 5 ? '没有更多了' : ''"
          @load="onLoadListData"
        >
          <div class="content-list">
            <div v-if="pageType === 1">
              <class-exams-item
                v-for="(item, index) in tableList"
                :key="index"
                :item="item"
                :searchType="searchType"
                :examType="examType"
              ></class-exams-item>
            </div>
            <div v-if="pageType === 2">
              <class-task-item
                v-for="(item, index) in tableList"
                :key="index"
                :index="index"
                :item="item"
                :examType="examType"
                :searchType="searchType"
                @handHomeWork="handHomeWork"
              ></class-task-item>
            </div>
            <div v-if="pageType === 3">
              <class-certificate-item
                v-for="(item, index) in tableList"
                :key="index"
                :index="index"
                :item="item"
                @showCertificate="showCertificate"
              ></class-certificate-item>
              <van-popup
                v-model="showCertificateDetail"
                class="certificate-detail"
                style="background-color: transparent; overflow-y: visible"
              >
                <div class="imgPop" style="width: 100%">
                  <van-image
                    height="265px"
                    width="100%"
                    fit="cover"
                    :src="certificateDetail.certificateUrl"
                  >
                  </van-image>
                </div>
                <div class="introu">
                  <div
                    v-for="(item,
                    index) in certificateDetail.certificateAttributes"
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
                      课程名称：
                      <span
                        v-if="certificateDetail.courseType === '2'"
                        style="color: #909399"
                        >[直播]</span
                      >
                      <span
                        v-if="certificateDetail.courseType === '3'"
                        style="color: #909399"
                        >[研讨]</span
                      >
                      <span
                        v-if="certificateDetail.courseType === '4'"
                        style="color: #909399"
                        >[系列]</span
                      >
                      {{ certificateDetail.courseName }}
                    </span>
                  </div>
                  <div class="teachername">
                    <span> 讲师：{{ certificateDetail.lecturerName }} </span>
                  </div>
                  <div class="time">
                    <span>
                      获得时间：{{
                        certificateDetail.certificateDate
                          | date("yyyy-MM-dd hh:mm")
                      }}
                    </span>
                  </div>
                  <div
                    class="sub"
                    @click="
                      downloadCertificate(certificateDetail.certificateUrl)
                    "
                  >
                    <span> 下载证书 </span>
                  </div>
                </div>
                <div class="close">
                  <img
                    src="@/assets/images/xx.png"
                    alt=""
                    @click="closeCertificate()"
                  />
                </div>
              </van-popup>
            </div>
          </div>
        </van-list>
        <nodata-page
          :contentTxt="['', '暂无考试~', '暂无作业~', '暂无证书~'][pageType]"
          v-if="noData"
        ></nodata-page>
      </van-pull-refresh>
      <!--        列表无数据-->

      <!--        网络有问题展示-->
      <network-error
        :onRefresh="onRefresh"
        v-if="isNetworkError"
      ></network-error>
    </div>
  </div>
</template>

<script src="./class-exams-task.js"></script>

<style lang="scss" scoped>
.class-exams-list {
  .listPadding {
    padding-top: 95px !important;
  }
}
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
.class-exams-list {
  background: #f2f3f5;
}
.class-task-list {
  background: #f5f5f5;
}
.class-exams-task_list {
  padding: 10px;
}
.certificate-detail {
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
}
</style>
