import React from 'react'

interface TimeFrameSelectorProps {
  timeFrame: string;
  setTimeFrame: (timeFrame: string) => void;
  availableTimeframes: string[];
}

export default function TimeFrameSelector({ timeFrame, setTimeFrame, availableTimeframes }: TimeFrameSelectorProps) {
  return (
    <select
      value={timeFrame}
      onChange={(e) => setTimeFrame(e.target.value)}
      className="bg-[#2B2B43] text-white px-3 py-2 rounded-md"
    >
      {availableTimeframes.map((tf) => (
        <option key={tf} value={tf}>{tf}</option>
      ))}
    </select>
  )
}