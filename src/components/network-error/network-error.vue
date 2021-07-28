<template functional>
  <!-- 网络异常页面 函数式组件 -->
  <div class="no-network">
    <!-- icon -->
    <img style="padding-top: 30%" src="@/assets/images/network.png" alt="" />
    <!-- 网络异常提示 -->
    <div style="padding-top: 30px; color: #646566; font-size: 14px">
      网络请求失败
    </div>
    <div style="padding-top: 10px">请检查您的网络，重新加载试试吧</div>
    <!-- 刷新按钮 onRefresh刷新接口，通过props传入 -->
    <div class="refresh" @click="props.onRefresh">刷新</div>
  </div>
</template>

<style lang="scss" scoped>
.no-network {
  top: 0%;
  padding-top: 83px;
  text-align: center;
  position: absolute;
  width: 100%;
  height: 100%;
  background: white;
  font-size: 13px;
  color: rgba(150, 151, 153, 1);
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
}
</style>
