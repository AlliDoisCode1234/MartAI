"use client";

const ACCEPT_HEADER: HeadersInit = {
  Accept: "application/json",
};

export async function request<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const hasBody = options.body !== undefined;
  const headers: HeadersInit = {
    ...ACCEPT_HEADER,
    ...(hasBody ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.error || "Request failed");
  }

  return (data ?? {}) as T;
}


