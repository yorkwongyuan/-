const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const Content = require("../models/Content");

// 全局参数
let data = {};
// 通用函数处理
router.use(function (req, res, next) {
  Category.find().then(categories => {
    data.categories = categories;
    next()
  })
});


router.get("/", function (req, res) {
  let _data = {
    page: req.query.page || 1,
    limit: 2,
    count: 0,
    userinfo: req.userinfo,
    pages: 0,
    contents: [],
    category: req.query.category
  }

  data = Object.assign(data,_data)
  // 搜索条件
  let where = {};

  // 如果存在query分类
  if (data.category) {
    where.Categorys = data.category;
  }
  Content.where(where).count()
    .then(count => {
      data.count = count
      // sort 1 为升序,-1为降序

      // 总页数
      data.pages = Math.ceil(data.count / data.limit);

      // 当前页数
      // 最大不得超过总页数
      data.page = Math.min(data.page, data.pages);

      // 最小不得低于1
      data.page = Math.max(data.page, 1);

      // 忽略
      skip = (data.page - 1) * data.limit;

      // console.log(where, 'where')
      // 查询
      return Content.where(where).find().sort({ addTime: -1 }).limit(data.limit).skip(skip).populate(['Categorys', 'author'])
    })
    .then(contents => {
      data.contents = contents
      res.render("main/index", data);
    })
});

router.get("/view", function(req, res){
  let contentId = req.query.contentId;
  Content.findOne({_id: contentId}).populate('Categorys').then(contentResult => {
    contentResult.views++;
    contentResult.save();
    res.render("main/view",{
      userinfo:req.userinfo,
      categories: data.categories,
      category: contentResult.Categorys._id.toString(),
      content: contentResult
    })
  })
})



module.exports = router;