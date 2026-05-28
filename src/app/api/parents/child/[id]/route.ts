import { NextRequest, NextResponse } from 'next/server';
import { serverFetch } from "@/lib/serverFetch";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  const response = await serverFetch(`${process.env.API_URL}/parents/child/${id}`);

  const result = await response.json();

  return NextResponse.json(result, { status: response.status });
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const body = await req.json();
  const { id } = await params;

  const response = await serverFetch(`${process.env.API_URL}/parents/child/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const result = await response.json();

  return NextResponse.json(result, { status: response.status });
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  const response = await serverFetch(`${process.env.API_URL}/parents/child/${id}`, {
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
