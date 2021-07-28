<template>
  <div style="height: 100%">
    <div id="container" class="w-100 h-100"></div>
  </div>
</template>

<script>
import MapLoader from "@/assets/js/AMap.js";
export default {
  name: "MapDemo",
  components: {},
  data() {
    return {
      map: null
    };
  },
  created() {},
  mounted() {
    let that = this;
    MapLoader()
      .then(
        AMap => {
          console.log("地图加载成功");
          that.map = new AMap.Map("container", {
            center: [120.483379, 36.14615],
            zoom: 16
          });
          // 创建一个 Marker 实例：
          var marker = new AMap.Marker({
            position: that.map.getCenter(), // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            title: "青岛国际创新园"
          });
          marker.setLabel({
            offset: new AMap.Pixel(10, 10), //设置文本标注偏移量
            content: "<div class='info'>这里是宇宙的中心</div>", //设置文本标注内容
            direction: "right" //设置文本标注方位
          });
          marker.on("click", function() {
            marker.markOnAMAP({
              // 打开高德地图
              name: "我就是我", // 高德中显示的地点名称
              position: marker.getPosition() // 导航到的地点
            });
          });
          // that.map.addControl(new AMap.ToolBar());
          // if (AMap.UA.mobile) {
          //   document.getElementById("button_group").style.display = "none";
          // }
          that.map.add(marker);
        },
        e => {
          console.log("地图加载失败", e);
        }
      )
      .catch(e => {
        console.log(e);
      });
  },
  methods: {}
};
</script>
