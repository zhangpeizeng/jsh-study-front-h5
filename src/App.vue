<template>
  <div id="app" style="word-break: break-all">
    <keep-alive>
      <router-view
        v-wechat-title="$route.meta.title"
        v-if="$route.meta && $route.meta.keepAlive"
        :key="$route.fullPath"
      />
    </keep-alive>
    <router-view
      v-wechat-title="$route.meta.title"
      v-if="!($route.meta && $route.meta.keepAlive)"
      :key="$route.fullPath"
    />
    <loading></loading>
  </div>
</template>
<script>
import loading from "./components/loading/loading.vue";

export default {
  components: {
    loading
  },
  created() {},
  methods: {}
};
</script>
<style lang="scss">
@import "./assets/style/common.scss";

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
