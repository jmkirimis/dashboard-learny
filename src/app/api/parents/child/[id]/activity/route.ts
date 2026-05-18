import { NextRequest, NextResponse } from 'next/server';
import { serverFetch } from "@/lib/serverFetch";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  const response = await serverFetch(`${process.env.API_URL}/parents/child/${id}/activity`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const result = await response.json();

  return NextResponse.json(result, { status: response.status });
}
