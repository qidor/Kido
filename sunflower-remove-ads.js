// 向日葵去广告 · 通用 JSON 广告字段清理 v1
// 作用：清理向日葵 App 接口返回中的开屏、横幅、弹窗类广告字段
// 安全原则：
//  - 只处理 JSON 文本；解析失败时原样返回，绝不改动
//  - 只删除命中的广告字段，其余字段原样保留
//  - 不触碰登录、设备列表、远控会话、会员/付费相关字段
//  - 远控会话不走 HTTPS JSON 接口，不受影响

const AD_KEY = /^(ads?|advertisements?|banner|splash|launchad|startupad|popup|popups|promotion|promotions|adinfo|adlist|advertise|floatad|floatwindow)$/i;
const AD_FLAG_KEY = /^(isad|is_ad|adflag|hasad|isadvert)$/i;

function isAdItem(item) {
  if (!item || typeof item !== 'object') return false;
  for (const k of Object.keys(item)) {
    if (AD_FLAG_KEY.test(k) && (item[k] === true || item[k] === 1 || item[k] === '1')) return true;
  }
  if (item.ad === true || item.ad === 1) return true;
  return false;
}

function scrub(node) {
  if (Array.isArray(node)) {
    return node.filter((item) => !isAdItem(item)).map(scrub);
  }
  if (node && typeof node === 'object') {
    const out = {};
    for (const k of Object.keys(node)) {
      if (AD_KEY.test(k)) continue; // 整个广告字段删掉
      out[k] = scrub(node[k]);
    }
    return out;
  }
  return node;
}

try {
  const obj = JSON.parse($response.body);
  $done({ body: JSON.stringify(scrub(obj)) });
} catch (e) {
  $done({}); // 不是 JSON 或处理出错：原样放行
}
