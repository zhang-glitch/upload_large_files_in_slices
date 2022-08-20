<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div @click="skipTest1">点击跳转到test1</div>
    <div @click="skipTest2">点击跳转到test2</div>
    <div @click="skipHome">点击跳转到home</div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "test1",
  mounted() {
    console.log("about ==> matcheds", this.$route.matched);
  },
  methods: {
    skipTest1() {
      this.$router.push("/test1");
    },
    skipTest2() {
      this.$router.push("/test2");
    },
    skipHome() {
      this.$router.push("/");
    },
  },
};
</script>
