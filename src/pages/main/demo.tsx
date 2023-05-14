import { useState, useEffect } from "react";

export default function Demo() {
    const [checkout, setCheckout] = useState('');

    useEffect(() => {
      fetch('/api/hello').then(res => res.json()).then(info => {
        setCheckout(info.url);
      });
    }, []);
  
  
    return (
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-4">Demo</h2>
        <p className="mb-2">
        <span className='text-xl'>Testing checkout link: {" "}</span>
        <a className='text-red-800 break-all' target='blank' href={checkout}>{checkout}</a>
        </p>
      </section>
    );
  }
  