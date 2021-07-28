<template>
  <div>
    <jshHeader :header="header"></jshHeader>
    <van-pull-refresh
      v-if="tableList.length > 0"
      v-model="isRefresh"
      @refresh="onRefresh"
    >
      <van-list
        v-model="isFinished"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="content">
          <div class="mb-16 d-flex align-items-center">
            <van-rate v-model="rate" color="#F5A623" readonly />
            <span class="ml-16 fs-16" style="color: #F5A623"
              >{{ yuanRate }}分</span
            >
          </div>
          <div
            class="pt-16 pb-16 border-t"
            v-for="(item, index) in tableList"
            :key="index"
          >
            <div class="clearfix">
              <div class="float-left">
                <div class="clearfix fs-14">
                  <span class="float-left" style="color: #323233">{{
                    item.userName
                  }}</span>
                  <van-rate
                    class="float-left ml-16"
                    color="#F5A623"
                    :count="item.grade"
                    size="15px"
                    readonly
                    v-model="item.grade"
                  />
                </div>
              </div>
              <div
                class="float-right"
                style="color: #1989FA"
                :style="{ color: item.likeStatus == 0 ? '#1989FA' : '#969799' }"
                @click="likeClick(item, index)"
              >
                <img
                  class="dianzan"
                  v-if="Number(item.likeStatus) === 0"
                  src="@/assets/images/dianzanAct.png"
                  alt=""
                />
                <img
                  class="dianzan"
                  v-if="Number(item.likeStatus) === 1"
                  src="@/assets/images/dianzan.png"
                  alt=""
                />
                {{ item.likeNum }}
              </div>
            </div>
            <div style="color: #969799" class="company mt-6 mb-6 fs-12">
              <div
                @click.stop="checkTip(index)"
                style="width: 300px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"
              >
                <span :id="gernerateId(index)"
                  >{{ item.companyAbbreviation }}
                  <span
                    v-if="
                      item.companyAbbreviation && item.departmentAbbreviation
                    "
                    >-</span
                  >
                  {{ item.departmentAbbreviation }}</span
                >
              </div>
              <div v-show="item.isShow && item.iswidth" class="content">
                {{ item.companyAbbreviation }}
                <span
                  v-if="item.companyAbbreviation && item.departmentAbbreviation"
                  >-</span
                >
                {{ item.departmentAbbreviation }}
              </div>
            </div>
            <div style="color: #7D7E80" class="mt-6 mb-6 fs-13">
              {{ item.content }}
            </div>
            <div style="color: #969799" class="fs-12">
              {{ item.createTime | date1("yyyy-MM-dd") }}
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
    <!--    没有数据-->
    <div class="no-list-data" v-else>
      <div class="set">
        <div style="padding-top: 50%">
          <img src="@/assets/images/no-search-data.png" alt="" />
        </div>
        <div style="padding-top: 10px">暂无评价</div>
      </div>
    </div>
  </div>
</template>

<script src="./course-evaluation.js"></script>
<style scoped>
.van-pull-refresh {
  min-height: 600px;
}
</style>
<style lang="scss" scoped>
.company {
  position: relative;
  .content {
    /*display: none;*/
    color: white;
    position: absolute;
    background: rgba(50, 50, 51, 0.9);
    box-shadow: 0px 1px 6px 2px rgba(201, 201, 201, 0.48);
    top: 20px;
    left: 0px;
    font-size: 13px;
    padding: 9px 12px;
    border-radius: 5px;
  }
  .content:before {
    content: "";
    color: black;
    position: absolute;
    top: -10px;
    left: 10px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 11px solid rgba(50, 50, 51, 0.9);
  }
}
.content {
  margin: 10px 15px;
  padding: 15px 15px 0 15px;
  background-color: #ffffff;
  border-radius: 5px;
}
.border-t {
  border-top: 1px solid #dcdee0;
}
.dianzan {
  width: 18px;
}
.no-list-data {
  text-align: center;
  width: 100%;
  height: 100%;
  margin-top: 10px;
  .set {
    height: 620px;
    background: white;
  }
  img {
    width: 67px;
    height: 49px;
  }
  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
}
</style>
