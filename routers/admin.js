const express = require("express");
const Users = require("../models/User");
const router = express.Router();
const Category = require("../models/Category");
const Content = require("../models/Content");

// 校验
router.use(function (req, res, next) {
  if (req.userinfo && req.userinfo.isAdmin) {
    // res.send("欢迎来到管理后台")
  } else {
    res.send("对不起，本页面仅限管理员浏览");
    return;
  }
  next()
});
// 后台首页
router.get("/", function (req, res) {
  res.render('admin/index', {
    userinfo: req.userinfo
  })
});

// 获取数据总条数
let getCount = function (Schema) {
  return new Promise((resolve, reject) => {
    Schema.count().then(count => {
      resolve(count)
    })

  })
}
// 用户列表页
router.get("/user", async function (req, res) {
  // 一页的数据条数
  let limit = 2;
  let page = req.query.page || 1;
  // 数据总条数
  let count = await getCount(Users);
  // 总页数
  let pages = Math.ceil(count / limit);
  // 当前页数
  // 最大不得超过总页数
  page = Math.min(page, pages);
  // 最小不得低于1
  page = Math.max(page, 1);

  // 忽略
  let skip = (page - 1) * limit;

  Users.find().limit(limit).skip(skip).then(users => {
    res.render('admin/user', {
      userinfo: req.userinfo,
      users: users,
      page: page,
      pages: pages,
      limit: limit,
      count: count,
      pageUrl: '/admin/user'
    })
  })
});

// 分类管理首页
router.get("/category", async function (req, res) {
  let page = req.query.page || 1;
  let limit = 100;
  let skip = (page - 1) / limit;
  let count = await getCount(Category);
  // sort 1 为升序,-1为降序
  Category.find().sort({ _id: -1 }).limit(limit).skip(skip).then(categoryLists => {
    let pages = Math.ceil(count / limit);
    res.render("admin/category.html", {
      userinfo: req.userinfo,
      categoryLists: categoryLists,
      page: page,
      limit: limit,
      count: count,
      pages: pages,
      pageUrl: "/admin/category"
    });
  })

});

// 添加分类
router.get("/category/add", function (req, res) {
  res.render("admin/category_add", {
    userinfo: req.userinfo
  })
});

// 添加分类-添加操作
router.post("/category/add", function (req, res) {
  let name = req.body.name || "";
  if (name == '') {
    res.render("admin/error.html", {
      userinfo: req.userinfo,
      message: "内容不能为空"
    });
    return;
  }

  // 如果分类名不为空
  Category.findOne({
    name: name
  }).then(result => {
    // 如果存在结果
    if (result) {
      res.render("admin/error.html", {
        userinfo: req.userinfo,
        message: "该分类已经存在"
      });
      return Promise.reject();
    } else {

      return new Category({
        name: name
      }).save();
    }
  }).then(result2 => {
    res.render("admin/category_add", {
      userinfo: req.userinfo
    });
  })
});

// 编辑后台分类管理
router.get("/category/edit", function (req, res) {
  let id = req.query.id;
  // console.log('get 过来的id是',id)
  if (id == '') {
    res.render("/admin/error", {
      userinfo: req.userinfo,
      message: "缺少id"
    })
    return;
  }
  Category.findOne({ _id: id }).then(result => {
    let name = result.name;
    res.render("admin/category_edit", {
      userinfo: req.userinfo,
      categoryName: name,
      id: id
    })
  })
});

// 编辑后台操作
router.post("/category/edit", function (req, res) {
  // console.log(req.query.id,'id??');
  let id = req.query.id || "";
  let name = req.body.categoryName;
  Category.findOne({
    _id: id
  }).then(category => {
    // 如果要修改的记录的id根本不存在
    if (!category) {
      res.render('admin/error', {
        userinfo: req.userinfo,
        message: "该分类不存在"
      });
      return Promise.reject();
      // 如果记录存在  
    } else {
      // 但是和之前的记录一样
      if (name == category.name) {
        res.render('admin/success', {
          userinfo: req.userinfo,
          message: "修改成功",
          url: "/admin/category"
        });
        return Promise.reject();
        // 和之前name不同
      } else {
        return Category.findOne({
          id: {
            $ne: id
          },
          name: name
        })
      }
    }
  }).then(sameCategory => {
    // 但是其他记录中有该name
    if (sameCategory) {
      res.render("admin/error", {
        userinfo: req.userinfo,
        message: "该分类名已经存在"
      });
      return Promise.reject();
      // 但是其他记录中无该name
    } else {
      return Category.update({
        _id: id
      }, {
          name: name
        })
    }
  }).then(reviseResult => {
    console.log('res', reviseResult);
    res.render("admin/success", {
      userinfo: req.userinfo,
      message: "修改成功",
      url: "/admin/category"
    })
  })
});

