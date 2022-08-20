const http = require("http");
const path = require("path");
const fse = require("fs-extra");
const multiparty = require("multiparty");
// 大文件存储目录
const UPLOAD_DIR = path.resolve(__dirname, "./", "target");

const resolvePost = req =>
   new Promise(resolve => {
     let chunk = "";
     req.on("data", data => {
       chunk += data;
     });
    req.on("end", () => {
       resolve(JSON.parse(chunk));
     });
});

 // 写入文件流
const pipeStream = (path, writeStream) =>
  new Promise(resolve => {
    const readStream = fse.createReadStream(path);
    readStream.on("end", () => {
      fse.unlinkSync(path);
      resolve();
    });
    readStream.pipe(writeStream);
});

// 合并切片
const mergeFileChunk = async (filePath, filename, size = 2 * 1024 *1024) => {
  const chunkDir = path.resolve(UPLOAD_DIR, 'chunkDir' + filename);
// 异步读取可能会发生顺序错乱
  const chunkPaths = await fse.readdir(chunkDir);
   // 根据切片下标进行排序
   // 否则直接读取目录的获得的顺序会错乱
  chunkPaths.sort((a, b) => a.split("-")[1] - b.split("-")[1]);
   // 并发写入文件
  await Promise.all(
    chunkPaths.map((chunkPath, index) =>
      pipeStream(
        path.resolve(chunkDir, chunkPath),
         // 根据 size 在指定位置创建可写流
        fse.createWriteStream(filePath, {
           start: index * size,
        })
      )
    )
  ).catch(err => {
    console.log("=======err", err)
  });
  // 合并后删除保存切片的目录
  fse.rmdirSync(chunkDir);
};

// 方式一
const server = new http.Server(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
     res.status = 200;
     res.end();
     return;
  }
  const multipart = new multiparty.Form();
  multipart.parse(req, async (err, fields, files) => {
     if (err) {
       return;
     }
     const [chunk] = files.chunk;
     const [hash] = fields.hash;
     const [filename] = fields.filename;
     // 创建临时文件夹用于临时存储 chunk
     // 添加 chunkDir 前缀与文件名做区分
     const chunkDir = path.resolve(UPLOAD_DIR, 'chunkDir' + filename);
     if (!fse.existsSync(chunkDir)) {
       await fse.mkdirs(chunkDir);
     }
    // fs-extra 的 rename 方法 windows 平台会有权限问题
     // @see https://github.com/meteor/meteor/issues/7852#issuecomment-255767835
     await fse.move(chunk.path, `${chunkDir}/${hash}`);
     res.end("received file chunk");
  });

  if (req.url === "/merge") {
    const data = await resolvePost(req);
    const { filename,size } = data;
    const filePath = path.resolve(UPLOAD_DIR, `${filename}`);
    await mergeFileChunk(filePath, filename);
    res.end(
      JSON.stringify({
        code: 0,
        message: "file merged success"
      })
    );
  }
})


server.listen(3000, () => {
  console.log("服务器创建成功")
})

