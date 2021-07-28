import JSH from "@/core";

/**
 * 精武门 调式入口页面
 */
export default {
  data() {
    return {
      address: ""
    };
  },
  methods: {
    tpDebugPageForLocation() {
      if (!this.address) return;
      window.location.href = this.address;
    },
    tpDebugPageForNavigate() {
      if (!this.address) return;
      JSH.navigateTo({
        url: this.address
      });
    }
  },
  created() {}
};
