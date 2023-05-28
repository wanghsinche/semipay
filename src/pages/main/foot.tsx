export function Foot() {
    return <footer className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center md:justify-between flex-wrap">
                <div className="flex items-center flex-shrink-0 text-white mr-6">
                    <span className="text-lg text-white-500">SEMIPAY</span>
                </div>
                <div className="mt-4 md:m-0 text-center md:text-right text-gray-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} SEMIPAY. All rights reserved.</p>
                </div>
            </div>
        </div>
    </footer>

}