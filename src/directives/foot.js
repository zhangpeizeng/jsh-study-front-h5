/**
 * Author:seebin
 *
 * 控制底部悬浮固定栏，在键盘弹起时隐藏，在键盘收回时显示
 *
 * 通过监听屏幕高度变化来操作元素隐藏与显示，默认通过disabled：block来显示元素
 * 可以通过传递指令值来设置默认属性, 比如：v-foot="'flex'" 则会通过disabled：flex来显示元素
 *
 * 使用方法：
 * import Vue from 'vue';
 * import Foot from '@/directives/foot';
 * Vue.use(Foot)
 *
 * 然后在需要隐藏的元素上添加指令v-foot即可.栗子：
 * <div v-foot>确认发货</div>
 */

// 监听执行方法
let listenAction;
// 原生高度
let originalHeight;
// 当前高度
let currHeight;
// disabled  取值范围 后期可补充
const disabledRange = ["flex", "block", "inline-block", "none"];

export default {
  install: Vue => {
    Vue.directive("foot", {
      inserted(el, binding) {
        if (binding.value && !disabledRange.includes(binding.value)) {
          throw new Error(
            "v-foot 的取值范围为：'flex' | 'block' | 'inline-block' | 'none'"
          );
        }
        const elStyle = el.style;
        let active = false;
        originalHeight = document.body.clientHeight;
        const reset = () => {
          if (!active) {
            return;
          }
          elStyle.display = binding.value ? binding.value : "block";
          active = false;
        };
        const hang = () => {
          if (active) {
            return;
          }
          elStyle.display = "none";
          active = true;
        };
        const getCurrHeight = () => {
          return document.body.clientHeight;
        };
        const check = () => {
          currHeight = getCurrHeight();
          if (currHeight < originalHeight - 100) {
            hang();
          } else {
            reset();
          }
        };
        listenAction = () => {
          check();
        };
        window.addEventListener("resize", listenAction);
      },
      unbind() {
        window.removeEventListener("resize", listenAction);
      }
    });
  }
};
