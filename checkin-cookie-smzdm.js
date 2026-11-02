// 什么值得买 Cookie 抓取脚本（http-request）
// 在 Edge 登录 www.smzdm.com 后浏览时，把当次请求的 Cookie 存到本机，
// 供每天 08:10 的签到脚本使用。Cookie 只存在本机，不会发到任何地方。
// 提醒规则：只有存入的 Cookie 和上次不一样才弹一次通知；平时浏览静默保存。
(function () {
  var url = $request.url || '';
  var headers = $request.headers || {};
  var cookie = headers['Cookie'] || headers['cookie'] || '';
  if (!cookie) {
    $done({});
    return;
  }
  var key = 'checkin_smzdm_cookie';
  var old = $persistentStore.read(key);
  if (old !== cookie) {
    $persistentStore.write(cookie, key);
    $notification.post('什么值得买签到', '什么值得买 Cookie 已保存', '每天 08:10 会用它自动签到领金币');
  }
  $done({});
})();
