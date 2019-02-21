(function (root) {
  let html = ""; // html容器
  let perpage = 2; // 每页条数
  let currentPage = 1; // 当前页数
  let totalPages = 0;
  let start = 0; // 开始
  let end = 0; // 结束
  let commentsLists = []

  let select = (selector) => document.querySelector(selector);
  let selectAll = (selector) => document.querySelectorAll(selector);

  // 提交评论
  root.submitComments = function (e) {
    let content = select('#comments').querySelector('textarea').value;
    let contentId = e.target.dataset.id;
    ajax("post", "/api/comments/submit", { content, contentId }).then(res => {
      commentsLists = res.data.comments;
      renderComments();
    })
  }

  // 获取评论列表
  root.getCommentLists = function (e) {
    let reg = /[?,&]contentId=([^&]+)/;
    let search = location.search;
    let contentId = reg.exec(search)[1];
    return ajax("get", "/api/comments", { contentId: contentId });
  }
  // 下一条数据
  root.next = function () {
    if (currentPage < totalPages) {
      currentPage++;
      renderComments();
    }
  },
  // 上一条数据
  root.previous = function() {
    if (currentPage > 1) {
      currentPage--;
      renderComments();
    }
  }

  // 获取评论列表
  getCommentLists().then(res => {
    commentsLists = res.data.comments;
    renderComments();
  });

  // 创建评论
  function renderComments() {
    totalPages = Math.ceil(commentsLists.length / perpage); // 总页数
    console.log(commentsLists)
    html = ""
    commentsLists.forEach((item, k) => {
      start = perpage * (currentPage - 1);
      end = start + perpage;
      console.log(start, end)

      if (k >= start && k < end) {
        html += `<div class="commentsList">
        <span class="username">
            ${item.username}
        </span>
        <div>
            ${item.content}
        </div>
        <div>${item.postTime.toString()}</div>
        
      </div>`
      };
    });
    html += `<button onclick="previous()">上一页</button>
    <div>${currentPage}/${totalPages}</div>
    <button onclick="next()">下一页</button>
    `;

    // 更新评论数
    let commentsCounts = selectAll('.commentsCount');
    commentsCounts.forEach(item => {
      item.innerHTML = commentsCounts.length;
    });

    // 渲染评论部分
    select("#commentsLists").innerHTML = html;
  }
}(window));

