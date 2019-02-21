// let ajax = require("./ajax.js");
(function (root) {
  let select = (selector) => document.querySelector(selector);
  let selectAll = (selector) => document.querySelectorAll(selector);

  function showLogin() {
    select("#login").classList.remove("hide");
    select("#register").classList.add("hide");
  }
  // 错误信息提示
  let warn = function (message) {
    console.log(message, 'message')
    select(".warn").textContent = message;
    select(".warn").classList.remove('hide');
    setTimeout(function () {
      select(".warn").classList.add('hide');
    }, 1000);
  }

  function $(selector) {
    return document.querySelector(selector)
  }

  // 登录
  root.login = function () {
    let username = selectAll('[name="username"]')[1].value;
    let password = selectAll('[name = "password"]')[1].value;
    ajax('post', '/api/user/login', { username: username, password: password }).then(res => {
      if (res.code == 1) {
        warn(res.msg)
      } else {
        console.log('登录成功');
        showUserInfo(res.data.username);
      }
    });
  }

  // 退出登录
  root.logout = function () {
    ajax('get', '/api/user/logout').then(res => {
      // location.reload();
      location.href = "/"
    })
  }

  // 注册
  root.register = function () {
    let username = select("[name='username']").value;
    let password = select("[name='password']").value;
    let repassword = select("[name='repassword']").value;
    ajax('post', '/api/user/register', { username: username, password: password, repassword: repassword }).then(res => {
      if (res.code == 1) {
        console.log(res.message, 'message')
        warn(res.message);
      } else {
        showLogin()
      }
    })
  }
  // 跳转登录
  root.toLogin = function () {
    $("#register").classList.add("hide");
    $("#login").classList.remove("hide");
  }

  // 跳转注册
  root.toRegister = function () {
    $("#register").classList.remove("hide");
    $("#login").classList.add("hide");
  }


  // 显示用户信息
  function showUserInfo(username) {

    // 登录后的提示语
    let date = new Date();
    let hours = date.getHours();
    let timeTips = "";
    if (hours < 6) {
      timeTips = "早上好"
    } else if (hours >= 6 && hours < 12) {
      timeTips = "上午好"
    } else if (hours >= 12 && hours < 14) {
      timeTips = "中午好"
    } else if (hours >= 14 && hours < 18) {
      timeTips = "下午好"
    } else if (hours >= 18 && hours <= 24) {
      timeTips = "晚上好"
    }


    $(".tips").innerHTML = timeTips + "," + username + "欢迎来到我的博客";
    $(".tips").classList.remove("hide");
    location.reload();
  }
}(window));

