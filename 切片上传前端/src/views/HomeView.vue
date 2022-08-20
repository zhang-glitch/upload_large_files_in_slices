<template>
  <div class="home">
    <vui-design-test />
    <!-- 使用store -->
    <div>{{ username }}</div>
    <button @click="handleClick">改变name</button>
  </div>
</template>

<script>
import VuiDesignTest from "@/components/VuiDesignTest.vue";
import { useLoginStore } from "../store/piniaStore";
import { mapState, mapActions } from "pinia";
// 这个不能再setup以外调用
// const loginStore = useLoginStore();
export default {
  components: { VuiDesignTest },
  name: "HomeView",
  computed: {
    ...mapState(useLoginStore, ["username", "password", "age"]),
  },
  methods: {
    ...mapActions(useLoginStore, ["changeUsername"]),
    handleClick() {
      this.changeUsername("llm");
    },
  },
  mounted() {
    console.log("this.$store", this.username);
    // const { username } = loginStore();
    // console.log("home ==> matcheds", this.$route, this.$route.matched);
  },
  updated() {
    const { username } = useLoginStore();
    console.log("username", username);
  },
};
</script>
