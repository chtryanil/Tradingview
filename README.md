# Tradingview Crypto Screener

A real-time cryptocurrency screener and charting tool built with Next.js and TypeScript.

## Features

- Live price updates for multiple cryptocurrencies
- Interactive candlestick charts with customizable timeframes
- Technical indicators including Support & Resistance levels
- Responsive design for desktop and mobile viewing
- Data fetched from Binance API

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (v14 or later)
- Python (v3.7 or later)
- pip (Python package installer)

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/chtryanil/Tradingview.git
   cd Tradingview
   ```

2. Install Node.js dependencies:
   ```
   npm install
   ```

3. Set up Python environment (optional but recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

4. Install Python dependencies:
   ```
  # pip install -r requirements.txt
   ```

5. Download initial data:
   ```
   python data.py
   ```

6. Start the development server:
   ```
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Updating Data

To update the cryptocurrency data:

1. Ensure your Python environment is activated (if using a virtual environment)
2. Run the data download script:
   ```
   python data.py
   ```

This script should be run periodically to keep your data up to date. Consider setting up a cron job or scheduled task to automate this process.

## Contributing

Contributions to the Tradingview Crypto Screener are welcome. Please feel free to submit a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).
