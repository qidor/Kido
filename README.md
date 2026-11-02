# Clash 模块

给 iPhone 上 Clash（Hako 版）用的自写模块，粘贴链接即可安装，需开启 HTTPS 解密（MITM）并信任证书。

> 注意：去广告模块只去广告，不动各 App 的下单、支付、登录等正常功能。如某个 App 打开异常，关掉对应模块即恢复。

## 模块一览

| 模块 | 覆盖范围 | 说明 |
|---|---|---|
| `SunflowerRemoveAds.sgmodule`（+ `sunflower-remove-ads.js`） | 向日葵远程工具 | 自写 v1：用脚本清理接口 JSON 里的开屏、横幅、弹窗广告字段；解析失败原样放行。不是可莉原版精确规则，能否全去掉以实测为准。如广告还在，把 Clash Connections 里向日葵的请求域名发来再钉规则 |
| `MeituanRemoveAds.sgmodule` | 美团 App、美团外卖 | 开屏接口、玲珑广告素材、品牌广告图、广告与统计域名。已实测可用 |
| `XianyuSplashRemoveAds.sgmodule` | 闲鱼开屏 | 只拦冷启动开屏。新版闲鱼开屏接口走 `acs.m.goofish.com`，旧规则写 `acs.m.taobao.com` 会失效；另含每天 0 点后的素材预取接口。可与旧的闲鱼去广告模块叠加装 |
| `JingdongSplashRemoveAds.sgmodule` | 京东开屏 | ADX 实时竞价开屏、物料下发接口、开屏大图（精确到开屏专用尺寸，不误伤商品图）。不要与京东全量模块叠装，二选一 |
| `V2EXCheckin.sgmodule`（+ `checkin-v2ex.js` / `checkin-cookie.js`） | V2EX 每日签到 | 每天 08:10 自动签到（仅 Clash 打开并连接时才跑）。安装后先在浏览器登录态下打开一次 v2ex.com 抓取 Cookie，Cookie 只存本机。未实机验证，以首日 08:10 的通知为准 |
| `NodeSeekCheckin.sgmodule`（+ `checkin-nodeseek.js` / `checkin-cookie.js`） | NodeSeek 每日签到 | 每天 08:10 自动签到（仅 Clash 打开并连接时才跑）。安装后先在浏览器登录态下打开一次 nodeseek.com 抓取 Cookie，Cookie 只存本机。未实机验证，以首日 08:10 的通知为准 |

## 安装方法

1. Clash → 模块页 → 粘贴对应模块的 Raw 链接，下载并开启。
2. 确认 HTTPS 解密已开启、证书已信任。
3. 把对应 App 杀后台重进验证。

## 论坛签到模块（V2EX / NodeSeek，各自独立）

1. 两个模块分开装、分开开关，互不影响；之前合在一起的 `ForumCheckin.sgmodule` 已废弃，不要装它。
2. 在手机 Edge 里（Clash 连接中、登录态）打开一次 v2ex.com 和一次 nodeseek.com，各收到一次“Cookie 已保存”通知。
3. 每天 08:10 自动签到，结果用通知告诉你；08:10 那一刻 Clash 没开着，当天就跳过。
4. 某天通知说 Cookie 失效，就重复第 2 步重抓。

## 规则来源

- 美团：规则摘自奶思 fmz200 去广告合集（2026-10-25 版）中的美团段。
- 闲鱼开屏、京东开屏：规则参考 Thelongdarkorg 纯本地规则仓库与 fmz200 合集，按 Clash 可用的改写动作整理。
- 向日葵：自写通用脚本，非任何原版复制。
- 论坛签到：V2EX 走 `/mission/daily` + once token 领取；NodeSeek 走 POST `/api/attendance?random=true`。

## 其他说明

- 京东开屏的 `start` / `welcomeHome` 启动接口不能整个拦截（会崩启动），原版靠 JQ 抠字段，Clash 跑不了 JQ，因此本仓库的京东模块只做接口级拦截；如开屏还在，说明走的是 `start` 里的配置字段，需按实际请求域名再钉规则。
- 本仓库仅收录自写/自整理的模块；淘宝、微信、拼多多等其他 App 目前用的是第三方仓库的直链，未收录于此。
