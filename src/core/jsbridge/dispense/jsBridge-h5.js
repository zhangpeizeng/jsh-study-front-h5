import _ from "lodash";
import axios from "axios";
import qs from "qs";
import CloudMarketing from "../../../request/interface/cloud-marketing";
import jwtto from "jwt-decode";

class JsBridgeH5 {
  constructor() {
    // 示例来源 用来判断是h5还是原生
    this.source = "h5";
  }

  /**
   * 从url中获取参数
   */
  getParams() {
    const ret = {};
    const seg = location.search.replace(/^\?/, "").split("&");
    const len = seg.length;
    let s;
    for (let i = 0; i < len; i += 1) {
      if (seg[i]) {
        s = seg[i].split("=");
        ret[s[0]] = decodeURIComponent(s[1]);
      }
    }
    return ret;
  }

  /**
   * 格式化对象为query拼接
   * @param {*} data 参数对象
   */
  formatParam(data) {
    let param = "";

    _.forIn(data, (value, key) => {
      param += `${key}=${value}&`;
    });

    return _.trimEnd(param, "&");
  }

  request(options) {
    const owner = this;
    if (options.url === null || options.url === undefined) {
      // eslint-disable-next-line no-console
      console.log("url is null");
      throw new Error("url Can't be empty! ");
    }
    if (options.method !== "post" && options.method !== "get") {
      // eslint-disable-next-line no-console
      console.log(
        "method is wrong required post or get, current is " + options.method
      );
      throw new Error(
        "method is wrong required post or get, current is " + options.method
      );
    }
    owner.deliveryRequest(options);
  }
  requestto(options) {
    if (options.url === null || options.url === undefined) {
      // eslint-disable-next-line no-console
      console.log("url is null");
      throw new Error("url Can't be empty! ");
    }
    if (options.method !== "post" && options.method !== "get") {
      // eslint-disable-next-line no-console
      console.log(
        "method is wrong required post or get, current is " + options.method
      );
      throw new Error(
        "method is wrong required post or get, current is " + options.method
      );
    }
    console.log(options.tokens);
    if (options && options.tokens) {
      options._config = {
        headers: {
          authorization: `bearer ${options.tokens ? options.tokens : ""}`
        }
      };
    }
    if (options.method === "post") {
      this.post(options);
    } else if (options.method === "get") {
      this.get(options);
    }
  }

  deliveryRequest(options) {
    let owner = this;
    console.log("options++++", options);
    // eslint-disable-next-line no-console
    console.log("===request url is: " + options.url);
    let accessToken = localStorage.getItem("accessToken");
    let accessexp = localStorage.getItem("accessexp")
      ? Number(localStorage.getItem("accessexp"))
      : 0;
    let nowdate = Date.parse(new Date().toString()) / 1000;
    let url = `${CloudMarketing.checkauthtoken}`;
    //时效时间获取失败
    if (!accessexp) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("accessexp");
      let oldtoken = localStorage.getItem("oldtoken");
      localStorage.removeItem("accessexp");
      options._config = {
        headers: {
          authorization: `bearer ${oldtoken ? oldtoken : ""}`
        }
      };
      //设置超时
      axios.defaults.timeout = 15000;
      axios
        .post(
          url,
          options.contentType === "form"
            ? qs.stringify(options.params)
            : options.params,
          options._config
        )
        .then(response => {
          let res = response.data;
          if (res.data.success) {
            let data = res.data.data["access_token"]
              ? res.data.data["access_token"]
              : null;
            //刷新本地缓存
            if (data && data != "") {
              localStorage.setItem("accessToken", data);
              // let userString = decodeURIComponent(
              //   escape(window.atob(data.split(".")[1]))
              // );
              let userString = jwtto(data);
              let time = userString.exp ? userString.exp : null;
              if (time && time != "") {
                localStorage.setItem("accessexp", time);
                console.log(time);
              }
              accessToken = data;
            } else {
              owner.$router.replace("/404");
            }
          } else {
            owner.$router.replace("/404");
          }
        })
        .catch(error => {
          this.handleRequestErrors(error);
        });
    }
    //  判断时效性
    if (accessexp - nowdate > 300) {
      options._config = {
        headers: {
          authorization: `bearer ${accessToken ? accessToken : ""}`
        }
      };
      if (options.method === "post") {
        this.post(options);
      } else if (options.method === "get") {
        this.get(options);
      }
    }
    //超过有效期处理
    else {
      owner.$router.replace("/public/nologin");
    }
  }

  get(options) {
    const url = `${options.url}?${this.formatParam(options.params)}`;
    //设置超时
    axios.defaults.timeout = 15000;
    axios
      .get(url, options._config)
      .then(response => {
        options.success(response.data);
      })
      .catch(error => {
        this.handleRequestErrors(error);
        options.error(error);
      });
  }

  post(options) {
    const url = `${options.url}`;
    //设置超时
    axios.defaults.timeout = 15000;
    console.log(options);
    axios
      .post(
        url,
        options.contentType === "form" ? options.params : options.params,
        options._config
      )
      .then(response => {
        options.success(response.data);
      })
      .catch(error => {
        this.handleRequestErrors(error);
        options.error(error);
      });
  }

  handleRequestErrors(error) {
    if (error && error.response && error.response.status === 401) {
      // localStorage.setItem("loginBackUrl", window.location.href);
      // location.replace("/pages/common/login?loginBackUrl=1");
    }
    if (
      error &&
      error.response &&
      error.response.request &&
      error.response.request.responseText
    ) {
      const emp = error.response.request.responseText.includes(
        "<!DOCTYPE html>"
      );
      if (emp) {
        // localStorage.setItem("loginBackUrl", window.location.href);
        // location.replace("/pages/common/login?loginBackUrl=1");
      }
    }
  }

  /**
   * 设置存储
   * @param {*} options
   */
  setStorage(options) {
    try {
      window.localStorage.setItem(options.key, options.data);
      if (options.success) options.success();
    } catch (e) {
      if (options.error) options.error(e);
    }
  }

  /**
   * 获取存储
   * @param {*} options
   */
  getStorage(options) {
    const item = localStorage.getItem(options.key);
    if (options.success) {
      options.success({ data: item });
    }
  }

  /**
   * 移除存储
   * @param {*} options
   */
  removeStorage(options) {
    window.localStorage.removeItem(options.key);
  }

  /**
   * 清空存储
   */
  clearStorage() {
    window.localStorage.clear();
  }

  setRootPath(path) {
    this.rootPath = path;
  }

  isRootPath() {
    return window.location.href.includes(this.rootPath);
  }
}

export default JsBridgeH5;
