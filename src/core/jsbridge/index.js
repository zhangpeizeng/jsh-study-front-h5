import JsBridgeH5 from "./dispense/jsBridge-h5";

// 适配对象
let JSH = {};

JSH = JsBridgeH5;

const jsh = new JSH();
// 暴露到全局对象
window.JSBridge = jsh;

export default jsh;
