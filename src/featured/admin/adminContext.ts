import { createContext, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { CmsContent } from "@/lib/content";

export type MediaTarget =
  | { type: "location" | "service"; slug: string; blockIdx?: number; field: "heroImageSrc" | "imageSrc" | "iconSrc" | "blockIconSrc" }
  | { type: "about"; field: "heroImageSrc" | "imageSrc" }
  | { type: "home"; field: "imageSrc" };

export type AdminCtxValue = {
  cms: CmsContent;
  setCms: Dispatch<SetStateAction<CmsContent | null>>;
  loading: boolean;
  stageFile: (file: File, onStaged: (blobUrl: string) => void) => void;
  openMediaPicker: (target: MediaTarget) => void;
  confirmDelete: (kind: "service" | "location", name: string) => boolean;
};

const AdminCtx = createContext<AdminCtxValue | null>(null);
export default AdminCtx;

export function useAdminCtx(): AdminCtxValue {
  const ctx = useContext(AdminCtx);
  if (!ctx) throw new Error("useAdminCtx must be used within AdminCtx.Provider");
  return ctx;
}
