import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.cookies.get('token')?.value;
  const body = await req.json();
  const { id } = params;

  const response = await fetch(`${process.env.API_URL}/pais/crianca/status/${id}`, {
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
