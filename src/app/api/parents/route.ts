import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/serverFetch";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const response = await serverFetch(`${process.env.API_URL}/parents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const result = await response.json();
  return NextResponse.json(result, { status: response.status });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();

  const response = await serverFetch(`${process.env.API_URL}/pais`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const result = await response.json();
  return NextResponse.json(result, { status: response.status });
}

export async function DELETE(req: NextRequest) {

  const response = await serverFetch(`${process.env.API_URL}/pais`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
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

