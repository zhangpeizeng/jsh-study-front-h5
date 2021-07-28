# ylh-web-front-main-local

## 项目使用说明
一、 第一步
```
npm install
```
二、 第二步
在根目录创建`.env.local`文件(本地开发配置文件)，并将以下内容复制到文件中

```
NODE_ENV='development'
VUE_APP_SERVER_SUFFIX='-dev'
VUE_APP_SERVER_HOST='http://dev.yilihuo.com'
VUE_APP_SERVER_HOST_UHOME='http://uhome-dev.ylhtest.com'
VUE_APP_SERVER_SUFFIX_UHOME='-uhome-dev'
VUE_APP_CONSOLE='false'
```

> 注：  
VUE_APP_SERVER_SUFFIX 为微服务工程分环境的后缀名；  
VUE_APP_SERVER_PROXY 为接口反向代理的服务地址，切换代理地址，可使用#号注释其他的地址，保证保留一个代理地址  
该文件不会被提交至git仓库

三、 执行命令 `npm run server` 来启动项目

### dev环境打包
```
npm run build:dev
```

### 验证代码规范并修复文件
```
npm run lint
```

四、接口地址

接口地址配置在request/interface/cloud-marketing.js中

五、网络请求接口

```
import JSH from "@/core";
JSH.request({
      url: CloudCustomized.TEST_API,
      method: "get|post",
      contentType: "get请求不需要此参数，post根据后台请求方式传form|json",
      params: {},
      success(data) {
        // eslint-disable-next-line no-console
        console.log(data);
      },
      error(e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    });
``` 

六、判断是否在APP中运行

```
import JSH from "@/core";
``` 



七、问题记录

- 写在style内联样式里面的1px不会生效，应该是style-vw-loader内部处理有问题，解决方法：可写在class里面

