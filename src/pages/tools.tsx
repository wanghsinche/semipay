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
    confirmWebhook: string;
    secret: string;
}

export default function Page() {
    const [config, setConfig] = useState<PaymentSettings>({
        qrcode: [],
        telegram: '', hostname: '', confirmWebhook: '', secret: ''
    });

    const [qrcode, setQrcode] = useState('');
    const [remark, setRemark] = useState('');
    const [price, setPrice] = useState(0);

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
    return <div className="mx-10 my-5">


        <p>
            <input value={price} onChange={e => setPrice(Number(e.target.value))}></input>
            <input value={remark} onChange={e => setRemark(e.target.value)}></input>
            <input id="remark" type="file" onChange={getLink}></input>
            {qrcode}
        </p>
        <p>
            <button onClick={()=>addToConfig()}>add To Config</button>
        </p>
        <p>
            <label htmlFor="telegram">
                telegram
                <input id="telegram"></input>
            </label>
        </p>
        <p>
            <label htmlFor="hostname">
                hostname
                <input id="hostname"></input>
            </label>
        </p>
        <p>
            <label htmlFor="secret">
                secret
                <input id="secret"></input>
            </label>
        </p>
        <p>
            <label htmlFor="confirmWebhook">
                <input id="confirmWebhook"></input>
            </label>
        </p>

        <pre>
            {JSON.stringify(config, null, 4)}
        </pre>
    </div>
}