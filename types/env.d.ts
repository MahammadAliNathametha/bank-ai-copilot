declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY?: string;
    DEFAULT_TENANT_ID: string;
    DATABASE_URL?: string;
    SUPABASE_STORAGE_BUCKET?: string;
    OPENAI_API_KEY?: string;
    DATABASE_PASSWORD?: string;
    BANK_LOGO_URL?: string;
    PRIMARY_COLOR?: string;
  }
}
