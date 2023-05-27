# SEMIPAY - 一个开源的微信支付解决方案

[ENGLISH VERSION](/README.en.md)

欢迎使用 SEMIPAY，一个半自动的微信支付解决方案，只需在 Vercel 上点击一次即可轻松部署私有的支付系统。

它可以创建半自动个人收款系统，免去域名备案，资质审批，交易费用等种种问题。适合每分钟收款小于5笔的系统。

你也可以用著名的`wechaty`[https://wechaty.js.org/](https://wechaty.js.org/)来监听微信付款消息，实现全自动收款。一个全自动收款系统非常复杂，而且有被微信封锁的风险，我就不演示了。

## 主要功能
- ⚡ 通过 Vercel 一键免费部署，添加所需配置即可立即拥有自己的微信收款系统
- 💬 支持tg机器人（推荐），Email(需要在代码里换成你自己的stmp邮箱)，webhook等多种通知方式
- 🎨 操作简单，在vercel edge config 更新配置即可立即生效
- 🌈 安全开源，无需担心资金问题


## 演示

获取测试结账链接：[https://payment-mauve.vercel.app](https://payment-mauve.vercel.app)

## Data Flow
```
bot     | client                  |           server                                   |   store  
----------------------------------------------------------------------------------------------
        | place checkout -->      |                                                    |          
        |                         | [uid, price, user, extra, ts]                      |  --> kv  
        | checkout link<--        |                                                    |          
        |request semipay -->      |                                                    |          
        |                         |get [uid, price, user, extra, ts] + assign `remark` |-->  kv   
        |render semipay page      |                                                    |          
        |pay via wechat           |                                                    |          
        |                         |                                                    |          
got msg |                         |   post transaction : remark, ts, price, raw log    | SQL DB
        | try to confirm with UID |   get `remark, ts` from uid, query `remark, ts`    | KV, SQL DB
        |                         |   send confirm request to business server          | 
```

## 用法

### 准备好配置
- 拷贝 `examle.edge.conf.json` 配置模板，初始化你的[vercel edge config](https://vercel.com/dashboard/stores/edge-config)

- 准备多张不同备注信息，固定金额的微信收款二维码，上传到网络（比如github, 比如对象存储服务器）

- 拿到可以直接访问的URL后填入qrcode字段

- 购买国内可用的域名（hostname），你也可以直接用vercel送的域名

- 设置好email或者tg机器人（推荐）链接，密钥 和 支付站点的hostname

- 设置好`confirmWebhook` 的地址，用于确认订单后的回调，请求样本如下所示：

```bash
curl -X POST <confirmWebhook>&token=<token> \n
-H "Content-Type: application/json" \n
-d '{"price":<price>,"user":"<user>","extra":"<extra>","uid":"<uid>","remark":"<remark>","timestamp":<timestamp>}'

```
- token生成:
```js
// info 即需要签名的payload
const secret = process.env.SECRET;
// 按字母顺序排序
const text = Object.keys(info).sort().map(k=> info[k]).join(','); 
// 使用sha256加密信息
const token = createHmac('sha256', secret).update(text).digest('base64');

```

- `webhook` 字段保持与`confirmWebhook`一致


总之，代码都在这了，不用我多加解释。

### 设置vercel

以下 JSON 模板可供参考，用来设置 Vercel edge-config：

https://vercel.com/dashboard/stores/edge-config

```json
{
  "qrcode": [
    {
      "url": "https://..co/storage/v1/object/public/static/five1.jpg",
      "remark": "five1",
      "price": 5
    },
    {
      "url": "https://..co/storage/v1/object/public/static/five2.jpg",
      "remark": "five2",
      "price": 5
    },
    {
      "url": "https://..co/storage/v1/object/public/static/five3.jpg",
      "remark": "five3",
      "price": 5
    }
  ],
  "webhook": "https://ok/api/wepaynotify?",
  "telegram": "https://api.telegram.org/botxxxx:xxxx/sendMessage?chat_id=xxx&",
  "email": "",
  "notifier": "",
  "hostname": "https://pay",
  "confirmWebhook": "https://ok/api/wepaynotify?",
  "secret": "123"
}
```

### 开始使用

```js
// 从你的业务服务器向支付服务器获取付款链接
const hostname = 'https://your.pay.domain';
// 准备信息
const info = {
    price: 5, // 价格，需要和你上面的qrcode数组price对应
    user: 'donate@user.com',
    extra: 'donate', // 额外信息，一般放商品id之类
    timestamp: Date.now() // 随便，简单防攻击而已
};

// 进行签名
// 获取密钥
const secret = process.env.SECRET;
// 按字母顺序排序
const text = Object.keys(info).sort().map(k=> info[k]).join(','); 
// 使用sha256加密信息
const token = createHmac('sha256', secret).update(text).digest('base64');

// 去支付服务器换付款链接
const checkout = await fetch(`${hostname}/api/checkout`, {
    method: 'post',
    body: JSON.stringify({...info, token})
}).then(res=>{
    if(res.status !== 200) throw new Error(res.status);
    return res;
}).then(res=>res.json());

// 付款链接
console.log(checkout);

// 用户点开checkout页面后，如果配置了tg机器人，则会收到消息
/**
  A checkout was placed 
    
    -user: demo@user.com
    -price: 5
    -remark: five1
    -extra: manual-5
    -uid: a3f65157-b9f5-49ad-95bf-7967200a3b38

    click here to confirm the payment
 * 
 * /
// 点击后即可确认订单，并调用confirmwebhook的地址发送确认消息
```

## 部署

通过一键式部署在 Vercel 上部署自己的支付网站：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fwanghsinche%2Fsemipay.git&env=NODE_ENV&envDescription=%E4%BD%A0%E5%BF%85%E9%A1%BB%E5%85%88%E5%89%8D%E5%BE%80https%3A%2F%2Fvercel.com%2Fdashboard%2Fstores%EF%BC%8C%E5%88%9B%E5%BB%BA%E5%B1%9E%E4%BA%8E%E8%87%AA%E5%B7%B1%E7%9A%84KV%E5%92%8Cedge%20config%2C%20%E5%B9%B6%E5%A1%AB%E5%85%A5%E7%9B%B8%E5%85%B3%E4%BF%A1%E6%81%AF.%20%20%E5%8F%AF%E5%8F%82%E8%80%83%20%20https%3A%2F%2Fpayment-mauve.vercel.app%2F%20%20%5Cn%20You%20created%20the%20KV%20and%20edge%20config%20in%20storage%20page.&envLink=https%3A%2F%2Fvercel.com%2Fdashboard%2Fstores&demo-title=SEMIPAY&demo-description=SEMIPAY%20-%20An%20Open%20Source%20Wechat%20Payment%20Solution&demo-url=https%3A%2F%2Fpayment-mauve.vercel.app%2F)


## 二次开发

这是一个使用[`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)快速启动的[Next.js](https://nextjs.org/)项目。

## 开始

首先，请运行开发服务器：

```bash
npm run dev
# 或者
yarn dev
# 或者
pnpm dev
```

使用您的浏览器打开 [http://localhost:3000](http://localhost:3000) 来查看结果。

## 在Vercel上部署

部署Next.js应用程序的最简单方法是使用[Next.js部署文档](https://nextjs.org/docs/deployment)中介绍的[Vercel平台](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)，Vercel是Next.js的创造者。

更多细节请查阅我们的[Next.js部署文档](https://nextjs.org/docs/deployment)。