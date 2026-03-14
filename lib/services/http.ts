export type ApiEnvelope<T> = {
  success: boolean;
  tenantId: string;
  data: T;
  error?: string;
};

export async function apiRequest<T>(path: string, init?: RequestInit) {
  const isFormData = typeof FormData !== "undefined" && init?.body instanceof FormData;

  const response = await fetch(path, {
    ...init,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  const payload = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.error ?? `Request failed for ${path}`);
  }

  return payload.data;
}
