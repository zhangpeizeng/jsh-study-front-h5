<template>
  <div>
    <jshHeader @leftClick="backTo" :header="header"></jshHeader>
    <div class="clearfloat pro-box">
      <div class="left" style="width: 35%">
        <div v-for="(item, index) in info.pictureDtoList" :key="index">
          <img
            v-if="item.mainFlag == 'Y'"
            class="pro-img"
            :src="item.pictureUrl"
            alt=""
          />
        </div>
      </div>
      <div class="left" style="width: 64%">
        <div class="item-title text-truncate-2">
          {{ info.itemName }}
        </div>
        <div class="item-bottom">型号: {{ info.itemModel }}</div>
        <div class="item-bottom" style="margin: 0">
          编码: {{ info.productCode }}
        </div>
      </div>
    </div>
    <div :class="{ fix: isfixed }" style="z-index: 999">
      <van-tabs
        color="#2780F8"
        v-model="active"
        :sticky="true"
        @click="tabClick"
      >
        <van-tab title="基本信息"></van-tab>
        <van-tab title="属性"></van-tab>
        <van-tab title="文描"></van-tab>
        <van-tab
          title="能效贴"
          v-if="info.energylabelDocument && info.energylabelDocument.length > 0"
        ></van-tab>
        <van-tab
          title="说明书"
          v-if="pdfInstructions && pdfInstructions.length > 0"
        ></van-tab>
      </van-tabs>
      <div
        v-if="active == 1"
        style="padding: 10px 15px;background-color: #ffffff"
      >
        <div
          class="mr-10"
          :class="[selectType == 0 ? 'lai-btn-act' : 'lai-btn']"
          @click="selectType = 0"
        >
          商品属性
          <img src="@/assets/images/botrig.png" alt="" />
        </div>
        <div
          class="mr-10"
          :class="[selectType == 1 ? 'lai-btn-act' : 'lai-btn']"
          @click="selectType = 1"
        >
          包装属性
          <img src="@/assets/images/botrig.png" alt="" />
        </div>
        <div
          class="mr-10"
          :class="[selectType == 2 ? 'lai-btn-act' : 'lai-btn']"
          @click="selectType = 2"
        >
          售后信息
          <img src="@/assets/images/botrig.png" alt="" />
        </div>
      </div>
    </div>
    <div style="width: 100%;height: 44px" v-if="isfixed && active != 1"></div>
    <div style="width: 100%;height: 88px" v-if="isfixed && active == 1"></div>
    <div>
      <!--      基本信息-->
      <div v-if="tabName == '基本信息'">
        <div class="item">
          <div class="pt-16">
            <div class="clearfloat pb-16">
              <div class="left left-title" style="width:35%">
                商品名称
              </div>
              <div class="left right-title" style="width:62%">
                {{ info.itemName }}
              </div>
            </div>
            <div class="clearfloat pb-16">
              <div class="left left-title" style="width:35%">
                卖点说明
              </div>
              <div class="left right-title" style="width:62%">
                <div v-if="info.ad">
                  {{ info.ad }}
                </div>
                <div v-else>
                  -
                </div>
              </div>
            </div>
            <div class="clearfloat pb-16">
              <div class="left left-title" style="width:35%">
                商品品牌
              </div>
              <div class="left right-title" style="width:62%">
                <div v-if="info.brandName">
                  {{ info.brandName }}
                </div>
                <div v-else>
                  -
                </div>
              </div>
            </div>
            <div class="clearfloat pb-16">
              <div class="left left-title" style="width:35%">
                商品类目
              </div>
              <div class="left right-title" style="width:62%">
                <div v-if="info.categoryName">
                  {{ info.categoryName }}
                </div>
                <div v-else>
                  -
                </div>
              </div>
            </div>
            <div class="clearfloat pb-16">
              <div class="left left-title" style="width:35%">
                产业/产品组
              </div>
              <div class="left right-title" style="width:62%">
                <div v-if="info.industryName || info.productGroupCode">
                  {{ info.industryName }}/{{ info.productGroupName }}
                </div>
                <div v-else>
                  -
                </div>
              </div>
            </div>
            <div class="clearfloat pb-16">
              <div class="left left-title" style="width:35%">
                商品编码
              </div>
              <div class="left right-title" style="width:62%">
                <div v-if="info.productCode">
                  {{ info.productCode }}
                </div>
                <div v-else>
                  -
                </div>
              </div>
            </div>
            <div class="clearfloat pb-16">
              <div class="left left-title" style="width:35%">
                商品型号
              </div>
              <div class="left right-title" style="width:62%">
                <div v-if="info.itemModel">
                  {{ info.itemModel }}
                </div>
                <div v-else>
                  -
                </div>
              </div>
            </div>
            <div class="clearfloat pb-16">
              <div class="left left-title" style="width:35%">
                产品系列
              </div>
              <div class="left right-title" style="width:62%">
                <div v-if="info.series">
                  {{ info.series }}
                </div>
                <div v-else>
                  -
                </div>
              </div>
            </div>
            <div class="clearfloat pb-16">
              <div class="left left-title" style="width:35%">
                起订量
              </div>
              <div class="left right-title" style="width:62%">
                <div v-if="info.moq">
                  {{ info.moq }}
                </div>
                <div v-else>
                  -
                </div>
              </div>
            </div>
            <div class="clearfloat pb-16">
              <div class="left left-title" style="width:35%">
                计量单位
              </div>
              <div class="left right-title" style="width:62%">
                <div v-if="info.itemUnit">
                  {{ info.itemUnit }}
                </div>
                <div v-else>
                  -
                </div>
              </div>
            </div>
            <div class="clearfloat pb-16">
              <div class="left left-title" style="width:35%">
                建议零售价
              </div>
              <div class="left right-title" style="width:62%">
                <div v-if="info.marketPrice">
                  {{ info.marketPrice }}
                </div>
                <div v-else>
                  -
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--      商品属性-->
      <div v-if="tabName == '属性' && selectType == 0">
        <div class="item">
          <div
            class="pt-16"
            v-if="info.otherAttrs && info.otherAttrs.length > 0"
          >
            <div
              class="clearfloat pb-16"
              v-for="(item, index) in info.otherAttrs"
              :key="index"
            >
              <div class="left left-title" style="width:35%">
                {{ item.name }}
              </div>
              <div class="left right-title" style="width:62%">
                <span v-for="(item1, index1) in item.values" :key="index1">
                  {{ item1.valueName }}
                </span>
              </div>
            </div>
          </div>
          <div v-else class="fs-12 no-data">
            暂无数据
          </div>
        </div>
      </div>
      <!--      包装属性-->
      <div v-if="tabName == '属性' && selectType == 1">
        <div class="item">
          <div class="pt-16">
            <div class="pb-16 fs-14" style="font-weight: bold;color: #323233">
              规格
            </div>
            <div class="clearfloat pb-16">
              <div class="left left-title" style="width:35%">
                深*宽*高
              </div>
              <div class="left right-title" style="width:62%">
                <div v-if="info.width">
                  {{ info.length }}*{{ info.width }}*{{ info.height
                  }}{{ info.specUnit }}
                </div>
                <div v-else>
                  -
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="pb-16 fs-14" style="font-weight: bold;color: #323233">
              重量
            </div>
            <div class="clearfloat pb-16">
              <div class="left left-title" style="width:35%">
                毛重
              </div>
              <div class="left right-title" style="width:62%">
                <div v-if="info.weight">
                  {{ info.weight }}{{ info.weightUnit }}
                </div>
                <div v-else>
                  -
                </div>
              </div>
            </div>
            <div class="clearfloat pb-16">
              <div class="left left-title" style="width:35%">
                净重
              </div>
              <div class="left right-title" style="width:62%">
                <div v-if="info.netWeight">
                  {{ info.netWeight }}{{ info.weightUnit }}
                </div>
                <div v-else>
                  -
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="pb-16 fs-14" style="font-weight: bold;color: #323233">
              体积
            </div>
            <div class="clearfloat pb-16">
              <div class="left left-title" style="width:35%">
                体积
              </div>
              <div class="left right-title" style="width:62%">
                <div v-if="info.volume">
                  {{ info.volume }}{{ info.volumeUnit }}
                </div>
                <div v-else>
                  -
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="pb-16 fs-14" style="font-weight: bold;color: #323233">
              包装清单
            </div>
            <div class="clearfloat pb-16">
              <div class="left left-title" style="width:35%">
                包装清单
              </div>
              <div class="left right-title" style="width:62%">
                <div v-if="info.packingList">
                  {{ info.packingList }}
                </div>
                <div v-else>
                  -
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--      售后属性-->
      <div v-if="tabName == '属性' && selectType == 2">
        <div class="item">
          <div class="pt-16">
            <div class="clearfloat pb-16">
              <div class="left left-title" style="width:35%">
                保修
              </div>
              <div class="left right-title" style="width:62%">
                <div v-if="info.guaranteeDiscribe">
                  {{ info.guaranteeDiscribe }}
                </div>
                <div v-else>
                  -
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="clearfloat pb-16">
              <div class="left left-title" style="width:35%">
                售后保障
              </div>
              <div class="left right-title" style="width:62%">
                <div v-if="info.afterService">
                  {{ info.afterService }}
                </div>
                <div v-else>
                  -
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="clearfloat pb-16">
              <div class="left left-title" style="width:35%">
                服务承诺
              </div>
              <div class="left right-title" style="width:62%">
                <div v-if="info.servicePromise">
                  {{ info.servicePromise }}
                </div>
                <div v-else>
                  -
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="clearfloat pb-16">
              <div class="left left-title" style="width:35%">
                其他信息
              </div>
              <div class="left right-title" style="width:62%">
                <div v-if="info.comments">
                  {{ info.comments }}
                </div>
                <div v-else>
                  -
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--      文描-->
      <div class="item" v-if="tabName == '文描'">
        <div class="item2">
          <div class="left-title1 pt-16">
            商品图片
            <span v-if="info.pictureDtoList" style="color:#969799 "
              >({{ info.pictureDtoList.length }}张)</span
            >
          </div>
          <div class="clearfloat">
            <div
              class="left l-img-div"
              v-for="(item, index) in info.pictureDtoList"
              :key="index"
            >
              <img class="pro-img" :src="item.pictureUrl" alt="" />
              <div class="zhu" v-if="item.mainFlag == 'Y'">
                主图
              </div>
            </div>
          </div>
        </div>
        <div class="item2">
          <div class="left-title1 pt-16">
            商品视频
            <span v-if="info.videoDtoList" style="color:#969799 "
              >({{ info.videoDtoList.length }}个)</span
            >
          </div>
          <div class="mt-12" v-if="info.videoDtoList">
            <div
              class="clearfloat"
              v-for="(item, index) in info.videoDtoList"
              :key="index"
            >
              <div class="left">
                {{ item.videoName }}
              </div>
              <div
                class="right"
                style="color: rgb(34, 126, 247);font-size: 12px;"
                @click="playVideo(item)"
              >
                <van-icon name="play" style="vertical-align: text-bottom;" />
                播放
              </div>
            </div>
          </div>
          <div class="mt-12 fs-12" style="color: rgb(150, 151, 153)" v-else>
            暂无视频
          </div>
        </div>
        <div class="item2" style="border: none">
          <div class="left-title1 pt-16">
            商品详情
          </div>
          <div class="mt-12">
            <div
              v-for="(item, index) in info.sellerItemDescribeDtoList"
              :key="index"
            >
              <div v-html="item.describeH5" class="xiang-box"></div>
            </div>
          </div>
        </div>
      </div>
      <!--      能效贴-->
      <div class="item" v-if="tabName == '能效贴'">
        <div
          v-if="info.energylabelDocument && info.energylabelDocument.length > 0"
        >
          <div v-for="(item, index) in info.energylabelDocument" :key="index">
            <div v-if="getFileType(item) == 'pdf'">
              <pdfExhibition :url="item"></pdfExhibition>
            </div>
            <img v-else style="width: 100%" :src="item" alt="" />
          </div>
        </div>
        <div v-else class="fs-12 no-data">
          暂无数据
        </div>
      </div>
      <!--     说明书-->
      <div class="item" style="padding: 0" v-if="tabName == '说明书'">
        <div v-if="pdfInstructions && pdfInstructions.length > 0">
          <div v-for="(item, index) in pdfInstructions" :key="index">
            <synopsisOpenUp
              :etag="item.etag"
              :pageCount="Number(item.pageCount)"
            ></synopsisOpenUp>
          </div>
        </div>
      </div>
    </div>
    <div style="width: 100%;height: 20px"></div>
    <!--    视频播放-->
    <van-popup v-model="isVideoPlayer">
      <div v-if="isVideoPlayer" style="width: 375px;margin: 0 auto">
        <VideoPlayer :vid="liveId" :video-container-height="200"></VideoPlayer>
      </div>
    </van-popup>
  </div>
