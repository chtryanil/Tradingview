import React from 'react'
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'

interface CryptoListProps {
  symbols: string[];
  selectedSymbol: string;
  setSelectedSymbol: (symbol: string) => void;
  prices: Record<string, number>;
  changes: Record<string, number>;
}

export default function CryptoList({ symbols, selectedSymbol, setSelectedSymbol, prices, changes }: CryptoListProps) {
  return (
    <div className="w-64 p-4 overflow-y-auto border-r border-base-200 bg-base-100">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Cryptocurrencies</h2>
      <div className="space-y-2">
        {symbols.map((symbol) => (
          <div
            key={symbol}
            className={`p-2 cursor-pointer rounded-md transition-colors duration-200 ${
              selectedSymbol === symbol ? 'bg-base-300' : 'hover:bg-base-200'
            }`}
            onClick={() => setSelectedSymbol(symbol)}
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-foreground">{symbol}</span>
              <div className="text-right">
                <div className="text-sm font-medium text-neutral">${prices[symbol]?.toFixed(2) || 'N/A'}</div>
                <div className={`text-xs font-medium flex items-center ${changes[symbol] >= 0 ? 'text-success' : 'text-error'}`}>
                  {changes[symbol] >= 0 ? <ArrowUpIcon size={12} /> : <ArrowDownIcon size={12} />}
                  {Math.abs(changes[symbol] || 0).toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}