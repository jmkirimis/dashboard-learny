import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  const response = await fetch(`${process.env.API_URL}/pais/criancas`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const result = await response.json();
  return NextResponse.json(result, { status: response.status });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const token = req.cookies.get('token')?.value;

  const response = await fetch(`${process.env.API_URL}/pais/criancas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const result = await response.json();
  return NextResponse.json(result, { status: response.status });
}