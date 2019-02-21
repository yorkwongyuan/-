(function IIFE(root) {
  function setCookie(cname, cvalue, day, path) {
    day = day || 1;
    path = path || '/';
    var date = new Date();
    date.setTime(date.getTime() + day * 24 * 60 * 60 * 1000);
    console.log("hehe")
    document.cookie = cname + '=' + cvalue + '; expires=' + date.toGMTString() + '; path=' + path + '; ';
  }

  root.Util = {
    setCookie,
  }
})(window);