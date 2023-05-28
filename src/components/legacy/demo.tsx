import Link from "next/link";
import { useState, useEffect } from "react";


function getCookie(name: string) {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length === 2) {
    return (parts.pop() as string).split(";").shift();
  }
}

export function Demo() {
  const [checkout, setCheckout] = useState();
  const [uid, setUid] = useState();
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);

  async function checkPayment(uid?: string) {
    if (!uid) return;
    setLoading(true);
    const res = await fetch(`/api/status?uid=${uid}`, {
      method: 'GET'
    }).then(res => {
      if (res.status !== 200) throw res.status
      return res.json();
    });
    if (res.status) {
      setPaid(true);
      document.cookie = `uid=${uid};expires=${new Date(Date.now() + 3600 * 1000 * 24)};`
    }
    setLoading(false);
  }

  useEffect(() => {
    if (getCookie('uid')) {
      checkPayment(getCookie('uid'));
    }
  }, [])

  useEffect(() => {
    fetch('/api/hello').then(res => res.json()).then(info => {
      setCheckout(info.url);
      setUid(info.uid);
    });
  }, []);

  return <div id="demo" className="mt-10 py-10 bg-slate-100">
    <div className="flex">
      <div className="bg-white rounded-lg shadow-md overflow-hidden w-1/3 ml-20 my-10">
        <div className="p-6">
          <div className="font-bold text-lg mb-2">付费体验DEMO</div>
          {!paid && <p className="text-gray-700 text-base">隐藏内容，付费后可见</p>}
          {paid && <p className="text-gray-700 text-base">付费咨询: pay@findata-be.uk</p>}
          {paid && <p className="text-sky-500 dark:text-sky-400"><Link href='/tools'>使用“自助配置工具”</Link></p>}
        </div>
        <div className="px-6 py-4 flex justify-between">
          <a target='_blank' href={checkout} className="bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400">
            {paid? '再次购买':'购买'}
          </a>
          <button onClick={() => { loading || checkPayment(uid); }} className="relative  border cursor-pointer flex items-center justify-center whitespace-nowrap px-6 rounded-lg">
            {loading ? 'loading...' : paid? '付费成功' : '已经购买，查看内容'}
          </button>
        </div>
      </div>

      <p className="mt-4 text-base leading-7 text-slate-700 my-10 mx-10 p-10"> 搭配消息监听, 实现自动收款。点击左侧购买按钮体验DEMO。</p>

    </div>
    <div className="flex flex-row-reverse">

      <div className="bg-white rounded-lg shadow-md overflow-hidden w-1/3 mr-20 my-10">
        <div className="p-6">
          <div className="font-bold text-lg mb-2">部署到Vercel</div>
          <p className="text-gray-700 text-base">前往Github了解详情</p>
        </div>
        <div className="px-6 py-4 flex justify-between">
          <a target="_blank" href="https://github.com/wanghsinche/semipay" className="bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400">
            Github
          </a>
        </div>
      </div>
      <p className="mt-4 text-base leading-7 text-slate-700 my-10 mx-10 p-10"> 开源方案, 私有化部署, 轻松安装到Vercel, 0成本运行。</p>
    </div>
  </div>
    ;


}
