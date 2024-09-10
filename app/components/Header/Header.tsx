import React from 'react'
import { Search, Maximize, Minimize, List, X } from 'lucide-react'

interface HeaderProps {
  isFullScreen: boolean;
  toggleFullScreen: () => void;
  showCryptoList: boolean;
  setShowCryptoList: (show: boolean) => void;
}

export default function Header({ isFullScreen, toggleFullScreen, showCryptoList, setShowCryptoList }: HeaderProps) {
  return (
    <header className="p-4 bg-[#2B2B43] flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold mr-4">Crypto Screener</h1>
        <button
          onClick={() => setShowCryptoList(!showCryptoList)}
          className="text-gray-400 hover:text-white"
        >
          {showCryptoList ? <X size={24} /> : <List size={24} />}
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-[#1E222D] rounded-md"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        <button
          onClick={toggleFullScreen}
          className="text-gray-400 hover:text-white"
        >
          {isFullScreen ? <Minimize size={24} /> : <Maximize size={24} />}
        </button>
      </div>
    </header>
  )
}