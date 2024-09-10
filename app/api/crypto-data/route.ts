import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const DATA_FILE = path.join(process.cwd(), 'crypto_data.json');
  
  try {
    const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
    const data = JSON.parse(rawData);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading crypto data:', error);
    return NextResponse.json({ error: 'Failed to read crypto data' }, { status: 500 });
  }
}