</template>

<script src="./product-detail.js"></script>
<style scoped>
.xiang-box >>> img {
  width: 100%;
}
</style>
<style lang="scss" scoped>
.item {
  background-color: #ffffff;
  margin: 15px 15px 0;
  padding: 0 15px;
  border-radius: 6px;
}

.item2 {
  border-bottom: 1px solid #dcdee0;
  padding-bottom: 16px;
}

.clearfloat:after {
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0;
}

.no-data {
  color: #969799;
  text-align: center;
  height: 50px;
  line-height: 50px;
}

.left-title {
  color: #969799;
  font-size: 12px;
}

.right-title {
  color: #323233;
  font-size: 12px;
}

.clearfloat {
  zoom: 1;
}

.l-img-div {
  width: 23%;
  height: 0;
  position: relative;
  padding-bottom: 23%;
  margin-right: 1.5%;
  margin-top: 9px;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    position: absolute;
    border-radius: 6px;
  }

  .zhu {
    position: absolute;
    padding: 1px 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(233deg, #00b7ff 0%, #2283e2 100%);
    font-size: 8px;
    color: #ffffff;
    text-align: center;
    border-radius: 0 0 6px 6px;
  }
}

.left-title1 {
  color: #323233;
  font-size: 13px;
}

.right-title1 {
  color: #323233;
  font-size: 12px;
}

