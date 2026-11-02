// 京东每日签到领京豆（cron，每天 08:10）
// 接口：POST api.m.jd.com client.action?functionId=signBeanAct，带网页 Cookie（pt_key/pt_pin）。
var cookie = $persistentStore.read('checkin_jd_cookie');
if (!cookie) {
  $notification.post('京东签到', '未找到 Cookie', '请先在 Edge 里打开 bean.m.jd.com 登录并签到一次（用网页版，不要用京东 App）');
  $done();
} else {
  $httpClient.post({
    url: 'https://api.m.jd.com/client.action?functionId=signBeanAct&body=%7B%22fp%22%3A%22-1%22%2C%22initfp%22%3A%22-1%22%7D&appid=ld',
    headers: {
      'Cookie': cookie,
      'User-Agent': 'okhttp/3.12.1;jdmall;android;version/10.3.4;build/92451;',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    body: ''
  }, function (error, response, data) {
    if (error) {
      $notification.post('京东签到', '签到失败', '请求出错：' + error);
      $done();
      return;
    }
    var text = data || '';
    try {
      var j = JSON.parse(text);
      var code = j.code;
      var msg = j.errorMessage || j.message || (j.data && (j.data.msg || j.data.errorMessage)) || '';
      if (msg.indexOf('已签') !== -1 || msg.indexOf('已领') !== -1) {
        $notification.post('京东签到', '今日已签到', msg);
      } else if (code === '0' || code === 0 || j.success === true) {
        var d = j.data || {};
        var bean = d.dailyAward ? d.dailyAward.beanCount : (d.beanCount || d.awardBean || d.dailyBean || '');
        $notification.post('京东签到', '签到成功', bean ? ('今日领取 ' + bean + ' 京豆') : '今日京豆已领取');
      } else if (msg.indexOf('登录') !== -1 || code === '3' || code === 3) {
        $notification.post('京东签到', 'Cookie 已失效', '请重新在 Edge 打开 bean.m.jd.com 登录并签到一次');
      } else {
        $notification.post('京东签到', '签到失败', msg || ('返回码 ' + code));
      }
    } catch (e) {
      $notification.post('京东签到', 'Cookie 可能失效', '请重新在 Edge 打开 bean.m.jd.com 登录并签到一次');
    }
    $done();
  });
}
