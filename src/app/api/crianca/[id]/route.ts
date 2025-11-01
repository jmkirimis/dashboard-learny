import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.cookies.get('token')?.value;
  const { id } = params;

  const response = await fetch(`${process.env.API_URL}/pais/crianca/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const result = await response.json();

  return NextResponse.json(result, { status: response.status });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.cookies.get('token')?.value;
  const body = await req.json();
  const { id } = params;

  const response = await fetch(`${process.env.API_URL}/pais/crianca/${id}`, {
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

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.cookies.get('token')?.value;
  const { id } = params;

  const response = await fetch(`${process.env.API_URL}/pais/crianca/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (response.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const result = await response.json();

  return new NextResponse(result, {
    status: response.status,
    headers: { 'Content-Type': 'application/json' },
  });
}

