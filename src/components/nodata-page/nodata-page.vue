<template functional>
  <!-- 缺省页 函数时组件 -->
  <div class="nodata-page">
    <!-- icon -->
    <img
      style="padding-top: 30%"
      src="@/assets/images/no-search-data.png"
      alt=""
    />
    <!-- 提示信息 props传入contentTxt -->
    <div style="padding-top: 10px">{{ props.contentTxt }}</div>
  </div>
</template>

<style lang="scss" scoped>
.nodata-page {
  text-align: center;
  width: 100%;
  left: 0%;
  top: 5%;
  font-size: 13px;
  color: rgba(153, 153, 153, 1);
  img {
    width: 67px;
    height: 49px;
  }
}
</style>
