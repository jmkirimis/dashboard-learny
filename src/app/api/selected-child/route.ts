import { NextRequest, NextResponse } from 'next/server';
import { serverFetch } from "@/lib/serverFetch";

export async function GET(req: NextRequest) {

  const response = await serverFetch(`${process.env.API_URL}/parents/selected-child`);

  const result = await response.json();
  return NextResponse.json(result, { status: response.status });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();

  const response = await serverFetch(`${process.env.API_URL}/parents/selected-child`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const result = await response.json();
  return NextResponse.json(result, { status: response.status });
}