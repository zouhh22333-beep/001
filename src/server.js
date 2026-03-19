const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// 保留跨域设置
app.use(cors());
app.use(express.json());

// 设置静态文件目录，基于你现有文件夹结构
app.use(express.static(path.join(__dirname, "/")));

// 根路径返回你的 index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 如果你原来有 /api/chat 接口（我保留接口逻辑示例）
app.post("/api/chat", async (req, res) => {
  try {
    // 这里保留你的接口逻辑，如果没有可以注释掉
    res.json({ message: "接口示例" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});