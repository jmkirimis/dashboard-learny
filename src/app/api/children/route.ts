import { NextRequest, NextResponse } from 'next/server';
import { serverFetch } from '@/lib/serverFetch';

export async function GET(req: NextRequest) {

  const response = await serverFetch(`${process.env.API_URL}/parents/children`);

  const result = await response.json();
  return NextResponse.json(result, { status: response.status });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const response = await serverFetch(`${process.env.API_URL}/parents/children`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const result = await response.json();
  return NextResponse.json(result, { status: response.status });
}