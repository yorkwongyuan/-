function ajax(method, url, data) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    let str = "";
    for(let key in data){
      str += `${key}=${data[key]}&`;
    }
    str = str.slice(0,str.length-1);

    if(method == 'get'){
      url = `${url}?${str}`;
      str = ""
    }
   
    // 开启
    xhr.open(method, url);

    // 注意setRequestHeader要放在open后面
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    // 发送
    xhr.send(str);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let res = JSON.parse(xhr.responseText);
        resolve(res);
      }
    }
  })
};
