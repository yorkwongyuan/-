const express = require("express");
const swig = require("swig");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Cookies = require("cookies");
const Users = require("./models/User");

// 解析前端传给后端的参数
app.use(bodyParser.urlencoded({ extended: true }));

// 第一个参数是模版文件的后缀，第二个参数表示用于处理模版内容的方法
app.engine("html", swig.renderFile);

// 设置模版文件目录，第一个不变，第二个为目录
app.set("views", "./views");

// 注册所使用的模版引擎
app.set("view engine", "html");

// 静态文件处理
// 这步其实是正则匹配，凡是/root开头的全部指向public文件
app.use('/root', express.static(__dirname + "/public"));

// 中间处理函数-将用户信息传入公共部分
app.use(function (req, res, next) {
  req.cookies = new Cookies(req, res);
  req.userinfo = req.cookies.get("userinfo");
  try {
    Users.findOne({ _id: req.userinfo }).then(res => {
      // 全局userinfo
      req.userinfo = res;
      next()
    })
  } catch (e) {
    next()
  }
})

// 分模块

// 后台管理部分
app.use("/admin", require("./routers/admin"));
// // ajax请求部分
app.use("/api", require("./routers/api"));
// 为req添加body属性
// // 大前端部分
app.use("/", require("./routers/main"));

swig.setDefaults({
  cache: false
})

mongoose.connect("mongodb://localhost:27017", function (err) {
  if (err) {
    console.log("数据库连接失败");
  } else {
    app.listen(3000);
    console.log("连接成功")
  }
})