// 删除分类
router.get("/category/del", function (req, res) {
  let id = req.query.id || "";

  Category.remove({
    _id: id
  }).then(result => {
    // console.log(result, 'result')
    res.render("admin/success", {
      userinfo: req.userinfo,
      message: "删除成功",
      url: "/admin/category"
    })
  })
});

// 内容部分！

// 内容首页
router.get("/content", async function (req, res) {
  let page = req.query.page || 1;
  let limit = 100;
  let skip = (page - 1) / limit;
  let count = await getCount(Content);
  // sort 1 为升序,-1为降序
  Content.find().sort({ _id: -1 }).limit(limit).skip(skip).populate(['Categorys','author']).then(contents => {
    console.log(contents, 'contents')
    let pages = Math.ceil(count / limit);
    res.render("admin/content_index", {
      userinfo: req.userinfo,
      contents: contents,
      page: page,
      limit: limit,
      count: count,
      pages: pages,
      pageUrl: "/admin/content"
    });
  })
});

// 内容添加
router.get("/content/add", function (req, res) {
  let userinfo = req.userinfo || "";
  Category.find().sort({ id: -1 }).then(categories => {
    res.render("admin/content_add", {
      userinfo: userinfo,
      categories: categories
    })
  })

});

// 内容添加操作
router.post("/content/add", function (req, res) {
  // 前端传递过来的数据
  let title = req.body.title;
  let content = req.body.content;
  let description = req.body.description;
  let Categorys = req.body.Categorys;
  // 校验部分，后期移到前端验证
  if (title == '') {
    res.render("admin/error", {
      userinfo: req.userinfo,
      message: "标题不得为空",
      url: "/admin/content"
    });
  } else if (content == "") {
    res.render("admin/error", {
      userinfo: req.userinfo,
      message: "内容不得为空",
      url: "/admin/content"
    });
  } else if (description == "") {
    res.render("admin/error", {
      userinfo: req.userinfo,
      message: "公司简介不得为空",
      url: "/admin/content"
    })
  } else {
    new Content({
      title: title,
      description: description,
      content: content,
      Categorys: Categorys,
      views: 0,
      author: req.userinfo._id,
      addTime: new Date(),
    }).save().then(saveResult => {
      res.render("admin/success", {
        userinfo: req.userinfo,
        message: "保存成功",
        url: "/admin/content"
      })
    })
  }
});

// 内容修改
router.get("/content/edit", function (req, res) {
  let id = req.query.id || "";
  let categories = [];
  Category.find().sort({ _id: 1 }).then(rs => {
    categories = rs;
    return Content.findOne({ _id: id }).populate('Categorys')
  }).then(content => {
    res.render("admin/content_edit", {
      userinfo: req.userinfo,
      content: content,
      categories: categories
    })
  });
});

// 内容修改--操作
router.post("/content/edit", function (req, res) {
  // console.log(req.body);
  let id = req.query.id
  // 前端传递过来的数据
  let title = req.body.title;
  let content = req.body.content;
  let description = req.body.description;
  let Categorys = req.body.Categorys;
  // 校验部分，后期移到前端验证
  if (title == '') {
    res.render("admin/error", {
      userinfo: req.userinfo,
      message: "标题不得为空",
      url: "/admin/content"
    });
  } else if (content == "") {
    res.render("admin/error", {
      userinfo: req.userinfo,
      message: "内容不得为空",
      url: "/admin/content"
    });
  } else if (description == "") {
    res.render("admin/error", {
      userinfo: req.userinfo,
      message: "公司简介不得为空",
      url: "/admin/content"
    });
  } else {
    return Content.update({
      _id: id
    }, {
        Categorys: Categorys,
        title: title,
        description: description,
        content: content
      }).then(updateResult => {
        // console.log(updateResult)
        res.render("admin/success", {
          userinfo: req.userinfo,
          message: "修改成功",
          url: `/admin/content/edit?id=${id}`
        })
      })
  }
});

// 删除内容
router.get("/content/del", function (req, res) {
  let id = req.query.id || "";
  Content.remove({
    _id: id
  }).then(delResult => {
    res.render("admin/success",{
      userinfo: req.userinfo,
      message: "删除成功",
      url: "/admin/content"
    })
  });
});

module.exports = router;