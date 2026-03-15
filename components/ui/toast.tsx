"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import toast, { Toaster, type ToastOptions } from "react-hot-toast";

type ToastActions = {
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
  loading: (message: string, options?: ToastOptions) => ReturnType<typeof toast.loading>;
};

const ToastContext = createContext<ToastActions | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const value = useMemo<ToastActions>(() => {
    return {
      success: (message, options) => toast.success(message, options),
      error: (message, options) => toast.error(message, options),
      info: (message, options) => toast(message, { icon: "ℹ️", ...options }),
      loading: (message, options) => toast.loading(message, options)
    };
  }, []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: "rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-xl",
          style: {
            color: "#fff",
            background: "rgba(5,5,5,0.95)",
            borderColor: "rgba(255,255,255,0.1)"
          }
        }}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
