<template>
  <div class="vui-design-test">
    <vui-breadcrumb separator=">">
      <vui-breadcrumb-item to="/">Home</vui-breadcrumb-item>
      <vui-breadcrumb-item to="/test2">test2</vui-breadcrumb-item>
      <vui-breadcrumb-item :to="undefined"
        >测试undefined是否可跳转</vui-breadcrumb-item
      >
    </vui-breadcrumb>

    <vui-select
      v-model="value"
      style="width: 200px"
      placeholder="Please select"
    >
      <vui-option value="new york">New York</vui-option>
      <vui-option value="london">London</vui-option>
      <vui-option value="sydney">Sydney</vui-option>
      <vui-option value="ottawa">Ottawa</vui-option>
      <vui-option value="paris">Paris</vui-option>
      <vui-option value="canberra">Canberra</vui-option>
    </vui-select>

    <button @click="handleClick">加载 / 暂停</button>

    <!-- <div class="dwa">dwda</div> -->

    <!-- <div class="loading"></div> -->
    <!-- <div class="lb-loading" v-show="status">
      <vui-spin :spinning="status" size="large" class="lb-loading-icon">
        <vui-icon
          slot="indicator"
          type="loading-filled"
          style="font-size: 30px"
        />
      </vui-spin>
    </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: "",
      status: false,
    };
  },
  watch: {
    value(value) {
      console.log(value);
    },
  },
  methods: {
    handleClick() {
      const loading = this.$loading({
        lock: true,
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.1)",
      });
      // this.status = true;
      setTimeout(() => {
        // this.status = !this.status;
        loading.close();
      }, 2000);
    },
  },
};
</script>

<style>
.dwa {
  width: 100%;
  height: 100%;
}
/* .loading {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
} */
/* .vui-design-test {
  height: 100%;
  width: 100%;
} */
.lb-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}
.lb-loading-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
