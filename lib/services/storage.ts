import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { ApiError } from "@/lib/services/api";

const DEFAULT_STORAGE_BUCKET = "bank-documents";

let ensuredBucketName: string | null = null;

function getStorageBucketName() {
  return process.env.SUPABASE_STORAGE_BUCKET || DEFAULT_STORAGE_BUCKET;
}

async function ensureStorageBucket() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return getStorageBucketName();
  }

  const bucketName = getStorageBucketName();

  if (ensuredBucketName === bucketName) {
    return bucketName;
  }

  const supabase = getSupabaseAdminClient();
  const listResult = await supabase.storage.listBuckets();

  if (listResult.error) {
    throw new ApiError(500, listResult.error.message);
  }

  const exists = (listResult.data ?? []).some((bucket) => bucket.name === bucketName);

  if (!exists) {
    const createResult = await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024
    });

    if (createResult.error) {
      throw new ApiError(500, createResult.error.message);
    }
  }

  ensuredBucketName = bucketName;
  return bucketName;
}

function sanitizePathSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase() || "file";
}

export async function uploadTenantDocument(options: {
  tenantId: string;
  file: File;
  folder?: string;
}) {
  const bucketName = await ensureStorageBucket();
  const extension = options.file.name.includes(".") ? options.file.name.split(".").pop() ?? "bin" : "bin";
  const path = `${options.tenantId}/${options.folder ?? "documents"}/${crypto.randomUUID()}-${sanitizePathSegment(options.file.name.replace(/\.[^.]+$/, ""))}.${sanitizePathSegment(extension)}`;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      bucket: bucketName,
      path,
      url: `/mock-storage/${path}`
    };
  }

  const supabase = getSupabaseAdminClient();
  const fileBuffer = new Uint8Array(await options.file.arrayBuffer());

  const uploadResult = await supabase.storage.from(bucketName).upload(path, fileBuffer, {
    contentType: options.file.type || "application/octet-stream",
    upsert: false
  });

  if (uploadResult.error) {
    throw new ApiError(500, uploadResult.error.message);
  }

  const publicUrlResult = supabase.storage.from(bucketName).getPublicUrl(path);

  return {
    bucket: bucketName,
    path,
    url: publicUrlResult.data.publicUrl
  };
}
