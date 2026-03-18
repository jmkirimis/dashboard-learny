import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { User } from "@/types";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const response = await fetch(`${process.env.API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const result = await response.json();

  if (!response.ok) {
    return NextResponse.json(result, { status: response.status });
  }

  const token = result.access_token;

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET!
  ) as User;

  const res = NextResponse.json(
    {
      _id: decoded._id,
      username: decoded.username,
      email: decoded.email,
      name: decoded.name,
      profilePicture: decoded.profilePicture,
      type: decoded.type,
    },
    { status: 200 }
  );

  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return res;
}