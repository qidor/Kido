// 京东 Cookie 抓取脚本（http-request）
// 在 Edge 手机网页版登录京东后，打开签到页 bean.m.jd.com/bean/signIndex.action
// （页面本身及其调用的 api.m.jd.com signBean 接口）时，本脚本把当次请求的 Cookie
// 存到本机，供每天 08:10 的签到脚本使用。Cookie 只存在本机，不会发到任何地方。
// 注意：不要用京东 App 抓取，App 内抓不到可用的网页 Cookie。
// 提醒规则：只有存入的 Cookie 和上次不一样才弹一次通知；平时浏览静默保存。
(function () {
  var url = $request.url || '';
  var headers = $request.headers || {};
  var cookie = headers['Cookie'] || headers['cookie'] || '';
  if (!cookie) {
    $done({});
    return;
  }
  // 京东网页登录态的标志是 pt_key，只存带 pt_key 的 Cookie
  if (cookie.indexOf('pt_key=') === -1) {
    $done({});
    return;
  }
  var key = 'checkin_jd_cookie';
  var old = $persistentStore.read(key);
  if (old !== cookie) {
    $persistentStore.write(cookie, key);
    $notification.post('京东签到', '京东 Cookie 已保存', '每天 08:10 会用它自动签到领京豆');
  }
  $done({});
})();
