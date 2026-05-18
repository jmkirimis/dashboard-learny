import { NextResponse } from 'next/server';
import { serverFetch } from "@/lib/serverFetch";

export async function GET() {

  const response = await serverFetch(`${process.env.API_URL}/parents/child/selected`);

  const result = await response.json();
  return NextResponse.json(result, { status: response.status });
}