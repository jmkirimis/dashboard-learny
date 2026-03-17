import { cookies } from "next/headers";

export async function serverFetch(url: string, options: RequestInit = {}) {
  const token = (await cookies()).get("token")?.value;

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}