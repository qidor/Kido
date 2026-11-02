// 论坛签到 Cookie 抓取脚本（http-request）
// 在浏览器登录态下访问 V2EX / NodeSeek 时，把当次请求的 Cookie 存到本机，
// 供每天 08:10 的签到脚本使用。Cookie 只存在本机，不会发到任何地方。
(function () {
  var url = $request.url || '';
  var headers = $request.headers || {};
  var cookie = headers['Cookie'] || headers['cookie'] || '';
  if (!cookie) {
    $done({});
    return;
  }
  if (url.indexOf('v2ex.com') !== -1) {
    // V2EX 登录态的标志是 A2，只存带 A2 的 Cookie，避免登出态的请求把好 Cookie 覆盖掉
    if (cookie.indexOf('A2=') !== -1) {
      $persistentStore.write(cookie, 'checkin_v2ex_cookie');
      $notification.post('论坛签到', 'V2EX Cookie 已保存', '每天 08:10 会用它自动签到');
    }
  } else if (url.indexOf('nodeseek.com') !== -1) {
    $persistentStore.write(cookie, 'checkin_nodeseek_cookie');
    $notification.post('论坛签到', 'NodeSeek Cookie 已保存', '每天 08:10 会用它自动签到');
  }
  $done({});
})();
