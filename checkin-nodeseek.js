// NodeSeek 每日签到（cron，每天 08:10）
// 流程：带 Cookie POST /api/attendance?random=true，返回里带“鸡腿”即领到。
var cookie = $persistentStore.read('checkin_nodeseek_cookie');
if (!cookie) {
  $notification.post('NodeSeek 签到', '未找到 Cookie', '请先在浏览器里登录后打开一次 nodeseek.com');
  $done();
} else {
  $httpClient.post({
    url: 'https://www.nodeseek.com/api/attendance?random=true',
    headers: {
      'Cookie': cookie,
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1',
      'origin': 'https://www.nodeseek.com',
      'referer': 'https://www.nodeseek.com/board',
      'Content-Type': 'application/json'
    },
    body: ''
  }, function (error, response, data) {
    if (error) {
      $notification.post('NodeSeek 签到', '签到失败', '请求出错：' + error);
      $done();
      return;
    }
    try {
      var j = JSON.parse(data || '{}');
      var msg = j.message || '';
      if (j.success || msg.indexOf('鸡腿') !== -1) {
        $notification.post('NodeSeek 签到', '签到成功', msg);
      } else if (msg.indexOf('已完成签到') !== -1) {
        $notification.post('NodeSeek 签到', '今日已签到', msg);
      } else {
        $notification.post('NodeSeek 签到', '签到失败', msg || '请打开 NodeSeek 手动查看');
      }
    } catch (e) {
      $notification.post('NodeSeek 签到', '签到失败', '返回无法解析，可能是验证拦截，请手动打开 NodeSeek 查看');
    }
    $done();
  });
}
