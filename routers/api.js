const express = require("express");
const router = express.Router();
const Users = require("../models/User");
const Content = require("../models/Content");

let responseData = {};
router.use(function (req, res, next) {
  responseData = {
    code: 0,
    message: ""
  }
  next();
});

router.post("/user/register", function (req, res) {
  // console.log(req.body, 'body')
  let username = req.body.username;
  let password = req.body.password;
  let repassword = req.body.repassword;
  if (username == '') {
    responseData = {
      code: 1,
      message: "用户名不得为空"
    }
    res.json(responseData);
    return;
  }
  if (password == '') {
    responseData = {
      code: 1,
      message: "密码不得为空"
    }
    res.json(responseData);
    return;
  }

  if (password != repassword) {
    responseData = {
      code: 1,
      message: "两次输入的密码不同！"
    }
    res.json(responseData);
    return;
  }

  // 去数据库核实信息
  Users.findOne({ username: username }).then(userinfo => {
    // 用户存在
    if (userinfo) {
      responseData = {
        code: 1,
        message: "用户已经存在了"
      }
      res.json(responseData);
      return;
    }

    // 用户名不存在
    let users = new Users({
      username: username,
      password: password
    });
    return users.save();

  }).then(save => {
    console.log(save, '保存成功');
    responseData = {
      code: 0,
      message: "保存成功"
    }
    res.json(responseData);
  });
});

router.post('/user/login', function (req, res) {
  let data = req.body;
  let { username, password } = data;
  // 从数据库取数据
  Users.findOne({ username: username, password: password }).then(userinfo => {
    if (userinfo != null) {
      responseData = {
        code: 0,
        msg: '返回成功',
        data: data
      }
      // 设置cookies
      req.cookies.set("userinfo", userinfo._id);
    } else {
      responseData = {
        code: 1,
        msg: '用户名或密码错误',
        data: data
      }
    }
    res.json(responseData);
  })

});

router.get('/user/logout', function(req, res){
  req.cookies.set('userinfo', null);
  res.json('ok')
});

router.post("/category/add", function(req, res){
  console.log(req.body);
  res.json()
});

// 提交评论

router.post("/comments/submit", function(req, res){
  let contentId = req.body.contentId;
  let content = req.body.content;
  Content.findOne({
    _id: contentId
  }).then(contentResult => {
    contentResult.comments.unshift({
      content: content,
      username: req.userinfo.username,
      postTime: new Date().toLocaleString("zh")
    });
    return contentResult.save()
  }).then(newContent => {
    responseData.msg = "保存成功";
    responseData.data = newContent;
    res.json(responseData)
  })
});

// 获取评论列表
router.get("/comments", function(req, res){
  let query = req.query || "";
  Content.findOne({
    _id: query.contentId
  }).then(result => {
    responseData.msg = "返回成功";
    responseData.data = result;
    res.json(responseData)
  })
})
module.exports = router;