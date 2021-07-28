import Vue from "vue";
import Vuex from "vuex";
import VConsole from "vconsole";
Vue.use(Vuex);

export default new Vuex.Store({
  state: { vconsoleFlag: false },
  mutations: {
    showVConsole(state) {
      state.vconsoleFlag = true;
      if (state.vconsoleFlag) {
        new VConsole();
      }
    }
  },
  actions: {},
  modules: {}
});