.pro-box {
  padding: 15px;
  background-color: #ffffff;
}

.pro-box {
  padding: 15px;
  background-color: #ffffff;
}

.left {
  float: left;
}

.right {
  float: right;
}

.clearfloat:after {
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0;
}

.fix {
  position: fixed;
  top: 44px;
  left: 0;
  right: 0;
}

.lai-btn-act {
  position: relative;
  display: inline-block;
  padding: 5px 14px;
  background: rgba(239, 246, 255, 1);
  border-radius: 5px;
  border: 0.5px solid rgba(39, 128, 248, 1);
  color: #2780f8;
  font-size: 13px;

  img {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 10px;
  }
}

.lai-btn {
  display: inline-block;
  padding: 5px 14px;
  background: rgba(242, 243, 245, 1);
  border-radius: 5px;
  border: 0.5px solid rgba(242, 243, 245, 1);
  color: #7d7e80;
  font-size: 13px;

  img {
    display: none;
  }
}

.item-title {
  height: 54px;
  line-height: 25px;
  font-size: 14px;
  color: #222222;
}

.pro-img {
  width: 108px;
  height: 108px;
  border-radius: 6px;
}

.item-bottom {
  color: #969799;
  font-size: 12px;
  margin-top: 5px;
  margin-bottom: 10px;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.clearfloat {
  zoom: 1;
}

.pro-box {
  padding: 15px;
  background-color: #ffffff;
}

.left {
  float: left;
}

.right {
  float: right;
}
</style>
