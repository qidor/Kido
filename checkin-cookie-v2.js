// 签到 Cookie 抓取脚本（http-request，统一版）
// 在浏览器登录态下访问 V2EX / NodeSeek / 京东 / 什么值得买时，把当次请求的
// Cookie 存到本机，供每天 08:10 的签到脚本使用。Cookie 只存在本机，不会发到任何地方。
// 提醒规则：只在第一次存下 Cookie 时提醒一次。之后每次访问都静默更新保存
// （保证签到脚本用的总是最新的 Cookie），不再弹通知。
// 防覆盖：V2EX 只存带 A2 的 Cookie，京东只存带 pt_key 的 Cookie，避免登出态的
// 请求把好 Cookie 覆盖掉。
(function () {
  var url = $request.url || '';
  var headers = $request.headers || {};
  var cookie = headers['Cookie'] || headers['cookie'] || '';
  if (!cookie) {
    $done({});
    return;
  }
  var key = '';
  var name = '';
  if (url.indexOf('v2ex.com') !== -1) {
    if (cookie.indexOf('A2=') === -1) {
      $done({});
      return;
    }
    key = 'checkin_v2ex_cookie';
    name = 'V2EX';
  } else if (url.indexOf('nodeseek.com') !== -1) {
    key = 'checkin_nodeseek_cookie';
    name = 'NodeSeek';
  } else if (url.indexOf('jd.com') !== -1) {
    if (cookie.indexOf('pt_key=') === -1) {
      $done({});
      return;
    }
    key = 'checkin_jd_cookie';
    name = '京东';
  } else if (url.indexOf('smzdm.com') !== -1) {
    key = 'checkin_smzdm_cookie';
    name = '什么值得买';
  } else {
    $done({});
    return;
  }
  var old = $persistentStore.read(key);
  $persistentStore.write(cookie, key);
  if (!old) {
    $notification.post(name + '签到', name + ' Cookie 已保存', '每天 08:10 会用它自动签到');
  }
  $done({});
})();
