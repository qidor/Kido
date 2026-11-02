// 论坛签到 Cookie 抓取脚本（http-request）
// 在浏览器登录态下访问 V2EX / NodeSeek 时，把当次请求的 Cookie 存到本机，
// 供每天 08:10 的签到脚本使用。Cookie 只存在本机，不会发到任何地方。
// 提醒规则：只比较登录凭证本身，凭证没变就不弹通知。
//   V2EX：只比 A2（登录凭证），其它 cookie 轮换不算换凭证；
//   NodeSeek：比较时去掉 Cloudflare 的轮换 cookie（__cf_bm 等），它一换不算换凭证。
// 只有凭证真变了（第一次保存、或重新登录）才弹一次通知；平时打开网站静默保存。
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
  var isV2ex = false;
  if (url.indexOf('v2ex.com') !== -1) {
    // V2EX 登录态的标志是 A2，只存带 A2 的 Cookie，避免登出态的请求把好 Cookie 覆盖掉
    if (cookie.indexOf('A2=') === -1) {
      $done({});
      return;
    }
    key = 'checkin_v2ex_cookie';
    name = 'V2EX';
    isV2ex = true;
  } else if (url.indexOf('nodeseek.com') !== -1) {
    key = 'checkin_nodeseek_cookie';
    name = 'NodeSeek';
  } else {
    $done({});
    return;
  }
  function identityOf(c, v2ex) {
    if (v2ex) {
      var m = c.match(/A2=([^;]+)/);
      return m ? m[1] : '';
    }
    return c.replace(/(^|;\s*)(__cf_bm|__cfruid|cf_clearance)=[^;]*/g, '').trim();
  }
  var old = $persistentStore.read(key);
  var oldIdentity = old ? identityOf(old, isV2ex) : '';
  if (oldIdentity !== identityOf(cookie, isV2ex)) {
    $persistentStore.write(cookie, key);
    $notification.post('论坛签到', name + ' Cookie 已保存', '每天 08:10 会用它自动签到');
  }
  $done({});
})();
