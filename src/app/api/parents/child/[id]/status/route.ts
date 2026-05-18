import { NextRequest, NextResponse } from 'next/server';
import { serverFetch } from "@/lib/serverFetch";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const body = await req.json();
  const { id } = await params;

  const response = await serverFetch(`${process.env.API_URL}/parents/children/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const result = await response.json();

  return NextResponse.json(result, { status: response.status });
}
