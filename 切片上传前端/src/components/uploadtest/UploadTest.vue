<template>
  <div>
    <input type="file" @change="handleFileChange" />
    <el-button @click="handleUpload">上传</el-button>
    <h1>总进度条</h1>
    <el-progress :percentage="uploadPercentage"></el-progress>
    <!-- <el-progress :percentage="totalPercentage"></el-progress> -->
    <h1>每个chunk的进度条</h1>
    <el-progress
      v-for="item in data"
      :key="item.hash"
      :percentage="item.percentage"
    >
    </el-progress>
  </div>
</template>

<script>
// 切片大小
// the chunk size
const SIZE = 10 * 1024 * 1024;
// 测试progress是不是只会执行分片数组长度的次数。经过测试，发现不是的。
let c = 0;
export default {
  data: () => ({
    container: {
      file: null,
    },
    // 放置若干个切片
    data: [],
    totalPercentage: 0,
  }),
  computed: {
    // 通过上传的进度可知，我们上传文件的时候，他是并行的。
    uploadPercentage() {
      if (!this.container.file || !this.data.length) return 0;
      // 如果没有发送的他们的percentage还是0
      const loaded = this.data
        .map((item) => item.chunk.size * (item.percentage / 100))
        .reduce((acc, cur) => acc + cur);
      console.log(
        "====================已加载的， 文件总大小, 比例",
        loaded,
        this.container.file.size
      );
      return parseInt(((loaded / this.container.file.size) * 100).toFixed(2));
    },
  },
  methods: {
    request({
      url,
      method = "post",
      data,
      headers = {},
      onProgress = (e) => e,
    }) {
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        // 获取文件的上传进度
        // onprogress事件并不是只执行分块大小的次数，而是根据读取文件大小来确定执行多少次，直到文件全部上传完毕
        xhr.upload.onprogress = onProgress;
        xhr.open(method, url);
        Object.keys(headers).forEach((key) =>
          xhr.setRequestHeader(key, headers[key])
        );
        xhr.send(data);
        xhr.onload = (e) => {
          // console.log("eee", e);
          // 在这里进行总的进度计算。
          let cur = 0;
          this.data.forEach((item) => {
            // 这里也可以测试时并行的，因为cur不是每次增加100
            cur += item.percentage;
            this.totalPercentage = (
              (cur / (this.data.length * 100)) *
              100
            ).toFixed(0);
          });
          resolve({
            data: e.target.response,
          });
        };
      });
    },
    handleFileChange(e) {
      const [file] = e.target.files;
      if (!file) return;
      Object.assign(this.$data, this.$options.data());
      this.container.file = file;
    }, // 生成文件切片
    createFileChunk(file, size = SIZE) {
      const fileChunkList = [];
      let cur = 0;
      while (cur < file.size) {
        fileChunkList.push({ file: file.slice(cur, cur + size) });
        cur += size;
      }
      return fileChunkList;
    }, // 上传切片
    async uploadChunks() {
      const requestList = this.data
        .map(({ chunk, hash, index }) => {
          const formData = new FormData();
          formData.append("chunk", chunk);
          formData.append("hash", hash);
          formData.append("filename", this.container.file.name);
          return { formData, index };
        })
        .map(({ formData, index }) =>
          this.request({
            url: "http://localhost:3000",
            data: formData,
            // 获取单个切片的值（内部有hash ,chunk)
            onProgress: this.createProgressHandler(this.data[index]),
          })
        );
      // 并发请求
      await Promise.all(requestList);
      // 合并切片
      await this.mergeRequest();
    },
    // 单个chunk上传的进度。如果是整个文件，我们只需要在xml中的load事件中计算进度即可。
    createProgressHandler(item) {
      return (e) => {
        c++;
        console.log("eeeeeeee", e, this.container.file.size, c);
        item.percentage = parseInt(String((e.loaded / e.total) * 100));
      };
    },
    // 合并请求只需要传递一个文件名即可。
    async mergeRequest() {
      await this.request({
        url: "http://localhost:3000/merge",
        headers: {
          "content-type": "application/json",
        },
        data: JSON.stringify({
          filename: this.container.file.name,
        }),
      });
    },
    async handleUpload() {
      if (!this.container.file) return;
      const fileChunkList = this.createFileChunk(this.container.file);
      // 将切片赋值给data保存
      this.data = fileChunkList.map(({ file }, index) => ({
        chunk: file,
        index,
        // 文件名 + 数组下标
        hash: this.container.file.name + "-" + index,
        percentage: 0,
      }));
      await this.uploadChunks();
    },
  },
};
</script>
