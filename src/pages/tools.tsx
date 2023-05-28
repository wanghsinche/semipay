import React, { useEffect, useState } from "react";
import jsQR from "jsqr";

interface QRCodeItem {
    url: string;
    remark: string;
    price: number;
}

interface PaymentSettings {
    qrcode: QRCodeItem[];
    telegram: string;
    hostname: string;
    webhook: string;
    secret: string;
}

export default function Page() {
    const [config, setConfig] = useState<PaymentSettings>({
        qrcode: [],
        telegram: 'https://api.telegram.org/botxxxx:xxxx/sendMessage?chat_id=xxx&', hostname: 'https://pay.com', webhook: 'https://business.com/api/confrim?', secret: 'mykey'
    });

    const [qrcode, setQrcode] = useState('');
    const [remark, setRemark] = useState('');
    const [price, setPrice] = useState(0);

    function setConfigField(key: keyof PaymentSettings, v: string) {
        setConfig({
            ...config,
            [key]: v
        })
    }

    function addToConfig() {
        const newItem: QRCodeItem = {
            url: qrcode,
            remark,
            price
        };
        const codeList = [...config.qrcode, newItem];
        setConfig({
            ...config,
            qrcode: codeList,
        })
    }

    function getImageData(url: string) {
        return new Promise<ImageData>((resolve, rej) => {
            const image = new Image();
            image.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;

                const context = canvas.getContext('2d');
                if (!context) return rej();

                context.drawImage(image, 0, 0);

                resolve(context.getImageData(0, 0, canvas.width, canvas.height));

            };
            image.src = url
        })
    }

    function getLink(event: React.ChangeEvent<HTMLInputElement>) {
        if (!event.target.files?.length) return;

        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = async (event) => {
            if (!event.target?.result) return;
            const dataUrl = event.target.result as string;

            const imageData = await getImageData(dataUrl);
            if (!imageData) return;

            const result = jsQR(imageData.data, imageData.width, imageData.height);
            if (!result) return;

            setQrcode(result.data);

        };
        reader.readAsDataURL(file);

    }
    return <div className="my-10 mx-20">
        <h1 className="text-center mx-auto text-lg">
            SemiPay Config 自助配置工具
        </h1>
        <div >
            <label className="block text-gray-700 font-bold mb-2" >
                 vercel edge config 内容
            </label>
            <div className=" overflow-y-scroll" style={{ height: 200 }}>
                <pre className="break-all text-white bg-gray-800 p-10">
                    {JSON.stringify(config, null, 4)}
                </pre>

            </div >
        </div>

        <div className=" my-5 flex justify-between">

            <div className="w-1/3 border border-gray-500 p-10 rounded">
                <div className="mb-4">
                    务必设置三张以上不同备注的相同金额收款码
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="price">
                        金额
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="price"
                        type="text"
                        placeholder="price"
                        value={price} onChange={e => setPrice(Number(e.target.value))}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="remark">
                        收款码备注
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="remark"
                        type="text"
                        placeholder="remark"
                        value={remark} onChange={e => setRemark(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="qrcode">
                        收款码
                    </label>

                    <input
                        className=" mb-2"
                        type="file"
                        placeholder="qrcode"
                        onChange={getLink}
                    />
                </div>

                <button onClick={() => addToConfig()} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Add To Config
                </button>
                <p className="block text-gray-700 font-bold my-2 break-all" >
                    {qrcode}
                </p>



            </div>

            <div className="w-1/2 border border-gray-500 p-10 rounded">
                <div className="mb-4">
                    其他字段
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="telegram">
                        telegram
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="telegram"
                        type="text"
                        placeholder="telegram"
                        value={config.telegram} onChange={e => setConfigField('telegram', e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="hostname">
                        hostname
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="hostname"
                        type="text"
                        placeholder="hostname"
                        value={config.hostname} onChange={e => setConfigField('hostname', e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="webhook">
                        webhook
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="webhook"
                        type="text"
                        placeholder="webhook"
                        value={config.webhook} onChange={e => setConfigField('webhook', e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="secret">
                        secret
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="secret"
                        type="text"
                        placeholder="secret"
                        value={config.secret} onChange={e => setConfigField('secret', e.target.value)}
                    />
                </div>

            </div>


        </div>

    </div>
}