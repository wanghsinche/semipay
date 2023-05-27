import { useState, useEffect } from "react";


function getCookie(name: string) {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length === 2) {
    return (parts.pop() as string).split(";").shift();
  }
}

export default function Demo() {
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


  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-4">Demo</h2>
      <p className="mb-8 bg-gray-200">
        <span className='text-xl'> 甚至你可以搭配著名的wechaty来实现自己的全自动收款系统，点击下方链接体验DEMO</span>
      </p>
      <p className="mb-8 bg-gray-200">
        <span className='text-xl'>支付链接: {" "}</span>
        <a className='text-red-800 break-all' target='blank' href={checkout}>{checkout}</a>
      </p>
      <p className="mb-8 bg-gray-200 text-center text-xl text-red-800">
        {!paid && <span  > <button onClick={() => { loading || checkPayment(uid); }}>{loading ? 'loading...' : '隐藏内容，支付后点击可见'}</button></span>}
        {paid && <p className="my-8 bg-gray-200">
          <a className="text-red-800" href="/tools" target='blank'>点击打开“自助配置工具”</a>
        </p>}
        {paid && <span >咨询: pay@findata-be.uk</span>}
      </p>
    </section>
  );
}
