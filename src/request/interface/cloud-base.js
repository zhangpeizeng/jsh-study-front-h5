/**
 *
 * 微服务定制服务
 */

const PREFIX = `${process.env.VUE_APP_SERVER_HOST}/ylh-cloud-service-base${process.env.VUE_APP_SERVER_SUFFIX_UHOME}`;
//const PREFIX = `ylh-cloud-service-base-uhome${process.env.VUE_APP_SERVER_SUFFIX}`; // 浏览器调试用
const PREFIX_SHARE = `${process.env.VUE_APP_SERVER_HOST_SHARE}/h5`;
const TITLE_PREFIX = `${process.env.VUE_APP_SERVER_SUFFIX}`;

// 接口列表
export default {
  titlePrefix: `${TITLE_PREFIX}`,
  // 获取省份
  getProvinceList: `${PREFIX}/api/page/base-static/list-province-list`,
  // 获取市
  getCityList: `${PREFIX}/api/page/base-static/get-city-by-province-code`,
  // 获取县
  getCountyNameList: `${PREFIX}/api/page/base-static/get-county-by-city-code`,
  // 初始化获取省市区
  getAddressData: `${PREFIX}/api/page/base-static/list-base-address`,
  // 分享外链
  share: `${PREFIX_SHARE}`,
  shopMap: `${PREFIX_SHARE}#/public/comment-map`,
  nearbyMap: `${PREFIX_SHARE}#/public/nearby-store-map`
};
