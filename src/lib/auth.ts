import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { User } from "../../types";

export async function getUserFromCookie(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as User;

    return {
      id: decoded.id,
      username: decoded.username,
      name: decoded.name,
      email: decoded.email,
      selectedChild: decoded.selectedChild,
    };

  } catch {
    return null;
  }
}