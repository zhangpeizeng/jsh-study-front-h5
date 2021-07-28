import Vue from "vue";

/**
 * image-url filter
 *
 * example 1:
 *    {{ url | matchImgUrl(300)}}
 *
 * example 2:
 *    :src="url | matchImgUrl(300)"
 */
Vue.filter("matchImgUrl", (url, width) => {
  if (width === null || width === undefined || width === "") {
    throw new Error("parameter 'width' is required");
  }
  if (url !== null && url !== undefined && url !== "") {
    if (url.match(/\/\/video.yilihuo.com/)) {
      return url;
    } else if (url.match(/.yilihuo.com/) || url.match(/.jsh.com/)) {
      // eslint-disable-next-line no-useless-escape
      const _imgName = url.replace(/.*\/([^\/]+)\..+/, "$1");
      return url.replace(_imgName, `${_imgName}_w${width}`);
    } else {
      return `${url}?p=2&w=${width}`;
    }
  } else {
    return "";
  }
});

/**
 * 时间过滤器
 *
 * 格式化时间为字符串为指定形式， 可格式化的值：1、时间戳 2、格式化后的时间字符串
 *
 * 通过字母匹配替换(yyyy|MM|dd|hh|mm|ss) 可随意组装连接符号 以及随意组装显示的格式
 *
 * 例子：
 * <div>{{1574152196836 | date}}</div>                            ==> 2019-11-19 16:29:56
 * <div>{{1574152196836 | date('yyyy-MM-dd hh:mm:ss')}}</div>     ==> 2019-11-19 16:29:56
 * <div>{{1574152196836 | date('yyyy-MM-dd')}}</div>              ==> 2019-11-19
 * <div>{{1574152196836 | date('MM-dd hh:mm')}}</div>             ==> 11-19 16:29
 * <div>{{'2019-11-19 16:29:56' | date('yyyy年MM月dd日')}}</div>   ==> 2019年11月19日
 * <div>{{'2019-11-19 16:29:56' | date('yyyy/MM/dd')}}</div>      ==> 2019/11/19
 *
 */

Vue.filter("date", function(value, type = "yyyy-MM-dd hh:mm:ss") {
  if (value === null || value === undefined || value === "") return "";

  let date = new Date();
  if (typeof value === "string" || typeof value === "number") {
    date = new Date(value);
  } else {
    return "";
  }

  if (/(y+)/.test(type)) {
    type = type.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  let o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds()
  };

  Object.keys(o).forEach(key => {
    if (new RegExp(`(${key})`).test(type)) {
      let str = o[key] + "";
      type = type.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : ("00" + str).substr(str.length)
      );
    }
  });

  return type;
});

/**
 * 将数字转以万为单位
 */
Vue.filter("numberToWanUnit", (value, decimals = 1) => {
  const number = parseFloat(value);
  if (isNaN(number)) return value;

  if (number >= 10000) {
    return parseFloat((number * 0.0001).toFixed(decimals)) + "万";
  }
  return value;
});
/**
 * 当年不展示年
 */
Vue.filter("date1", function(value, type = "yyyy-MM-dd hh:mm:ss") {
  if (value === null || value === undefined || value === "") return "";
  let date = new Date();
  if (typeof value === "string" || typeof value === "number") {
    date = new Date(value);
  } else {
    return "";
  }

  if (/(y+)/.test(type)) {
    type = type.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
    // 当年不展示年
    if (date.getFullYear() == new Date().getFullYear()) {
      type = type.substr(5, type.length);
    }
  }
  let o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds()
  };

  Object.keys(o).forEach(key => {
    if (new RegExp(`(${key})`).test(type)) {
      let str = o[key] + "";
      type = type.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : ("00" + str).substr(str.length)
      );
    }
  });

  return type;
});
/**
 * 将1 过滤成 01
 */
Vue.filter("numberFilter", value => {
  if (value === null || value === undefined || value === "") return "";
  let number = value;
  if (typeof number === "string") {
    if (number.length == 1) {
      return "0" + number;
    }
  } else {
    return value;
  }
  return value;
});
