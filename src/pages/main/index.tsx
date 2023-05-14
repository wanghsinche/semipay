import Head from 'next/head';
import Demo from './demo';
import Deploy from './deploy';
import Usage from './usage';

export default function SEMIPay() {
  return (
    <div>
      <main>
        <h1 className="text-4xl font-bold text-center mb-8">SEMIPAY - 一个开源的微信支付解决方案</h1>
        <p className="mb-2">欢迎使用 SEMIPAY，一个半自动的微信支付解决方案，只需在 Vercel 上点击一次即可轻松部署私有的支付系统。</p>

        <p className="mb-2">它可以创建半自动个人收款系统，免去域名备案，资质审批，交易费用等种种问题。适合每分钟收款小于5笔的系统。</p>

        <p className="mb-2">要做成自动化收款系统也是可以，比如用著名的wechaty来监听微信付款消息。但需要你自己开发，一个全自动收款 系统是非常复杂的。</p>

        <p className="mb-2">前往github fork 部署：
            <a className="mx-8" href="https://github.com/wanghsinche/semipay" data-size="large" data-show-count="true" aria-label="Star wanghsinche/semipay on GitHub"><i className="ri-github-line"></i>https://github.com/wanghsinche/semipay</a>
        </p>

        <Demo />
        <Usage/>
      </main>
    </div>
  );
}
