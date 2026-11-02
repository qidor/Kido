// 什么值得买每日签到领金币（cron，每天 08:10）
// 接口：GET zhiyou.smzdm.com/user/checkin/jsonp_checkin，带登录 Cookie，返回 JSONP。
var cookie = $persistentStore.read('checkin_smzdm_cookie');
if (!cookie) {
  $notification.post('什么值得买签到', '未找到 Cookie', '请先在 Edge 里登录 www.smzdm.com 一次');
  $done();
} else {
  var url = 'https://zhiyou.smzdm.com/user/checkin/jsonp_checkin?callback=smzdmCheckin&_=' + Date.now();
  $httpClient.get({
    url: url,
    headers: {
      'Cookie': cookie,
      'Referer': 'https://www.smzdm.com/',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1'
    }
  }, function (error, response, data) {
    if (error) {
      $notification.post('什么值得买签到', '签到失败', '请求出错：' + error);
      $done();
      return;
    }
    try {
      var text = data || '';
      var j = JSON.parse(text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1));
      if (j.error_code === 0) {
        var num = j.data && j.data.checkin_num;
        $notification.post('什么值得买签到', '签到成功', num ? ('累计签到 ' + num + ' 天，金币已到账') : '今日金币已到账');
      } else {
        var msg = j.error_msg || '';
        if (msg.indexOf('已签') !== -1 || msg.indexOf('已经') !== -1) {
          $notification.post('什么值得买签到', '今日已签到', msg);
        } else {
          $notification.post('什么值得买签到', '签到失败', msg || '请打开什么值得买手动查看');
        }
      }
    } catch (e) {
      $notification.post('什么值得买签到', 'Cookie 可能失效', '请重新在 Edge 登录 www.smzdm.com 一次');
    }
    $done();
  });
}
