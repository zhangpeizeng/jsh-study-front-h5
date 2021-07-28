const SentryWebpackPlugin = require("@sentry/webpack-plugin");
const pkg = require("./package.json");

const plugins = [];

const getNowDate = () => {
  const date = new Date();
  const y = date.getFullYear() + "";
  const m = "0" + (date.getMonth() + 1);
  const d = "0" + date.getDate();
  const h = "0" + date.getHours();
  const mm = "0" + date.getMinutes();
  return `${y.slice(-2)}${m.slice(-2)}${d.slice(-2)}T${h.slice(-2)}:${mm.slice(
    -2
  )}`;
};
const releaseVersion = `${pkg.version}-${getNowDate()}`;

if (
  process.env.NODE_ENV === "production" &&
  process.env.JENKINS_CHECK_BUILD !== "true"
) {
  plugins.push(
    new SentryWebpackPlugin({
      url: "https://sentry.ylhtest.com/",
      // sentry-cli configuration
      authToken:
        "e262460de1604259af66aa78cce0cb2d94ac90c0cb434de290f2979a1e218b0d",
      org: "jsh",
      project: "jsh-study-front-h5",
      release: `jsh-study-front-h5@${releaseVersion}`,

      // webpack specific configuration
      include: "./dist",
      urlPrefix: "~/h5",

      deploy: {
        env: process.env.VUE_APP_SENTRY_ENV
      }
    })
  );
}

module.exports = {
  lintOnSave: false,
  // 输出文件目录
  outputDir: "dist",
  // 不要轻易改地址，
  publicPath: "/h5",
  transpileDependencies: ["@jsh/helper"],
  // 代理地址
  devServer: {
    port: 8081,
    open: true,
    overlay: {
      //  当出现编译器错误或警告时，在浏览器中显示全屏覆盖层
      warnings: false,
      errors: true
    },
    // proxy: process.env.VUE_APP_SERVER_HOST_UHOME
    proxy: {
      // 易理货登录测试服务
      "^/ylh-cloud": {
        target: process.env.VUE_TEST_SERVER,
        changeOrigin: true
      },
      // 营销学院测试服务
      "^/jsh-study": {
        target: process.env.VUE_APP_SERVER_HOST_UHOME,
        changeOrigin: true
      }
    }
    // public: "0.0.0.0:8081"
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require("postcss-px-to-viewport")({
            unitToConvert: "px",
            viewportWidth: 375,
            unitPrecision: 5,
            propList: ["*"],
            viewportUnit: "vw",
            fontViewportUnit: "vw",
            selectorBlackList: [".ignore", ".hairlines"],
            minPixelValue: 1,
            mediaQuery: false,
            replace: true,
            exclude: /(\/|\\)(node_modules)(\/|\\)/
          })
        ]
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule("vue")
      .test(/\.vue$/)
      .use("style-vw-loader")
      .loader("style-vw-loader")
      .tap(() => {
        return {
          unitToConvert: "px",
          viewportWidth: 375,
          unitPrecision: 5,
          viewportUnit: "vw",
          fontViewportUnit: "vw",
          minPixelValue: 1
        };
      });
  },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /main.js$/,
          loader: "string-replace-loader",
          options: {
            search: "RELEASE_VERSION_FOR_WEBPACK",
            replace: releaseVersion
          }
        }
      ]
    }
    // plugins
  }
};
