import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const response = await fetch(`${process.env.API_URL}/pais`, {
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
  const token = req.cookies.get('token')?.value;

  const response = await fetch(`${process.env.API_URL}/pais`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const result = await response.json();
  return NextResponse.json(result, { status: response.status });
}

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  const response = await fetch(`${process.env.API_URL}/pais`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
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

