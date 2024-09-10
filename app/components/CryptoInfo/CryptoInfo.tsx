import React from 'react'

interface CryptoInfoProps {
  selectedSymbol: string;
  price: number | undefined;
  change: number | undefined;
}

export default function CryptoInfo({ selectedSymbol, price, change }: CryptoInfoProps) {
  if (!selectedSymbol) return null;

  const [base, quote] = selectedSymbol.split('-');

  return (
    <div>
      <h2 className="text-xl font-semibold">{base}/{quote}</h2>
      {price !== undefined ? (
        <p className="text-lg">Price: {price.toFixed(2)} {quote}</p>
      ) : (
        <p className="text-lg">Price: N/A</p>
      )}
      {change !== undefined ? (
        <p className={`text-sm ${change >= 0 ? 'text-success' : 'text-error'}`}>
          24h Change: {change.toFixed(2)}%
        </p>
      ) : (
        <p className="text-sm">24h Change: N/A</p>
      )}
    </div>
  )
}