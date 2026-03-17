import { NextRequest, NextResponse } from 'next/server';
import { serverFetch } from "@/lib/serverFetch";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  const response = await serverFetch(`${process.env.API_URL}/pais/crianca/${id}`);

  const result = await response.json();

  return NextResponse.json(result, { status: response.status });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { id } = params;

  const response = await serverFetch(`${process.env.API_URL}/pais/crianca/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const result = await response.json();

  return NextResponse.json(result, { status: response.status });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  const response = await serverFetch(`${process.env.API_URL}/pais/crianca/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
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

