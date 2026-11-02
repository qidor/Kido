// V2EX 每日签到（cron，每天 08:10）
// 流程：带 Cookie 访问 /mission/daily，取 once token，再访问 redeem 领取铜币。
var cookie = $persistentStore.read('checkin_v2ex_cookie');
if (!cookie) {
  $notification.post('V2EX 签到', '未找到 Cookie', '请先在浏览器里登录后打开一次 v2ex.com');
  $done();
} else {
  var UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1';
  var headers = { 'Cookie': cookie, 'User-Agent': UA };
  $httpClient.get({ url: 'https://www.v2ex.com/mission/daily', headers: headers }, function (error, response, data) {
    if (error) {
      $notification.post('V2EX 签到', '签到失败', '请求出错：' + error);
      $done();
      return;
    }
    var body = data || '';
    var m = body.match(/\/mission\/daily\/redeem\?once=(\d+)/);
    if (!m) {
      if (body.indexOf('已领取') !== -1) {
        $notification.post('V2EX 签到', '今日已领取', '');
      } else {
        $notification.post('V2EX 签到', '签到失败', '未找到领取链接，可能是 Cookie 失效，请重新打开 v2ex.com 抓取');
      }
      $done();
      return;
    }
    $httpClient.get({ url: 'https://www.v2ex.com/mission/daily/redeem?once=' + m[1], headers: headers }, function (error2, response2, data2) {
      if (error2) {
        $notification.post('V2EX 签到', '签到失败', '领取请求出错：' + error2);
      } else if ((data2 || '').indexOf('已领取') !== -1) {
        $notification.post('V2EX 签到', '签到成功', '今日铜币已领取');
      } else {
        $notification.post('V2EX 签到', '领取结果未知', '请打开 v2ex.com/mission/daily 查看');
      }
      $done();
    });
  });
}
