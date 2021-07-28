<template>
  <div class="p-12">
    <div class="pt-40">
      <textarea
        v-model="url"
        rows="3"
        class="w-100"
        placeholder="请粘帖要跳转的地址"
      ></textarea>
    </div>
    <div>
      <button @click="toPage">跳转</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: ""
    };
  },
  methods: {
    toPage() {
      if (!this.url) return;
      window.location.href = this.url;
    }
  }
};
</script>
