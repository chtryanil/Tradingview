import React, { useState } from 'react'

interface IndicatorSelectorProps {
  selectedIndicators: string[];
  setSelectedIndicators: (indicators: string[]) => void;
}

const availableIndicators = [
  'SMA',
  'EMA',
  'RSI',
  'MACD',
  'Bollinger Bands',
  'Stochastic Oscillator',
];

export default function IndicatorSelector({ selectedIndicators, setSelectedIndicators }: IndicatorSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleIndicator = (indicator: string) => {
    if (selectedIndicators.includes(indicator)) {
      setSelectedIndicators(selectedIndicators.filter(i => i !== indicator));
    } else {
      setSelectedIndicators([...selectedIndicators, indicator]);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button 
          type="button" 
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-[#2B2B43] text-sm font-medium text-white hover:bg-[#363A45] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
        >
          Indicators
          <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-[#2B2B43] ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {availableIndicators.map((indicator) => (
              <label key={indicator} className="flex items-center px-4 py-2 text-sm text-white hover:bg-[#363A45] cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-indigo-600 mr-2"
                  checked={selectedIndicators.includes(indicator)}
                  onChange={() => toggleIndicator(indicator)}
                />
                {indicator}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}