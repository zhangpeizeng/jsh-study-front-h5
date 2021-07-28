// src/assets/js/AMap.js

export default function MapLoader() {
  // <-- 原作者这里使用的是module.exports
  return new Promise((resolve, reject) => {
    console.log(window.AMap);
    if (window.AMap) {
      resolve(window.AMap);
    } else {
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src =
        "https://webapi.amap.com/maps?v=1.4.15&callback=initAMap&key=95753776c60b45092a199be41225c7c5";
      script.onerror = reject;
      document.head.appendChild(script);
    }
    window.initAMap = () => {
      resolve(window.AMap);
    };
  });
}
