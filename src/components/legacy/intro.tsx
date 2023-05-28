export function Intro() {
    return <div className="px-4 sm:px-6 md:px-8">
        <div className="absolute inset-0 bottom-10 bg-bottom bg-no-repeat bg-slate-50 dark:bg-[#0B1120] index_beams__yWcJT">
            <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom dark:border-b dark:border-slate-100/5" ></div>
        </div>
        <div className="relative pt-6 lg:pt-8 flex items-center justify-between text-slate-700 font-semibold text-sm leading-6 dark:text-slate-200">
            <span className="text-lg">
                SEMIPAY
            </span>
            <a className="flex items-center cursor-pointer" href="https://github.com/wanghsinche/semipay" target="_blank">
                GITHUB
            </a>
        </div>
        <div className="relative max-w-5xl mx-auto pt-20 sm:pt-24 lg:pt-32">
            <h1 className="text-slate-900 font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center dark:text-white">
                Open-source personal payment solution
            </h1>
            <p className="mt-6 text-lg text-slate-600 text-center max-w-3xl mx-auto dark:text-slate-400">
                简单的开源个人收款解决方案
            </p>
            <p className="mt-6 text-lg text-slate-600 text-center max-w-3xl mx-auto dark:text-slate-400">
                只需在 Vercel 上简单操作即可轻松部署。
            </p>
            <p className="mt-6 text-lg text-slate-600 text-center max-w-3xl mx-auto dark:text-slate-400">
                甚至可以搭配 <span className="font-mono font-medium text-sky-500 dark:text-sky-400">wechaty</span> 来实现属于自己的全自动收款系统。适合<span className="font-mono font-medium text-sky-500 dark:text-sky-400">个人开发者</span>快速验证商业模式。
            </p>
            <div className="mt-6 sm:mt-10 flex justify-center space-x-6 text-sm">
                <a className="bg-slate-900 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 text-white font-semibold h-12 px-6 rounded-lg w-full flex items-center justify-center sm:w-auto dark:bg-sky-500 dark:highlight-white/20 dark:hover:bg-sky-400" href="#demo">
                    Get started
                </a>
            </div>
        </div>
    </div>
}