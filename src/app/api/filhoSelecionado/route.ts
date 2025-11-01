import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  const response = await fetch(`${process.env.API_URL}/pais/filhoSelecionado`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const result = await response.json();
  return NextResponse.json(result, { status: response.status });
}

export async function PUT(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const body = await req.json();

  const response = await fetch(`${process.env.API_URL}/pais/filhoSelecionado`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const result = await response.json();
  return NextResponse.json(result, { status: response.status });
}